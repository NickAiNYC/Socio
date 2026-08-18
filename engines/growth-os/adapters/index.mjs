/**
 * Adapter Interfaces for external integration.
 * In a JS environment, these act as documentation contracts.
 */

/**
 * GovernedAdapterProxy — the ONLY path to external adapters.
 *
 * Agents cannot call adapters directly: every external call must carry an
 * executed, approved action whose proposal binds businessId, adapter (type),
 * and payload. Anything else is refused. Adapters themselves are plain
 * service objects registered here; they are never exposed to agents.
 */
export class GovernedAdapterProxy {
  constructor(registry = {}) {
    this.registry = registry;
  }

  async call(adapterName, method, params, approval) {
    if (!approval || approval.status !== 'EXECUTED') {
      throw new Error('external adapter calls require an executed, approved action');
    }
    const proposal = approval.proposal;
    if (!proposal) throw new Error('approval has no proposal binding');
    if (proposal.businessId !== params.businessId) {
      throw new Error(`adapter call businessId ${params.businessId} does not match the approved action for ${proposal.businessId}`);
    }
    if (proposal.type !== adapterName) {
      throw new Error(`adapter ${adapterName} does not match the approved action type ${proposal.type}`);
    }
    // businessId is bound separately above; compare the execution parameters
    // against the approved payload exactly.
    const executionParams = { ...params };
    delete executionParams.businessId;
    if (JSON.stringify(proposal.payload) !== JSON.stringify(executionParams)) {
      throw new Error('adapter call payload does not match the approved action payload');
    }
    const adapter = this.registry[adapterName];
    if (!adapter) throw new Error(`adapter ${adapterName} is not registered`);
    if (typeof adapter[method] !== 'function') {
      throw new Error(`adapter ${adapterName}.${method} does not exist`);
    }
    return adapter[method](params);
  }
}

/**
 * @interface RevenueAdapter
 */
export class RevenueAdapter {
  async getTransactions(_businessId, _dateRange) {
    throw new Error('Not implemented');
  }
}

/**
 * @interface CRMAdapter
 */
export class CRMAdapter {
  async getCustomers(_businessId) {
    throw new Error('Not implemented');
  }
  async updateCustomer(_businessId, _customerId, _data) {
    throw new Error('Not implemented');
  }
}

/**
 * @interface CompetitiveIntelAdapter
 */
export class CompetitiveIntelAdapter {
  async getCompetitorEvents(_businessId, _dateRange) {
    throw new Error('Not implemented');
  }
}
