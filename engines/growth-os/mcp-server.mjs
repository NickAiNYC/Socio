import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { 
  BusinessTwin, 
  RevenueLedger, 
  AgentGovernor, 
  BusinessTwinMemoryRepository,
  MemoryRepository 
} from "./index.mjs";

// Initialize Growth OS primitives
// In a production setup, these repositories would connect to Postgres.
const twinRepo = new BusinessTwinMemoryRepository();
const ledgerRepo = new MemoryRepository();

const businessTwin = new BusinessTwin(twinRepo);
const revenueLedger = new RevenueLedger(ledgerRepo);
const agentGovernor = new AgentGovernor();

// Boot the twin with a mock default state if none exists for testing purposes
// (This ensures agents have something to read immediately)
businessTwin.initialize('socio_default', { 
  name: 'Socio Default Business',
  status: 'ACTIVE',
  goals: ['Acquire 5 merchants', 'Validate lead funnel']
}).catch(() => {}); // ignore if already exists

// Create MCP Server
const server = new McpServer({
  name: "Growth-OS",
  version: "1.0.0",
});

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
        content: [
          {
            type: "text",
            text: JSON.stringify(state, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading twin: ${error.message}`,
          },
        ],
        isError: true
      };
    }
  }
);

// Tool: Propose Action
server.tool(
  "growth_os_propose_action",
  "Submits an Action Proposal to the Governor for evaluation. MUST be used before executing modifying actions.",
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
      
      const decision = await agentGovernor.evaluate(proposal);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(decision, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Governance Error: ${error.message}`,
          },
        ],
        isError: true
      };
    }
  }
);

// Tool: Record Event
server.tool(
  "growth_os_record_event",
  "Records an outcome or action into the Revenue Ledger.",
  {
    businessId: z.string(),
    agentId: z.string().optional(),
    type: z.enum(['revenue', 'campaign_cost', 'refund', 'lead_created', 'agent_action']),
    amount: z.number().describe("The financial amount (use 0 for non-financial events like lead_created)"),
    currency: z.string().default('USD'),
    source: z.string()
  },
  async (eventData) => {
    try {
      const event = await revenueLedger.record(eventData);
      
      return {
        content: [
          {
            type: "text",
            text: `Event recorded successfully with ID: ${event.id}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Ledger Error: ${error.message}`,
          },
        ],
        isError: true
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
