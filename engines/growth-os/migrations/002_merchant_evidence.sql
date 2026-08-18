-- =============================================================================
-- 002_merchant_evidence.sql — Merchant Evidence Layer schema alignment
-- =============================================================================
-- Aligns the experiments table with the engine's generic JSONB repository
-- pattern (businessId lives in data->>'businessId'; the column was never
-- populated by ExperimentEngine):
--   1. add updated_at (PostgresRepository.save() upsert writes it)
--   2. drop NOT NULL on business_id (column is informational; scoping happens
--      through the JSONB data at the repository boundary)

ALTER TABLE experiments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE experiments ALTER COLUMN business_id DROP NOT NULL;
