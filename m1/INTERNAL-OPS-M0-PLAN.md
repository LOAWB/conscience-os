# Conscience Os Internal Operations App — M0 Plan

**Status:** drafted by Jr 2026-05-06, **Pory design-cosign incorporated** (mode=design-cosign, full receipt in `#porygon`), awaiting Vessel green-light before any restructure.
**Scope:** establish architecture + migration plan + Phase 1 MVP build for the private operations app. Distinct surface from the public marketing site.

**Material deltas from v0 → v1 after Pory cosign:**

1. Railway root directory stays at repo root (`/`); use `pnpm --filter <app>` filtered commands per service. Do NOT set Root Directory to `/apps/public-site` etc. — shared packages would be invisible to the build context.
2. Configure Railway watch paths per service so public-site changes don't rebuild internal-ops and vice versa.
3. Use separate Postgres roles where Railway permits: `public_intake_role` (INSERT on leads only) for public-site, `ops_role` (full CRM) for internal-ops, `migration_role` (DDL only) for deploys. Same Postgres instance, different connection contexts.
4. Build real `users` + `sessions` + `roles` + `invitations` from day 1, seeded with one admin row. Env-only ADMIN_EMAIL/ADMIN_PASSWORD_HASH was a working bootstrap; layering Phase 4 client invites on top of it would be technical debt by month two.
5. Internal-ops uses its own JWT cookie name (`conscience_ops_session`) distinct from any future public-site auth, so the trust boundary stays unambiguous at the cookie level.

---

## 0. Goal restated

Build the **private command center** for running the Conscience Os service business: leads, clients, projects, tasks, schedule, audits. Auth-gated. Different surface from the public marketing website. The public site is the entry point for new clients; this app is what runs the business after they arrive.

