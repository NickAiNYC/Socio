import { randomUUID } from 'crypto';
import { ValidationError } from './errors.mjs';

/**
 * Revenue Ledger
 * Immutable source of truth for business events and outcomes.
 */
export class RevenueLedger {
  constructor(repository) {
    /** @type {import('./repositories/memory-repository.mjs').MemoryRepository} */
    this.repository = repository;
  }

  /**
   * Records a new event in the ledger.
   * @param {import('./types.mjs').RevenueEvent} event
   */
  async record(event) {
    this._validateEvent(event);
    
    const recordId = event.id || randomUUID();
    const finalEvent = {
      ...event,
      id: recordId,
      occurredAt: event.occurredAt || new Date().toISOString(),
    };

    return await this.repository.save(recordId, finalEvent);
  }

  /**
   * Get all events for a specific business
   */
  async getByBusiness(businessId) {
    return await this.repository.findAll(e => e.businessId === businessId);
  }

  /**
   * Get all events, optionally filtered
   */
  async getEvents(filters = {}) {
    return await this.repository.findAll(e => {
      let match = true;
      if (filters.businessId && e.businessId !== filters.businessId) match = false;
      if (filters.campaignId && e.campaignId !== filters.campaignId) match = false;
      if (filters.agentId && e.agentId !== filters.agentId) match = false;
      if (filters.experimentId && e.experimentId !== filters.experimentId) match = false;
      if (filters.startDate && new Date(e.occurredAt) < new Date(filters.startDate)) match = false;
      if (filters.endDate && new Date(e.occurredAt) > new Date(filters.endDate)) match = false;
      if (filters.type && e.type !== filters.type) match = false;
      return match;
    });
  }

  /**
   * Calculate aggregated metrics based on filters
   */
  async calculateMetrics(filters = {}) {
    const events = await this.getEvents(filters);
    
    let grossRevenue = 0;
    let netRevenue = 0;
    let totalCost = 0;
    let refunds = 0;

    for (const e of events) {
      if (e.type === 'revenue' || e.type === 'purchase' || e.type === 'repeat_purchase' || e.type === 'expansion_revenue') {
        grossRevenue += e.amount;
        netRevenue += e.amount;
      } else if (e.type === 'refund' || e.type === 'churn') {
        refunds += e.amount;
        netRevenue -= Math.abs(e.amount); // Ensure refunds subtract from net
      } else if (e.type === 'campaign_cost') {
        totalCost += Math.abs(e.amount);
      }
    }

    const roi = totalCost > 0 ? ((netRevenue - totalCost) / totalCost) * 100 : 0;

    return {
      grossRevenue,
      netRevenue,
      totalCost,
      refunds,
      roi,
      eventCount: events.length
    };
  }

  /**
   * Gets an agent's scorecard
   */
  async getAgentScorecard(agentId, dateRange = {}) {
    const events = await this.getEvents({ agentId, ...dateRange });
    
    let actions = 0;
    let successfulActions = 0;
    let failedActions = 0;
    let revenueAttributed = 0;
    let cost = 0;

    for (const e of events) {
      if (e.type === 'agent_action') {
        actions++;
        if (e.metadata?.status === 'success') successfulActions++;
        if (e.metadata?.status === 'failed') failedActions++;
      }
      if (e.type === 'revenue' || e.type === 'purchase') {
        revenueAttributed += e.amount;
      }
      if (e.type === 'campaign_cost') {
        cost += Math.abs(e.amount);
      }
    }

    const roi = cost > 0 ? ((revenueAttributed - cost) / cost) * 100 : 0;
    const approvalRate = actions > 0 ? (successfulActions / actions) * 100 : 0; // Simplified for now
    const averageRevenuePerAction = actions > 0 ? revenueAttributed / actions : 0;

    return {
      agentId,
      actions,
      successfulActions,
      failedActions,
      revenueAttributed,
      cost,
      roi,
      approvalRate,
      averageRevenuePerAction
    };
  }

  _validateEvent(event) {
    if (!event.businessId) throw new ValidationError('businessId is required');
    if (!event.type) throw new ValidationError('type is required');
    if (event.amount === undefined || typeof event.amount !== 'number') {
      throw new ValidationError('amount is required and must be a number');
    }
    if (!event.currency) throw new ValidationError('currency is required');
    if (!event.source) throw new ValidationError('source is required');
  }
}
