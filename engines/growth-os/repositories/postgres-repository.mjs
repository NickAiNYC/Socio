import pg from 'pg';
const { Pool } = pg;
import { randomUUID } from 'crypto';

/**
 * PostgreSQL Repository implementation for durable persistence.
 */
export class PostgresRepository {
  static TABLE_NAME_RE = /^[a-z_][a-z0-9_]*$/;

  constructor(tableName) {
    if (!PostgresRepository.TABLE_NAME_RE.test(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`);
    }
    this.tableName = tableName;
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    // A Postgres restart terminates idle clients; without a listener the
    // pool's 'error' event crashes the Node process. Log and keep serving —
    // the next query re-establishes a connection.
    this.pool.on('error', (err) => {
      console.error(`[pg] pool error on ${this.tableName}: ${err?.message || err}`);
    });
  }

  async _ensureTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.pool.query(query);
  }

  async save(id, data) {
    await this._ensureTable();
    const recordId = id || randomUUID();
    // Mirrors MemoryRepository.save(): the id is part of the stored record so
    // consumers that filter on record.id (e.g. AuditTrail's chain-head
    // exclusion) behave identically on both backends.
    const record = { ...data, id: recordId };
    const query = `
      INSERT INTO ${this.tableName} (id, data)
      VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const res = await this.pool.query(query, [recordId, record]);
    return res.rows[0].data;
  }

  /**
   * Append-only save: INSERT with ON CONFLICT DO NOTHING; throws if the id
   * already exists. Used by the Revenue Ledger and Audit Trail so economic
   * history and chain-of-custody records cannot be silently overwritten.
   */
  async saveIfAbsent(id, data) {
    await this._ensureTable();
    const recordId = id || randomUUID();
    const record = { ...data, id: recordId };
    const query = `
      INSERT INTO ${this.tableName} (id, data)
      VALUES ($1, $2)
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
    const res = await this.pool.query(query, [recordId, record]);
    if (res.rows.length === 0) {
      throw new Error(`Record ${recordId} already exists; duplicate writes are rejected.`);
    }
    return res.rows[0].data;
  }

  async get(id) {
    await this._ensureTable();
    const query = `SELECT data FROM ${this.tableName} WHERE id = $1;`;
    const res = await this.pool.query(query, [id]);
    return res.rows.length > 0 ? res.rows[0].data : null;
  }

  async update(id, data) {
    await this._ensureTable();
    const current = await this.get(id);
    if (!current) {
      throw new Error(`Record with id ${id} not found.`);
    }
    const updated = { ...current, ...data };
    return this.save(id, updated);
  }

  async findAll(filterFn = (_item) => true) {
    await this._ensureTable();
    const query = `SELECT data FROM ${this.tableName};`;
    const res = await this.pool.query(query);
    const results = [];
    for (const row of res.rows) {
      if (filterFn(row.data)) {
        results.push(row.data);
      }
    }
    return results;
  }

  async delete(id) {
    await this._ensureTable();
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *;`;
    const res = await this.pool.query(query, [id]);
    return res.rows.length > 0;
  }

  async clear() {
    await this._ensureTable();
    const query = `TRUNCATE TABLE ${this.tableName};`;
    await this.pool.query(query);
  }

  /**
   * Compare-and-swap on a top-level JSONB field.
   * Atomically flips `field` from `expectedValue` to `newValue`; returns the
   * updated record, or null if the expected value did not match (no write).
   * Used to consume approvals exactly once under concurrency.
   */
  async compareAndSwap(id, field, expectedValue, newValue) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(field)) {
      throw new Error(`Invalid JSONB field name: ${field}`);
    }
    await this._ensureTable();
    const query = `
      UPDATE ${this.tableName}
      SET data = jsonb_set(data, '{${field}}', $3::jsonb, true), updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND data->>'${field}' = $2
      RETURNING *;
    `;
    const res = await this.pool.query(query, [id, String(expectedValue), JSON.stringify(newValue)]);
    return res.rows.length > 0 ? res.rows[0].data : null;
  }

  /**
   * Tenant-scoped read: filters at the database boundary, not in JS.
   */
  async findByBusiness(businessId) {
    await this._ensureTable();
    const query = `SELECT data FROM ${this.tableName} WHERE data->>'businessId' = $1;`;
    const res = await this.pool.query(query, [businessId]);
    return res.rows.map((row) => row.data);
  }

  /**
   * Serializes refund bookkeeping per original payment ACROSS connections.
   *
   * Runs the callback inside a transaction holding a Postgres advisory lock
   * keyed on the original payment id, so concurrent refund records for the
   * same original (from different API/webhook processes) cannot both pass the
   * over-refund check. All reads/writes inside the callback use the locked
   * transaction; the lock releases on COMMIT/ROLLBACK.
   */
  async withRefundLock(originalEventId, fn) {
    await this._ensureTable();
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // hashtextextended -> bigint advisory lock key; scoped to this tx.
      await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [String(originalEventId)]);
      const result = await fn({
        get: async (id) => {
          const res = await client.query(`SELECT data FROM ${this.tableName} WHERE id = $1;`, [id]);
          return res.rows.length > 0 ? res.rows[0].data : null;
        },
        findAll: async (filterFn) => {
          const res = await client.query(`SELECT data FROM ${this.tableName};`);
          return res.rows.map((row) => row.data).filter(filterFn);
        },
        saveIfAbsent: async (id, data) => {
          const record = { ...data, id };
          const res = await client.query(
            `INSERT INTO ${this.tableName} (id, data) VALUES ($1, $2)
             ON CONFLICT (id) DO NOTHING RETURNING data;`,
            [id, record]
          );
          if (res.rows.length === 0) {
            throw new Error(`Record ${id} already exists; duplicate writes are rejected.`);
          }
          return res.rows[0].data;
        },
      });
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

/**
 * Postgres Repository for Business Twin, supporting snapshots.
 */
export class BusinessTwinPostgresRepository extends PostgresRepository {
  constructor() {
    super('business_twins');
    this.historyTable = 'business_twin_history';
  }

  async _ensureTable() {
    await super._ensureTable();
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.historyTable} (
        snapshot_id VARCHAR(255) PRIMARY KEY,
        business_id VARCHAR(255) NOT NULL,
        data JSONB NOT NULL,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.pool.query(query);
  }

  async saveSnapshot(businessId, snapshot) {
    await this._ensureTable();
    const snapshotId = randomUUID();
    const record = { ...snapshot, _snapshotId: snapshotId, _savedAt: new Date().toISOString() };

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO ${this.historyTable} (snapshot_id, business_id, data)
         VALUES ($1, $2, $3);`,
        [snapshotId, businessId, record]
      );
      await client.query(
        `INSERT INTO ${this.tableName} (id, data)
         VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP;`,
        [businessId, snapshot]
      );
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    return snapshot;
  }

  async getHistory(businessId) {
    await this._ensureTable();
    const query = `SELECT data FROM ${this.historyTable} WHERE business_id = $1 ORDER BY saved_at ASC;`;
    const res = await this.pool.query(query, [businessId]);
    return res.rows.map(row => row.data);
  }

  async clear() {
    await super.clear();
    await this._ensureTable();
    const query = `TRUNCATE TABLE ${this.historyTable};`;
    await this.pool.query(query);
  }
}
