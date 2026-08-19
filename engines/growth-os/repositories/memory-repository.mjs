import { randomUUID } from 'crypto';

/**
 * Generic In-Memory Repository interface for tests and portable setups.
 */
export class MemoryRepository {
  constructor() {
    this.store = new Map();
    this._refundLocks = new Map(); // per-original-payment refund serialization
  }

  async save(id, data) {
    const recordId = id || randomUUID();
    this.store.set(recordId, { ...data, id: recordId });
    return this.store.get(recordId);
  }

  /**
   * Append-only save: rejects if the id already exists.
   * Used by the Revenue Ledger and Audit Trail to keep history immutable.
   */
  async saveIfAbsent(id, data) {
    const recordId = id || randomUUID();
    if (this.store.has(recordId)) {
      throw new Error(`Record ${recordId} already exists; duplicate writes are rejected.`);
    }
    const record = { ...data, id: recordId };
    this.store.set(recordId, record);
    return record;
  }

  async get(id) {
    return this.store.get(id) || null;
  }

  async update(id, data) {
    if (!this.store.has(id)) {
      throw new Error(`Record with id ${id} not found.`);
    }
    const current = this.store.get(id);
    const updated = { ...current, ...data };
    this.store.set(id, updated);
    return updated;
  }

  async findAll(filterFn = (_item) => true) {
    const results = [];
    for (const item of this.store.values()) {
      if (filterFn(item)) {
        results.push(item);
      }
    }
    return results;
  }

  async delete(id) {
    return this.store.delete(id);
  }

  /**
   * Compare-and-swap on a top-level field (single-threaded: atomic within the
   * event loop). Returns the updated record, or null if expected did not match.
   */
  async compareAndSwap(id, field, expectedValue, newValue) {
    const current = this.store.get(id);
    if (!current || current[field] !== expectedValue) return null;
    const updated = { ...current, [field]: newValue, id };
    this.store.set(id, updated);
    return updated;
  }

  /**
   * Tenant-scoped read at the repository boundary.
   */
  async findByBusiness(businessId) {
    return this.findAll((item) => item.businessId === businessId);
  }

  /**
   * Serializes refund bookkeeping per original payment within this process.
   * Concurrent refund records for the same originalEventId run sequentially,
   * so the over-refund check and the insert cannot interleave. Mirrors the
   * Postgres advisory-lock semantics for in-memory stores.
   */
  async withRefundLock(originalEventId, fn) {
    this._refundLocks ??= new Map();
    const key = String(originalEventId);
    const prev = this._refundLocks.get(key) || Promise.resolve();
    const run = prev.then(() =>
      fn({
        get: (id) => this.get(id),
        findAll: (filterFn) => this.findAll(filterFn),
        saveIfAbsent: (id, data) => this.saveIfAbsent(id, data),
      })
    );
    this._refundLocks.set(key, run.catch(() => {}));
    return run;
  }

  async clear() {
    this.store.clear();
  }
}

/**
 * Specialized repository for Business Twin with versioning/history.
 */
export class BusinessTwinMemoryRepository extends MemoryRepository {
  constructor() {
    super();
    this.history = new Map(); // Map<businessId, Array<Snapshot>>
  }

  async saveSnapshot(businessId, snapshot) {
    if (!this.history.has(businessId)) {
      this.history.set(businessId, []);
    }
    const record = { ...snapshot, _snapshotId: randomUUID(), _savedAt: new Date().toISOString() };
    this.history.get(businessId).push(record);
    return super.save(businessId, snapshot);
  }

  async getHistory(businessId) {
    return this.history.get(businessId) || [];
  }

  async clear() {
    super.clear();
    this.history.clear();
  }
}
