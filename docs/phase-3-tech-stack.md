# Socio Tech Stack Architecture (Phase 3)

The Socio infrastructure leverages a powerful, extremely lean combination of tools designed for a solo founder. Total estimated operating cost is **~$166–$341/month**.

## 🧠 Operations Layer: Hermes Agents (The Brain)
**Tool**: Hermes Desktop (v0.20.4+)
**Cost**: Included in LLM API usage.
**Purpose**: Long-running relationship management, client communication, and workflow orchestration.
- **Bot Mode**: 8 specialized agents (`Socio-Prospect`, `Socio-Pitch`, etc.) each with persistent memory and autonomous skill creation capabilities.
- **Agent Groups**: We have clustered `Socio-Prospect`, `Socio-Pitch`, and `Socio-Onboard` into the `Socio-Operations` group for seamless multi-agent task routing.

## 🦾 Build Layer: DeepSeek Harness (The Arms)
**Tool**: `@deepseek-ai/dsh` (v0.1.0-rc.7+)
**Cost**: Included in LLM API usage.
**Purpose**: Heavy lifting coding tasks, ad-hoc API integrations, and internal tool creation.
- **MCP Server**: DSH runs locally as an MCP server. Hermes can autonomously delegate to it when custom code or scraping is required.
- **Plugins**: Equipped with `dsh-dag-orchestrator`, `dsh-plugin-subagents`, and `dsh-memory-evolve`.

## 🏢 Command Center: Taskade Genesis
**Cost**: $16/month (Pro Tier)
**Purpose**: Replaces Notion, Zapier, and standard CRMs.
- Acts as the central hub for the investor CRM, merchant deal stages, and the Net New Revenue dashboard.

## ⚙️ Execution Layer
- **Marketing Automation**: Helio (Self-hosted on DigitalOcean). *Cost: $20/mo (VPS)*.
- **Local SEO & Listings**: Synup MCP. *Cost: $50–100/mo*.
- **Communications**: Resend (Email) + Twilio (WhatsApp API). *Cost: $30–80/mo*.
- **Payments**: Stripe Connect. *Cost: 2.9% + $0.30 per transaction*.
- **Database**: Supabase (PostgreSQL). *Cost: $0–25/mo*.

---

### Deployment Runbook

#### 1. VPS Provisioning
SSH into your DigitalOcean Ubuntu 22.04 droplet as root and run:
```bash
./deploy_vps.sh
```
This handles firewall config, Docker installation, and spins up the Helio marketing automation CDP.

#### 2. DSH Build Environment
Initialize your local build environment:
```bash
./setup_dsh.sh
```

#### 3. Agent Fleet Initialization
Link Hermes to DSH via MCP, spawn the 8 agents with persistent memory, and group them:
```bash
./init_hermes_fleet.sh
```
