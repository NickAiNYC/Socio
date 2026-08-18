# Phase 3: The Lean Tech Stack

## Architecture Overview
A powerful, bootstrap-tight combination of tools designed to pass the "one-human test." Total estimated operating cost is ~$166–$341/month.

### 🧠 Operations Layer: Hermes Agents (The Brain)
- **Tool**: Hermes Desktop (v0.20.4+)
- **Purpose**: Workflow orchestration and client communication.

### 🦾 Build Layer: DeepSeek Harness (The Arms)
- **Tool**: `@deepseek-ai/dsh` (v0.1.0-rc.7+)
- **Purpose**: Heavy lifting and custom integrations via MCP.

### 🏢 Command Center: Taskade Genesis
- **Cost**: $16/month (Pro Tier)
- **Purpose**: Replaces Notion, Zapier, and standard CRMs.

### ⚙️ Execution Layer
- **Marketing Automation**: Helio (Self-hosted on DigitalOcean). *Cost: $20/mo (VPS)*.
- **Local SEO & Listings**: Synup MCP. *Cost: $50–100/mo*.
- **Communications**: Resend (Email) + Twilio (WhatsApp API). *Cost: $30–80/mo*.
- **Payments**: Stripe Connect. *Cost: 2.9% + $0.30 per transaction*.
- **Database**: Supabase (PostgreSQL). *Cost: $0–25/mo*.
