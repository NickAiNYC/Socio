/**
 * Merchant Evidence Layer — report builder.
 *
 * Turns the Growth OS economic trace into a merchant-facing evidence report.
 * The report answers six questions, each backed by real recorded data:
 *
 *   1. What did Socio do?          -> governed actions (audit trail + approvals)
 *   2. What happened?              -> ledger metrics (revenue, cost, refunds)
 *   3. What revenue followed?      -> revenue events on the ledger
 *   4. What can we attribute?      -> attribution/correlation-level records
 *   5. What can't we prove?        -> observation-level (unknown) records
 *   6. What should Socio do next?  -> learnings, experiment status, pending approvals
 *
 * Honesty rules (mirrors docs/economic-truth-model.md):
 *   - every section is computed from recorded facts; nothing is invented
 *   - an empty store produces zeros, empty arrays, and missing-hop notes —
 *     never fabricated numbers
 *   - causation is never claimed; the methodology section states the ladder
 */
import { buildEconomicTrace } from '../economic/economic-trace.mjs';
import { LEVELS } from '../economic/attribution.mjs';
import { MIN_SAMPLE_PER_GROUP } from '../economic/stats.mjs';
import { computeIncrementality } from './revenue-schedule.mjs';

const REVENUE_EVENT_TYPES = new Set(['revenue', 'purchase', 'repeat_purchase', 'expansion_revenue']);

/**
 * Lists the durable approval registry for a business (real Governor state).
 * Approvals store businessId inside proposal.businessId, so filtering happens
 * on the record shape, not the repository's top-level findByBusiness.
 */
async function listApprovals(agentGovernor, businessId) {
  const repo = agentGovernor?.approvalRepository;
  if (!repo || typeof repo.findAll !== 'function') return [];
  const records = await repo.findAll((a) => a && a.proposal && a.proposal.businessId === businessId);
  return records.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
}

/**
 * Computes real Stripe connection state from two recorded signals:
 *   - whether a webhook signing secret is configured (env)
 *   - whether any stripe-source events actually reached the ledger
 *
 *   connected   = secret configured AND >= 1 stripe event recorded
 *   configured  = secret configured, but no stripe events yet (pipe unproven)
 *   disconnected= no secret configured (Socio cannot receive Stripe data)
 */
export function computeStripeState({ secretConfigured = false, stripeEventCount = 0 }) {
  if (secretConfigured && stripeEventCount > 0) {
    return {
      status: 'connected',
      reason: `webhook secret configured and ${stripeEventCount} stripe event(s) recorded on the ledger`,
      secretConfigured,
      eventsReceived: stripeEventCount,
    };
  }
  if (secretConfigured) {
    return {
      status: 'configured',
      reason: 'webhook secret configured but no stripe events recorded yet — the connection is not proven end-to-end',
      secretConfigured,
      eventsReceived: 0,
    };
  }
  return {
    status: 'disconnected',
    reason: 'no STRIPE_WEBHOOK_SECRET configured — Socio is not receiving Stripe data',
    secretConfigured: false,
    eventsReceived: 0,
  };
}

/**
 * Builds the merchant evidence report for a business.
 *
 * @param {object} params
 * @param {import('../business-twin.mjs').BusinessTwin} params.businessTwin
 * @param {import('../revenue-ledger.mjs').RevenueLedger} params.revenueLedger
 * @param {import('../audit-trail.mjs').AuditTrail} params.auditTrail
 * @param {import('../experiment-engine.mjs').ExperimentEngine} params.experimentEngine
 * @param {import('../economic/economic-store.mjs').MemoryEconomicStore|import('../economic/economic-store.mjs').PostgresEconomicStore} params.economicStore
 * @param {import('../agent-governor.mjs').AgentGovernor} params.agentGovernor
 * @param {string} params.businessId
 * @param {boolean} [params.stripeSecretConfigured=false] whether STRIPE_WEBHOOK_SECRET is set
 * @param {object|null} [params.revenueSchedule=null] the signed Revenue Definition
 *   Schedule for this business (validated), or null when none is on file
 */
