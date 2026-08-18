/**
 * Adapter Interfaces for external integration.
 * In a JS environment, these act as documentation contracts.
 */

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
