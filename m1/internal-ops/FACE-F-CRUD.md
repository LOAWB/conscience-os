# face-f Task Packet — Domain CRUD Modules

**Face:** face-f
**Project:** conscience-os-internal
**Lane:** Domain entity surfaces (leads, clients, projects, tasks, events, audits) + APIs + today-view data + audit export
**Codex:** pory-codex-conscience-internal-crud (proposed; assigns at face claim)
**Cosign cadence:** 4 (pre-flight + mid-execution + end-of-phase + pre-merge)
**Reference:** `m1/INTERNAL-OPS-M0-PLAN.md`, `m1/internal-ops/THREE-FACE-EXECUTION-PLAN.md`, `packages/db/src/schema.ts` (face-d artifact), `packages/ui/src/index.ts` (face-e artifact)

---

## Scope

Every domain entity surface inside internal-ops. List + detail + create + edit per entity. REST API per entity. Cross-cutting handlers for Today View data composition and quick-capture routing. Structured audit form + markdown export.

**Compose, do not duplicate.** Every visual primitive (`<StatusBadge>`, `<PriorityChip>`, `<FormField>`, `<EntityListLoading>`, `<EntityEmptyState>`, etc.) comes from `@repo/ui`. If a primitive is missing, file a request against face-e — never inline a one-off in a domain file.

**Compose, do not bypass schema.** All DB access goes through `@repo/db`. No raw SQL in route handlers. No direct Postgres connections. Schema enforces enums, FKs, NOT NULLs; route handlers use Zod-style runtime validation matching the schema and reject mismatches with 422.

---

## Entity dependency order (build in this sequence)

1. **Leads** — depends on `@repo/db` schema + `@repo/ui` primitives only
2. **Clients** — depends on Leads (lead → client conversion path)
3. **Projects** — depends on Clients (every project has `client_id`)
4. **Tasks** — depends on Clients + Projects + Leads (task can link to any of the three)
5. **Events** — depends on Clients + Projects + Leads
6. **Audits** — depends on Leads OR Clients (CHECK constraint: at least one)

After all 6 entities ship, build:

7. **`/api/today`** — composition endpoint
8. **`/api/quick-capture`** — multi-intent router

---

## Files this face creates

### API routes

```
apps/internal-ops/src/app/api/leads/route.ts                      ← GET list, POST create
apps/internal-ops/src/app/api/leads/[id]/route.ts                 ← GET one, PATCH, DELETE
apps/internal-ops/src/app/api/leads/[id]/notes/route.ts           ← GET list, POST create
apps/internal-ops/src/app/api/leads/[id]/convert/route.ts         ← POST convert lead → client

apps/internal-ops/src/app/api/clients/route.ts
apps/internal-ops/src/app/api/clients/[id]/route.ts

apps/internal-ops/src/app/api/projects/route.ts
apps/internal-ops/src/app/api/projects/[id]/route.ts
apps/internal-ops/src/app/api/projects/[id]/deliverables/route.ts ← PATCH deliverables jsonb

apps/internal-ops/src/app/api/tasks/route.ts
apps/internal-ops/src/app/api/tasks/[id]/route.ts
apps/internal-ops/src/app/api/tasks/[id]/complete/route.ts        ← POST quick-complete

apps/internal-ops/src/app/api/events/route.ts
apps/internal-ops/src/app/api/events/[id]/route.ts

apps/internal-ops/src/app/api/audits/route.ts
apps/internal-ops/src/app/api/audits/[id]/route.ts
apps/internal-ops/src/app/api/audits/[id]/export/route.ts         ← GET text/markdown

apps/internal-ops/src/app/api/today/route.ts                      ← GET aggregated dashboard data
apps/internal-ops/src/app/api/quick-capture/route.ts              ← POST multi-intent router
```

### UI surfaces

```
apps/internal-ops/src/app/(dashboard)/leads/page.tsx              ← list with status pipeline filter
apps/internal-ops/src/app/(dashboard)/leads/[id]/page.tsx         ← detail
apps/internal-ops/src/app/(dashboard)/leads/new/page.tsx          ← create form

apps/internal-ops/src/app/(dashboard)/clients/page.tsx
apps/internal-ops/src/app/(dashboard)/clients/[id]/page.tsx
apps/internal-ops/src/app/(dashboard)/clients/new/page.tsx

apps/internal-ops/src/app/(dashboard)/projects/page.tsx
apps/internal-ops/src/app/(dashboard)/projects/[id]/page.tsx
apps/internal-ops/src/app/(dashboard)/projects/new/page.tsx

apps/internal-ops/src/app/(dashboard)/tasks/page.tsx
apps/internal-ops/src/app/(dashboard)/tasks/new/page.tsx
                                                                  (no [id] page; use side panel on list view)

apps/internal-ops/src/app/(dashboard)/schedule/page.tsx           ← upcoming events
apps/internal-ops/src/app/(dashboard)/schedule/new/page.tsx       ← schedule new event

apps/internal-ops/src/app/(dashboard)/audits/page.tsx             ← list of completed audits
apps/internal-ops/src/app/(dashboard)/audits/new/page.tsx         ← structured form, depends on lead OR client param
apps/internal-ops/src/app/(dashboard)/audits/[id]/page.tsx        ← view + edit + export button
```

