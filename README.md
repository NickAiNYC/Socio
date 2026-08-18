# Socio Operating System

This monorepo is the single source of truth for **Socio NYC** — a performance-based growth partnership firm for local NYC merchants.

## 🧠 The Architecture
The Socio OS leverages a highly automated, AI-native tech stack:
- **Operations Layer (The Brain):** 12 Hermes Agents (8 Ops + 4 Compliance) orchestrating client relations and workflows.
- **Build Layer (The Arms):** DeepSeek Harness (DSH) running as an MCP server to execute coding and scraping tasks.
- **Execution Engine:** Self-hosted Helio CDP, Synup MCP for local SEO, and Stripe Connect for commission tracking.
- **Compliance Wrapper:** Fully compliant with NYC 2026 consumer rules (All-In Pricing, Click-to-Cancel) and Chinese automation standards (AI Disclosure).

## 🚀 Quickstart
To deploy this OS on a new DigitalOcean VPS:
```bash
# Clone the repository
git clone https://github.com/NickAiNYC/Socio.git socio-os
cd socio-os

# Configure environment variables
cp .env.example .env

# Run the automated deployment script
chmod +x quickstart.sh
./quickstart.sh
```

## 📁 Repository Structure
- `agents/`: System prompts and bot configurations.
- `docs/`: Master documentation and Phase overviews.
- `scripts/`: Utility scripts (backups, deployments).
- `templates/`: Pitch sequences, legal agreements, and social bios.
- `website/`: The fully static, high-converting landing page.
- `workflows/`: DSH DAG definitions for scraping and syncing.

*Built by a solo founder. Powered by AI. Scaled for NYC.*
