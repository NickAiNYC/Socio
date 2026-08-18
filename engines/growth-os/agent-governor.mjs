import { PolicyViolationError, ValidationError } from './errors.mjs';

/**
 * Agent Governor
 * Central governance layer evaluating action proposals.
 */
export class AgentGovernor {
  constructor(policies = {}) {
    this.policies = policies;
    this.defaultRiskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  }

  /**
   * Evaluates an Action Proposal
   * @param {import('./types.mjs').ActionProposal} proposal
   * @returns {import('./types.mjs').GovernanceDecision}
   */
  async evaluate(proposal) {
    this._validateProposal(proposal);

    // Default policy rules based on prompt
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
    // Policies can be an array of functions that take the proposal and return a modification to the decision
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
