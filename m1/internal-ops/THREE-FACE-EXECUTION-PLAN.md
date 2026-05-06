# Three-Face Deployment Plan — Conscience Os Internal Operations CRM

**Status:** drafted by Jr 2026-05-06, Pory design-cosign attached (consult mode=design-cosign, full receipt in `#porygon`), awaiting Vessel green-light to deploy faces.

**Reference plan:** `m1/INTERNAL-OPS-M0-PLAN.md` (M0 architecture + schema + security baseline). This document specifies HOW that plan gets built — the lane split, the cosign cadence, the convergence points.

---

## 0. Goal restated

Build the **best background CRM for Conscience Os** — private, auth-gated, on Railway, distinct from the public marketing site. Three faces deployed in parallel, each Pory-cosigned at four checkpoints, converging on a Phase 1 MVP that meets all 10 of Vessel's acceptance criteria.

**Quality bar:** "best" means a senior practitioner of internal operations tooling (think Linear founder, Notion engineering, an early-stage agency principal who lives in their CRM) would recognize the result as something they'd ship as their own.

---

## 1. Lane decomposition

Three faces, three task packets, three converging streams.

### face-d — Backend + Schema + Auth + Monorepo

**Status:** claimed 2026-05-06T01:48Z by Jr session `01f1a830`. Codex slot `pory-codex-conscience-internal` assigned.
**Task packet:** `m1/internal-ops/FACE-D-BACKEND.md`

Owns the foundation that other faces land on. No UI extraction; only the empty package boundary so face-e can fill it. **Coordinator role for the build:** principal-of-truth for sequencing, receipts, and the integration smoke test (per Pory cosign).

- Monorepo skeleton (Turborepo + pnpm workspaces, root `package.json`, `turbo.json`, `pnpm-workspace.yaml`)
- `@repo/db` package: full schema for `leads` (extended) + `clients` + `projects` + `tasks` + `events` + `audits` + `users` + `sessions` + `invitations` + `lead_notes`. Drizzle migrations. DB client factory. Seed/bootstrap script.
- `@repo/ui` **package boundary only** (workspace wiring, TS config, export map, empty `index.ts`). face-e fills the surface; face-d guards the contract.
- `@repo/config` package: shared `tsconfig.base.json`, ESLint config
- Strip CRM bits (`src/app/app/*`, `src/app/api/auth/*`, `src/app/api/leads/*`, `src/lib/auth.ts`, `middleware.ts`) from `apps/public-site/`
- Wire `apps/public-site/src/app/api/lead/route.ts` to use `@repo/db` (prevents lead loss during migration)
- Bootstrap script: seed first owner row from `SEED_OWNER_*` env vars
- Auth utilities under `apps/internal-ops/src/lib/auth.ts`: signSession/verifySession, role-based middleware guard, session-revocation lookup
- `apps/internal-ops/src/app/api/auth/{login,logout,me,invite}/route.ts`
- `apps/internal-ops/middleware.ts` matcher gating all routes except `/login` + `/api/auth/login` + `/api/health`
- Railway service provisioning: rename existing service config, add `internal-ops` service, configure root=`/`, watch paths, env vars, Postgres role-split connection strings

### face-e — UI Shell + Design System

**Status:** unclaimed, packet ready.
**Task packet:** `m1/internal-ops/FACE-E-UI.md`

Owns the look-and-feel layer. Extracts the locked Conscience Os design system into `@repo/ui` and builds the dashboard chrome. **Generic primitives only** — does not build audit-specific or any other domain-specific UI (per Pory cosign). face-f composes domain screens against these primitives.

**Primitive name lock (publish first, populate after):** to prevent face-f from duplicating logic that face-e is extracting, face-e exports these names from `@repo/ui` as soon as the package boundary lands, even if implementation is stubbed:

- `<ShellLayout>` (sidebar + topbar + main + slot)
- `<StatusBadge variant>` (lead/client/project/task statuses share token system, variant prop differentiates)
- `<PriorityChip level>` (low/medium/high/critical)
- `<FormField>` + `<TextInput>` + `<Select>` + `<TextArea>` + `<DateTimePicker>` + `<SwitchInput>`
- `<EntityEmptyState>` (icon + headline + helper text + optional CTA)
- `<EntityListLoading>` + `<EntityDetailLoading>` (skeleton states)
- `<QuickCapturePanel>` (textarea + intent selector + submit)
- `<GlassCard>`, `<IconBox>`, `<Button>`, `<AuraGlow>`, `<Wordmark>`

