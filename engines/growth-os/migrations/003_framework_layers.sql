-- =============================================================================
-- 003_framework_layers.sql — Verifier + Prompt Optimizer schema
-- =============================================================================
-- Idempotent; follows the generic JSONB repository pattern.

-- Revenue Definition Schedules: the signed per-merchant contract that governs
-- what the report may call "incremental revenue". One active schedule per
-- business (businessId is the natural key in practice; history is kept by
-- versioning inside the JSONB record).
CREATE TABLE IF NOT EXISTS revenue_schedules (
  id VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS revenue_schedules_business_idx ON revenue_schedules ((data->>'businessId'));

-- Prompt variants: versioned agent prompts for the outcome-driven optimizer.
-- One variant per row; `active` is flipped by compare-and-swap on promotion.
CREATE TABLE IF NOT EXISTS prompt_variants (
  id VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS prompt_variants_agent_idx ON prompt_variants ((data->>'agentId'));
