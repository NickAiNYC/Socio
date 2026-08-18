import pg from 'pg';
const { Pool } = pg;
import { randomUUID } from 'crypto';

/**
 * PostgreSQL Repository implementation for durable persistence.
 */
export class PostgresRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
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
    const query = `
      INSERT INTO ${this.tableName} (id, data)
      VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const res = await this.pool.query(query, [recordId, data]);
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

  async findAll(filterFn = (item) => true) {
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
    
    const query = `
      INSERT INTO ${this.historyTable} (snapshot_id, business_id, data)
      VALUES ($1, $2, $3);
    `;
    await this.pool.query(query, [snapshotId, businessId, record]);
    
    return super.save(businessId, snapshot);
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