### Shared module utilities

```
apps/internal-ops/src/lib/validators/leads.ts                     ← Zod schemas matching DB schema
apps/internal-ops/src/lib/validators/clients.ts
apps/internal-ops/src/lib/validators/projects.ts
apps/internal-ops/src/lib/validators/tasks.ts
apps/internal-ops/src/lib/validators/events.ts
apps/internal-ops/src/lib/validators/audits.ts

apps/internal-ops/src/lib/queries/today.ts                        ← aggregated query for dashboard
apps/internal-ops/src/lib/exporters/audit-markdown.ts             ← markdown emitter for proposal prep
```

---

## API contract template (applies to all entities)

```
GET    /api/<entity>                   200 { items: T[], total: number }   ← list with optional ?status=&search=&sort=&limit=&offset=
GET    /api/<entity>/[id]              200 { item: T }   |   404 { error }
POST   /api/<entity>                   201 { item: T }   |   422 { error, issues: [...] }
PATCH  /api/<entity>/[id]              200 { item: T }   |   404 | 422
DELETE /api/<entity>/[id]              204                |   404
```

All routes guarded by `requireRole(['owner', 'operator'])` (face-d utility). Anonymous → 401. Wrong role → 403. Validation failure → 422 with Zod issues array.

---

## Today View data shape

`GET /api/today` returns one round-trip:

```ts
{
  counts: {
    open_leads: number;       // status NOT IN ('won','lost','archived')
    active_clients: number;   // status = 'active'
    active_projects: number;  // status NOT IN ('complete','support')
    overdue_tasks: number;    // status != 'done' AND due_date < now()
  },
  todays_tasks: Task[];       // status != 'done' AND due_date::date = today
  overdue_tasks: Task[];      // status != 'done' AND due_date < now()::date
  upcoming_events: Event[];   // date_time >= now() AND date_time < now() + 7d, ordered ASC
}
```

Implement as one Drizzle query with subqueries or N small parallelized queries via `Promise.all` — both acceptable. Pory mid-execution cosign reviews the choice.

---

## Quick-capture handler

`POST /api/quick-capture` body:

```ts
{ intent: 'task' | 'event' | 'lead-followup', text: string, due_at?: string, link_to?: { type: 'lead'|'client'|'project', id: string } }
```

Behavior:

- `intent === 'task'`: insert `tasks` row with `title = text`, `status = 'to_do'`, `priority = 'medium'`, `due_date = due_at || tomorrow at 9am`, link if specified
- `intent === 'event'`: insert `events` row with `title = text`, `type = 'follow_up'`, `date_time = due_at || tomorrow at 9am`, link if specified
- `intent === 'lead-followup'`: must have `link_to.type = 'lead'`. Updates `leads.next_follow_up_at = due_at || +24h`, appends to `lead_notes` with `body = text, author = 'QuickCapture'`

Returns `{ ok: true, redirect_to?: string }` (e.g., `/leads/[id]` for the followup case).

---

## Audit markdown export

`GET /api/audits/[id]/export` returns `text/markdown`:

```markdown
# System Audit — {{ business_name }}

**Date:** {{ created_at }}
**Lead/Client:** {{ name }} ({{ email }})

## Business overview

{{ business_overview }}

## Current tools

{{ current_tools }}

## Pain points

{{ pain_points }}

## Opportunities

{{ opportunities }}

## Recommended systems

{{ recommended_systems }}

## Next steps

{{ next_steps }}

---

_Generated by Conscience Os Internal Ops — {{ now }}_
```

This becomes the source for proposal drafting. Vessel copies to wherever the proposal lives.

---

## Lead pipeline + state machine

`leads.status` transitions are not strictly enforced at the DB level (open enum), but the UI guides them. Forward arrows shown by default; sideways/backwards available via `Other...` dropdown.

```
new_lead → contacted → audit_scheduled → audit_completed → proposal_sent → won
                                                                          → lost
                                                       → on_hold (any time)
```

`status = 'won'` triggers UI prompt: "Convert to client?" → `POST /api/leads/[id]/convert` creates a `clients` row with copied contact info, sets `leads.converted_client_id`, redirects to the new client detail.

`status = 'lost'` requires a reason in `notes` field (UI enforced, backend optional).

---

## Project deliverables UX

`projects.deliverables` is `jsonb` with shape `[{ label: string, done: boolean, due_at?: string }]`.

UI: checklist on project detail page with `<FormField>` per item + add-row button. Save persists via `PATCH /api/projects/[id]/deliverables`. Progress bar derived: `done.length / total.length`.

---

## Acceptance criteria

