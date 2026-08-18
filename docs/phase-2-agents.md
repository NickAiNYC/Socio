# Phase 2: Agent Architecture

## The DSH + Hermes Hybrid Model

**Layer 1: Build Layer (DeepSeek Harness)**
- Rapid prototyping, internal tool creation, and heavy logic execution (scraping, webhooks).
- Runs as an MCP server.

**Layer 2: Operations Layer (Hermes Bot Mode)**
- Long-running client services, recurring workflows, and multi-agent group collaboration.
- Persistent memory to learn from merchants over time.

## The 8-Agent Fleet
1. **Socio-Prospect:** Lead generation, digital audits, and scoring (Google Maps, Instagram).
2. **Socio-Pitch:** Multi-touch outreach and CRM management (Resend, Twilio WhatsApp).
3. **Socio-Onboard:** Agreement signing, data collection, and action plan generation (DocuSign, Typeform).
4. **Socio-Content:** High-quality content generation and scheduling (Helio CDP, Canva).
5. **Socio-Listings:** Local SEO optimization and review management (Synup MCP).
6. **Socio-Track:** Financial tracking, commission calculation, and invoicing (Stripe, Square).
7. **Socio-Support:** Frontline merchant support and issue routing (Intercom, WhatsApp).
8. **Socio-Expand:** Data analysis for cross-sells and referral programs.
