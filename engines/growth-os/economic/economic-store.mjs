import pg from 'pg';
import { randomUUID } from 'node:crypto';

/**
 * Economic store: customers, experiment assignments, and attribution records.
 * MemoryEconomicStore is for tests; PostgresEconomicStore uses the migrated
 * schema with real constraints (UNIQUE customers, PRIMARY KEY assignments,
 * UNIQUE attribution.revenue_event_id).
 */

export class MemoryEconomicStore {
  constructor() {
    this.customers = new Map();       // `${businessId}:${provider}:${providerCustomerId}` -> record
    this.assignments = new Map();     // `${experimentId}:${customerId}` -> { variant }
    this.attribution = new Map();     // revenueEventId -> record
  }

  async upsertCustomer({ businessId, provider, providerCustomerId, displayName = null, data = {} }) {
    const key = `${businessId}:${provider}:${providerCustomerId}`;
    const existing = this.customers.get(key);
    const record = {
      id: existing?.id || randomUUID(),
      businessId,
      provider,
      providerCustomerId,
      displayName: displayName ?? existing?.displayName ?? null,
      data: { ...(existing?.data || {}), ...data },
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    this.customers.set(key, record);
    return record;
  }

  async findCustomerByProviderId(businessId, provider, providerCustomerId) {
    return this.customers.get(`${businessId}:${provider}:${providerCustomerId}`) || null;
  }

  async getCustomersByBusiness(businessId) {
    return [...this.customers.values()].filter((c) => c.businessId === businessId);
  }

  async assignVariant(experimentId, customerId, variant) {
    const key = `${experimentId}:${customerId}`;
    if (this.assignments.has(key) && this.assignments.get(key).variant !== variant) {
      throw new Error(`customer ${customerId} is already assigned in experiment ${experimentId}`);
    }
    const record = { experimentId, customerId, variant, assignedAt: new Date().toISOString() };
    this.assignments.set(key, record);
    return record;
  }

  async getAssignment(experimentId, customerId) {
    return this.assignments.get(`${experimentId}:${customerId}`) || null;
  }

  async getAssignmentsByExperiment(experimentId) {
    return [...this.assignments.values()].filter((a) => a.experimentId === experimentId);
  }

  async recordAttribution(record) {
    if (this.attribution.has(record.revenueEventId)) {
      throw new Error(`attribution already exists for revenue event ${record.revenueEventId}`);
    }
    this.attribution.set(record.revenueEventId, record);
    return record;
  }

  async getAttributionByRevenueEvent(revenueEventId) {
    return this.attribution.get(revenueEventId) || null;
  }

  async getAttributionByBusiness(businessId) {
    return [...this.attribution.values()].filter((a) => a.businessId === businessId);
  }
}

export class PostgresEconomicStore {
  constructor(pool) {
    this.pool = pool instanceof pg.Pool ? pool : new pg.Pool({ connectionString: pool });
    // Crash-prevention: a terminated idle client emits 'error' on the pool.
    this.pool.on('error', (err) => {
      console.error(`[pg] economic store pool error: ${err?.message || err}`);
    });
  }

  async upsertCustomer({ businessId, provider, providerCustomerId, displayName = null, data = {} }) {
    const id = randomUUID();
    const res = await this.pool.query(
      `INSERT INTO customers (id, business_id, provider, provider_customer_id, display_name, data)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (business_id, provider, provider_customer_id)
       DO UPDATE SET display_name = COALESCE($5, customers.display_name),
                     data = customers.data || $6
       RETURNING *`,
      [id, businessId, provider, providerCustomerId, displayName, data]
    );
    const row = res.rows[0];
    return {
      id: row.id,
      businessId: row.business_id,
      provider: row.provider,
      providerCustomerId: row.provider_customer_id,
      displayName: row.display_name,
      data: row.data,
      createdAt: row.created_at,
    };
  }

  async findCustomerByProviderId(businessId, provider, providerCustomerId) {
    const res = await this.pool.query(
      `SELECT * FROM customers WHERE business_id = $1 AND provider = $2 AND provider_customer_id = $3`,
      [businessId, provider, providerCustomerId]
    );
    const row = res.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      businessId: row.business_id,
      provider: row.provider,
      providerCustomerId: row.provider_customer_id,
      displayName: row.display_name,
      data: row.data,
      createdAt: row.created_at,
    };
  }

  async getCustomersByBusiness(businessId) {
    const res = await this.pool.query(`SELECT * FROM customers WHERE business_id = $1`, [businessId]);
    return res.rows.map((row) => ({
      id: row.id,
      businessId: row.business_id,
      provider: row.provider,
      providerCustomerId: row.provider_customer_id,
      displayName: row.display_name,
      data: row.data,
      createdAt: row.created_at,
    }));
  }

  async assignVariant(experimentId, customerId, variant) {
    const res = await this.pool.query(
      `INSERT INTO experiment_assignments (experiment_id, customer_id, variant)
       VALUES ($1, $2, $3)
       ON CONFLICT (experiment_id, customer_id)
       DO UPDATE SET variant = EXCLUDED.variant
       RETURNING *`,
      [experimentId, customerId, variant]
    );
    const row = res.rows[0];
    return { experimentId: row.experiment_id, customerId: row.customer_id, variant: row.variant, assignedAt: row.assigned_at };
  }

  async getAssignment(experimentId, customerId) {
    const res = await this.pool.query(
      `SELECT * FROM experiment_assignments WHERE experiment_id = $1 AND customer_id = $2`,
      [experimentId, customerId]
    );
    const row = res.rows[0];
    return row ? { experimentId: row.experiment_id, customerId: row.customer_id, variant: row.variant, assignedAt: row.assigned_at } : null;
  }

  async getAssignmentsByExperiment(experimentId) {
    const res = await this.pool.query(
      `SELECT * FROM experiment_assignments WHERE experiment_id = $1`,
      [experimentId]
    );
    return res.rows.map((row) => ({ experimentId: row.experiment_id, customerId: row.customer_id, variant: row.variant, assignedAt: row.assigned_at }));
  }

  async recordAttribution(record) {
    const res = await this.pool.query(
      `INSERT INTO attribution (id, business_id, revenue_event_id, data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (revenue_event_id) DO NOTHING
       RETURNING *`,
      [record.id || randomUUID(), record.businessId, record.revenueEventId, record]
    );
    if (res.rows.length === 0) {
      throw new Error(`attribution already exists for revenue event ${record.revenueEventId}`);
    }
    return record;
  }

  async getAttributionByRevenueEvent(revenueEventId) {
    const res = await this.pool.query(
      `SELECT data FROM attribution WHERE revenue_event_id = $1`,
      [revenueEventId]
    );
    return res.rows[0]?.data || null;
  }

  async getAttributionByBusiness(businessId) {
    const res = await this.pool.query(
      `SELECT data FROM attribution WHERE business_id = $1`,
      [businessId]
    );
    return res.rows.map((r) => r.data);
  }
}
