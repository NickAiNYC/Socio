import { randomUUID } from 'crypto';

/**
 * AuditTrail logs every governed action executed by agents.
 * This provides the deterministic chain of custody required before
 * revenue attribution can occur.
 */
export class AuditTrail {
  constructor(repository) {
    this.repo = repository;
  }

  /**
   * Record a new governed execution event.
   */
  async log(eventData) {
    if (!eventData.businessId) throw new Error("businessId is required for audit logs.");
    if (!eventData.agentId) throw new Error("agentId is required for audit logs.");
    if (!eventData.proposalId) throw new Error("proposalId is required for audit logs.");

    const logEntry = {
      id: `audit_${Date.now()}_${randomUUID().split('-')[0]}`,
      timestamp: new Date().toISOString(),
      ...eventData,
    };

    return this.repo.save(logEntry.id, logEntry);
  }

  /**
   * Fetch all actions for a specific business or agent.
   */
  async getLogs(filterOptions = {}) {
    return this.repo.findAll((item) => {
      let match = true;
      if (filterOptions.businessId && item.businessId !== filterOptions.businessId) match = false;
      if (filterOptions.agentId && item.agentId !== filterOptions.agentId) match = false;
      return match;
    });
  }
}
