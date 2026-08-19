/**
 * ChiefOfStaffEngine.ts
 * 
 * Hierarchical Graph-Aware Decision Engine for Autonomous Growth OS.
 * Computes the Single Next Best Action across 4 strict mathematical tiers:
 * 
 * Tier 1: Hard Blockers (Security, AirLock breaches, multi-agent deadlocks)
 * Tier 2: Downstream Leverage Ratio (Downstream Value Unlocked ÷ Founder Time)
 * Tier 3: Direct Expected Value ((Revenue * Probability * Confidence) ÷ Time)
 * Tier 4: Quick Win Founder Productivity Tie-breaker
 */

/* =========================================================================
   1. TYPES & DATA CONTRACTS
   ========================================================================= */

export type UrgencyTier = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type GatingCategory = 'HARD_BLOCKER' | 'LEVERAGE' | 'REVENUE' | 'PRODUCTIVITY';

export interface CausalChainContext {
  downstreamAgentIds: string[];
  downstreamActionCount: number;
  downstreamPipelineValue: number; // e.g. $8,400 unlocked across waiting agents
  isDeadlockRoot: boolean;
  timeWindowExpiryHours?: number;
}

export interface LeverageMetrics {
  directRevenue: number;
  probabilityOfSuccess: number; // 0.0 - 1.0
  confidenceScore: number;      // 0.0 - 1.0
  founderTimeSeconds: number;   // e.g. 45 seconds
  calculatedScore?: number;
}

export interface ActionCandidate {
  id: string;
  title: string;
  description: string;
  category: GatingCategory;
  urgency: UrgencyTier;
  risk: RiskLevel;
  targetMerchant: string;
  proposingAgentId: string;
  proposalId?: string;
  whyNow: string;
  metrics: LeverageMetrics;
  causalChain: CausalChainContext;
  governorRequired: boolean;
  policyCode?: string;
  createdAt: string;
}

export interface EvaluationExplanation {
  winningTier: GatingCategory;
  leverageRatio: number;
  expectedDirectValue: number;
  totalSystemImpact: number;
  breakdown: string;
  signals: string[];
}

export interface DecisionResult {
  nextBestAction: ActionCandidate;
  explanation: EvaluationExplanation;
  evaluatedCandidatesCount: number;
  timestamp: string;
}

/* =========================================================================
   2. MATHEMATICAL SCORING ALGORITHMS
   ========================================================================= */

/**
 * Calculates Leverage Ratio: Downstream Unblocked Value ÷ Founder Time in Minutes
 */
export function calculateLeverageScore(action: ActionCandidate): number {
  const timeMinutes = Math.max(action.metrics.founderTimeSeconds / 60, 0.1);
  return action.causalChain.downstreamPipelineValue / timeMinutes;
}

/**
 * Calculates Pure Expected Value Score:
 * (Direct Revenue * Probability * Confidence) ÷ Time in Minutes
 */
export function calculateExpectedValueScore(action: ActionCandidate): number {
  const timeMinutes = Math.max(action.metrics.founderTimeSeconds / 60, 0.1);
  const directEV = action.metrics.directRevenue * action.metrics.probabilityOfSuccess * action.metrics.confidenceScore;
  return directEV / timeMinutes;
}

/* =========================================================================
   3. HIERARCHICAL 4-TIER DECISION ENGINE
   ========================================================================= */

