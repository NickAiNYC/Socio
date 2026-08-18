import { randomUUID, createHash } from 'crypto';

/**
 * AuditTrail logs every governed action executed by agents.
 *
 * Entries are hash-chained (each entry binds to the previous entry's hash)
 * and append-only via saveIfAbsent: a replayed id is rejected, and there is
 * no application API to update or delete an entry. This is an
 * "append-only, hash-chained application audit trail" — it is NOT
 * cryptographic proof (no signatures, no Merkle root, no external
 * anchoring). Tampering is detectable in-place by recomputing the chain,
 * not provable to third parties.
 */
export class AuditTrail {
  constructor(repository) {
    this.repo = repository;
    this.chainHeadKey = '__audit_chain_head__';
  }

  /**
   * Record a new governed execution event.
   */
  async log(eventData) {
    if (!eventData.businessId) throw new Error("businessId is required for audit logs.");
    if (!eventData.agentId) throw new Error("agentId is required for audit logs.");
    if (!eventData.proposalId) throw new Error("proposalId is required for audit logs.");

    const prevEntry = await this.repo.get(this.chainHeadKey) || null;
    const prevHash = prevEntry ? prevEntry.hash : null;

    const logEntry = {
      id: `audit_${Date.now()}_${randomUUID().split('-')[0]}`,
      timestamp: new Date().toISOString(),
      prevHash,
      hash: null, // set below over the canonical payload
      ...eventData,
    };

    const canonical = JSON.stringify({
      id: logEntry.id,
      timestamp: logEntry.timestamp,
      prevHash: logEntry.prevHash,
      businessId: logEntry.businessId,
      agentId: logEntry.agentId,
      proposalId: logEntry.proposalId,
      actionType: logEntry.actionType,
      payload: logEntry.payload,
      status: logEntry.status,
    });
    logEntry.hash = createHash('sha256').update(canonical).digest('hex');

    const saved = await this.repo.saveIfAbsent(logEntry.id, logEntry);
    // Advance the chain head.
    await this.repo.save(this.chainHeadKey, { hash: logEntry.hash, entryId: logEntry.id, timestamp: logEntry.timestamp });
    return saved;
  }

  /**
   * Fetch all actions for a specific business or agent.
   * businessId filtering happens at the repository boundary when supported.
   */
  async getLogs(filterOptions = {}) {
    const excludeHead = (item) => item.id !== this.chainHeadKey;
    let items;
    if (filterOptions.businessId && this.repo.findByBusiness) {
      items = await this.repo.findByBusiness(filterOptions.businessId);
      items = items.filter(excludeHead);
    } else {
      items = await this.repo.findAll(excludeHead);
    }
    let match = true;
    const { agentId } = filterOptions;
    return items.filter((item) => {
      match = true;
      if (agentId && item.agentId !== agentId) match = false;
      return match;
    });
  }

  /**
   * Recomputes each entry's hash from its canonical content and validates the
   * prevHash chain. Returns any broken links (tampered content or chain).
   * @returns {Promise<{valid: boolean, brokenLinks: Array<{id: string, index: number}>}>}
   */
  async verifyChain() {
    const entries = (await this.repo.findAll((item) => item.id !== this.chainHeadKey))
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
    const brokenLinks = [];
    let prevHash = null;
    entries.forEach((entry, index) => {
      const canonical = JSON.stringify({
        id: entry.id,
        timestamp: entry.timestamp,
        prevHash: entry.prevHash,
        businessId: entry.businessId,
        agentId: entry.agentId,
        proposalId: entry.proposalId,
        actionType: entry.actionType,
        payload: entry.payload,
        status: entry.status,
      });
      const recomputed = createHash('sha256').update(canonical).digest('hex');
      if (recomputed !== entry.hash) {
        brokenLinks.push({ id: entry.id, index, reason: 'hash_mismatch' });
      }
      if (entry.prevHash !== prevHash) {
        brokenLinks.push({ id: entry.id, index, reason: 'chain_break' });
      }
      prevHash = entry.hash;
    });
    return { valid: brokenLinks.length === 0, brokenLinks };
  }
}
