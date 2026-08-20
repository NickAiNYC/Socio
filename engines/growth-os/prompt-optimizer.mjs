/**
 * PromptOptimizer — DSPy-style outcome-driven prompt selection.
 *
 * Agents' prompts are versioned as variants. Each variant is scored against
 * REAL recorded outcomes from the Revenue Ledger and Audit Trail (conversion,
 * ROI, approval rate). The best-scoring variant can be promoted to active.
 *
 * Honesty rules:
 *   - scoring only counts events recorded AFTER the variant was created
 *   - below a minimum sample the verdict is "insufficient", never a score —
 *     optimizing on noise is optimizing garbage
 *   - promotion is a governed action (executed approval required in the MCP
 *     layer) and flips the active flag by compare-and-swap
 */
const METRICS = Object.freeze(['conversion', 'roi', 'approval']);
const MIN_SAMPLE = 10;

export class PromptOptimizer {
  /**
   * @param {object} repository generic repository (prompt_variants table)
   * @param {object} deps
   * @param {import('./revenue-ledger.mjs').RevenueLedger} deps.ledger
   * @param {import('./audit-trail.mjs').AuditTrail} deps.auditTrail
   */
  constructor(repository, { ledger, auditTrail }) {
    this.repository = repository;
    this.ledger = ledger;
    this.auditTrail = auditTrail;
  }

  /**
   * Registers a prompt variant. Re-registering the same (agentId, variantId)
   * is rejected — variants are immutable once recorded.
   */
  async registerVariant({ agentId, variantId, prompt, description = null, baseline = null }) {
    if (!agentId || !variantId || typeof prompt !== 'string' || prompt.length === 0) {
      throw new Error('registerVariant requires agentId, variantId and a non-empty prompt');
    }
    const record = {
      agentId,
      variantId,
      prompt,
      description,
      baseline, // optional baseline prompt text the variant derives from
      active: false,
      createdAt: new Date().toISOString(),
    };
    await this.repository.saveIfAbsent(`${agentId}:${variantId}`, record);
    return record;
  }

  async listVariants(agentId) {
    return (await this.repository.findAll((r) => r.agentId === agentId))
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  }

  async getActiveVariant(agentId) {
    const variants = await this.listVariants(agentId);
    return variants.find((v) => v.active === true) || null;
  }

  /**
   * Scores each variant of an agent against recorded outcomes that occurred
   * after the variant was created.
   * @param {string} agentId
   * @param {{metric?: string, minSample?: number, nowMs?: number}} [opts]
   * @returns {Promise<{metric: string, minSample: number, variants: Array<object>, note?: string}>}
   */
  async evaluate(agentId, { metric = 'conversion', minSample = MIN_SAMPLE } = {}) {
    if (!METRICS.includes(metric)) throw new Error(`metric must be one of ${METRICS.join(', ')}`);
    const variants = await this.listVariants(agentId);
    if (variants.length === 0) {
      return { metric, minSample, variants: [], note: 'no prompt variants registered for this agent' };
    }

    const actions = await this.auditTrail.getLogs({ agentId });
    const events = await this.ledger.getEvents({ agentId });

    const scored = variants.map((variant) => {
      const since = new Date(variant.createdAt).getTime();
      const actionsAfter = actions.filter((a) => new Date(a.timestamp).getTime() >= since);
      const revenueAfter = events.filter(
        (e) => ['revenue', 'purchase', 'repeat_purchase', 'expansion_revenue'].includes(e.type) &&
          new Date(e.occurredAt).getTime() >= since
      );
      const costAfter = events
        .filter((e) => e.type === 'campaign_cost' && new Date(e.occurredAt).getTime() >= since)
        .reduce((sum, e) => sum + Math.abs(e.amount), 0);
      const revenueTotal = revenueAfter.reduce((sum, e) => sum + e.amount, 0);

      const n = actionsAfter.length;
      let score = null;
      let verdict = 'insufficient';
      if (n >= minSample) {
        if (metric === 'conversion') {
          score = revenueAfter.length / n;
        } else if (metric === 'roi') {
          score = costAfter > 0 ? ((revenueTotal - costAfter) / costAfter) * 100 : 0;
        } else { // approval
          const approved = actionsAfter.filter((a) => a.status === 'EXECUTED').length;
          score = approved / n;
        }
        verdict = 'scored';
      }
      return {
        agentId,
        variantId: variant.variantId,
        description: variant.description,
        active: variant.active === true,
        createdAt: variant.createdAt,
        n,
        revenueEvents: revenueAfter.length,
        revenueTotal,
        cost: costAfter,
        score: score === null ? null : Math.round(score * 10000) / 10000,
        verdict,
        reason: verdict === 'insufficient'
          ? `sample too small (n=${n} < ${minSample}) — optimizing on this would be optimizing noise`
          : `metric=${metric} scored from ${n} recorded actions`,
      };
    });

    scored.sort((a, b) => (a.verdict !== b.verdict ? (a.verdict === 'scored' ? -1 : 1) : (b.score ?? -1) - (a.score ?? -1)));
    return { metric, minSample, variants: scored };
  }

  /**
   * Promotes a variant to active (CAS: exactly one active variant at a time).
   */
  async promote(agentId, variantId) {
    const variants = await this.listVariants(agentId);
    const target = variants.find((v) => v.variantId === variantId);
    if (!target) throw new Error(`variant ${variantId} not found for agent ${agentId}`);

    const active = variants.find((v) => v.active === true);
    if (active) {
      const flipped = await this.repository.compareAndSwap(`${agentId}:${active.variantId}`, 'active', true, false);
      if (!flipped) throw new Error(`could not deactivate ${active.variantId} — concurrent promotion`);
    }
    const promoted = await this.repository.compareAndSwap(`${agentId}:${variantId}`, 'active', false, true);
    if (!promoted) throw new Error(`could not promote ${variantId} — concurrent promotion`);
    return promoted;
  }
}