export class ChiefOfStaffEngine {
  /**
   * Ingests action candidates and graph dependencies, evaluates strict 4 tiers,
   * and returns the mathematically optimal Next Best Action.
   */
  public static evaluateNextBestAction(candidates: ActionCandidate[]): DecisionResult | null {
    if (!candidates || candidates.length === 0) return null;

    // -----------------------------------------------------------------------
    // TIER 1: Hard Blockers (Security breaches, AirLock holds, deadlocks)
    // -----------------------------------------------------------------------
    const hardBlockers = candidates.filter(
      (c) => c.category === 'HARD_BLOCKER' || c.urgency === 'CRITICAL' || c.causalChain.isDeadlockRoot
    );

    if (hardBlockers.length > 0) {
      // Sort by downstream agents blocked then shortest time
      const winner = hardBlockers.sort((a, b) => {
        if (b.causalChain.downstreamActionCount !== a.causalChain.downstreamActionCount) {
          return b.causalChain.downstreamActionCount - a.causalChain.downstreamActionCount;
        }
        return a.metrics.founderTimeSeconds - b.metrics.founderTimeSeconds;
      })[0];

      return {
        nextBestAction: winner,
        explanation: {
          winningTier: 'HARD_BLOCKER',
          leverageRatio: calculateLeverageScore(winner),
          expectedDirectValue: winner.metrics.directRevenue,
          totalSystemImpact: winner.causalChain.downstreamPipelineValue + winner.metrics.directRevenue,
          breakdown: `Critical hard blocker resolved: unblocks ${winner.causalChain.downstreamActionCount} downstream agent tasks.`,
          signals: [
            'Deadlock prevention active',
            `${winner.causalChain.downstreamAgentIds.length} agents currently blocked`,
            'Zero bypass security threshold'
          ]
        },
        evaluatedCandidatesCount: candidates.length,
        timestamp: new Date().toISOString()
      };
    }

    // -----------------------------------------------------------------------
    // TIER 2: Leverage / Unblock Bottlenecks (Downstream Value ÷ Founder Time)
    // -----------------------------------------------------------------------
    const leverageCandidates = candidates.filter(
      (c) => c.causalChain.downstreamPipelineValue > 0 && c.causalChain.downstreamActionCount >= 1
    );

    if (leverageCandidates.length > 0) {
      const winner = leverageCandidates.sort((a, b) => {
        const scoreA = calculateLeverageScore(a);
        const scoreB = calculateLeverageScore(b);
        return scoreB - scoreA;
      })[0];

      const leverageRatio = calculateLeverageScore(winner);

      // If high leverage ratio (> $5,000 / min), prioritize immediately
      if (leverageRatio > 2500) {
        return {
          nextBestAction: winner,
          explanation: {
            winningTier: 'LEVERAGE',
            leverageRatio: Math.round(leverageRatio),
            expectedDirectValue: winner.metrics.directRevenue,
            totalSystemImpact: winner.causalChain.downstreamPipelineValue + winner.metrics.directRevenue,
            breakdown: `Unlocks $${winner.causalChain.downstreamPipelineValue.toLocaleString()} across ${winner.causalChain.downstreamAgentIds.join(', ')} in ${winner.metrics.founderTimeSeconds}s.`,
            signals: [
              `High leverage: $${Math.round(leverageRatio).toLocaleString()}/min founder unlock`,
              `${winner.causalChain.downstreamActionCount} waiting pipeline actions`,
              `${winner.metrics.confidenceScore * 100}% causal confidence`
            ]
          },
          evaluatedCandidatesCount: candidates.length,
          timestamp: new Date().toISOString()
        };
      }
    }

    // -----------------------------------------------------------------------
    // TIER 3: Direct Pure Expected Value ((Rev * Prob * Conf) ÷ Time)
    // -----------------------------------------------------------------------
    const directCandidates = candidates.filter((c) => c.metrics.directRevenue > 0);

    if (directCandidates.length > 0) {
      const winner = directCandidates.sort((a, b) => {
        const scoreA = calculateExpectedValueScore(a);
        const scoreB = calculateExpectedValueScore(b);
        return scoreB - scoreA;
      })[0];

      const evScore = calculateExpectedValueScore(winner);

      return {
        nextBestAction: winner,
        explanation: {
          winningTier: 'REVENUE',
          leverageRatio: calculateLeverageScore(winner),
          expectedDirectValue: winner.metrics.directRevenue,
          totalSystemImpact: winner.metrics.directRevenue + winner.causalChain.downstreamPipelineValue,
          breakdown: `Highest direct expected return: +$${winner.metrics.directRevenue.toLocaleString()} at ${(winner.metrics.probabilityOfSuccess * 100).toFixed(0)}% probability.`,
          signals: [
            `Projected Return: +$${winner.metrics.directRevenue.toLocaleString()}`,
            `${(winner.metrics.confidenceScore * 100).toFixed(0)}% statistical confidence sample`,
            `${winner.metrics.founderTimeSeconds}s founder review window`
          ]
        },
        evaluatedCandidatesCount: candidates.length,
        timestamp: new Date().toISOString()
      };
    }

    // -----------------------------------------------------------------------
    // TIER 4: Founder Productivity Tie-breaker (Quickest Win)
    // -----------------------------------------------------------------------
    const fallbackWinner = candidates.sort((a, b) => a.metrics.founderTimeSeconds - b.metrics.founderTimeSeconds)[0];

    return {
      nextBestAction: fallbackWinner,
      explanation: {
        winningTier: 'PRODUCTIVITY',
        leverageRatio: 0,
        expectedDirectValue: fallbackWinner.metrics.directRevenue,
        totalSystemImpact: fallbackWinner.metrics.directRevenue,
        breakdown: `Quick productivity win: completes in ${fallbackWinner.metrics.founderTimeSeconds} seconds.`,
        signals: ['Clears operational backlog', 'Low cognitive overhead']
      },
      evaluatedCandidatesCount: candidates.length,
      timestamp: new Date().toISOString()
    };
  }
}
