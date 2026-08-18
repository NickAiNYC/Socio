/**
 * @typedef {Object} RevenueEvent
 * @property {string} [id] - assigned by RevenueLedger.record() when omitted
 * @property {string} businessId
 * @property {string} [customerId]
 * @property {string} [agentId]
 * @property {string} [actionId]
 * @property {string} [experimentId]
 * @property {string} [campaignId]
 * @property {string} [channel]
 * @property {string} type - e.g., 'revenue', 'campaign_cost', 'refund', 'lead_created'
 * @property {number} amount
 * @property {string} currency
 * @property {string} [occurredAt] - ISO Date string; defaults to now
 * @property {string} source
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} ActionProposal
 * @property {string} id
 * @property {string} businessId
 * @property {string} agentId
 * @property {string} type
 * @property {string} risk - 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' (validated at runtime)
 * @property {string} [objective]
 * @property {string} [expectedOutcome]
 * @property {Object} [payload]
 * @property {string} [evidence]
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} GovernanceDecision
 * @property {'approved' | 'approval_required' | 'blocked'} decision
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} risk
 * @property {string} reason
 * @property {string} policy
 * @property {string} [requiredApprover]
 */

/**
 * @typedef {Object} Experiment
 * @property {string} id
 * @property {string} businessId
 * @property {string} hypothesis
 * @property {string} objective
 * @property {string} metric
 * @property {number} baseline
 * @property {string[]} variants
 * @property {Object} allocation
 * @property {string} startAt
 * @property {string} [endAt]
 * @property {'DRAFT' | 'RUNNING' | 'PAUSED' | 'PROMOTED' | 'KILLED' | 'INCONCLUSIVE'} status
 * @property {Array<any>} observations
 * @property {string} [decision]
 * @property {string} [rationale]
 */

/**
 * @typedef {Object} ActionExplanation
 * @property {string} actionId
 * @property {string} whyNow
 * @property {string} evidence
 * @property {string} hypothesis
 * @property {string} expectedOutcome
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} risk
 * @property {GovernanceDecision} policyDecision
 * @property {number} confidence
 * @property {string} limitations
 */

export {};
