/**
 * Economic trace: reconstructs the full chain for a business —
 * twin -> opportunities -> experiments -> approved actions -> customers ->
 * revenue -> attribution -> learnings. Returns the evidence at every hop;
 * missing hops are reported as absent (never invented).
 */
export async function buildEconomicTrace({
  businessTwin,
  ledger,
  auditTrail,
  experimentEngine,
  economicStore,
  businessId,
}) {
  const trace = { businessId, hops: [], missing: [] };

  // 1. Twin
  try {
    trace.twin = await businessTwin.snapshot(businessId);
  } catch {
    trace.missing.push('business_twin');
  }

  // 2. Approved actions from the audit trail
  trace.actions = await auditTrail.getLogs({ businessId });
  trace.missing.push(...(trace.actions.length ? [] : ['approved_actions']));

  // 3. Experiments
  const experiments = (await experimentEngine.listExperiments(businessId)) || [];
  trace.experiments = experiments;

  // 4. Customers
  trace.customers = await economicStore.getCustomersByBusiness(businessId);

  // 5. Revenue events
  trace.revenue = await ledger.getByBusiness(businessId);

  // 6. Attribution records
  trace.attribution = await economicStore.getAttributionByBusiness(businessId);

  // 7. Learnings = concise evidence summary
  const attributed = trace.attribution.filter((a) => a.level === 'attribution');
  const correlational = trace.attribution.filter((a) => a.level === 'correlation');
  const unknown = trace.attribution.filter((a) => a.level === 'observation');
  trace.learnings = {
    attributedCount: attributed.length,
    correlationalCount: correlational.length,
    unknownCount: unknown.length,
    summary:
      trace.attribution.length === 0
        ? 'no attribution evidence yet'
        : `${attributed.length} attribution-level, ${correlational.length} correlation-level, ${unknown.length} unknown`,
  };

  return trace;
}
