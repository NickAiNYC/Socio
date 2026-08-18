import { randomUUID } from 'crypto';
import { BusinessTwinConflictError } from '../errors.mjs';

/**
 * Generic In-Memory Repository interface for tests and portable setups.
 */
export class MemoryRepository {
  constructor() {
    this.store = new Map();
  }

  async save(id, data) {
    const recordId = id || randomUUID();
    this.store.set(recordId, { ...data, id: recordId });
    return this.store.get(recordId);
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

  async findAll(filterFn = (item) => true) {
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