**MVP success (Vessel's acceptance criteria):**

1. Live on Railway behind login
2. Today View shows today's tasks + overdue items + upcoming events
3. CRUD on leads / clients / projects / tasks
4. Tasks linkable to clients/projects
5. Schedule view shows audits/calls/follow-ups
6. Public-site `/book` intake feeds into the CRM (Phase 2 wire)
7. README + env-var docs

---

## 1. Public vs internal — clear separation

| Surface          | Public site (`conscience-web`)             | Internal ops (`internal-ops`)               |
| ---------------- | ------------------------------------------ | ------------------------------------------- |
| Audience         | Public, prospective clients                | Vessel only (M0); future operator team      |
| Domain           | `conscienceos.com` (DNS pending)           | `ops.conscienceos.com` (proposed)           |
| Railway service  | `conscience-web` (current, renames OK)     | `internal-ops` (new)                        |
| Auth             | None (public)                              | JWT cookie, gated everywhere except /login  |
| Routes           | `/`, `/about`, `/book`, `/services`, etc.  | `/login`, `/(dashboard)/*`, `/api/*` authed |
| DB write surface | Only `POST /api/lead` (creates a Lead row) | Full CRUD on all tables                     |
| Env vars         | `DATABASE_URL` only                        | `DATABASE_URL` + `JWT_SECRET` + ADMIN\_\*   |

**Rule:** the public site never holds admin credentials, never serves admin UI, never lists private data. Only privilege: write a single Lead row from the booking form.

---

## 2. Architecture decision: monorepo with shared `db` + `ui` packages

```
conscience-os/                        (repo root, single repo)
├── apps/
│   ├── public-site/                  ← current Next.js app, CRM stripped out
│   └── internal-ops/                 ← new Next.js app
├── packages/
│   ├── db/                           ← Drizzle schema + client + migrations
│   ├── ui/                           ← brand tokens + glass cards + wordmark
│   └── config/                       ← shared tsconfig + eslint (optional)
├── package.json                      ← workspaces root
├── pnpm-workspace.yaml               ← pnpm
├── turbo.json                        ← Turborepo pipeline
└── README.md
```

**Why monorepo (Turborepo + pnpm):**

- **Shared DB schema is canonical.** Both apps need to read/write the same tables. Splitting schemas across repos creates drift the second they diverge. One source of truth in `@repo/db`.
- **Shared brand tokens.** Hero ring, wordmark, glass cards, electric-blue accents — locked design language. Living in `@repo/ui` means a change in one place propagates to both surfaces.
- **Atomic refactors.** When we add a column to `leads`, both apps see it in one PR.
- **Single test surface.** Type checking across the boundary catches contract drift.

**Why not separate repos:** code duplication for schema + brand + auth utility. We'd be writing the same Drizzle schema twice and praying they stay aligned. Pory verdict pending; will fold in.

**Why not just route-namespace inside one Next.js app:** what we have now. The whole point of Vessel's directive is that public marketing and private ops should not coexist behind one binary. Different deploys, different env scopes, different security postures.

**Tooling pin:** Turborepo for build pipeline + pnpm for workspaces (Next.js compatibility, fast installs, Railway support documented).

---

## 3. Repo restructure plan (current → target)

### Files that **stay on public site** (`apps/public-site/`)

```
src/app/page.tsx, layout.tsx, globals.css, icon.tsx, opengraph-image.tsx, robots.ts, sitemap.ts
src/app/about/, /book/, /case-study/, /services/, /work-together/, /legal/
src/app/api/lead/route.ts                  ← stays, but rewritten to use @repo/db
src/components/                            ← public-only components
public/                                     (none currently)
```

### Files that **move to internal-ops** (`apps/internal-ops/`)

```
src/app/app/login/page.tsx       → src/app/login/page.tsx
src/app/app/page.tsx             → src/app/(dashboard)/page.tsx       (Today View)
src/app/app/layout.tsx           → src/app/(dashboard)/layout.tsx
src/app/app/leads/page.tsx       → src/app/(dashboard)/leads/page.tsx
src/app/app/leads/[id]/page.tsx  → src/app/(dashboard)/leads/[id]/page.tsx
src/app/api/auth/*               → src/app/api/auth/*
src/app/api/leads/*              → src/app/api/leads/*
src/components/app/login-form.tsx → src/components/login-form.tsx
src/lib/auth.ts                  → src/lib/auth.ts
middleware.ts                    → middleware.ts (matcher widened to all routes except /login + /api/auth/login)
```

### Files that **move to `packages/db/`**

```
src/db/index.ts                  → packages/db/src/client.ts
src/db/schema.ts                 → packages/db/src/schema.ts (extended per Vessel data model)
drizzle.config.ts                → packages/db/drizzle.config.ts
drizzle/                         → packages/db/drizzle/
```

### Files that **move to `packages/ui/`** (extracted from current shared components)

```
Wordmark, hero ring, glass card, icon-box, button, aura primitives, Geist font setup, color tokens.
(Audit pass needed during migration — not all currently-shared components belong here.)
```

### Files that **disappear** (no replacement)

- `src/app/app/` directory itself (empty after the moves above)

---

## 4. Migration strategy — single execution window

This is a large, atomic restructure. Run it in one sitting (~2-3 hours), commit-per-step, push as a single feature branch, deploy in order.

### Step-by-step

1. **Create monorepo skeleton on a new branch** `m2/internal-ops-monorepo`:
   - Move current `src/`, `public/`, `next.config.ts`, etc. into `apps/public-site/`
   - Add root `package.json` with `pnpm workspaces`
   - Add `pnpm-workspace.yaml` + `turbo.json`
   - Create `packages/db/`, `packages/ui/`, `packages/config/` with placeholder `package.json`s
2. **Extract `packages/db/`**:
   - Move schema + client + migrations
   - Add `@repo/db` workspace name
   - Refactor `apps/public-site/src/app/api/lead/route.ts` to import from `@repo/db`
3. **Extract `packages/ui/`** (minimal first cut):
   - Move wordmark, glass-card primitive, color tokens
   - Both apps consume from `@repo/ui`
4. **Strip CRM from public-site:**
   - Delete `apps/public-site/src/app/app/`, `api/auth/`, `api/leads/`, `lib/auth.ts`, `middleware.ts`
   - Leave only the Lead-write path intact
5. **Scaffold `apps/internal-ops/`:**
   - New Next.js 16 app with the same brand baseline
   - Port `auth.ts`, `middleware.ts` (now matching all routes), `/login`, `/(dashboard)/*`, `/api/auth/*`, `/api/leads/*`
   - Add new schema + routes for clients, projects, tasks, events, audits (per Phase 1)
6. **Railway service split** (per Pory cosign):
   - Both services keep Root Directory at `/` (repo root). Each gets explicit Build + Start commands.
     - `conscience-web` build: `pnpm install --frozen-lockfile && pnpm --filter public-site build`
     - `conscience-web` start: `pnpm --filter public-site start`
     - `internal-ops` build: `pnpm install --frozen-lockfile && pnpm --filter internal-ops build`
     - `internal-ops` start: `pnpm --filter internal-ops start`
   - Watch paths configured per service: `apps/public-site/**` + `packages/**` for public, `apps/internal-ops/**` + `packages/**` for ops.
   - Both services reference `${{Postgres.DATABASE_URL}}` but with different DB role connection strings if Postgres roles are split (see security plan).
   - Internal-ops gets its own Railway-provided domain initially; custom domain `ops.conscienceos.com` later.
7. **Migrate DB schema:**
   - Generate fresh migration `0001_internal_ops_init.sql` covering clients, projects, tasks, events, audits + extending leads with new fields
   - Apply via `pnpm --filter @repo/db migrate`
8. **Smoke test:**
   - Public site: `/book` submits a Lead row that internal-ops can read
   - Internal-ops: log in, create a client, link a project, add a task, view it on Today
   - Confirm both Railway services resolve their domains and serve their surface
9. **PR + merge** (PR #11 against fork, eventually upstream to LOAWB once write access lands)

### Risks during migration

- **Workspace import paths.** TS paths config in each app needs `@repo/db`, `@repo/ui` aliases. Easy to miss; surface as type errors.
- **Drizzle migrations location.** Migrations move from `apps/public-site/drizzle/` to `packages/db/drizzle/`. The `0000_init.sql` already applied on Railway Postgres should remain registered; Drizzle's `__drizzle_migrations` table tracks it. Generate new ones additively.
- **Railway Root Directory stays at `/`** (per Pory cosign). Use service-level `pnpm --filter <app>` build/start commands so each service has full monorepo context including `/packages`. Setting Root Directory to `/apps/public-site` would hide shared packages from the build context.
- **Watch paths per service.** Configure `apps/public-site/**` for the public-site service and `apps/internal-ops/**` for internal-ops, plus `packages/**` for both, so a public-only change does not redeploy ops and vice versa.
- **`output: "standalone"` per app.** Both `next.config.ts` files need the standalone flag. Keep the build/start scripts symmetric.

---

## 5. Data model (Vessel's spec, normalized)

All tables in shared `packages/db/src/schema.ts`. PostgreSQL types via Drizzle.

### `leads` (extended from current)

| column              | type                     | notes                     |
| ------------------- | ------------------------ | ------------------------- |
| id                  | uuid PK                  | gen_random_uuid()         |
| name                | text NOT NULL            |                           |
| business_name       | text NOT NULL            | renamed from `business`   |
| email               | text NOT NULL            |                           |
| phone               | text                     | new                       |
| business_type       | text                     | optional                  |
| problems            | text                     | from intake form          |
| tools               | text                     | from intake form          |
| outcome             | text                     | from intake form          |
| source              | text DEFAULT 'website'   |                           |
| status              | enum lead_status         | new pipeline (see below)  |
| tier                | enum lead_tier           | retained                  |
| notes               | text                     | freeform notes            |
| next_follow_up_at   | timestamptz              | replaces `next_action_at` |
| converted_client_id | uuid FK clients(id) NULL | set when status=Won       |
| created_at          | timestamptz              |                           |
| updated_at          | timestamptz              |                           |

`lead_status` enum: `new_lead | contacted | audit_scheduled | audit_completed | proposal_sent | won | lost | on_hold`

### `clients`

| column          | type                                         |
| --------------- | -------------------------------------------- |
| id              | uuid PK                                      |
| business_name   | text NOT NULL                                |
| contact_name    | text NOT NULL                                |
| email           | text                                         |
| phone           | text                                         |
| status          | enum client_status                           |
| notes           | text                                         |
| important_links | jsonb DEFAULT '[]' (array of `{label, url}`) |
| created_at      | timestamptz                                  |
| updated_at      | timestamptz                                  |

`client_status` enum: `active | paused | offboarded`

### `projects`

| column         | type                                          |
| -------------- | --------------------------------------------- |
| id             | uuid PK                                       |
| client_id      | uuid FK clients(id) ON DELETE cascade         |
| name           | text NOT NULL                                 |
| description    | text                                          |
| status         | enum project_status                           |
| due_date       | timestamptz                                   |
| deliverables   | jsonb DEFAULT '[]' (array of `{label, done}`) |
| internal_notes | text                                          |
| created_at     | timestamptz                                   |
| updated_at     | timestamptz                                   |

`project_status` enum: `discovery | planning | building | review | deployed | support | complete`

### `tasks`

| column      | type                      |
| ----------- | ------------------------- |
| id          | uuid PK                   |
| title       | text NOT NULL             |
| description | text                      |
| status      | enum task_status          |
| priority    | enum task_priority        |
| due_date    | timestamptz               |
| client_id   | uuid FK clients(id) NULL  |
| project_id  | uuid FK projects(id) NULL |
| lead_id     | uuid FK leads(id) NULL    |
| created_at  | timestamptz               |
| updated_at  | timestamptz               |

`task_status` enum: `to_do | in_progress | waiting | done`
`task_priority` enum: `low | medium | high | critical`

### `events`

| column           | type                 |
| ---------------- | -------------------- |
| id               | uuid PK              |
| title            | text NOT NULL        |
| type             | enum event_type      |
| date_time        | timestamptz NOT NULL |
| duration_minutes | int DEFAULT 30       |
| client_id        | uuid FK NULL         |
| lead_id          | uuid FK NULL         |
| project_id       | uuid FK NULL         |
| notes            | text                 |
| created_at       | timestamptz          |

`event_type` enum: `audit | call | deadline | follow_up | other`

### `audits`

| column              | type                     |
| ------------------- | ------------------------ |
| id                  | uuid PK                  |
| lead_id             | uuid FK leads(id) NULL   |
| client_id           | uuid FK clients(id) NULL |
| business_overview   | text                     |
| current_tools       | text                     |
| pain_points         | text                     |
| opportunities       | text                     |
| recommended_systems | text                     |
| next_steps          | text                     |
| created_at          | timestamptz              |
| updated_at          | timestamptz              |

CHECK constraint: `(lead_id IS NOT NULL) OR (client_id IS NOT NULL)` — every audit attaches to one or the other.

### `lead_notes` (existing, kept)

Unchanged from current schema.

---

## 6. Routes / screens — Phase 1 MVP

Internal-ops Next.js App Router layout. All routes under `/(dashboard)/*` are auth-gated by middleware.

```
apps/internal-ops/src/app/
├── login/page.tsx                  ← email + password form
├── (dashboard)/
│   ├── layout.tsx                  ← sidebar nav + user menu
│   ├── page.tsx                    ← Today View (default landing)
│   ├── leads/
│   │   ├── page.tsx                ← list with status pipeline filter
│   │   └── [id]/page.tsx           ← detail + edit + linked tasks/events
│   ├── clients/
│   │   ├── page.tsx                ← list with status filter
│   │   ├── new/page.tsx            ← create form
│   │   └── [id]/page.tsx           ← detail + projects + notes + links
│   ├── projects/
│   │   ├── page.tsx                ← list grouped by client
│   │   ├── new/page.tsx            ← create form
│   │   └── [id]/page.tsx           ← detail + deliverables + tasks
│   ├── tasks/
│   │   ├── page.tsx                ← list with priority + status filters
│   │   └── new/page.tsx            ← create form
│   ├── schedule/
│   │   └── page.tsx                ← upcoming events list/calendar
│   └── audits/
│       ├── new/page.tsx            ← structured audit form
│       └── [id]/page.tsx           ← view + edit
├── api/
│   ├── auth/login + logout + me
│   ├── leads/  (list, get, patch, delete + notes subroute)
│   ├── clients/
│   ├── projects/
│   ├── tasks/
│   ├── events/
│   └── audits/
└── middleware.ts                   ← gate everything except /login + /api/auth/login
```

### Today View composition (the most important screen)

Three-column dashboard:

1. **Left: Today's tasks** — tasks where `status != done` AND `due_date <= today`. Quick-complete button per row.
2. **Center: Overdue + upcoming events** — events from `now` to `now + 7d`, grouped by day. Audits and calls shown distinctly.
3. **Right: Quick capture** — single textarea + dropdown to file note as task / event / lead-followup. Reduces friction for "I just thought of something" moments.

Top strip: counts (open leads, active clients, active projects, overdue tasks). One-click drill-down.

---

## 7. Deploy plan

### Railway service architecture

```
Project: conscience-os
├── Service: Postgres                    (existing, unchanged)
├── Service: conscience-web              (existing, refactored)
│   ├── Root Directory: /                (repo root, NOT apps/public-site)
│   ├── Build: pnpm install --frozen-lockfile && pnpm --filter public-site build
│   ├── Start: pnpm --filter public-site start
│   ├── Watch paths: apps/public-site/**, packages/**
│   ├── Domain: conscience-web-production.up.railway.app + conscienceos.com (later)
│   └── Env: DATABASE_URL_PUBLIC_INTAKE (limited Postgres role) + HOSTNAME=0.0.0.0 + PORT=3000
└── Service: internal-ops                (new)
    ├── Root Directory: /                (repo root)
    ├── Build: pnpm install --frozen-lockfile && pnpm --filter internal-ops build
    ├── Start: pnpm --filter internal-ops start
    ├── Watch paths: apps/internal-ops/**, packages/**
    ├── Domain: internal-ops-production.up.railway.app + ops.conscienceos.com (later)
    └── Env: DATABASE_URL_OPS (full role) + JWT_SECRET + INVITE_TOKEN_SECRET + SEED_OWNER_EMAIL + SEED_OWNER_PASSWORD_HASH + HOSTNAME=0.0.0.0 + PORT=3000
```

Both services point at the same Postgres instance via `${{Postgres.DATABASE_URL}}` reference variable, but with **separate role connection strings** (per Pory cosign on least-privilege). Both apply the standalone-output pattern locked yesterday. The `SEED_OWNER_*` env vars are only read by a one-time bootstrap during migration to seed the first `users` row, then ignored thereafter.

### Local development

```
pnpm install                            # at repo root
pnpm dev                                # parallel dev across both apps via Turborepo
pnpm --filter public-site dev           # single app
pnpm --filter internal-ops dev          # single app
pnpm --filter @repo/db migrate          # apply pending migrations
```

---

## 8. Security plan

### Auth model — Phase 1 (revised per Pory cosign)

Real `users` + `sessions` + `roles` + `invitations` tables from day 1, seeded with one Vessel-owner row at first deploy. Env-var admin (yesterday's pattern) is bootstrap-only and stops being authoritative the instant the seeded row exists.

**Why now and not later:** Phase 4 client invites can't sit on top of a single-admin env auth without throwing it away. Building a real users model now is roughly 100 lines of additional code (one schema migration + a session resolver + an invitation token generator) and avoids a re-architecture in three months.

Tables added to `packages/db/src/schema.ts`:

- `users(id, email, password_hash, role, name, created_at, updated_at)` — `role` enum: `owner | operator | client`
- `sessions(id, user_id, jwt_id, ip, user_agent, expires_at, created_at, revoked_at)` — server-side session record so we can revoke sessions without rotating JWT_SECRET
- `invitations(id, email, role, token_hash, invited_by, expires_at, accepted_at, created_at)` — for Phase 4 client invites and any future operator additions

Auth surface:

- JWT cookie name: `conscience_ops_session` (distinct from any future public-site auth so the trust boundary is unambiguous at the cookie level)
- HS256, 7-day expiry, httpOnly, secure in prod, sameSite=lax
- JWT payload includes `userId` + `role` (read by middleware to check authorization)
- Sessions table records each issued JWT by `jti` so server-side revocation works without secret rotation
- Middleware matcher: `["/((?!login|api/auth/login|api/health).*)"]` — gate everything except login page, login API, and health probe

Bootstrap path:

1. First deploy reads `SEED_OWNER_EMAIL` + `SEED_OWNER_PASSWORD_HASH` env vars
2. Migration script inserts one `users` row with `role='owner'` if and only if the table is empty
3. Migration log records the seed event; subsequent deploys skip re-seeding
4. Vessel signs in, the env vars become unused and can be deleted from Railway

Future invitations (Phase 4):

- Owner generates an invite link from `/settings/team`. Token is HMAC-signed with `INVITE_TOKEN_SECRET`, stored as hash in `invitations.token_hash`, expires in 72h.
- Recipient sets a password, gets a `users` row with the role specified in the invitation.
- Client role only sees `/portal/*` routes (Phase 4 surface, not built in M0).

### Hardening for Phase 1 launch

- **No public read-paths.** Every internal-ops route returns 401 unauth (or redirects to /login).
- **Rate-limit on /api/auth/login.** 5 attempts per IP per 15 min, returns 429. (Pory flagged this on the existing code yesterday; carry the fix forward.)
- **`secure: true` cookie in prod.** Already in `setSessionCookie`.
- **Env-var hygiene.** `JWT_SECRET` only on internal-ops service. `ADMIN_PASSWORD_HASH` only on internal-ops service. `ADMIN_EMAIL` not strictly secret but kept on internal-ops only.
- **CSP headers.** Strict CSP on internal-ops to block injection. Default-src self, frame-ancestors none, no inline scripts beyond Next's own.
- **Audit log table** (deferred to Phase 1.5): every state change writes an `audit_log` row (`who`, `what`, `when`, `before`, `after`). Costs ~100 lines of code. Surfaces in /audit-log later.

### Separate Postgres roles (per Pory cosign)

Same Postgres instance, three roles:

- `public_intake_role` — granted INSERT on `leads` only. Public-site connects with this. Cannot read `leads`, cannot touch any other table. Restricts blast radius if public-site is compromised.
- `ops_role` — full CRUD on application tables (`leads`, `clients`, `projects`, `tasks`, `events`, `audits`, `users`, `sessions`, `invitations`, `lead_notes`). Internal-ops connects with this.
- `migration_role` — DDL only (`CREATE`, `ALTER`, `DROP`). Used by `drizzle-kit migrate` during deploy bootstrap. Migration script reads `DATABASE_URL_MIGRATION` env var locally; not exposed to either runtime service.

If Railway-managed Postgres makes role splitting awkward (it's a managed service), document the limitation and re-evaluate when we cut over to self-hosted Postgres or promote to a dedicated DB host. Even on managed Postgres, separating users via `CREATE ROLE` SQL is supported — we just need the role-creation as part of the migration runbook.

### What's NOT in M0 security

- Multi-factor (deferred — add when first non-owner user joins)
- IP allowlist on internal-ops domain (overkill for single operator; add if Vessel travels and wants the extra gate)
- Hardware-key WebAuthn (long-term roadmap)

---

## 9. Phase breakdown with acceptance gates

### Phase 1 — Core ops dashboard (this M0 build)

**Acceptance gate:** all 10 of Vessel's MVP criteria green. Live on Railway. Vessel can sign in, see Today View, create + manage leads/clients/projects/tasks/events.

Estimated execution time post-greenlight: **~6-8 hours** of Jr foreman time. Heaviest cost is the dashboard UI surface (Today + 5 list/detail views).

### Phase 2 — Public site → internal-ops intake wire

Public-site `/book` form already POSTs to `/api/lead`. Refactor that handler to:

1. Import `@repo/db` and write to `leads` table directly (since both apps share the DB)
2. Set initial `status = 'new_lead'`, `next_follow_up_at = now() + 24h`
3. Auto-create a `tasks` row: `"Follow up with {name} ({business_name})"`, due tomorrow, priority=high
4. (Optional) Send Vessel a Discord notification via webhook on new intake

**Acceptance:** intake from /book lands as a Lead in /leads with an auto-generated follow-up Task on Today.

### Phase 3 — Audit workflow

Build the structured audit form per Vessel's spec. Add `/audits/new`, `/audits/[id]`. Expose "Run audit" CTA on Lead detail. Generate `audit_summary` markdown export for proposal prep.

### Phase 4 — Client project control

Project timeline view, deliverables checklist with progress bar, file/link attachments (URL list — no file upload yet, defer to Cloudflare R2 or Railway volumes when needed). Per-client view consolidating all artifacts.

### Beyond M0

- Multi-user invites
- Email notifications (Resend)
- Calendar sync (Google / iCal)
- AI summary on intake (deferred per zero-spend rule)
- Audit log table

---

## 10. What's NOT in M0

- AI features of any kind
- Email sending (Resend deferred)
- File uploads (URL list only)
- Calendar provider sync (manual entry only)
- Multi-user / invites
- Mobile app surface
- Public client portal
- Real-time updates (no websocket / SSE; polling on Today View if needed)

---

## 11. Open items requiring Vessel signoff

1. **Architecture:** monorepo with Turborepo + pnpm + shared `@repo/db` + `@repo/ui` packages. Confirm or push back.
2. **Domain:** `ops.conscienceos.com` for internal-ops. Confirm or pick a different subdomain.
3. **Public-site lead-write path (Phase 2 timing):** strip the existing `/api/lead` write logic in M0 (so public site has zero DB write authority temporarily) OR keep it writing to the shared DB during M0 as well. **Default recommendation:** keep it writing during M0 (prevents lead loss during migration); Phase 2 adds the auto-task and notification on top.
4. **Session expiry:** 7-day cookie matches what's deployed today. Confirm or adjust.
5. **Initial seed data:** seed Vessel's known prospect list on first deploy? If yes, share the list. Otherwise empty and start adding manually.
6. **Public-site cleanup:** approve full removal of `/app/*`, `/api/auth/*`, `/api/leads/*` from `apps/public-site/` (these have been live but auth-gated since yesterday).
7. **Branch strategy:** `m2/internal-ops-monorepo` against fork, then PR up to LOAWB once write access lands. Or different naming.

---

## 12. Execution sequence on greenlight

Single execution window, atomic-per-step:

1. (~30 min) Create monorepo skeleton, move public-site files
2. (~30 min) Extract `@repo/db`, refactor public-site to use it, smoke-test public site still serves
3. (~20 min) Strip CRM from public-site, redeploy clean public-site to Railway
4. (~30 min) Extract `@repo/ui` (minimal cut: wordmark, tokens, glass primitive)
5. (~60 min) Scaffold internal-ops app structure + middleware + auth pages, port login flow
6. (~120 min) Build Phase 1 MVP screens: Today + Leads + Clients + Projects + Tasks + Schedule + Audits
7. (~30 min) Provision `internal-ops` Railway service, set env, point Postgres reference, deploy
8. (~20 min) Smoke test full pipeline: public-site lead → internal-ops dashboard
9. (~20 min) Custom domain + DNS for `ops.conscienceos.com`
10. (~20 min) README + env docs + commit + push

Total: **~6 hours** if no surprises. Pory will flag landmines pre-flight to compress.

---

## Sources / receipts

- Vessel directive 2026-05-06 [PROJECT: CONSCIENCE-OS-INTERNAL] in `#conscience-os-app`
- Pory consult mode=design-cosign, response in `#porygon` (2026-05-06 — folded in below once received)
- Locked design system: `01-build-scope.md`, prior wordmark + ring + glass commits
- Railway monorepo guide: docs.railway.com/guides/monorepo (referenced for service Root Directory pattern)
