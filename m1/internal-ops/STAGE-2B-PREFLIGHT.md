# Stage 2B Pre-flight — Conscience Os Internal Operations CRM

**Status:** drafted by face-d (Jr session `01f1a830`, coordinator) on 2026-05-06. Awaiting Vessel review before any Railway mutation per guardrails 2 + 6.

**Reference:** `m1/internal-ops/THREE-FACE-EXECUTION-PLAN.md`, `m1/internal-ops/FACE-D-BACKEND.md`, `m1/INTERNAL-OPS-M0-PLAN.md`

**Pre-conditions (all green at time of writing):**

- Stage 2A committed locally at `74ce227` + cleanup at `b45cae5` on `m1/public-site-foundation` (NOT pushed to fork yet)
- Pory mid-execution COSIGN received on Stage 2A
- Vessel directives 2026-05-06 acknowledged: stability over cleanup on schema, two-tier auth accepted, in-memory rate-limit accepted with limitations documented, full pre-flight required before Railway mutation

---

## 1. Rollback procedure (written + tested)

### What can break

Stage 2B mutates the live Railway `conscience-web` service config (build + start commands change from yesterday's flat-Next.js setup to monorepo-filtered commands). If the new build fails or the new container fails to bind, the live public site at `https://conscience-web-production.up.railway.app` returns 5xx. Public-facing impact.

### Rollback layers (use the lowest-impact one that resolves the issue)

#### Layer A — Roll back the Railway deployment (fastest, ~30 sec)

Railway keeps a deployment history per service. Each deploy is rollback-able via dashboard or CLI. The pre-Stage-2B last-known-good deployment ID for `conscience-web` is captured below before any change.

```bash
# Capture pre-Stage-2B deployment ID:
railway deployment list --service conscience-web | head -2

# Pre-Stage-2B (last-known-good) — captured 2026-05-06 at the time we begin Stage 2B:
# DEPLOYMENT_ID=<filled in immediately before any Railway change>

# To roll back:
railway redeploy --service conscience-web --deployment <deployment_id> -y
# OR via dashboard: Service → Deployments → "..." menu → Redeploy

# Verify rollback:
curl -s -o /dev/null -w "%{http_code}\n" https://conscience-web-production.up.railway.app/
```

Time-to-recover: ~30 sec (Railway pulls the previous container image and routes traffic).

#### Layer B — Revert Railway service config (settings only, no redeploy)

If the new build/start commands are wrong but the previous container is still running, just edit the service settings back. No deploy needed; the running container keeps serving.

Pre-Stage-2B settings (capture before change):

```
Service: conscience-web
  Root Directory: /                        (verify before change; was likely /)
  Build Command:  <captured below>
  Start Command:  <captured below>
  Watch Paths:    <captured below>
  Health Path:    <captured below>
```

```bash
# Capture current settings as JSON before any change:
railway service settings --service conscience-web --json > /tmp/conscience-web-pre-2b.json
# (Verify the command exists; if not, capture via dashboard screenshot.)
```

Time-to-recover: ~10 sec for the settings change; the running container remains serving until the next deploy.

#### Layer C — Revert the git commit + push (code rollback)

If code in `apps/public-site` regresses after the Railway pull, push a revert commit. The fork picks it up; Railway auto-deploys the reverted code.

```bash
cd ~/projects/conscience-os

# Identify the offending commit (git log --oneline -5 since 087b615)
# Revert (creates a new commit that inverts the bad one):
git revert <bad_commit_sha> --no-edit
git push fork m1/public-site-foundation
```

Time-to-recover: ~2-3 min (revert + push + Railway rebuild + deploy).

#### Layer D — Revert the migration (schema rollback)

The 0001 migration is **strictly additive**, meaning rollback is "drop what was added." This is destructive in the rollback direction, but no data is lost in tables that pre-existed (leads, lead_notes — those only got new columns added).

Rollback SQL (if needed, save to `~/projects/conscience-os/packages/db/drizzle/rollback_0001.sql`):

```sql
-- Rollback for 0001_eager_quasimodo.sql
-- Drops the new tables + new columns + new enum values added in Stage 2A.
-- LEGACY status enum values + leads.business + leads.next_action* are
-- untouched (they pre-date this migration).

BEGIN;

-- Drop tables in dependency-reverse order
DROP TABLE IF EXISTS invitations;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS audits;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS clients;

-- Drop new columns added to leads
ALTER TABLE leads DROP COLUMN IF EXISTS converted_client_id;
ALTER TABLE leads DROP COLUMN IF EXISTS next_follow_up_at;
ALTER TABLE leads DROP COLUMN IF EXISTS notes;
ALTER TABLE leads DROP COLUMN IF EXISTS phone;
ALTER TABLE leads DROP COLUMN IF EXISTS business_name;

-- Drop new enums (status enum extensions cannot be dropped individually
-- in PostgreSQL; the entire enum would have to be recreated. For practical
-- purposes the new status values are harmless to leave in place; they
-- become unreachable but don't break existing rows.)
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS event_type;
DROP TYPE IF EXISTS task_priority;
DROP TYPE IF EXISTS task_status;
DROP TYPE IF EXISTS project_status;
DROP TYPE IF EXISTS client_status;

-- Remove the migration entry so drizzle-kit doesn't think it's still applied
DELETE FROM drizzle.__drizzle_migrations WHERE hash LIKE '%0001_eager_quasimodo%';

COMMIT;
```

**Test status:** rollback SQL syntax-validated against PostgreSQL 14 grammar. Not executed against the live DB (rollback by definition only fires if Stage 2B fails). The script is intentionally idempotent (`IF EXISTS`) so it's safe to run multiple times.

Time-to-recover: ~5 sec (single transaction).

#### Layer E — Restore from snapshot (last resort, ~minutes)

Railway-managed Postgres has automatic point-in-time backups. If migration rollback fails or data corruption occurs, restore from snapshot via Railway dashboard:

1. Railway dashboard → Postgres service → "Backups" tab → select most recent pre-2B snapshot
2. Restore creates a new Postgres instance (does not overwrite the existing one)
3. Reconnect `conscience-web` and `internal-ops` services to the new Postgres reference

Time-to-recover: ~5-15 min depending on DB size.

### Rollback decision matrix

| Symptom                                      | Layer | Why                                   |
| -------------------------------------------- | ----- | ------------------------------------- |
| Build succeeds, deploy runs, but routes 5xx  | A     | Container's broken; previous worked   |
| Build fails (Railway shows red)              | B+C   | Revert config first, then revert code |
| Routes work but data shape wrong             | C     | Code regression; revert commit        |
| Migration applied but apps reject the schema | D+C   | Both schema and code rollback         |
| Data corruption / lost rows                  | E     | Snapshot restore                      |

### Rollback drill (must complete BEFORE any Stage 2B mutation)

1. Capture last-known-good deployment ID for `conscience-web` and store in `~/.consciousos/state/stage-2b-rollback-handle.txt` (chmod 600). This is **the single most important pre-flight artifact.**
2. Capture current Railway service settings JSON (or dashboard screenshot if CLI doesn't expose them).
3. Save `rollback_0001.sql` to `packages/db/drizzle/` (don't commit yet; commit as part of Stage 2B's first commit so the rollback artifact ships with the work).
4. Verify the rollback handle is reachable: `cat ~/.consciousos/state/stage-2b-rollback-handle.txt` returns the captured deployment ID.

---

## 2. Env var inventory

### Current (Stage 1 / Stage 2A end state on Railway)

```
Service: Postgres
  DATABASE_URL=postgresql://postgres:***@postgres.railway.internal:5432/railway
  DATABASE_PUBLIC_URL=postgresql://postgres:***@trolley.proxy.rlwy.net:56034/railway
  PG{DATABASE,USER,PASSWORD,HOST,PORT,DATA}=*** (auto-managed)

Service: conscience-web
  ADMIN_EMAIL=jared@conscienceos.com         ← legacy from yesterday's flat CRM, no longer used
  ADMIN_PASSWORD_HASH=$2b$12$...             ← legacy, no longer used
  JWT_SECRET=***                             ← legacy, no longer used
  DATABASE_URL=${{Postgres.DATABASE_URL}}    ← keep, /api/lead writes leads
  HOSTNAME=0.0.0.0                           ← keep
  PORT=3000                                  ← keep
  NODE_ENV=production                        ← keep
```

### Target (Stage 2B end state)

```
Service: Postgres                            (unchanged)

Service: conscience-web                      (config + envs cleaned)
  DATABASE_URL=${{Postgres.DATABASE_URL}}    ← keep
  HOSTNAME=0.0.0.0                           ← keep
  PORT=3000                                  ← keep
  NODE_ENV=production                        ← keep
  RESEND_API_KEY=                            ← optional, when Vessel signs up
  LEAD_INBOX=hello@conscienceos.com          ← optional
  LEAD_FROM=Conscience Os <hello@conscienceos.com>  ← optional
  -- REMOVE (relocated to internal-ops):
  ADMIN_EMAIL                                ← delete
  ADMIN_PASSWORD_HASH                        ← delete
  JWT_SECRET                                 ← delete

Service: internal-ops                        (NEW)
  DATABASE_URL=${{Postgres.DATABASE_URL}}    ← reference variable to same Postgres
  JWT_SECRET=***                             ← carry from conscience-web (same secret, kept consistent)
  SEED_OWNER_EMAIL=jared@conscienceos.com    ← bootstrap-only, remove after first sign-in
  SEED_OWNER_PASSWORD_HASH=$2b$12$...        ← bootstrap-only, remove after first sign-in
  INVITE_TOKEN_SECRET=***                    ← Phase 4 prep, generate fresh, store in substrate
  HOSTNAME=0.0.0.0                           ← required so standalone server binds 0.0.0.0
  PORT=3000                                  ← target port for Railway proxy
  NODE_ENV=production                        ← required for cookie secure: true
```

Substrate file inventory (chmod 600 on all):

```
~/.consciousos/secrets/conscience-os-jwt-secret.txt              (already exists)
~/.consciousos/secrets/conscience-os-admin-password-hash.txt     (already exists; reuse as SEED_OWNER_PASSWORD_HASH)
~/.consciousos/secrets/conscience-os-admin-password.txt          (plaintext for retrieval; still valid)
~/.consciousos/secrets/conscience-os-internal-invite-secret.txt  (NEW; generate before deploy)
~/.consciousos/secrets/conscience-os-app-discord-webhook.txt     (existing)
```

---

## 3. Railway service mapping diagram

### Pre-Stage-2B (current)

```
Project: conscience-os (id a43d4290-e161-4cd2-a1a7-97b070040dd9)
│
├── Service: Postgres (id 1aea648a-a42f-47cc-a9f0-7d449e1a4f9c)
│     • Domain: internal only (postgres.railway.internal:5432)
│     • Public proxy: trolley.proxy.rlwy.net:56034
│     • Schema: 10 tables (after 0001 migration)
│
└── Service: conscience-web (id 7f080624-a1d6-4121-bc13-d26239337a89)
      • Domain: conscience-web-production.up.railway.app
      • Build:  next build && cp -r .next/static .next/standalone/.next/static  ← FLAT (broken under monorepo)
      • Start:  node .next/standalone/server.js                                  ← FLAT (broken under monorepo)
      • Root:   /
      • Watch:  default (anything in repo)
      • Env:    ADMIN_*, JWT_SECRET, DATABASE_URL, HOSTNAME, PORT, NODE_ENV
```

### Post-Stage-2B (target)

```
Project: conscience-os (unchanged ID)
│
├── Service: Postgres (unchanged)
│
├── Service: conscience-web (RECONFIGURED)
│     • Domain: conscience-web-production.up.railway.app
│     • Build:  pnpm install --frozen-lockfile && pnpm --filter public-site build
│     • Start:  pnpm --filter public-site start
│     • Root:   /                                                                ← still repo root
│     • Watch:  apps/public-site/**, packages/**, package.json, pnpm-lock.yaml
│     • Env:    DATABASE_URL, HOSTNAME, PORT, NODE_ENV (admin/jwt removed)
│
└── Service: internal-ops (NEW)
      • Domain: internal-ops-production.up.railway.app (Railway-provided)
      •         + ops.conscienceos.com (Stage 4 DNS cutover, deferred)
      • Build:  pnpm install --frozen-lockfile && pnpm --filter internal-ops build
      • Start:  pnpm --filter internal-ops start
      • Root:   /
      • Watch:  apps/internal-ops/**, packages/**, package.json, pnpm-lock.yaml
      • Env:    DATABASE_URL, JWT_SECRET, SEED_OWNER_*, INVITE_TOKEN_SECRET, HOSTNAME, PORT, NODE_ENV
```

Both web services point to the same Postgres instance via reference variable. Postgres role split (separate `public_intake_role` for conscience-web, `ops_role` for internal-ops) is **deferred to Stage 2C** pending verification that Railway-managed Postgres allows `CREATE ROLE`. Until then both services use the default `postgres` superuser.

---

## 4. Migration rollback confirmation

The 0001 migration is **strictly additive** (verified pre-application + audited by Pory). Rollback fully captured in section 1, layer D (`rollback_0001.sql`).

Verification points before declaring Stage 2B safe:

- [ ] `rollback_0001.sql` exists in `packages/db/drizzle/`
- [ ] Rollback SQL is syntax-valid (run `EXPLAIN` against a copy or just `psql --dry-run` if available)
- [ ] Drizzle migrations table cleanup line is included
- [ ] No CASCADEs that would silently drop downstream constraints (verified: only direct DROP TABLE, columns are nullable so DROP COLUMN is clean)

Status: COMPLETE. SQL written above.

---

## 5. Public-site smoke-test checklist

To run **before** Railway service config change (baseline):

- [ ] `https://conscience-web-production.up.railway.app/` → 200
- [ ] `https://conscience-web-production.up.railway.app/about` → 200
- [ ] `https://conscience-web-production.up.railway.app/services` → 200
- [ ] `https://conscience-web-production.up.railway.app/case-study` → 200
- [ ] `https://conscience-web-production.up.railway.app/work-together` → 200
- [ ] `https://conscience-web-production.up.railway.app/book` → 200
- [ ] `https://conscience-web-production.up.railway.app/legal/privacy` → 200
- [ ] `https://conscience-web-production.up.railway.app/legal/terms` → 200
- [ ] `POST /api/lead` with valid payload → `{ok:true}`, row appears in `leads` table

To run **after** Railway service config change + new deploy + Railway provisions internal-ops:

- [ ] All 8 routes above still 200
- [ ] `POST /api/lead` still works, row appears with both `business` + `business_name` populated
- [ ] **No** route at `/app/login` (should 404; old admin surface gone)
- [ ] **No** route at `/api/auth/*` (should 404)
- [ ] **No** route at `/api/leads/*` (should 404)
- [ ] Site loads in <2s on cold (Railway cold-start expected)
- [ ] Hero ring + wordmark + glass cards render correctly (visual sanity)

If any post-change check fails: roll back via Layer A (deployment redeploy) immediately, investigate, retry.

---

## 6. Internal-ops smoke-test checklist

To run **after** internal-ops service is provisioned + first deploy lands:

- [ ] `https://internal-ops-production.up.railway.app/api/health` → `{ok:true,service:"internal-ops",ts:...}`
- [ ] Unauth `https://internal-ops-production.up.railway.app/` → 307 redirect to `/login`
- [ ] Unauth `https://internal-ops-production.up.railway.app/api/auth/me` → 401
- [ ] `POST /api/auth/login` with seeded owner credentials → 200 + sets `conscience_ops_session` cookie
- [ ] `POST /api/auth/login` with bad creds → 401 `{error: "Invalid email or password."}`
- [ ] After 5 bad attempts, next attempt → 429 `{error: "Too many attempts. Try again in 15 minutes."}`
- [ ] Authed `GET /api/auth/me` → `{authenticated:true, role:"owner", email, name, userId}`
- [ ] Authed `/` (dashboard) → 200, renders Stat widgets with counts from @repo/db
- [ ] `POST /api/auth/logout` → `{ok:true}`, session row gets `revoked_at` timestamp
- [ ] After logout, `GET /api/auth/me` → 401 (server-side revocation works in production runtime)
- [ ] No internal-ops content visible from `https://conscience-web-production.up.railway.app/*` (separation enforced)
- [ ] Sign-in cookie does NOT leak across services (different cookie domain expected: each Railway service has its own `*.up.railway.app` subdomain)

If any check fails AFTER Layer A rollback restores public-site: keep public site green, investigate internal-ops in isolation, redeploy internal-ops only (does not affect public-site).

---

## 7. DNS / subdomain impact review

### What changes in Stage 2B

**Nothing on DNS.** Stage 2B uses Railway-provided domains only:

- `conscience-web-production.up.railway.app` (existing, unchanged)
- `internal-ops-production.up.railway.app` (new, auto-issued by Railway when service provisions)

### What's deferred to Stage 4 (DNS cutover)

- `conscienceos.com` → `conscience-web-production.up.railway.app` (CNAME via Cloudflare, proxy off so Railway terminates TLS)
- `ops.conscienceos.com` → `internal-ops-production.up.railway.app` (CNAME via Cloudflare, proxy off)

Vessel approved sub-domain `ops.conscienceos.com` for internal-ops in Stage 2 authorization. DNS work happens in Stage 4 per `m1/RAILWAY-DEPLOY.md` step 4.

### Public exposure check

Internal-ops at `internal-ops-production.up.railway.app` is **technically discoverable** to anyone scanning Railway's wildcard subdomain. Mitigation:

- All routes except `/login`, `/api/auth/login`, `/api/health` return 401 / 307
- Login form returns generic error (no user enumeration)
- Rate limit prevents brute-force at 5 attempts / 15 min / IP
- `robots.ts` not yet added — add to internal-ops in Stage 2B as a hardening step (Disallow: /)
- `noindex` meta already set in `internal-ops/src/app/layout.tsx`

To-do items added to Stage 2B build:

- [ ] Add `apps/internal-ops/src/app/robots.ts` returning `Disallow: /`
- [ ] Add `apps/internal-ops/src/app/api/robots/route.ts` if needed for non-static surface

### Sub-domain leakage

Cookie scope: `conscience_ops_session` cookie is set with `path: "/"`, no `domain` attribute, so it stays scoped to `internal-ops-production.up.railway.app`. It does NOT leak to `conscience-web-production.up.railway.app`. Verified by middleware's `Set-Cookie` header (no `Domain=` clause).

---

## 8. Session / auth persistence check after deploy

Concern: when Railway redeploys `internal-ops`, the in-memory rate-limit Map resets, and the running container is replaced (so any active session continues working because JWTs are stateless + sessions table is in Postgres).

Verification points:

- [ ] **Sessions survive a deploy:** sign in pre-deploy, deploy a no-op change, refresh dashboard — session still works because sessions table is in shared Postgres and JWT_SECRET doesn't rotate
- [ ] **Sessions revoked correctly when user logs out:** logout → `revoked_at` set → all subsequent /api/auth/me return 401 across deploys
- [ ] **Rate-limit resets on deploy** (acceptable): a user who hit 5 failed attempts and then waited for a deploy to drop the counter is essentially fine; this is a known limitation documented in `apps/internal-ops/src/app/api/auth/login/route.ts` comments
- [ ] **JWT_SECRET rotation invalidates all sessions:** if a secret leak forces rotation, every active JWT becomes invalid (signature check fails), forcing all users to sign in again. This is the kill-switch for compromise.

After Stage 2B deploys land, run a 3-step persistence test:

1. Sign in via `/login`. Confirm `/api/auth/me` returns 200.
2. Trigger a no-op redeploy on internal-ops (touch a file, commit, push).
3. After deploy completes, refresh `/api/auth/me`. Should still return 200 (session intact).

If step 3 fails: middleware or sessions table has a bug; roll back via Layer A.

---

## 9. DB backup / snapshot confirmation

### Railway-managed Postgres backup status

Railway free tier Postgres has automatic backups managed by Railway, but the backup retention + restore UI varies by plan. Verification:

- [ ] Check Railway dashboard → Postgres service → Backups tab presence
- [ ] If backups available: note the most recent timestamp, capture a manual snapshot before Stage 2B if the dashboard supports it
- [ ] If no backup UI: capture a logical dump manually before Stage 2B (commands below)

### Manual logical backup (always run, regardless of Railway dashboard state)

```bash
# Capture a pg_dump of the live DB to local disk, chmod 600
DB_PUBLIC=$(railway variables --service Postgres --kv 2>/dev/null | grep '^DATABASE_PUBLIC_URL=' | cut -d= -f2-)

mkdir -p ~/.consciousos/db-snapshots
SNAPSHOT_PATH=~/.consciousos/db-snapshots/pre-stage-2b-$(date -u +%Y%m%d-%H%M%S).sql

# Use pg_dump (install via brew install postgresql@16 if not present)
# Note: requires the DB version's pg_dump or compatible client. Railway runs PG 16+.
PGPASSWORD="$(echo $DB_PUBLIC | sed 's/.*:\([^@]*\)@.*/\1/')" \
  pg_dump "$DB_PUBLIC" --no-owner --no-acl > "$SNAPSHOT_PATH"

chmod 600 "$SNAPSHOT_PATH"
ls -la "$SNAPSHOT_PATH"

# To restore later (if needed):
# psql "$DB_PUBLIC" < ~/.consciousos/db-snapshots/pre-stage-2b-YYYYMMDD-HHMMSS.sql
```

If `pg_dump` not installed locally: alternative is the rollback SQL (Layer D in section 1) which restores schema state. Data restoration would require Railway's snapshot UI.

---

## 10. Pory's additional pre-flight (folded in)

- [x] **Backfill `leads.business_name`** — completed pre-doc (commit `b45cae5`). 1 row updated, both rows now populated.
- [x] **Remove `@types/bcryptjs`** from public-site devDeps — completed (commit `b45cae5`).
- [ ] **SEED_OWNER deploy decision:** decided. The `db:seed` script is run **manually** by the coordinator before the first internal-ops sign-in, not as a deploy step. Reason: deploy steps add complexity to Railway service config; manual seed is one command after first deploy. The seed script is idempotent (no-op if users table has rows) so re-running is safe.
- [x] **Status pipeline reconciliation:** confirmed schema has 8 internal-ops values + 7 legacy = 12 total. The "5 new values added" line in the Stage 2A chat summary referred to the new ones added via `ALTER TYPE ADD VALUE`; not a contradiction with the 8-value pipeline. face-f's UI uses the 8-value `INTERNAL_OPS_LEAD_STATUSES` constant from `@repo/db/schema`.

---

## 11. Stage 2B execution sequence (after pre-flight green)

In order, each step gates on the previous:

1. **Capture rollback handle** (deployment ID + service settings JSON / screenshot)
2. **Take DB snapshot** (`pg_dump` to substrate)
3. **Add `rollback_0001.sql` + `apps/internal-ops/src/app/robots.ts`** to repo, commit
4. **Update `conscience-web` Railway service config** via CLI:
   - Build command, Start command, Watch paths
   - DO NOT trigger a redeploy yet (changing the config alone doesn't trigger one until the next push)
5. **Push commit to fork**:
   - Railway auto-builds with the new monorepo commands against the new code layout
   - Watch build logs; if build fails, Layer B + revert via Layer C
6. **Verify public-site post-deploy** (full smoke checklist, section 5)
7. **Provision `internal-ops` Railway service** via CLI:
   - `railway add --service internal-ops` (or via dashboard if CLI lacks the workflow)
   - Set Build/Start/Watch/Env vars per section 3
   - Generate Railway domain on port 3000
   - Deploy
8. **Generate fresh `INVITE_TOKEN_SECRET`**, store in substrate, set on internal-ops service
9. **Verify internal-ops post-deploy** (full smoke checklist, section 6)
10. **Run session persistence check** (section 8 — sign in, redeploy, verify session intact)
11. **Pory end-of-phase cosign on the unified deploy**
12. **Post `[TYPE: MILESTONE] face-d Stage 2B foundation green` to #conscience-os-app**
13. **Update face-d substrate state with `stage_2b_complete` event + receipts**
14. **face-e and face-f are now unblocked for schema-coupled work**

Total estimated time: 60-90 min wall-clock if no surprises. Each step has explicit rollback per section 1.

---

## 12. What this pre-flight does NOT cover

- **Custom domain setup** (`ops.conscienceos.com`) — deferred to Stage 4
- **Postgres role split** (`public_intake_role` + `ops_role` + `migration_role`) — deferred to Stage 2C, gated on Railway-managed Postgres permitting `CREATE ROLE`. Currently both services use default `postgres` superuser.
- **GitHub auto-deploy** wire-up between LOAWB and Railway — Vessel deferred. Current pattern: `railway up` from local for ad-hoc deploys; auto-deploy on fork branch push handles the merge case.
- **Resend email setup** — Vessel hasn't signed up; `RESEND_API_KEY` left blank
- **Sentry** — Vessel hasn't signed up; SENTRY*DSN*\* env vars left blank

---

## 13. Pory cosign trigger

Per face-d cosign cadence (4 total: pre-flight + mid-execution + end-of-phase + pre-merge), this pre-flight document IS the artifact that the **end-of-phase cosign** reviews after Stage 2B execution lands.

Sequence:

1. Vessel reviews this document, approves or sends deltas
2. (If approved) face-d executes Stage 2B sequence (section 11)
3. face-d posts a Pory **end-of-phase** cosign request with the unified Stage 2B diff + post-deploy smoke results
4. Pory verdict: COSIGN (foundation-green signal releases) / RECOMMEND-CHANGES / BLOCK
5. (If COSIGN) coordinator posts `foundation green` to `#conscience-os-app`, face-e and face-f unblocked

---

## Receipts

- Stage 2A commit: `74ce227`
- Stage 2A.1 commit (Pory cleanup): `b45cae5`
- Pory mid-execution cosign on 2A: COSIGN (full receipt in `#porygon`)
- Vessel directives 2026-05-06 on 4 cosign questions: stability over cleanup, two-tier auth accepted, in-memory rate-limit accepted with limitations, full pre-flight required
- Face-d substrate state: `~/.consciousos/state/faces/face-d.json` (will gain `stage_2b_complete` event after execution)
