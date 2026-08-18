import { randomUUID } from 'node:crypto';
import { compareGroups } from './stats.mjs';

/**
 * Evidence ladder — Socio never blurs these:
 *   FACT         — a recorded event (timestamped, source-identified)
 *   OBSERVATION  — an aggregate computed from facts
 *   CORRELATION  — a statistical association between series
 *   ATTRIBUTION  — a causal-ish claim supported by a designed experiment with
 *                  control group and adequate samples
 *   CAUSATION    — never claimed automatically; requires RCT, replication,
 *                  external validation (reserved, not produced here)
 *
 * If any link in the chain is missing, the attribution remains UNKNOWN.
 */

export const LEVELS = Object.freeze(['fact', 'observation', 'correlation', 'attribution', 'causation']);

/**
 * Attribute a revenue event to an experiment + customer, evidence-based.
 *
 * @param {object} params
 * @param {{recordAttribution(record: object): Promise<any>,
 *          findCustomerByProviderId(businessId: string, provider: string, providerCustomerId: string): Promise<{id: string, providerCustomerId: string, businessId: string, [key: string]: any}|null>,
 *          getAssignment(experimentId: string, customerId: string): Promise<{variant: string, assignedAt: string, [key: string]: any}|null>}} params.store economic store
 * @param {{id: string, businessId: string, amount: number, currency: string, occurredAt?: string, source: string, metadata?: {[key: string]: any}}} params.revenueEvent the ledger revenue event
 * @param {string|null} params.experimentId
 * @param {string|null} params.customerId (Socio customer id, not provider id)
 * @param {number[]} [params.treatmentOutcomes] metric values from treatment group
 * @param {number[]} [params.controlOutcomes] metric values from control group
 * @param {boolean} [params.isRct=false] whether the experiment used randomized assignment
 * @returns {Promise<{id: string, businessId: string, revenueEventId: string, experimentId: string|null, customerId: string|null, variant?: string, level: string, claim: string, confidence: number|null, evidence: Array<{type: string, what: string, [key: string]: any}>, createdAt: string}>} the attribution record
 */
export async function attributeRevenue({
  store,
  revenueEvent,
  experimentId = null,
  customerId = null,
  treatmentOutcomes = [],
  controlOutcomes = [],
  isRct = false,
}) {
  /** @type {Array<{type: string, what: string, [key: string]: any}>} */
  const facts = [
    {
      type: 'fact',
      what: 'revenue_event_recorded',
      id: revenueEvent.id,
      amount: revenueEvent.amount,
      currency: revenueEvent.currency,
      occurredAt: revenueEvent.occurredAt,
      source: revenueEvent.source,
    },
  ];

  // 1. Unknown stays unknown: no customer or no experiment => no attribution.
  if (!customerId || !experimentId) {
    return store.recordAttribution({
      id: randomUUID(),
      businessId: revenueEvent.businessId,
      revenueEventId: revenueEvent.id,
      experimentId: experimentId || null,
      customerId: customerId || null,
      level: 'observation',
      claim: 'unknown attribution — revenue recorded, but no experiment/customer link exists',
      confidence: null,
      evidence: facts,
      createdAt: new Date().toISOString(),
    });
  }

  // 2. Customer must be a known entity in the store.
  const customer = await store.findCustomerByProviderId(revenueEvent.businessId, 'stripe', revenueEvent.metadata?.stripeCustomerId || '');
  if (!customer) {
    return store.recordAttribution({
      id: randomUUID(),
      businessId: revenueEvent.businessId,
      revenueEventId: revenueEvent.id,
      experimentId,
      customerId,
      level: 'observation',
      claim: 'unknown attribution — revenue event references an unmapped customer',
      confidence: null,
      evidence: facts,
      createdAt: new Date().toISOString(),
    });
  }
  facts.push({ type: 'fact', what: 'customer_mapped', customerId: customer.id, providerCustomerId: customer.providerCustomerId });

  // 3. Experiment assignment must exist for this customer.
  const assignment = await store.getAssignment(experimentId, customerId);
  if (!assignment) {
    return store.recordAttribution({
      id: randomUUID(),
      businessId: revenueEvent.businessId,
      revenueEventId: revenueEvent.id,
      experimentId,
      customerId,
      level: 'observation',
      claim: 'unknown attribution — customer is not assigned to the experiment',
      confidence: null,
      evidence: facts,
      createdAt: new Date().toISOString(),
    });
  }
  facts.push({ type: 'fact', what: 'experiment_assignment', variant: assignment.variant, assignedAt: assignment.assignedAt });

  // 4. Correlation from group comparison.
  const comparison = compareGroups(treatmentOutcomes, controlOutcomes);
  facts.push({
    type: 'correlation',
    what: 'group_comparison',
    nTreatment: comparison.nTreatment,
    nControl: comparison.nControl,
    delta: comparison.delta ?? null,
    tStat: comparison.tStat ?? null,
    pApprox: comparison.pApprox ?? null,
    sufficient: comparison.sufficient,
    verdict: comparison.verdict,
  });

  let level = 'correlation';
  let claim = 'correlational evidence only — group comparison; not a causal attribution';
  let confidence = comparison.sufficient ? Math.max(0, 1 - (comparison.pApprox ?? 1)) : null;

  if (!comparison.sufficient) {
    level = 'observation';
    claim = `insufficient sample (treatment n=${comparison.nTreatment}, control n=${comparison.nControl}) — inconclusive`;
    confidence = null;
  } else if (comparison.verdict !== 'significant_positive') {
    level = 'correlation';
    claim = 'no significant positive effect detected — no attribution';
    confidence = 1 - (comparison.pApprox ?? 1);
  } else if (isRct && comparison.verdict === 'significant_positive') {
    // Evidence-based attribution: designed experiment + control + adequate n.
    level = 'attribution';
    claim = `treatment variant ${assignment.variant} shows significant positive lift (delta=${comparison.delta.toFixed(4)}, approx p=${comparison.pApprox.toFixed(4)}) — attribution-level evidence, still not causation`;
    confidence = 1 - (comparison.pApprox ?? 1);
  }

  return store.recordAttribution({
    id: randomUUID(),
    businessId: revenueEvent.businessId,
    revenueEventId: revenueEvent.id,
    experimentId,
    customerId,
    variant: assignment.variant,
    level,
    claim,
    confidence,
    evidence: facts,
    createdAt: new Date().toISOString(),
  });
}