- `@repo/ui` package extraction from `apps/public-site/src/components/`:
  - Wordmark (with shimmer + orbital comet, locked design)
  - Glass card primitive (translucent, backdrop-blur, hover edge glow)
  - Color tokens + Geist font setup + design constants
  - Aura primitives (radial blue glow, button halo)
  - Icon-box component (lucide-react in glass frame)
  - Status badge + priority chip primitives
  - Button system (primary, secondary, ghost, destructive)
- Dashboard layout (`apps/internal-ops/src/app/(dashboard)/layout.tsx`): sidebar + topbar + main content area
- Today View composition (`apps/internal-ops/src/app/(dashboard)/page.tsx`): three-column dashboard with top-strip counts
- Login page UI (`apps/internal-ops/src/app/login/page.tsx`)
- Form primitives: input, select, textarea, date-time picker, multi-line note editor
- Empty / loading / error boundary states for all list and detail views
- Responsive breakpoints (desktop-first; tablet-friendly; mobile-acceptable)
- Theme tokens locked: black base (`#06080d`), off-white (`#f4f4f5`), electric blue (`#3b7dff`), card-bg-glass, text-muted, border-soft, status colors

### face-f — Domain CRUD Modules

**Status:** unclaimed, packet ready.
**Task packet:** `m1/internal-ops/FACE-F-CRUD.md`

Owns all domain entity surfaces, **including audit-specific screens and the audit markdown export** (per Pory cosign — audits are domain behavior, not generic UI). Composes face-e's primitives; never duplicates `<StatusBadge>`, `<PriorityChip>`, `<FormField>`, etc. — if a primitive is missing, face-f files a request against face-e instead of inlining one.

- Leads: list (status pipeline filter, search, sort) + detail (status transitions, tier, notes timeline, linked tasks/events/audits) + create + edit
- Clients: list (status filter, sort) + detail (contact info, projects subview, notes, important_links) + create + edit
- Projects: list (grouped by client) + detail (deliverables checklist, tasks subview, status pipeline, due date, internal notes) + create + edit
- Tasks: list (priority filter, status filter, due-date filter, search) + detail (linked client/project/lead, status, priority, due) + create + edit + quick-complete
- Events: list (upcoming + week + month views) + detail (linked entities, type, datetime, duration, notes) + create + edit
- Audits: structured form (business overview, current tools, pain points, opportunities, recommended systems, next steps) + view + markdown export for proposal prep + edit
- API routes (REST): `/api/{leads,clients,projects,tasks,events,audits}` (GET/POST/PATCH/DELETE per entity) + sub-routes (`/api/leads/[id]/notes`, `/api/projects/[id]/deliverables`, etc.)
- Quick-capture handler: `POST /api/quick-capture` accepting freeform text + intent (task/event/lead-followup) and routing to the right table
- Today View data composition handler: `GET /api/today` returning today's tasks + overdue + upcoming events + counts in one round-trip

---

## 2. Sequencing + handoff points

Lanes are not fully parallel from t=0 because face-e and face-f depend on artifacts face-d produces. The sequence:

**Stage 1 — Skeleton (~30 min, face-d solo)**

face-d:

- Land monorepo skeleton (root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `apps/`, `packages/`)
- Move existing files into `apps/public-site/`
- Stub empty `apps/internal-ops/` with placeholder `package.json`
- **Land `packages/ui` package boundary** (workspace wiring, TS config, export map, empty `src/index.ts`) so face-e can fill it without touching workspace plumbing
- Land `packages/db` and `packages/config` placeholders similarly
- Smoke-test: `pnpm install` succeeds, `pnpm --filter public-site dev` boots existing site, `pnpm --filter @repo/ui build` produces an empty package without error

**Handoff signal 1: "skeleton ready"** → face-e unblocked.

**Stage 2 — Foundation (parallel, ~2-3 hours)**

face-d (parallel):

