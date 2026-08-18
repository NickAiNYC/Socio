# Growth OS Engine

This engine acts as the central control plane, shared memory layer, and economic truth layer for Socio. It turns disconnected AI agents into an orchestrated fleet operating upon a living model of a business.

## Core Modules

### Business Twin
The persistent state representation of the business. It acts as the shared context layer for all agents. Never overwritten without maintaining a history of snapshots.

### Revenue Ledger
The single source of truth for economic outcomes. An immutable event log tracking revenue, costs, agent actions, and refunds. It calculates ROI and attributes revenue to specific agents and campaigns.

### Agent Governor
The policy enforcement engine. Every agent must propose actions to the Governor. It evaluates the risk (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) and applies custom business policies (e.g. budget limits) before approving execution.

### Experiment Engine
The learning mechanism. It tracks the lifecycle of growth hypotheses (`DRAFT` -> `RUNNING` -> `PROMOTED` / `KILLED`). It collects observations and evaluates statistical significance before allowing a hypothesis to be permanently rolled out.

### Growth Loop
The orchestration cycle linking everything together. It observes the twin, identifies opportunities, formulates hypotheses, routes proposals through the governor, executes, measures revenue in the ledger, extracts learnings, and updates the twin.

## Data Persistence
For version 1, all data is stored via an `In-Memory Repository` interface (`repositories/memory-repository.mjs`). This ensures the engine remains fast, portable, and uncoupled from heavy DB migrations. As the architecture matures, this interface can seamlessly drop in a Postgres or MongoDB adapter.

## Integration
External platforms (Stripe, CRMs, etc.) are connected via `Adapters` (`adapters/index.mjs`). The core engine interfaces only with these adapters, ensuring no vendor lock-in.
