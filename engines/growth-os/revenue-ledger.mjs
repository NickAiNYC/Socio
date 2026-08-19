import { randomUUID } from 'crypto';
import { ValidationError } from './errors.mjs';

const REVENUE_TYPES = new Set(['revenue', 'purchase', 'repeat_purchase', 'expansion_revenue']);
const COST_TYPES = new Set(['campaign_cost']);
const POSITIVE_TYPES = new Set([...REVENUE_TYPES, ...COST_TYPES]);
const REFUND_TYPES = new Set(['refund', 'churn']);

/**
 * Revenue Ledger
 * Append-only source of truth for business events and outcomes.
 * Entries are immutable once written: re-recording an existing id is rejected
 * (duplicate webhook / replayed payment cannot silently overwrite history).
 */
export class RevenueLedger {
  constructor(repository) {
    /** @type {import('./repositories/memory-repository.mjs').MemoryRepository} */
    this.repository = repository;
    this._fallbackRefundLocks = new Map(); // in-process refund serialization (no-lock repos)
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

    // Refunds are serialized per original payment: the over-refund check and
    // the insert must be atomic (see _recordRefund / withRefundLock).
    if (REFUND_TYPES.has(event.type)) {
      return this._recordRefund(finalEvent);
    }

    // DB-enforced idempotency: a replayed idempotencyKey (e.g. duplicate
    // Stripe event delivery) must be rejected regardless of record id.
    if (finalEvent.idempotencyKey) {
      const existing = await this.repository.findAll(
        (e) => e.idempotencyKey === finalEvent.idempotencyKey
      );
      if (existing.length > 0) {
        throw new ValidationError(
          `duplicate event: idempotencyKey ${finalEvent.idempotencyKey} already recorded`
        );
      }
    }

    // Immutable append: a replayed id must fail, never overwrite or duplicate.
    try {
      return await this.repository.saveIfAbsent(recordId, finalEvent);
    } catch (err) {
      // Postgres unique-violation (23505) from the idempotency index.
      if (err?.code === '23505' || /23505/.test(err?.message || '')) {
        throw new ValidationError(
          `duplicate event: idempotencyKey ${finalEvent.idempotencyKey || recordId} already recorded`
        );
      }
      throw err;
    }
  }

  /**
   * Refund bookkeeping, atomic per original payment.
   *
   * Partial refunds accumulate and the total never exceeds the original. The
   * check + insert run under a repository lock keyed on the original payment:
   *   - Postgres: pg_advisory_xact_lock in a transaction (safe across
   *     processes/connections)
   *   - memory: per-key promise chain (safe across concurrent awaits)
   * Without the lock, two concurrent refunds can both read "0 refunded so
   * far" and over-refund the original.
   */
  async _recordRefund(finalEvent) {
    const originalEventId = finalEvent.metadata?.originalEventId;
    if (!originalEventId) {
      throw new ValidationError('refund requires metadata.originalEventId of the original payment');
    }

    const book = async (tx) => {
      const original = await tx.get(originalEventId);
      if (!original) {
        throw new ValidationError(`refund references unknown original event ${originalEventId}`);
      }
      if (!REVENUE_TYPES.has(original.type)) {
        throw new ValidationError(`refund original event ${originalEventId} is not a payment (type ${original.type})`);
      }
      const existingRefunds = await tx.findAll(
        (e) => e.type === 'refund' && e.metadata?.originalEventId === originalEventId
      );
      const totalRefunded = existingRefunds.reduce((sum, e) => sum + e.amount, 0);
      const remaining = original.amount - totalRefunded;
      // Small epsilon absorbs float division rounding (minor units / 100).
      if (finalEvent.amount - remaining > 1e-6) {
        throw new ValidationError(
          `refund of ${finalEvent.amount} exceeds the remaining refundable amount ` +
          `${Math.max(remaining, 0).toFixed(2)} of original event ${originalEventId}`
        );
      }
      if (finalEvent.idempotencyKey) {
        const dup = await tx.findAll((e) => e.idempotencyKey === finalEvent.idempotencyKey);
        if (dup.length > 0) {
          throw new ValidationError(
            `duplicate event: idempotencyKey ${finalEvent.idempotencyKey} already recorded`
          );
        }
      }
      try {
        return await tx.saveIfAbsent(finalEvent.id, finalEvent);
      } catch (err) {
        if (err?.code === '23505' || /23505/.test(err?.message || '')) {
          throw new ValidationError(
            `duplicate event: idempotencyKey ${finalEvent.idempotencyKey || finalEvent.id} already recorded`
          );
        }
        throw err;
      }
    };

    if (this.repository.withRefundLock) {
      return this.repository.withRefundLock(originalEventId, book);
    }
    // Fallback for repositories without lock support: serialize in-process.
    this._fallbackRefundLocks ??= new Map();
    const key = String(originalEventId);
    const prev = this._fallbackRefundLocks.get(key) || Promise.resolve();
    const run = prev.then(() => book(this.repository));
    this._fallbackRefundLocks.set(key, run.catch(() => {}));
    return run;
  }

  /**
   * Get all events for a specific business — filtered at the repository
   * boundary (database-scoped SQL in Postgres), not in application JS.
   */
  async getByBusiness(businessId) {
    if (this.repository.findByBusiness) {
      return await this.repository.findByBusiness(businessId);
    }
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
   * Calculate aggregated metrics based on filters.
   * Mixed-currency data is never silently summed: when multiple currencies are
   * present, gross/net/cost/refund sums are computed for the primary currency
   * (first seen) and the full per-currency breakdown is exposed via `byCurrency`.
   */
  async calculateMetrics(filters = {}) {
    const events = await this.getEvents(filters);

    const byCurrency = {};
    const currencyOrder = [];

    for (const e of events) {
      const currency = e.currency || 'USD';
      if (!byCurrency[currency]) {
        byCurrency[currency] = { grossRevenue: 0, netRevenue: 0, totalCost: 0, refunds: 0, eventCount: 0 };
        currencyOrder.push(currency);
      }
      const agg = byCurrency[currency];
      agg.eventCount += 1;

      if (REVENUE_TYPES.has(e.type)) {
        agg.grossRevenue += e.amount;
        agg.netRevenue += e.amount;
      } else if (REFUND_TYPES.has(e.type)) {
        agg.refunds += e.amount;
        agg.netRevenue -= Math.abs(e.amount);
      } else if (COST_TYPES.has(e.type)) {
        agg.totalCost += Math.abs(e.amount);
      }
    }

    const mixedCurrencies = currencyOrder.length > 1;
    const primary = currencyOrder[0] || 'USD';
    const primaryAgg = byCurrency[primary] || { grossRevenue: 0, netRevenue: 0, totalCost: 0, refunds: 0, eventCount: 0 };

    const netRevenue = primaryAgg.netRevenue;
    const totalCost = primaryAgg.totalCost;
    const roi = totalCost > 0 ? ((netRevenue - totalCost) / totalCost) * 100 : 0;

    return {
      grossRevenue: primaryAgg.grossRevenue,
      netRevenue,
      totalCost,
      refunds: primaryAgg.refunds,
      roi,
      eventCount: events.length,
      mixedCurrencies,
      currencies: currencyOrder,
      byCurrency,
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
    if (POSITIVE_TYPES.has(event.type) && event.amount <= 0) {
      throw new ValidationError(`${event.type} amount must be a positive number`);
    }
    if (REFUND_TYPES.has(event.type) && event.amount <= 0) {
      throw new ValidationError(`${event.type} amount must be a positive number`);
    }
  }
}
