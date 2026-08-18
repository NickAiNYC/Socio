import { BusinessTwinConflictError } from './errors.mjs';

/**
 * Business Twin
 * Persistent state representation of a business.
 */
export class BusinessTwin {
  constructor(repository) {
    /** @type {import('./repositories/memory-repository.mjs').BusinessTwinMemoryRepository} */
    this.repository = repository;
  }

  /**
   * Initializes a new Business Twin.
   */
  async initialize(businessId, initialData = {}, agentId = 'system') {
    const existing = await this.repository.get(businessId);
    if (existing) {
      throw new BusinessTwinConflictError(`BusinessTwin for ${businessId} already exists.`);
    }

    const state = {
      ...initialData,
      id: businessId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.repository.saveSnapshot(businessId, state);
    return state;
  }

  /**
   * Gets current state of the Business Twin.
   */
  async get(businessId) {
    const state = await this.repository.get(businessId);
    if (!state) throw new Error(`BusinessTwin ${businessId} not found.`);
    return state;
  }

  /**
   * Completely replaces the state (rarely used).
   */
  async update(businessId, newState, agentId, reason) {
    const current = await this.get(businessId);
    
    const updated = {
      ...newState,
      id: businessId,
      updatedAt: new Date().toISOString(),
      _lastUpdateAgent: agentId,
      _lastUpdateReason: reason
    };

    await this.repository.saveSnapshot(businessId, updated);
    return updated;
  }

  /**
   * Patches specific fields of the Business Twin.
   */
  async patch(businessId, patchData, agentId, reason) {
    const current = await this.get(businessId);

    // Deep merge could be used here. For simplicity, we shallow merge top level.
    // If complex nested patching is needed, lodash.merge or similar is recommended.
    const updated = {
      ...current,
      ...patchData,
      id: businessId, // ensure ID is never overwritten
      updatedAt: new Date().toISOString(),
      _lastUpdateAgent: agentId,
      _lastUpdateReason: reason
    };

    await this.repository.saveSnapshot(businessId, updated);
    return updated;
  }

  /**
   * Returns a point-in-time snapshot of the current state.
   */
  async snapshot(businessId) {
    // get() returns the current active state which is essentially the snapshot.
    return this.get(businessId);
  }

  /**
   * Gets the history of the Business Twin.
   */
  async history(businessId) {
    return await this.repository.getHistory(businessId);
  }
}
