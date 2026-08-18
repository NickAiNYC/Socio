import { PolicyViolationError, ValidationError } from './errors.mjs';

const DEFAULT_APPROVAL_TTL_MS = 15 * 60 * 1000;

/**
 * Agent Governor
 * Central governance layer evaluating action proposals.
 *
 * In addition to policy evaluation, the Governor maintains a durable
 * approval registry: `propose()` persists the proposal + decision so that
 * `growth_os_execute_action` can enforce that an approval EXISTS, is still
 * valid (not expired), is bound to the same business/agent/action/payload,
 * and has not already been consumed (replay protection).
 */
export class AgentGovernor {
  /**
   * @param {Array|Object} [policies] custom policy functions (array) or policy map
   * @param {object} [approvalRepository] repository backing the approval registry (MemoryRepository / PostgresRepository)
   */
  constructor(policies = {}, approvalRepository = null) {
    this.policies = policies;
    this.approvalRepository = approvalRepository;
    this.defaultRiskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    this.approvalTtlMs = DEFAULT_APPROVAL_TTL_MS;
  }

  /**
   * Evaluates an Action Proposal (policy layer only — does not persist).
   * @param {import('./types.mjs').ActionProposal} proposal
   * @returns {import('./types.mjs').GovernanceDecision}
   */
  async evaluate(proposal) {
    this._validateProposal(proposal);

    // Default policy rules based on risk
    let decision = 'approved';
    let reason = 'Action meets low risk criteria';
    let requiredApprover = undefined;
    let matchingPolicy = 'DEFAULT_RISK_POLICY';

    // 1. Hard block CRITICAL actions
    if (proposal.risk === 'CRITICAL') {
      decision = 'blocked';
      reason = 'CRITICAL risk actions are blocked by default';
      requiredApprover = 'SYSTEM_ADMIN';
    }
    // 2. High risk requires approval
    else if (proposal.risk === 'HIGH') {
      decision = 'approval_required';
      reason = 'HIGH risk actions require explicit approval';
      requiredApprover = 'BUSINESS_OWNER';
    }
    // 3. Medium risk requires approval by default (can be overridden)
    else if (proposal.risk === 'MEDIUM') {
      decision = 'approval_required';
      reason = 'MEDIUM risk actions require approval by default';
      requiredApprover = 'AGENT_SUPERVISOR';
    }

    // Evaluate custom policies
    if (this.policies && Array.isArray(this.policies)) {
      for (const policyFn of this.policies) {
        const policyResult = await policyFn(proposal, { decision, reason, matchingPolicy, requiredApprover });
        if (policyResult) {
          decision = policyResult.decision || decision;
          reason = policyResult.reason || reason;
          matchingPolicy = policyResult.policy || matchingPolicy;
          requiredApprover = policyResult.requiredApprover || requiredApprover;

          // Fail closed: if any policy blocks, we immediately block
          if (decision === 'blocked') break;
        }
      }
    }

    return {
      decision,
      risk: proposal.risk,
      reason,
      policy: matchingPolicy,
      requiredApprover
    };
  }

  /**
   * Proposes an action AND persists the governance decision as durable state.
   * @param {import('./types.mjs').ActionProposal} proposal
   * @returns {Promise<object>} the persisted approval record
   */
  async propose(proposal) {
    this._validateProposal(proposal);
    const decision = await this.evaluate(proposal);

    const approval = {
      id: proposal.id,
      proposal,
      decision: decision.decision,
      risk: proposal.risk,
      reason: decision.reason,
      policy: decision.policy,
      requiredApprover: decision.requiredApprover,
      status: decision.decision === 'approved' ? 'APPROVED'
        : decision.decision === 'blocked' ? 'BLOCKED' : 'PENDING',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.approvalTtlMs).toISOString(),
      executedAt: null,
    };

    if (this.approvalRepository) {
      // Duplicate proposal id must not silently overwrite a prior decision.
      await this.approvalRepository.saveIfAbsent(approval.id, approval);
    }

    return approval;
  }

  /**
   * Returns the durable approval state for a proposal, or null if never proposed.
   * @param {string} proposalId
   */
  async getApprovalStatus(proposalId) {
    if (!this.approvalRepository) return null;
    return await this.approvalRepository.get(proposalId);
  }

  /**
   * Atomically consumes an approval: APPROVED -> EXECUTED.
   * Replay (second execution of the same proposal) fails.
   * @param {string} proposalId
   */
  async markExecuted(proposalId) {
    const approval = await this.getApprovalStatus(proposalId);
    if (!approval) throw new Error(`approval ${proposalId} not found`);
    if (approval.status !== 'APPROVED') {
      throw new Error(`proposal ${proposalId} is not APPROVED (status: ${approval.status}) — replay or unapproved execution rejected`);
    }
    if (new Date(approval.expiresAt) < new Date()) {
      throw new Error(`approval ${proposalId} has expired`);
    }

    approval.status = 'EXECUTED';
    approval.executedAt = new Date().toISOString();
    // NOTE: read-modify-write. A true compare-and-set (UPDATE ... WHERE status='APPROVED')
    // is a listed hardening step for multi-worker concurrency on Postgres.
    await this.approvalRepository.save(approval.id, approval);
    return approval;
  }

  _validateProposal(proposal) {
    if (!proposal.id) throw new ValidationError('Proposal ID is required');
    if (!proposal.businessId) throw new ValidationError('businessId is required');
    if (!proposal.agentId) throw new ValidationError('agentId is required');
    if (!proposal.type) throw new ValidationError('type is required');
    if (!proposal.risk) throw new ValidationError('risk level is required');
    if (!this.defaultRiskLevels.includes(proposal.risk)) {
      throw new ValidationError(`Invalid risk level: ${proposal.risk}`);
    }
  }
}
