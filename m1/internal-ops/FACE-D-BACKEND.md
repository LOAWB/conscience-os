# face-d Task Packet — Backend + Schema + Auth + Monorepo + Coordinator

**Face:** face-d
**Project:** conscience-os-internal
**Lane:** internal ops dashboard + CRM core (M0 plan + Phase 1 MVP build)
**Codex:** pory-codex-conscience-internal
**Cosign cadence:** 4 (pre-flight + mid-execution + end-of-phase + pre-merge)
**Coordinator:** YES — principal-of-truth for sequencing, receipts, integration smoke test
**Reference:** `m1/INTERNAL-OPS-M0-PLAN.md`, `m1/internal-ops/THREE-FACE-EXECUTION-PLAN.md`

---

## Scope

Foundation that face-e and face-f land on. Repo restructure, shared packages, full DB schema, auth model, internal-ops app shell, Railway service split, Postgres role split. **No UI extraction** (face-e); **no domain modules** (face-f). Empty `@repo/ui` package boundary only — face-d guards the contract, face-e fills the surface.

**Coordinator-only responsibilities (in addition to lane scope):**

- Release handoff signals to face-e (after Stage 1) and face-f (after Stage 2)
- Aggregate cosign receipts in `~/.consciousos/state/faces/face-d.json` history
- Run the Stage 4 integration smoke test
- Resolve cross-face primitive disputes if face-e and face-f disagree
- Post cross-face status updates to `#conscience-os-app` at handoff transitions

---

## Files this face creates

```
[ROOT]
package.json                              ← workspace root, scripts: dev/build/lint/typecheck/db
pnpm-workspace.yaml                       ← packages: ['apps/*', 'packages/*']
turbo.json                                ← pipeline: build, dev (persistent), lint, typecheck
.gitignore                                ← extended for monorepo (.next, dist, .turbo)

apps/public-site/                         ← MOVED from current src/, public/, etc.
apps/public-site/package.json
apps/public-site/next.config.ts           ← keep output: standalone
apps/public-site/tsconfig.json            ← extends @repo/config/tsconfig.next.json

apps/internal-ops/package.json
apps/internal-ops/next.config.ts          ← output: standalone
apps/internal-ops/tsconfig.json
apps/internal-ops/middleware.ts           ← matcher gates all except /login, /api/auth/login, /api/health
apps/internal-ops/src/app/layout.tsx      ← root layout, font config
apps/internal-ops/src/app/login/page.tsx  ← FACE-E fills the UI; face-d ships an unstyled stub for boot
apps/internal-ops/src/app/api/auth/login/route.ts
apps/internal-ops/src/app/api/auth/logout/route.ts
apps/internal-ops/src/app/api/auth/me/route.ts
apps/internal-ops/src/app/api/auth/invite/route.ts          ← Phase 4 prep, scaffold only
apps/internal-ops/src/app/api/health/route.ts
apps/internal-ops/src/lib/auth.ts         ← signSession, verifySession, getSession, requireRole
apps/internal-ops/src/lib/role-guard.ts   ← higher-order handler wrapper for role checks

packages/db/package.json
packages/db/tsconfig.json
packages/db/drizzle.config.ts
packages/db/src/schema.ts                 ← full schema, all tables (see section below)
packages/db/src/client.ts                 ← createClient(connectionString) factory
packages/db/src/index.ts                  ← public exports
packages/db/src/seed.ts                   ← seed-owner bootstrap
packages/db/drizzle/0001_internal_ops_init.sql  ← generated migration

packages/ui/package.json                  ← BOUNDARY ONLY (empty src/index.ts)
packages/ui/tsconfig.json
packages/ui/src/index.ts                  ← exports nothing, face-e fills

packages/config/package.json
packages/config/tsconfig.base.json
packages/config/tsconfig.next.json
packages/config/eslint.config.js
```

## Files this face modifies

```
apps/public-site/src/app/api/lead/route.ts  ← refactor to import from @repo/db
```

## Files this face deletes

```
apps/public-site/src/app/app/                       ← entire dir, was internal admin
apps/public-site/src/app/api/auth/                  ← move to internal-ops
apps/public-site/src/app/api/leads/                 ← move to internal-ops
apps/public-site/src/lib/auth.ts                    ← move to internal-ops
apps/public-site/src/components/app/                ← move what face-e wants, delete rest
apps/public-site/middleware.ts                      ← move to internal-ops (broader matcher)
apps/public-site/drizzle.config.ts                  ← moved to packages/db/
apps/public-site/drizzle/                           ← moved to packages/db/
apps/public-site/src/db/                            ← moved to packages/db/src/
```

---

## Schema spec

Full schema in `packages/db/src/schema.ts`. Generate migration `0001_internal_ops_init.sql` covering everything below; the existing `0000_init.sql` (already applied) stays in place — Drizzle's `__drizzle_migrations` table tracks it.

### Enums

