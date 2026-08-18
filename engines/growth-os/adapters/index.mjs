/**
 * Adapter Interfaces for external integration.
 * In a JS environment, these act as documentation contracts.
 */

/**
 * @interface RevenueAdapter
 */
export class RevenueAdapter {
  async getTransactions(businessId, dateRange) {
    throw new Error('Not implemented');
  }
}

/**
 * @interface CRMAdapter
 */
export class CRMAdapter {
  async getCustomers(businessId) {
    throw new Error('Not implemented');
  }
  async updateCustomer(businessId, customerId, data) {
    throw new Error('Not implemented');
  }
}

/**
 * @interface CompetitiveIntelAdapter
 */
export class CompetitiveIntelAdapter {
  async getCompetitorEvents(businessId, dateRange) {
    throw new Error('Not implemented');
  }
}
