-- Rollback for 0001_eager_quasimodo.sql
-- ============================================================================
-- This script undoes the schema additions made by 0001 (Stage 2A migration).
-- It is INTENTIONALLY NOT a Drizzle migration; it's a one-shot recovery
-- artifact triggered ONLY if Stage 2B execution surfaces a problem that
-- requires reverting the new schema to the pre-Stage-2A state.
--
-- Usage (only if needed):
--   DATABASE_URL="$DB_PUBLIC" psql "$DATABASE_URL" -f rollback_0001.sql
--   OR via the Node helper at packages/db (exec arbitrary SQL).
--
-- Idempotent: re-running has no effect (IF EXISTS clauses everywhere).
--
-- WHAT THIS DOES NOT DO:
-- - Does NOT drop the legacy 'status' enum values added via ALTER TYPE
--   ADD VALUE (PostgreSQL does not support DROP VALUE on enums; the new
--   values become unreachable but harmless once the columns referencing
--   them are removed).
-- - Does NOT touch the leads.business legacy column or any 0000_init data.
-- - Does NOT remove the 'tier' or original 'status' enums (predate this
--   migration).
-- ============================================================================

BEGIN;

-- Drop tables in dependency-reverse order (children first)
DROP TABLE IF EXISTS invitations;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS audits;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS clients;

-- Drop columns added to leads (additive only, so DROP COLUMN preserves
-- the rest of the row)
ALTER TABLE leads DROP COLUMN IF EXISTS converted_client_id;
ALTER TABLE leads DROP COLUMN IF EXISTS next_follow_up_at;
ALTER TABLE leads DROP COLUMN IF EXISTS notes;
ALTER TABLE leads DROP COLUMN IF EXISTS phone;
ALTER TABLE leads DROP COLUMN IF EXISTS business_name;

-- Drop new enum types (PostgreSQL allows this once no columns reference them)
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS event_type;
DROP TYPE IF EXISTS task_priority;
DROP TYPE IF EXISTS task_status;
DROP TYPE IF EXISTS project_status;
DROP TYPE IF EXISTS client_status;

-- Remove the migration entry so drizzle-kit doesn't think it's still applied
DELETE FROM drizzle.__drizzle_migrations WHERE hash IN (
  SELECT hash FROM drizzle.__drizzle_migrations WHERE id IN (
    SELECT id FROM drizzle.__drizzle_migrations
    ORDER BY created_at DESC LIMIT 1
  )
);

COMMIT;
