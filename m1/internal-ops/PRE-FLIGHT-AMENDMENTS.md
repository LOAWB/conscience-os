# Pre-flight Amendments — face-e + face-f

**Status:** coordinator arbitration after both Pory pre-flight cosigns came back REWORK on 2026-05-06. Folds Pory's deltas into the packets without rewriting them. face-e and face-f read this document alongside their packets, then re-run pre-flight cosign.

**Verdicts logged:**

- face-e pre-flight: REWORK at `~/.consciousos/logs/pory-consult-raw/20260506T041631Z-face-e:pre-flight.txt`
- face-f pre-flight: REWORK at `~/.consciousos/logs/pory-consult-raw/20260506T041700Z-pory-consult.txt`

**Substrate-side observation:** invariant #6 ("no two faces on same project_id concurrently except in valid rally cohort") forced face-f to claim under `project_id=conscience-os-internal-crud`. We accept this fragmentation: each face owns a distinct `-ui` / `-crud` project_id slug; logical unity is in the master plan + this amendments doc + the shared `m1/internal-ops/` packet directory. Coordinator (face-d) stays on the canonical `conscience-os-internal` project_id.

face-e should claim under `project_id=conscience-os-internal-ui` (matching face-f's pattern).

---

## face-e amendments (5 items)

### A1. Expand the @repo/ui publish list — 23 additional primitives

The original 27-name lock was too thin. Pory called out that face-f will be forced to inline duplicates without these. Add to `@repo/ui` exports:

- Layout / chrome: `PageHeader`, `SectionHeader`, `ActionBar`
- List surfaces: `SearchInput`, `FilterTabs`, `SortSelect`, `Pagination`, `DataList` (preferred over `DataTable` for the "operational command center" feel — denser rows, less chrome)
- Detail surfaces: `DetailPanel`, `DetailField`, `Tabs`, `Drawer`
- Modal / dialog: `Modal`, `ConfirmDialog`, `DropdownMenu`
- Form additions: `IconButton`, `CheckboxInput`
- Data-rendering: `ProgressBar`, `Checklist`, `Timeline`, `NoteComposer`
- Notifications: `Toast`, `InlineNotice`

**Name-lock (per Pory round-2 cosign on face-f):** the names above are exact `@repo/ui` exports. Earlier "or" alternatives are dropped. Use `FilterTabs` not `SegmentedControl`. Use `Drawer` not `SidePanel`. Both `Toast` and `InlineNotice` ship: `Toast` for transient (timed dismiss) notifications, `InlineNotice` for persistent contextual banners (e.g., the demo-data label in section A4).

Combined with the original 27, the locked publish list is now **50 primitives**. face-e exports them as stubs first (so face-f never sees a missing import during the parallel build window), then fills implementations during Stage 3.

Highest-risk omissions to ship first (face-f waits on these): `DataList`, `SearchInput`, `FilterTabs`, `Modal`, `ConfirmDialog`, `Checklist`, `ProgressBar`, `Timeline`, `NoteComposer`, `DetailPanel`, `DetailField`, `Tabs`.

### A2. `cn` utility ownership

`packages/ui/src/lib/cn.ts` exports `cn(...args)` backed by `clsx` + `tailwind-merge`. `@repo/ui` re-exports it from the package root. Public-site stops referencing `apps/public-site/src/lib/utils.ts` and starts importing from `@repo/ui`. NO `@repo/ui` code may import from any `apps/*` path.

### A3. Brand-fidelity extraction order

1. Copy current public-site components (`conscience-mark.tsx`, `hero-ring.tsx`, `site-nav.tsx`, glass card primitive, etc.) byte-close into `@repo/ui` — preserve every CSS animation + shadow + token.
2. Tokenize: replace inline color literals with `tokens.colors.*` references where the value is canonical.
3. Both apps import from `@repo/ui` (public-site rewrites its imports to consume the package).
4. Run `pnpm --filter public-site build`. Open the deployed Railway URL in a browser, screenshot 3 pages: `/`, `/work-together`, `/case-study`.
5. Compare screenshots with pre-extraction reference (face-e captures pre-state before step 1).
6. ONLY after that pass: delete the original component files from `apps/public-site/src/components/`.

If any visual diff between pre and post (more than anti-aliasing-level): revert step 6, investigate, fix in `@repo/ui`, re-screenshot, re-confirm.

### A4. Demo data labeling on Today View shell

Until face-f ships `/api/today`, the Today View renders mock data. Mock rows MUST be visibly labeled:

- Top of the panel: a small `<InlineNotice variant="info">` banner saying "Sample data — internal-ops Today wires to /api/today in Stage 3."
- Each mock row: italic + opacity 0.55 + a "demo" badge in the corner.
- Once `/api/today` is live and returns real data, the banner and demo badges disappear automatically.

This satisfies Vessel's hard rule #2 ("No fake business data presented as real") at every render moment.

### A5. `_dev/preview` route security

The preview page at `apps/internal-ops/src/app/_dev/preview/page.tsx` MUST NOT be reachable in production:

```ts
import { notFound } from "next/navigation";

export default function PreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  // ... preview content
}
```

Plus: `apps/internal-ops/middleware.ts` must NOT add `/preview` or `/_dev/*` to PUBLIC_PATHS. The route is auth-gated by default (matches the dashboard tree pattern); the runtime check above is a second line of defense.

---

## face-f amendments (10 items)

### F1. API route count

The packet's "Files this face creates" lists 16 surfaces but counts to **19 route files** (re-counting the explicit list including notes, convert, complete, deliverables, export). The packet narrative said "16"; the file list is correct. Update the count to 19 in the packet narrative. No file-list change.

### F2. Tasks detail surface (clarify)

Packet currently says "no [id] page; use side panel on list view". Lock that as the canonical implementation:

- Tasks list page renders `<TaskRow>` instances. Click → opens `<Drawer>` (face-e primitive) on the right with task detail + edit form. No URL change.
- This is the "operational command center" pattern — operators stay in the list while editing tasks. Avoids context loss.
- If a task needs to be linked-to externally, generate a permalink that opens the list with the side panel pre-opened (`/tasks?open=<id>` query param).

### F3. Events detail surface (add)

The packet had no events `[id]` route. Add:

- `apps/internal-ops/src/app/(dashboard)/schedule/[id]/page.tsx` — event detail with edit form. Follow the same `<DetailPanel>` + `<DetailField>` pattern as Leads.
- API: existing `/api/events/[id]` (GET / PATCH / DELETE) already in face-f scope.

### F4. business_name as canonical, business as legacy

- All face-f writes to `leads` populate BOTH `business_name` and `business` (legacy) until a future cleanup migration drops `business`.
- All face-f reads use `business_name` first, fall back to `business` if `business_name IS NULL`. Older rows pre-dating the schema change may still have null `business_name` despite the backfill (defensive).
- All face-f Zod validators expose the field as `businessName` to clients and translate at the boundary.

### F5. business_name nullable for legacy rows

Schema in `@repo/db` declares `business_name` as nullable text. The 2026-05-06 backfill populated existing rows, but treat null as possible. Read helper:

```ts
function leadBusinessName(lead: Lead): string {
  return lead.businessName ?? lead.business;
}
```

### F6. Status legacy read mapping

When face-f's UI renders an existing lead with a legacy status value, map for display:

| DB value    | UI label             | Internal-ops pipeline equivalent |
| ----------- | -------------------- | -------------------------------- |
| `new`       | "New (legacy)"       | new_lead                         |
| `contacted` | "Contacted"          | contacted (same)                 |
| `qualified` | "Qualified (legacy)" | on_hold                          |
| `in_audit`  | "In audit (legacy)"  | audit_scheduled                  |
| `won`       | "Won"                | won (same)                       |
| `lost`      | "Lost"               | lost (same)                      |
| `archived`  | "Archived (legacy)"  | on_hold (visual)                 |

The status pipeline UI shows ONLY the 8 canonical values (`INTERNAL_OPS_LEAD_STATUSES`). Legacy values render with a subtle "legacy" tag and an "Update to current" button that PATCHes status to the mapped equivalent.

### F7. Forbid legacy status values in write validators

Zod write validator for lead PATCH:

```ts
import { INTERNAL_OPS_LEAD_STATUSES } from "@repo/db";
const leadStatusInput = z.enum(INTERNAL_OPS_LEAD_STATUSES);
```

Any attempt to PATCH a lead with a legacy status value (`new`, `qualified`, `in_audit`, `archived`) returns 422. Reads still tolerate legacy values; only writes are constrained.

### F8. Lead → Client conversion idempotency + concurrency

```ts
// apps/internal-ops/src/app/api/leads/[id]/convert/route.ts
await db.transaction(async (tx) => {
  const [lead] = await tx
    .select()
    .from(leads)
    .where(eq(leads.id, id))
    .for("update")  // row lock
    .limit(1);

  if (!lead) throw new HttpError(404, "Lead not found");
  if (lead.convertedClientId) {
    throw new HttpError(422, "Lead already converted", {
      clientId: lead.convertedClientId,
    });
  }

  const [client] = await tx.insert(clients).values({...}).returning();
  await tx.update(leads).set({
    status: "won",
    convertedClientId: client.id,
  }).where(eq(leads.id, id));
});
```

The `for("update")` row lock prevents two concurrent convert clicks from creating duplicate clients. The 422 on already-converted leads makes the operation idempotent: same lead converted twice → first succeeds, second returns the existing clientId.

### F9. Audit markdown export — escape backticks + HTML

Update the escape set:

```ts
function escapeMarkdownText(s: string): string {
  return s
    .replace(/\\/g, "\\\\") // backslash FIRST
    .replace(/`/g, "\\`") // backtick (Pory addition)
    .replace(/[*_#\[\]()]/g, (c) => "\\" + c)
    .replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!); // HTML safety
}
```

Apply to every user-supplied text field before emission: `business_overview`, `current_tools`, `pain_points`, `opportunities`, `recommended_systems`, `next_steps`, plus `name`, `business_name`, `email`, `phone`.

### F10. Server-side auth on every API route

Middleware verifies JWT signature/expiry at the edge but cannot query Postgres for revocation. EVERY API route handler must call `getSession()` from `apps/internal-ops/src/lib/auth.ts` OR `requireRole(...)` from `apps/internal-ops/src/lib/role-guard.ts` to enforce server-side revocation. `requireRole` is the higher-order wrapper preferred for entity routes:

```ts
export const GET = requireRole(["owner", "operator"], async (req, ctx) => {
  const { session } = ctx;
  // ... handler
});
```

Routes that don't gate (only `/api/health`, `/api/auth/login`) are explicit exceptions documented in `apps/internal-ops/middleware.ts` PUBLIC_PATHS.

---

## Re-cosign protocol

After reading this document, each face:

1. Re-runs `pory-consult.sh --stdin --mode design-cosign` with: original packet contents + this amendments doc + the same questions.
2. Posts second-round verdict to `#porygon` and a brief in `#conscience-os-app`.
3. If COSIGN: holds for coordinator's Stage 3 start signal.
4. If still REWORK / BLOCK: post the verdict; coordinator arbitrates again.

Coordinator does NOT post Stage 3 start signal until BOTH faces hit COSIGN this round.

---

## Receipts

- face-e pre-flight (round 1): REWORK, deltas in this doc sections A1-A5
- face-f pre-flight (round 1): REWORK, deltas in this doc sections F1-F10
- Coordinator arbitration: this document, committed at TBD
- face-e + face-f pre-flight (round 2): TBD after re-cosign
