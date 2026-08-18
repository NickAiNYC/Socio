# Growth OS Data Model

## Business Twin
The Business Twin represents the persistent operational state of a business.
It uses event-sourced updates (snapshots and patches) to ensure history is retained.

```typescript
type BusinessTwinState = {
  id: string; // Business ID
  createdAt: string;
  updatedAt: string;
  _lastUpdateAgent: string; // the agent or system that made the last update
  _lastUpdateReason: string; // justification for the update
  
  // Custom business fields
  name?: string;
  locations?: any[];
  services?: any[];
  pricing?: any;
  // ... any other context
}
```

## Revenue Ledger
The Revenue Ledger is an immutable event log for economic and operational activities.

```typescript
type RevenueEvent = {
  id: string; // Unique event ID
  businessId: string;
  customerId?: string;
  agentId?: string;
  actionId?: string;
  experimentId?: string;
  campaignId?: string;
  channel?: string;
  
  type: 'revenue' | 'campaign_cost' | 'refund' | 'lead_created' | 'agent_action' | ...;
  amount: number;
  currency: string;
  occurredAt: string;
  source: string; // e.g. 'stripe', 'manual', 'hermes'
  metadata?: Record<string, any>;
}
```

## Action Proposal
Before any agent executes a change, it generates an Action Proposal evaluated by the Governor.

```typescript
type ActionProposal = {
  id: string;
  businessId: string;
  agentId: string;
  type: string; // e.g., 'send_email', 'update_pricing'
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  objective: string;
  expectedOutcome: string;
  payload: any; // the actual execution arguments
  evidence: string; // why this action is proposed
  createdAt: string;
}
```

## Experiment
A growth hypothesis being actively tested.

```typescript
type Experiment = {
  id: string;
  businessId: string;
  hypothesis: string;
  objective: string;
  metric: string;
  baseline: number;
  variants: string[];
  allocation: any;
  startAt?: string;
  endAt?: string;
  status: 'DRAFT' | 'RUNNING' | 'PAUSED' | 'PROMOTED' | 'KILLED' | 'INCONCLUSIVE';
  observations: any[];
  decision?: string;
  rationale?: string;
}
```