- `lead_status` — `new_lead | contacted | audit_scheduled | audit_completed | proposal_sent | won | lost | on_hold`
- `lead_tier` — `audit | build | support | not_sure`
- `client_status` — `active | paused | offboarded`
- `project_status` — `discovery | planning | building | review | deployed | support | complete`
- `task_status` — `to_do | in_progress | waiting | done`
- `task_priority` — `low | medium | high | critical`
- `event_type` — `audit | call | deadline | follow_up | other`
- `user_role` — `owner | operator | client`

### Tables

| Table         | Columns (key fields only — full spec in master M0 plan section 5)                                                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`       | id, email (unique), password_hash, role, name, created_at, updated_at                                                                                                                                                        |
| `sessions`    | id, user_id (FK), jti (JWT id), ip, user_agent, expires_at, created_at, revoked_at                                                                                                                                           |
| `invitations` | id, email, role, token_hash, invited_by (FK users), expires_at, accepted_at, created_at                                                                                                                                      |
| `leads`       | id, name, business_name, email, phone, business_type, problems, tools, outcome, source, status (lead_status), tier (lead_tier), notes, next_follow_up_at, converted_client_id (FK clients NULL), created_at, updated_at      |
| `clients`     | id, business_name, contact_name, email, phone, status (client_status), notes, important_links (jsonb default '[]'), created_at, updated_at                                                                                   |
| `projects`    | id, client_id (FK), name, description, status (project_status), due_date, deliverables (jsonb default '[]'), internal_notes, created_at, updated_at                                                                          |
| `tasks`       | id, title, description, status (task_status), priority (task_priority), due_date, client_id (FK NULL), project_id (FK NULL), lead_id (FK NULL), created_at, updated_at                                                       |
| `events`      | id, title, type (event_type), date_time, duration_minutes (default 30), client_id (FK NULL), lead_id (FK NULL), project_id (FK NULL), notes, created_at                                                                      |
| `audits`      | id, lead_id (FK NULL), client_id (FK NULL), business_overview, current_tools, pain_points, opportunities, recommended_systems, next_steps, created_at, updated_at — CHECK `(lead_id IS NOT NULL) OR (client_id IS NOT NULL)` |
| `lead_notes`  | (existing, kept) id, lead_id, body, author, created_at                                                                                                                                                                       |

Indexes: status columns on each entity, foreign keys, `created_at desc` for default ordering.

### Postgres roles

Create three roles via raw SQL (Drizzle migrations support raw SQL via custom migrations). Run after table creation:

```sql
CREATE ROLE public_intake_role NOLOGIN;
GRANT INSERT ON leads TO public_intake_role;

CREATE ROLE ops_role NOLOGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ops_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ops_role;

