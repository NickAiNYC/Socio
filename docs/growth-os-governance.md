# Growth OS Governance

The Agent Governor is the central safety mechanism of Socio's Growth OS. Before an agent executes any external action (spending money, contacting customers, mutating production infrastructure), it must submit an `ActionProposal` to the Governor.

## Risk Levels

- **LOW**: Safe, reversible, non-destructive actions (e.g., generating content drafts, pulling analytics). Automatically executed by default.
- **MEDIUM**: Actions with moderate impact (e.g., sending low-volume emails to existing customers). Requires approval by an `AGENT_SUPERVISOR`.
- **HIGH**: Actions with financial or reputational impact (e.g., starting an ad campaign, changing core pricing). Requires approval by the `BUSINESS_OWNER`.
- **CRITICAL**: Destructive or extremely high-risk actions (e.g., deleting a database, spamming entire lists). Blocked by default unless overridden by the `SYSTEM_ADMIN`.

## Evaluation Pipeline

The Governor evaluates the proposal through a sequence of policies:
1. **Default Risk Policy**: Maps the defined risk level to the default approval logic.
2. **Custom Policies**: Optional functions that analyze the payload and context. For example, a `BUDGET_LIMIT` policy might block a LOW-risk ad spend proposal if the spend exceeds $1000.

## Failsafe Mechanisms
- **Fail Closed**: If any policy throws an error or returns a "blocked" decision, the proposal is immediately rejected.
- **Traceability**: Every decision returns a structured reason and policy identifier, explaining exactly why an action was approved or denied. This directly feeds into Phase 6 (Explainability).
