import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  BusinessTwin,
  RevenueLedger,
  AgentGovernor,
  BusinessTwinMemoryRepository,
  MemoryRepository,
  PostgresRepository,
  BusinessTwinPostgresRepository,
  AuditTrail
} from "./index.mjs";

// ---------------------------------------------------------------------------
// Persistence selection — FAIL CLOSED.
// Production requires DATABASE_URL. Memory is only allowed when explicitly
// requested (GROWTH_OS_ALLOW_MEMORY=true) for tests / local scratch.
// ---------------------------------------------------------------------------
const DATABASE_URL = process.env.DATABASE_URL;
const ALLOW_MEMORY = process.env.GROWTH_OS_ALLOW_MEMORY === 'true';

if (!DATABASE_URL && !ALLOW_MEMORY) {
  console.error(
    'Growth OS fails closed: DATABASE_URL is required for durable persistence. ' +
    'Set GROWTH_OS_ALLOW_MEMORY=true only for explicit in-memory test mode.'
  );
  process.exit(1);
}

let twinRepo;
let ledgerRepo;
let auditRepo;
let approvalRepo;

if (DATABASE_URL) {
  twinRepo = new BusinessTwinPostgresRepository();
  ledgerRepo = new PostgresRepository('revenue_ledger');
  auditRepo = new PostgresRepository('audit_trail');
  approvalRepo = new PostgresRepository('approvals');
} else {
  twinRepo = new BusinessTwinMemoryRepository();
  ledgerRepo = new MemoryRepository();
  auditRepo = new MemoryRepository();
  approvalRepo = new MemoryRepository();
}

const businessTwin = new BusinessTwin(twinRepo);
const revenueLedger = new RevenueLedger(ledgerRepo);
const auditTrail = new AuditTrail(auditRepo);
const agentGovernor = new AgentGovernor([], approvalRepo);

// Boot the twin with a mock default state if none exists for testing purposes
businessTwin.initialize('socio_default', {
  name: 'Socio Default Business',
  status: 'ACTIVE',
  goals: ['Acquire 5 merchants', 'Validate lead funnel']
}).catch(() => {}); // ignore if already exists

