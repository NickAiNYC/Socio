# Growth OS Architecture Assessment

## 1. Existing Socio Architecture
Socio is currently structured as a lightweight, AI-native monorepo containing:
- **`website/`**: A static lead capture page with a Node.js webhook receiver (`api/leads.js`) designed to interface with Hermes Kanban boards.
- **`engines/`**: Standalone backend components, currently including the headless `contento` MCP server for FFmpeg video rendering.
- **`workflows/`**: YAML-based DeepSeek Harness (DSH) workflows orchestrating complex scrapes and operations (e.g., `prospect-scraper.yaml`).

## 2. Existing Agent Architecture
Socio relies on a fleet of 8 specialized Hermes profiles defined in `agents/`.
These agents (e.g., `socio-prospect`, `socio-pitch`, `socio-content`) are standalone workers triggered by crons or webhooks. Currently, they operate independently without a centralized state or shared business context model, communicating primarily via Hermes Kanban tasks and JSON output files.

## 3. Existing Persistence/Event Mechanisms
Currently, Socio **lacks a unified persistence layer or database**. 
- Data exists ephemerally or as flat JSON output files (e.g., `latest-prospects.json`).
- Workflow state is managed via Hermes Kanban boards and DSH memory.
- There is no central ledger, customer profile store, or formal event bus.

## 4. Where Growth OS Should Integrate
Growth OS will be integrated as the **central control plane and shared memory layer** (`engines/growth-os/`).
Instead of agents acting as disconnected marketers, they will become workers acting upon the `Business Twin`.
Agents will generate `Action Proposals` that pass through the `Agent Governor`. Approved actions will be executed, and their outcomes recorded in the `Revenue Ledger`.

## 5. Files to Create
`engines/growth-os/`
- `index.mjs`: Main export and integration points.
- `types.mjs`: Core type definitions/JSDoc structures.
- `errors.mjs`: Custom error classes.
- `revenue-ledger.mjs`: Immutable event recording and aggregation.
- `business-twin.mjs`: Persistent state representation of the business (in-memory initial implementation).
- `agent-governor.mjs`: Policy evaluation, risk scoring, and approval logic.
- `experiment-engine.mjs`: Lifecycle management for growth hypotheses.
- `growth-loop.mjs`: The orchestrator tying observation, hypothesis, governance, and execution.
- `adapters/`: Interfaces for integrating external tools (e.g., `revenue-adapter.mjs`).
- `repositories/`: Interfaces for data storage (e.g., `in-memory-repository.mjs`).
- `tests/`: Comprehensive test suite for all core components.

`docs/`
- `growth-os-data-model.md`
- `growth-os-governance.md`

## 6. Files to Modify
- `package.json`: Add test script (`node --test`) to run our test suite.
- Existing `agents/*.json`: Update system prompts to instruct agents to interface with Growth OS for context and action proposals. (Phase 11)

## 7. Risks/Conflicts
- **Persistence Gap:** Without an existing DB, we must implement robust in-memory repositories first, designing them to be easily swappable for Postgres/MongoDB later to avoid locking the architecture.
- **Agent Rewiring:** Existing agents currently perform direct API calls (e.g., to Canva or Twilio). We must reroute these actions through the Agent Governor as proposals without breaking the existing fleet.

## 8. Migration Strategy
1. **Core Implementation:** Build the Growth OS primitives (`revenue-ledger`, `business-twin`, `agent-governor`, `experiment-engine`, `growth-loop`) in isolation using in-memory repositories.
2. **Testing:** Extensively test these primitives using Node's native test runner to ensure mathematical accuracy and policy enforcement.
3. **Adapter Layer:** Define adapter interfaces for external tools.
4. **Agent Integration:** Expose Growth OS capabilities via an integration layer, allowing the existing Hermes agents to read the Business Twin and submit proposals.