CREATE ROLE migration_role NOLOGIN;
GRANT ALL PRIVILEGES ON SCHEMA public TO migration_role;
```

Then issue connection-string-equivalent users (`public_intake_user`, `ops_user`, `migration_user`) via `CREATE USER ... IN ROLE`. The Railway-managed Postgres user (`postgres`) gets `migration_role` granted; the Railway services connect via the appropriate role-scoped DSN.

If Railway-managed Postgres blocks role creation, document the limitation in commit message + raise as proposal for self-hosted Postgres in M2+.

---

## Auth spec

JWT cookie `conscience_ops_session`. HS256. 7-day expiry. httpOnly. `secure: true` in prod. sameSite=lax.

JWT payload: `{ userId, role, iat, exp, jti }`.

Server-side session record (`sessions` table) keyed by `jti` allows revocation without rotating `JWT_SECRET`. On each request, middleware:

1. Extracts cookie
2. Verifies JWT
3. Looks up `sessions.jti = payload.jti AND revoked_at IS NULL`
4. If row missing or revoked, redirect to `/login`
5. Otherwise attach `userId` + `role` to request headers (`x-user-id`, `x-user-role`) and pass through

### Login flow

`POST /api/auth/login` body `{ email, password }`:

1. Look up `users` by email (case-insensitive)
2. If no row OR `bcrypt.compare(password, password_hash) === false`, increment login-attempt counter for IP, return 401
3. If 5+ failed attempts in last 15 min for this IP, return 429
4. Otherwise generate JWT with new `jti`, insert `sessions` row, set cookie, return `{ ok: true }`

### Seed-owner bootstrap

On first deploy, the migration runs `seed.ts` which:

1. Counts `users` rows. If `> 0`, skip.
2. Reads `SEED_OWNER_EMAIL` and `SEED_OWNER_PASSWORD_HASH` from env
3. If either missing, log warning + skip (manual seed needed)
4. Otherwise `INSERT INTO users (email, password_hash, role, name) VALUES (...)` with `role = 'owner'`
5. Log seed event with timestamp

After first sign-in, those env vars become unused. Document removing them in the Railway dashboard as a hardening step.

---

## Railway provisioning checklist

1. Add `internal-ops` service to existing Railway `conscience-os` project (already has `Postgres` + `conscience-web`)
2. Set **Root Directory: `/`** on both services (NOT `/apps/X`, per Pory cosign)
3. Set service-level Build + Start:
   - `conscience-web`: build `pnpm install --frozen-lockfile && pnpm --filter public-site build`, start `pnpm --filter public-site start`
   - `internal-ops`: build `pnpm install --frozen-lockfile && pnpm --filter internal-ops build`, start `pnpm --filter internal-ops start`
4. Set Watch paths per service:
   - `conscience-web`: `apps/public-site/**` + `packages/**` + `package.json` + `pnpm-lock.yaml`
   - `internal-ops`: `apps/internal-ops/**` + `packages/**` + `package.json` + `pnpm-lock.yaml`
5. Set env vars on `internal-ops`:
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}` (or role-scoped string if role split lands)
   - `JWT_SECRET` (generate with `openssl rand -base64 48`, store in `~/.consciousos/secrets/conscience-os-internal-jwt-secret.txt`)
   - `SEED_OWNER_EMAIL=jared@conscienceos.com`
   - `SEED_OWNER_PASSWORD_HASH` (generate fresh, store in substrate)
   - `INVITE_TOKEN_SECRET` (generate, separate from JWT_SECRET)
   - `HOSTNAME=0.0.0.0`
   - `PORT=3000`
6. Generate Railway-provided domain for `internal-ops` service, point to port 3000
7. Confirm `https://internal-ops-production.up.railway.app/api/health` returns 200
8. Custom domain `ops.conscienceos.com` deferred to Vessel DNS pass

---

## Acceptance criteria

- [ ] `pnpm install` at repo root succeeds with no warnings
- [ ] `pnpm --filter public-site dev` boots existing public site at localhost:3000, all 9 public routes serve 200
- [ ] `pnpm --filter internal-ops dev` boots internal-ops at a different port, `/api/health` returns 200
- [ ] `pnpm --filter @repo/db migrate` applies schema cleanly against Railway Postgres
- [ ] `INSERT INTO leads ...` via public-site `/api/lead` succeeds and lands a row visible from internal-ops
- [ ] Sign-in via `POST /api/auth/login` with seeded owner credentials returns 200 + sets `conscience_ops_session` cookie
- [ ] Sign-in with bad creds returns 401; rate limit returns 429 after 5 attempts in 15 min
- [ ] `/api/auth/me` returns `{ authenticated: true, email, role }` with valid cookie
- [ ] `/api/auth/logout` clears cookie + sets `revoked_at` on session row
- [ ] Middleware redirects unauthenticated requests on any `/(dashboard)/*` route to `/login`
- [ ] Railway services both deploy clean and reach 200 on health probes
- [ ] No regressions to existing public-site routes
- [ ] Postgres roles created (or limitation documented)

---

## Pory cosign triggers (4)

1. **Pre-flight:** before any code runs, Pory reviews this packet against the M0 plan. Verdict required: GO / REWORK / BLOCKED.
2. **Mid-execution:** triggered after Stage 1 (skeleton) lands. Pory checks workspace wiring, package boundary integrity, and that the public site still builds.
3. **End-of-phase:** after Stage 2 (foundation green), Pory reviews the diff (auth, schema, migrations, public-site cleanup, internal-ops shell). Verdict required: COSIGN / RECOMMEND-CHANGES / BLOCK.
4. **Pre-merge:** during Stage 4 (integration), Pory reviews the unified PR diff for cross-cutting issues.

Trigger Pory consults via `~/.consciousos/scripts/pory-consult.sh --stdin --mode <mode>`. Verdicts auto-post to `#porygon`.

---

## Stage timing

- Stage 1 (skeleton): ~30 min
- Stage 2 (foundation green): ~2-3 hours
- Stage 4 share (integration coordinator role): ~1 hour
- **Total face-d engaged time: ~4-5 hours wall-clock** (overlaps with face-e and face-f stages)

---

## Risks specific to face-d

- **Drizzle migration registry conflict.** `0000_init.sql` is registered against the public-site path. After moving to `packages/db/drizzle/`, ensure the `__drizzle_migrations` table is preserved (don't drop the DB) and the new migration `0001_internal_ops_init.sql` numbers sequentially.
- **Public-site downtime.** During the strip-CRM step, public-site temporarily has no `/app/*`. Acceptable since those routes are admin-only; document in commit message.
- **Postgres role creation on managed Railway.** If Railway-managed Postgres blocks `CREATE ROLE`, fall back to single-user model and document the gap. Do not block the build on this.
- **Lead-write path during cutover.** `apps/public-site/src/app/api/lead/route.ts` must continue accepting writes throughout the migration. Test before and after refactor.

---

## Handoff signals to other faces

- After Stage 1 lands: post `[TYPE: ACTION] face-d skeleton ready, face-e unblocked, packages/ui boundary live` to `#conscience-os-app`
- After Stage 2 lands: post `[TYPE: ACTION] face-d foundation green, face-f unblocked` with the `@repo/db` schema export shape and the auth-route shapes
- During Stage 4: coordinate the smoke test, post `[TYPE: MILESTONE] integration green` on full pass

---

## Substrate engagement

- Face state: `~/.consciousos/state/faces/face-d.json` (existing, update `task_packet_path`)
- Receipts: every cosign result logs to `~/.consciousos/logs/receipts.jsonl`
- Discord: status posts as `Jr` to `#conscience-os-app`