const server = new McpServer({
  name: "Growth-OS",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Shared validation helpers
// ---------------------------------------------------------------------------
const FINANCIAL_EVENT_TYPES = new Set(['revenue', 'campaign_cost', 'refund']);

function deepEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

async function enforceApprovedProposal(proposalId, { businessId, agentId, actionType, payload }) {
  const approval = await agentGovernor.getApprovalStatus(proposalId);
  if (!approval) {
    throw new Error(`proposal ${proposalId} does not exist — no approval on record`);
  }
  if (approval.status !== 'APPROVED') {
    throw new Error(`proposal ${proposalId} is not approved (status: ${approval.status})`);
  }
  if (new Date(approval.expiresAt) < new Date()) {
    throw new Error(`approval ${proposalId} has expired`);
  }
  if (approval.proposal.businessId !== businessId) {
    throw new Error(`approval ${proposalId} is bound to business ${approval.proposal.businessId}, not ${businessId}`);
  }
  if (approval.proposal.agentId !== agentId) {
    throw new Error(`approval ${proposalId} is bound to agent ${approval.proposal.agentId}, not ${agentId}`);
  }
  if (approval.proposal.type !== actionType) {
    throw new Error(`approval ${proposalId} authorizes action type ${approval.proposal.type}, not ${actionType}`);
  }
  if (!deepEqual(approval.proposal.payload, payload ?? {})) {
    throw new Error(`approval ${proposalId} payload does not match the execution payload — the approval must authorize the exact action`);
  }
  return approval;
}

// Tool: Read Business Twin
server.tool(
  "growth_os_read_twin",
  "Reads the current state of the Business Twin. This must be called to establish context before taking action.",
  {
    businessId: z.string().describe("The ID of the business. Use 'socio_default' if unknown.")
  },
  async ({ businessId }) => {
    try {
      const state = await businessTwin.snapshot(businessId);
      return {
        content: [{ type: "text", text: JSON.stringify(state, null, 2) }],
      };
    } catch (error) {
      return { content: [{ type: "text", text: `Error reading twin: ${error.message}` }], isError: true };
    }
  }
);

// Tool: Propose Action — persists the proposal AND the governance decision.
server.tool(
  "growth_os_propose_action",
  "Submits an Action Proposal to the Governor for evaluation and persists the decision. MUST be used before executing modifying actions.",
  {
    businessId: z.string(),
    agentId: z.string(),
    type: z.string(),
    risk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    objective: z.string(),
    expectedOutcome: z.string(),
    payload: z.any().describe("The JSON object containing the action's execution parameters."),
    evidence: z.string()
  },
  async (proposalData) => {
    try {
      const proposal = {
        ...proposalData,
        id: `prop_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        createdAt: new Date().toISOString()
      };

      const approval = await agentGovernor.propose(proposal);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            proposalId: approval.id,
            decision: approval.decision,
            status: approval.status,
            risk: approval.risk,
            reason: approval.reason,
            policy: approval.policy,
            requiredApprover: approval.requiredApprover,
            expiresAt: approval.expiresAt,
          }, null, 2),
        }],
      };
    } catch (error) {
      return { content: [{ type: "text", text: `Governance Error: ${error.message}` }], isError: true };
    }
  }
);

// Tool: Execute Action — enforces a durable, unexpired, bound approval.
server.tool(
  "growth_os_execute_action",
  "Executes a governed action. Requires the proposalId from growth_os_propose_action with decision=approved. The approval is consumed (replay is rejected) and the business, agent, action type and payload must match exactly.",
  {
    businessId: z.string(),
    agentId: z.string(),
    proposalId: z.string(),
    actionType: z.string(),
    payload: z.any()
  },
  async (execData) => {
    try {
      // 1. Enforce the approval — this is the boundary.
      await enforceApprovedProposal(execData.proposalId, {
        businessId: execData.businessId,
        agentId: execData.agentId,
        actionType: execData.actionType,
        payload: execData.payload,
      });

      // 2. Consume the approval (APPROVED -> EXECUTED). Replay fails here.
      await agentGovernor.markExecuted(execData.proposalId);

      // 3. Log to Audit Trail
      await auditTrail.log({
        businessId: execData.businessId,
        agentId: execData.agentId,
        proposalId: execData.proposalId,
        actionType: execData.actionType,
        payload: execData.payload,
        status: 'EXECUTED'
      });

      // 4. Execute the action (Simulated external call for now)
      const result = `Action ${execData.actionType} securely executed and logged to audit trail.`;

      return { content: [{ type: "text", text: result }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Execution Error: ${error.message}` }], isError: true };
    }
  }
);

// Tool: Record Event — financial events must reference an executed governed action.
server.tool(
  "growth_os_record_event",
  "Records an outcome or action into the Revenue Ledger. Financial events (revenue, campaign_cost, refund) REQUIRE actionId of an executed, approved action. Refunds additionally require metadata.originalEventId of the original payment.",
  {
    businessId: z.string(),
    agentId: z.string().optional(),
    actionId: z.string().optional().describe("Required for financial events: proposalId of the executed, approved action"),
    type: z.enum(['revenue', 'campaign_cost', 'refund', 'lead_created', 'agent_action']),
    amount: z.number().describe("The financial amount (use 0 for non-financial events like lead_created)"),
    currency: z.string().default('USD'),
    source: z.string(),
    metadata: z.any().optional()
  },
  async (eventData) => {
    try {
      if (FINANCIAL_EVENT_TYPES.has(eventData.type)) {
        if (!eventData.actionId) {
          throw new Error(`${eventData.type} events require actionId of an executed, approved action`);
        }
        const approval = await agentGovernor.getApprovalStatus(eventData.actionId);
        if (!approval || approval.status !== 'EXECUTED') {
          throw new Error(`actionId ${eventData.actionId} is not an executed, approved action`);
        }
        if (approval.proposal.businessId !== eventData.businessId) {
          throw new Error(`actionId ${eventData.actionId} belongs to business ${approval.proposal.businessId}, not ${eventData.businessId}`);
        }
      }

      const event = await revenueLedger.record({
        ...eventData,
        actionId: eventData.actionId,
        metadata: eventData.metadata,
      });

      return {
        content: [{ type: "text", text: `Event recorded successfully with ID: ${event.id}` }],
      };
    } catch (error) {
      return { content: [{ type: "text", text: `Ledger Error: ${error.message}` }], isError: true };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