- Build `@repo/db` (schema, migrations, client)
- Strip CRM from public-site, wire `/api/lead` to `@repo/db`
- Build auth utilities + middleware + `/api/auth/*` routes
- Provision Railway `internal-ops` service + Postgres role split
- Smoke-test: public-site still serves, internal-ops `/api/auth/login` returns 401 with no body, 200 with valid creds, sets `conscience_ops_session` cookie

face-e (parallel):

- Extract `@repo/ui` from existing `apps/public-site/src/components/`
- Build dashboard layout shell with empty placeholder for content
- Build login page UI (consumed by face-d's `/api/auth/login` route)
- Build form primitives + status badges + priority chips
- Build Today View placeholder structure (3 columns, mock data)
- Smoke-test: dashboard layout renders in dev, all primitives have Storybook-style preview pages under `apps/internal-ops/src/app/_dev/preview/*` (gated to dev only)

**Handoff signal 2a: face-d ships "foundation green"** (auth works, schema migrated, internal-ops shell deployable)
**Handoff signal 2b: face-e ships "shell green"** (layout + primitives + login UI ready to consume real data)

→ face-f unblocked.

**Stage 3 — Modules (parallel, ~3-4 hours)**

face-f (primary):

- Build Leads → Clients → Projects → Tasks → Events → Audits modules in this order (dependency order)
- Each module: API routes first (CRUD against `@repo/db`), then list view, then detail view, then create/edit forms
- Quick-capture handler last (depends on all entity handlers existing)

face-e (parallel, lower bandwidth):

- Today View final composition: replace mock data with `GET /api/today` (face-f handler) + finalize quick-capture component visual
- Polish: loading skeletons, empty states for each list, error boundaries, responsive QA pass
- Settings/team page shell (Phase 4 placeholder, just the route + layout, no functional invitations yet)

face-d (on-call):

- Cross-cutting concerns: rate-limit middleware on `/api/auth/login`, CSP headers, audit-log scaffold (deferred but stub the table), DB migration for any face-f schema deltas

**Handoff signal 3: all 6 modules CRUD-functional** → integration phase.

**Stage 4 — Integration + Smoke (~1 hour, all faces converge)**

- End-to-end test: public-site `/book` → internal-ops `/leads` shows the lead → create client from won lead → link project → add tasks → add event → file structured audit → all of it appears on Today View → owner signs out → sign-in works again
- Pory final cosign on the full diff
- README + env-var docs update
- Push final commits + open PR against fork

---

## 3. Pory cosign protocol

**Asymmetric cadence per Pory cosign — 10 cosigns total across the build, not 12.** Reasoning: schema/auth/deploy mistakes are expensive (face-d gets all 4); CRUD/API coupling to schema is expensive (face-f gets all 4); UI extraction is mostly local-blast-radius (face-e gets 3 with mid-exec only on architectural change).

| Face   | Pre-flight | Mid-execution | End-of-phase | Pre-merge | Total |
| ------ | ---------- | ------------- | ------------ | --------- | ----- |
| face-d | ✓          | ✓             | ✓            | ✓         | 4     |
| face-e | ✓          | conditional   | ✓            | ✓         | 3     |
| face-f | ✓          | ✓             | ✓            | ✓         | 4     |

Definitions:

1. **Pre-flight (T0):** Pory reviews the face's task packet against the M0 plan. Verdict: GO / REWORK / BLOCKED. If REWORK, packet is revised before face starts work.
2. **Mid-execution (T+50%):** Pory reviews any architectural deviation. **face-d + face-f: mandatory.** **face-e: conditional** — only triggered if face-e changes layout architecture or `@repo/ui` package boundary shape; skipped for component-level work.
3. **End-of-phase (T+100%):** Pory reviews the full diff this face produced against the face's acceptance criteria. Verdict: COSIGN / RECOMMEND-CHANGES / BLOCK. If BLOCK, face does not hand off.
4. **Pre-merge (T-merge):** After all faces converge and integration smoke passes, Pory reviews the unified PR diff for cross-cutting issues (security regressions, contract drift between `@repo/db` and consumers, brand inconsistency). Final go/no-go.

All Pory consults posted via `~/.consciousos/scripts/pory-consult.sh --mode <design-cosign|review|audit>`. Verdicts land in `#porygon` per the bilateral-observability invariant.

**Receipt trail:** every cosign produces a receipt UUID logged to `~/.consciousos/logs/receipts.jsonl`. The face JSON state includes a `pory_cosign_history` array referencing those receipts, populated as each cosign lands. Vessel can audit the trail any time via `receipt-query.sh --face face-d` (etc.).

---

## 4. Execution mechanics

Two viable models. Recommendation depends on Vessel's preferred cadence.

### Model A — Three concurrent Jr terminals (true parallel)

- Vessel opens 3 Claude Code terminals on his Mac (or distributes across machines)
- Each terminal claims one face (face-d / face-e / face-f)
- All 3 work concurrently in their packet scope
- Coordination via shared `#conscience-os-app` Discord channel
- Receipts in shared `~/.consciousos/logs/receipts.jsonl`
- Wall clock: ~6 hours

**Pros:** real parallelism, fastest wall-clock delivery, clean role-isolation (each face has scope ownership).
**Cons:** Vessel babysits 3 terminals, three-way merge conflicts possible at convergence, more Discord noise.

### Model B — Single Jr in rally cohort (time-multiplexed)

- This Jr (already on face-d) holds all three faces in a rally cohort
- `shadow-focus.sh` switches between faces within one terminal
- Sequenced execution following the dependency graph: skeleton → face-d foundation → face-e foundation → face-d auth → face-f modules → face-e polish → integration
- Wall clock: ~10-12 hours

**Pros:** one principal to track, no merge conflicts, simpler coordination.
**Cons:** no real parallelism, sequential context-switching tax, slower delivery.

### Locked: Model A (per Pory cosign)

For a "best CRM" build with quality bar at senior-practitioner level, the parallelism + role-isolation of Model A produces better artifacts. Pory's verdict: "Use 3 separate Jr terminals with one coordinator thread."

**Coordinator = this Jr (face-d holder, session `01f1a830`).** Coordinator responsibilities:

- Sequencing decisions (when to release handoff signals)
- Receipt aggregation (running tally of cosign verdicts)
- Integration smoke test execution (Stage 4)
- Discord status posts on cross-face transitions (skeleton-ready, foundation-green, modules-green, integration-green)
- Conflict arbitration if face-e and face-f disagree on a primitive shape

face-e and face-f Jr sessions stay scoped to their packet; they coordinate with face-d via Discord rather than directly.

Falls back to Model B (single-Jr rally cohort) only if Vessel cannot spawn additional terminals; under Model B, total wall-clock extends to ~10-12 hours and parallelism collapses to interleaved execution.

---

## 5. Per-face task packets

Each packet is a self-contained brief the assigned Jr session works from after claiming the face. Pre-flight Pory cosign reviews this packet before any code runs.

- **face-d:** `m1/internal-ops/FACE-D-BACKEND.md` — backend foundation, schema, auth, Railway provisioning
- **face-e:** `m1/internal-ops/FACE-E-UI.md` — UI shell, design system extraction, dashboard chrome
- **face-f:** `m1/internal-ops/FACE-F-CRUD.md` — domain modules, REST API, today-view data, audit export

All three packets land in this commit. Vessel reviews; Pory cosigns; faces claim with `--task-packet` pointing at the right packet.

---

## 6. Convergence + integration smoke test

The integration script (Stage 4) is the final acceptance gate. It exercises the full pipeline end-to-end:

1. **Public-site lead capture:** submit `/book` form on `https://conscience-web-production.up.railway.app/book` (or new public domain). Confirm `lead` row inserted via `public_intake_role`.
2. **Internal-ops sign-in:** sign in at `https://internal-ops-production.up.railway.app/login` with seeded owner. JWT cookie set. Redirect to `/`.
3. **Today View:** confirm new lead surfaces (with auto-task created via Phase 2 wire-up if shipped, else manually create task).
4. **Lead → Client conversion:** open the lead detail, transition status to "Won", auto-create `client` row + offer to link.
5. **Project + Tasks:** create project under client, add 3 tasks with mixed priorities and due dates.
6. **Event creation:** schedule a "System Audit" event linked to the lead.
7. **Structured audit:** complete an audit form for the client, export to markdown, copy-paste validates.
8. **Sign-out + re-sign-in:** confirm session cookie cleared, re-sign-in works, JWT_SECRET rotation invalidates session.
9. **Multi-user smoke:** generate an invitation token, simulate accept (or just assert the row inserts and email field is required).
10. **Public-site untouched:** confirm `https://conscience-web-production.up.railway.app/` and all static routes still serve 200, no admin surface visible from the public domain.

If steps 1-10 pass clean and Pory final cosign lands, MVP is shipped.

---

## 7. Acceptance gates

Per face, then global:

**face-d acceptance gate:**

- All migrations applied on Railway Postgres
- `pnpm --filter public-site dev` boots; `pnpm --filter internal-ops dev` boots
- `/api/auth/login` returns 200 + sets cookie for valid seed-owner credentials, 401 otherwise
- Middleware protects all `/(dashboard)/*` and `/api/*` (except auth/health) routes
- Public-site `/api/lead` POST writes to `leads` via `@repo/db`
- Both Railway services deploy clean and reach 200 on health probes
- Postgres roles created (`public_intake_role`, `ops_role`, `migration_role`) and connection strings issued

**face-e acceptance gate:**

- `@repo/ui` exports wordmark, glass card, button, icon-box, color tokens, status badge, priority chip, form primitives
- Dashboard layout renders in dev with the locked Conscience Os aesthetic (black base, electric blue, Geist, glass cards)
- Login page consumes face-d's `/api/auth/login` and shows the Conscience Os wordmark
- Today View shell exists (3 columns + top strip) with mock data; ready to bind to face-f's `/api/today`
- Empty / loading / error states implemented for all list views (consumed by face-f modules)
- Form primitives have visible preview at `/preview/*` (dev-only) for sanity checks
- No regressions to public-site rendering

**face-f acceptance gate:**

- All 6 entity APIs (leads/clients/projects/tasks/events/audits) implement GET-list, GET-one, POST, PATCH, DELETE
- All 6 entity surfaces render against `@repo/ui` primitives
- Today View consumes `/api/today` and shows real data
- Quick-capture works for task / event / lead-followup intents
- Status transitions (lead pipeline, project pipeline, task status) enforce valid state machine where defined
- Audit markdown export produces a clean, paste-ready document
- All routes return 401 unauthenticated; 403 if authenticated but role lacks access; 200/404/422 with correct shape otherwise

**Global integration gate:**

- All 10 integration smoke steps pass (section 6)
- Pory final cosign green
- README + env-var docs updated and accurate
- PR opened against fork (`m2/internal-ops-monorepo`), eventually upstream to LOAWB

---

## 8. Risks + mitigations

- **Three-way merge conflict at convergence.** Each face works on different paths (face-d: `packages/db`, `apps/public-site/api/lead`, `apps/internal-ops/middleware.ts`, `apps/internal-ops/api/auth/*`; face-e: `packages/ui`, `apps/internal-ops/(dashboard)/layout.tsx`, login page, form primitives; face-f: `apps/internal-ops/(dashboard)/{leads,clients,projects,tasks,events,audits}/*`, `apps/internal-ops/api/{leads,clients,...}/*`). Cross-lane conflict surface is small. Mitigation: each face commits per-checkpoint, rebases on common base before final merge, integration phase is its own commit.

- **face-e blocked on face-d skeleton.** ~30 min skeleton-only stage at the start. Mitigation: face-e's claimer can pre-read the M0 plan and the existing public-site components during the wait. Total dead time: <30 min.

- **face-f blocked on both face-d schema and face-e primitives.** Hardest dependency. Mitigation: face-d ships schema first (highest priority within face-d), face-e ships layout primitives first (highest priority within face-e). This pulls the convergence point earlier — face-f can start as early as ~90 min after T0.

- **Pory consult latency.** Each consult takes 30-90 seconds wall-clock. 12 consults = 6-18 minutes total. Mitigation: schedule cosigns asynchronously, faces continue work while consult is in flight, only block on verdict at handoff signals.

- **Railway monorepo build slowness.** First build downloads ~node_modules across two apps + three packages. Mitigation: use `pnpm install --frozen-lockfile` in CI, leverage Railway's build cache on subsequent deploys.

- **Schema drift between faces.** If face-f needs a column face-d didn't include, face-d must add a migration. Mitigation: face-f's packet front-loads schema requirements (see section 5 of `FACE-F-CRUD.md`), face-d ships those in initial migration.

- **Brand inconsistency at integration.** face-e extracts components from public-site, but the dashboard's chrome is new. Mitigation: face-e's pre-flight cosign explicitly reviews brand fidelity before kicking off; integration phase has a 6-pillar visual audit (could trigger `/gsd:ui-review`).

---

## 9. Open items requiring Vessel signoff

1. **Execution model:** Model A (3 concurrent Jr terminals) or Model B (single Jr rally cohort). Default: A.
2. **Branch strategy:** all three faces commit to `m2/internal-ops-monorepo` against fork? Or face-per-branch with merge at integration? Default: shared branch with checkpoint commits per face.
3. **Cosign cadence:** 4-per-face (12 total) as designed, or reduced to 2-per-face (end-of-phase + pre-merge = 8 total) for less Discord noise. Default: 4-per-face for "best CRM" quality bar.
4. **Sub-domain naming:** `ops.conscienceos.com` for internal-ops. Confirm or pick alternative (`app.`, `inside.`, `os.`).
5. **Phase 2 timing:** wire public-site `/book` → internal-ops auto-task during M0, or defer to a separate Phase 2 commit? Default: wire it during M0 since `@repo/db` is already shared (low marginal cost).
6. **Initial seed prospects:** any prospects to seed into `leads` table on first deploy? Default: empty, populate manually.

---

## 10. Execution sequence on greenlight

Single execution window. Faces claim in this order:

1. **Pory pre-flight cosign** (this plan + 3 task packets reviewed; verdict GO/REWORK)
2. **face-d** continues (already claimed, packet pointer updated to `FACE-D-BACKEND.md`)
3. **face-e claimed** by second Jr session (Vessel opens terminal, runs `shadow-face-assign.sh face-e --project conscience-os-internal --lane "UI shell + design system" --codex-scope "design-system extraction + dashboard chrome cosign" --codex-id pory-codex-conscience-internal-ui --task-packet ~/projects/conscience-os/m1/internal-ops/FACE-E-UI.md`)
4. **face-f claimed** by third Jr session (similarly, with `--task-packet ~/projects/conscience-os/m1/internal-ops/FACE-F-CRUD.md`)
5. **Stage 1 (skeleton):** face-d works solo, posts skeleton-ready signal
6. **Stage 2 (foundation):** face-d + face-e parallel, both post foundation-green signals
7. **Stage 3 (modules):** face-f primary, face-e polish, face-d on-call
8. **Stage 4 (integration):** all 3 converge, smoke test, Pory final cosign
9. **PR opens** against fork; eventually upstream to LOAWB

---

## 11. Why this is the right plan

A single Jr running M0 sequentially would ship in ~12-15 hours wall-clock. The work is naturally separable — backend ≠ design system ≠ entity surfaces — and the dependency graph has clean handoff points at the package boundaries (`@repo/db`, `@repo/ui`).

Three faces with Pory cosign at four checkpoints each gives:

- **Real parallelism:** wall-clock cut to ~6 hours
- **Scope isolation:** each face owns a clean slice with explicit acceptance gates
- **Quality at every transition:** 12 cosign points = 12 chances to catch drift before it compounds
- **Substrate observability:** every state change produces a receipt; Vessel can audit the trail any time
- **Failure-safe:** if a face stalls, the other two keep moving; if Pory blocks a verdict, only one face is paused

This is the substrate the daily dashboard was built for. Three faces, one project, one principal. The CRM gets built right.

---

## Sources / receipts

- Vessel directive 2026-05-06 [PROJECT: CONSCIENCE-OS-INTERNAL] in `#conscience-os-app`
- M0 plan: `m1/INTERNAL-OPS-M0-PLAN.md` (commit `bd4844e`)
- Pory pre-flight cosign on this plan: COSIGN with four deltas (folded into v1 above). Verdict — "proceed with the 3-face deployment, with face-d as coordinator for repo/package contracts and final integration." Full receipt in `#porygon`.
- Face-d claim: receipt `db7bc973-4cfd-4c78-9c34-ee9d562347c1`