export async function buildMerchantEvidenceReport({
  businessTwin,
  revenueLedger,
  auditTrail,
  experimentEngine,
  economicStore,
  agentGovernor,
  businessId,
  stripeSecretConfigured = false,
  revenueSchedule = null,
}) {
  const trace = await buildEconomicTrace({
    businessTwin,
    ledger: revenueLedger,
    auditTrail,
    experimentEngine,
    economicStore,
    businessId,
  });

  const metrics = await revenueLedger.calculateMetrics({ businessId });

  // Verifier layer: apply the signed Revenue Definition Schedule to the ledger.
  // "Verified" means incremental — excluded and out-of-window revenue is never
  // claimed, and a baseline is only applied when real history exists.
  const incrementality = computeIncrementality(trace.revenue, trace.attribution, revenueSchedule);

  const approvals = await listApprovals(agentGovernor, businessId);
  const approvalCounts = {
    total: approvals.length,
    approved: approvals.filter((a) => a.status === 'APPROVED').length,
    pending: approvals.filter((a) => a.status === 'PENDING').length,
    blocked: approvals.filter((a) => a.status === 'BLOCKED').length,
    executed: approvals.filter((a) => a.status === 'EXECUTED').length,
  };

  // --- 3. What revenue followed? (real ledger events) ---
  const revenueEvents = trace.revenue
    .filter((e) => REVENUE_EVENT_TYPES.has(e.type) || e.type === 'refund')
    .sort((a, b) => (a.occurredAt < b.occurredAt ? -1 : a.occurredAt > b.occurredAt ? 1 : 0));

  // --- 4. What can we attribute? / 5. What can't we prove? ---
  const evidenceBased = trace.attribution.filter((a) => a.level === 'attribution' || a.level === 'correlation');
  const unknown = trace.attribution.filter((a) => a.level === 'observation');

  // Revenue on the ledger with no attribution record at all — recorded as a
  // fact, but unclaimed by any intervention. Never imputed.
  const attributedEventIds = new Set(trace.attribution.map((a) => a.revenueEventId));
  const unattributedRevenue = trace.revenue
    .filter((e) => REVENUE_EVENT_TYPES.has(e.type))
    .reduce((sum, e) => (attributedEventIds.has(e.id) ? sum : sum + e.amount), 0);

  // --- 6. What should Socio do next? (derived only from recorded state) ---
  const experiments = trace.experiments.map((e) => ({
    id: e.id,
    hypothesis: e.hypothesis,
    objective: e.objective,
    metric: e.metric,
    status: e.status,
    decision: e.decision || null,
    rationale: e.rationale || null,
    observations: Array.isArray(e.observations) ? e.observations.length : 0,
    variants: Array.isArray(e.variants) ? e.variants : [],
  }));
  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');

  const stripeEvents = trace.revenue.filter((e) => e.source === 'stripe');
  const stripe = computeStripeState({
    secretConfigured: Boolean(stripeSecretConfigured),
    stripeEventCount: stripeEvents.length,
  });

  return {
    businessId,
    generatedAt: new Date().toISOString(),
    questions: {
      whatDidSocioDo: {
        count: trace.actions.length,
        actions: trace.actions.map((a) => ({
          id: a.id,
          proposalId: a.proposalId,
          agentId: a.agentId,
          actionType: a.actionType,
          status: a.status,
          timestamp: a.timestamp,
        })),
      },
      whatHappened: {
        metrics: {
          grossRevenue: metrics.grossRevenue,
          netRevenue: metrics.netRevenue,
          totalCost: metrics.totalCost,
          refunds: metrics.refunds,
          roi: metrics.roi,
          eventCount: metrics.eventCount,
          mixedCurrencies: metrics.mixedCurrencies,
          currencies: metrics.currencies,
          // Verifier layer: exclusion-aware split when a schedule is on file.
          excludedRevenue: incrementality.excludedRevenue,
          eligibleRevenue: incrementality.eligibleRevenue,
          incrementalRevenue: incrementality.incrementalRevenue,
        },
        byCurrency: metrics.byCurrency,
      },
      whatRevenueFollowed: {
        count: revenueEvents.length,
        events: revenueEvents.map((e) => ({
          id: e.id,
          type: e.type,
          amount: e.amount,
          currency: e.currency,
          occurredAt: e.occurredAt,
          source: e.source,
        })),
      },
      whatCanWeAttribute: {
        count: evidenceBased.length,
        records: evidenceBased.map((r) => ({
          id: r.id,
          revenueEventId: r.revenueEventId,
          experimentId: r.experimentId,
          variant: r.variant || null,
          level: r.level,
          claim: r.claim,
          confidence: r.confidence,
          evidence: r.evidence,
        })),
      },
      whatCantWeProve: {
        count: unknown.length,
        records: unknown.map((r) => ({
          id: r.id,
          revenueEventId: r.revenueEventId,
          experimentId: r.experimentId,
          level: r.level,
          claim: r.claim,
          confidence: r.confidence,
          evidence: r.evidence,
        })),
        unattributedRevenue: {
          amount: unattributedRevenue,
          note:
            unattributedRevenue > 0
              ? 'revenue recorded on the ledger with no attribution record — Socio cannot claim any of it'
              : 'no unattributed revenue on the ledger',
        },
      },
      whatShouldSocioDoNext: {
        learnings: trace.learnings,
        experiments,
        pendingApprovals: pendingApprovals.map((a) => ({
          id: a.id,
          agentId: a.proposal.agentId,
          type: a.proposal.type,
          risk: a.proposal.risk,
          objective: a.proposal.objective,
          expiresAt: a.expiresAt,
        })),
      },
    },
    trace: {
      businessId,
      missing: trace.missing,
      learnings: trace.learnings,
      counts: {
        actions: trace.actions.length,
        experiments: trace.experiments.length,
        customers: trace.customers.length,
        revenueEvents: trace.revenue.length,
        attributionRecords: trace.attribution.length,
      },
    },
    methodology: {
      levels: LEVELS,
      minSamplePerGroup: MIN_SAMPLE_PER_GROUP,
      ladder:
        'FACT (recorded event) -> OBSERVATION (aggregate) -> CORRELATION (statistical association) -> ' +
        'ATTRIBUTION (designed experiment + control + adequate sample) -> CAUSATION (never claimed automatically)',
      causationClaimed: false,
    },
    approvals: {
      counts: approvalCounts,
      records: approvals.map((a) => ({
        id: a.id,
        agentId: a.proposal.agentId,
        type: a.proposal.type,
        risk: a.proposal.risk,
        decision: a.decision,
        status: a.status,
        createdAt: a.createdAt,
        expiresAt: a.expiresAt,
        executedAt: a.executedAt,
      })),
    },
    stripe,
    incrementality,
    schedule: revenueSchedule
      ? {
          status: 'signed',
          businessId: revenueSchedule.businessId,
          attributionWindowDays: revenueSchedule.attributionWindowDays,
          baselineMethod: revenueSchedule.baselineMethod,
          exclusions: revenueSchedule.exclusions,
          disputeWindowDays: revenueSchedule.disputeWindowDays,
          paymentFrequency: revenueSchedule.paymentFrequency,
          holdoutPercent: revenueSchedule.holdoutPercent,
          commissionRate: revenueSchedule.commissionRate,
          effectiveDate: revenueSchedule.effectiveDate,
          version: revenueSchedule.version,
        }
      : { status: 'none', note: 'no revenue definition schedule on file — incremental revenue cannot be computed' },
    system: {
      persistence: revenueLedger.repository.constructor.name.includes('Postgres') ? 'postgres' : 'memory',
      stripeSecretConfigured: Boolean(stripeSecretConfigured),
      health: 'ok',
    },
  };
}

/**
 * Verifies the audit chain for a business (hash-chain integrity, in-place
 * tamper detection). Real verifyChain output — never simulated.
 */
export async function verifyMerchantAuditChain(auditTrail) {
  const result = await auditTrail.verifyChain();
  return {
    valid: result.valid,
    brokenLinks: result.brokenLinks,
    checkedAt: new Date().toISOString(),
  };
}