- [ ] All 6 entity API routes implement GET-list, GET-one, POST, PATCH, DELETE
- [ ] All API routes return correct status codes (401/403/404/422 plus success)
- [ ] All API routes validate input via Zod, reject malformed bodies with 422 + issues
- [ ] All entity list pages render against `@repo/ui` primitives (no inline status badges or priority chips)
- [ ] All entity detail pages render with correct linked entities (project → client name, task → linked entity, etc.)
- [ ] All create/edit forms use `<FormField>` from `@repo/ui` exclusively
- [ ] Lead pipeline state-machine UI works: forward arrows + Other dropdown
- [ ] Lead → client conversion creates clients row + sets `converted_client_id`
- [ ] Project deliverables checklist persists via PATCH and renders progress correctly
- [ ] Task quick-complete works without leaving the list page
- [ ] Schedule view shows upcoming events ordered by `date_time` ASC
- [ ] Audit form captures all six structured fields, supports edit, generates markdown export
- [ ] `/api/today` returns counts + tasks + upcoming events in one round-trip with reasonable performance (<200ms on Railway Postgres at <10k rows total)
- [ ] `/api/quick-capture` correctly routes all 3 intents
- [ ] Empty state + loading state + error state shown on every list view via `@repo/ui` primitives
- [ ] No primitive duplicated from face-e — verify by grep for inline color tokens, status string maps, priority enums in face-f files
- [ ] All routes return 401 unauthenticated, 403 wrong-role, 200/404/422 with valid auth

---

## Schema requirements list (for face-d)

Confirm the following columns exist in `@repo/db` schema before face-f starts:

- `leads.next_follow_up_at` (timestamptz NULL)
- `leads.converted_client_id` (uuid FK → clients(id) NULL)
- `leads.business_name` (renamed from `business`)
- `leads.phone` (text NULL)
- `clients.important_links` (jsonb default `'[]'`)
- `projects.deliverables` (jsonb default `'[]'`)
- `tasks.lead_id` (uuid FK → leads(id) NULL)
- `events.duration_minutes` (int default 30)
- `events.lead_id` (uuid FK → leads(id) NULL)
- `audits` table with CHECK constraint `(lead_id IS NOT NULL) OR (client_id IS NOT NULL)`

If any are missing, file a delta against face-d before starting the affected entity.

---

## Pory cosign triggers (4)

1. **Pre-flight:** before any code runs, Pory reviews this packet against the M0 plan + face-d's schema artifact + face-e's primitive publish list.
2. **Mid-execution:** triggered after Leads + Clients + Projects modules ship (50% of entities). Pory checks API contract consistency, validator-vs-schema alignment, primitive composition (no duplications), and the `/api/today` query plan.
3. **End-of-phase:** after all 6 entities + `/api/today` + `/api/quick-capture` ship, Pory reviews against acceptance criteria.
4. **Pre-merge:** Pory reviews unified PR diff for cross-face issues (schema drift, primitive duplication, security gaps in route guards).

---

## Stage timing

- Stage 1+2 (waiting on face-d schema and face-e primitives): use to read M0 plan + finalize Zod validators + draft API stubs
- Stage 3 (modules execution): ~3-4 hours active work
- Stage 4 (integration smoke share): ~30 min
- **Total face-f engaged time: ~4-5 hours wall-clock**

---

## Risks specific to face-f

- **Schema drift mid-build.** If a column isn't in the schema, face-f files a delta to face-d rather than working around it. Adds ~10 min round-trip but prevents bad data shapes.
- **Validator divergence.** Zod schemas in `apps/internal-ops/src/lib/validators/` must mirror Drizzle schema. Generate Zod from Drizzle if `drizzle-zod` is added; otherwise document the manual parity.
- **Today View N+1.** A naive `/api/today` implementation could fan out queries. Use one query with subqueries OR `Promise.all` of independent counts. Pory mid-execution cosign reviews.
- **Lead-conversion atomicity.** Lead → client creation should be a transaction (insert client + update lead in one `BEGIN/COMMIT`). Drizzle supports this; use `db.transaction(...)`.
- **Audit markdown encoding.** User content can contain markdown control chars. Escape `*`, `_`, `#`, `[`, `]`, `(`, `)`, `\` in text fields when emitting markdown export.

---

## Handoff signals from this face

- After Leads + Clients + Projects modules ship: post `[TYPE: ACTION] face-f mid-checkpoint, half of entities live` to `#conscience-os-app`
- After all 6 entities + cross-cutting handlers ship: post `[TYPE: MILESTONE] face-f modules green, ready for integration` with link to all 6 routes

---

## Substrate engagement

- Face state: `~/.consciousos/state/faces/face-f.json` (created at claim)
- Receipts: every cosign result logs to `~/.consciousos/logs/receipts.jsonl`
- Discord: status posts as `Jr` to `#conscience-os-app` (one Jr session per face; this is face-f's session, distinct from face-d's and face-e's)
- Claim command on greenlight:
  ```bash
  ~/.consciousos/scripts/shadow-face-assign.sh face-f \
    --project conscience-os-internal \
    --lane "domain CRUD modules + REST API + today-view data + audit export" \
    --codex-scope "API contract review + validator-schema alignment + primitive-composition audit + audit-export markdown review" \
    --codex-id pory-codex-conscience-internal-crud \
    --task-packet ~/projects/conscience-os/m1/internal-ops/FACE-F-CRUD.md
  ```
