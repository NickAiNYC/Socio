-- =============================================================================
-- 001_economic_truth.sql — Socio Economic Truth Layer schema
-- =============================================================================
-- Idempotent: the generic JSONB repositories auto-create a compatible shape;
-- these migrations add real columns, indexes, and DB-enforced constraints.

-- Revenue ledger: immutable event log. Idempotency is DB-enforced via the
-- partial unique index on data->>'idempotencyKey' — a replayed Stripe event
-- (same event id) cannot insert twice even with a different record id.
CREATE TABLE IF NOT EXISTS revenue_ledger (
  id VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS revenue_ledger_business_idx ON revenue_ledger ((data->>'businessId'));
CREATE UNIQUE INDEX IF NOT EXISTS revenue_ledger_idempotency_uniq
  ON revenue_ledger ((data->>'idempotencyKey'))
  WHERE data->>'idempotencyKey' IS NOT NULL;

-- Approvals: durable governor state; status flips are compare-and-swap.
CREATE TABLE IF NOT EXISTS approvals (
  id VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS approvals_status_idx ON approvals ((data->>'status'));

-- Audit trail: hash-chained, append-only.
CREATE TABLE IF NOT EXISTS audit_trail (
  id VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_trail_business_idx ON audit_trail ((data->>'businessId'));

-- Business twins + history.
CREATE TABLE IF NOT EXISTS business_twins (
  id VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS business_twin_history (
  snapshot_id VARCHAR(255) PRIMARY KEY,
  business_id VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS business_twin_history_business_idx ON business_twin_history (business_id, saved_at);

-- Customers: provider identity mapping, uniqueness DB-enforced.
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(255) PRIMARY KEY,
  business_id VARCHAR(255) NOT NULL,
  provider VARCHAR(64) NOT NULL,
  provider_customer_id VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, provider, provider_customer_id)
);
CREATE INDEX IF NOT EXISTS customers_business_idx ON customers (business_id);

-- Experiments + control/treatment assignments.
CREATE TABLE IF NOT EXISTS experiments (
  id VARCHAR(255) PRIMARY KEY,
  business_id VARCHAR(255) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS experiments_business_idx ON experiments (business_id);

CREATE TABLE IF NOT EXISTS experiment_assignments (
  experiment_id VARCHAR(255) NOT NULL,
  customer_id VARCHAR(255) NOT NULL,
  variant VARCHAR(64) NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (experiment_id, customer_id)
);

-- Attribution records: one per revenue event; DB-enforced uniqueness.
CREATE TABLE IF NOT EXISTS attribution (
  id VARCHAR(255) PRIMARY KEY,
  business_id VARCHAR(255) NOT NULL,
  revenue_event_id VARCHAR(255) NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS attribution_business_idx ON attribution (business_id);
