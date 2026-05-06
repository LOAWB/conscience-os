# face-e Task Packet — UI Shell + Design System

**Face:** face-e
**Project:** conscience-os-internal
**Lane:** UI shell + design system extraction (`@repo/ui`) + dashboard chrome
**Codex:** pory-codex-conscience-internal-ui (proposed; assigns at face claim)
**Cosign cadence:** 3 (pre-flight + end-of-phase + pre-merge; mid-execution conditional on architectural change)
**Reference:** `m1/INTERNAL-OPS-M0-PLAN.md`, `m1/internal-ops/THREE-FACE-EXECUTION-PLAN.md`

---

## Scope

Visual layer for internal-ops. Extracts the locked Conscience Os design system into `@repo/ui`, builds dashboard chrome (sidebar + topbar + main slot), composes the Today View shell, builds the login page UI, ships generic form primitives.

**Generic primitives only.** No domain-specific UI: no audit form bodies, no lead detail layouts, no project deliverable checklists. Those belong to face-f. If face-f needs a primitive that doesn't exist yet, file a request — do not inline a one-off.

Locked aesthetic (no deviation without LANE-CHANGE-PROPOSAL):

- Black base `#06080d` + off-white text `#f4f4f5` + electric blue accent `#3b7dff`
- Geist Sans body + Geist Mono mono via `next/font`
- Glass cards: translucent + backdrop-blur + subtle white-alpha border + blue hover edge
- Aura: soft radial blue glows on key surfaces, opacity ≤20%, no neon
- Wordmark: glass pill + bold uppercase `CONSCIENCE` with shimmer + accent blue `Os` + ringless mark with orbiting comet dot

---

## Primitive name lock (publish surface first, populate after)

These names ship as exports from `@repo/ui` immediately after face-d lands the package boundary, even with stub implementations. face-f composes against these names from the moment the schema lands; preventing duplication is the whole point.

```ts
// packages/ui/src/index.ts (publish list)

export { ShellLayout } from "./shell/shell-layout";
export { Sidebar } from "./shell/sidebar";
export { TopBar } from "./shell/topbar";

export { GlassCard } from "./primitives/glass-card";
export { Wordmark } from "./primitives/wordmark";
export { IconBox } from "./primitives/icon-box";
export { AuraGlow } from "./primitives/aura-glow";

export { Button } from "./primitives/button";
export { LinkButton } from "./primitives/link-button";

export { StatusBadge } from "./primitives/status-badge";
export { PriorityChip } from "./primitives/priority-chip";
export { Tag } from "./primitives/tag";
export { Avatar } from "./primitives/avatar";

export { FormField } from "./forms/form-field";
export { TextInput } from "./forms/text-input";
export { TextArea } from "./forms/text-area";
export { Select } from "./forms/select";
export { DateTimePicker } from "./forms/datetime-picker";
export { SwitchInput } from "./forms/switch-input";
export { FormError } from "./forms/form-error";

export { EntityListLoading } from "./states/entity-list-loading";
export { EntityDetailLoading } from "./states/entity-detail-loading";
export { EntityEmptyState } from "./states/entity-empty-state";
export { ErrorBoundaryFallback } from "./states/error-boundary-fallback";

export { TodayPanel } from "./today/today-panel";
export { QuickCapturePanel } from "./today/quick-capture-panel";
export { CountStrip } from "./today/count-strip";

export { tokens } from "./tokens";
export type {
  LeadStatus,
  ClientStatus,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  EventType,
} from "./types";
```

`tokens` exports the design constants (`colors`, `spacing`, `radii`, `typography`, `motion`) so face-f and any consumer reads the system through one source.

---

## Files this face creates

```
packages/ui/src/index.ts                       ← publish list (replace empty stub from face-d)
packages/ui/src/tokens.ts                      ← color/spacing/radii/typography constants
packages/ui/src/types.ts                       ← shared status enum types (mirrors @repo/db enums)

packages/ui/src/primitives/glass-card.tsx
packages/ui/src/primitives/wordmark.tsx        ← extracted from current public-site
packages/ui/src/primitives/icon-box.tsx
packages/ui/src/primitives/aura-glow.tsx
packages/ui/src/primitives/button.tsx
packages/ui/src/primitives/link-button.tsx
packages/ui/src/primitives/status-badge.tsx
packages/ui/src/primitives/priority-chip.tsx
packages/ui/src/primitives/tag.tsx
packages/ui/src/primitives/avatar.tsx

packages/ui/src/forms/form-field.tsx           ← label + helper-text + error wrapper
packages/ui/src/forms/text-input.tsx
packages/ui/src/forms/text-area.tsx
packages/ui/src/forms/select.tsx
packages/ui/src/forms/datetime-picker.tsx      ← native input[type=datetime-local] wrapper
packages/ui/src/forms/switch-input.tsx
packages/ui/src/forms/form-error.tsx

packages/ui/src/shell/shell-layout.tsx         ← sidebar + topbar + main slot composition
packages/ui/src/shell/sidebar.tsx              ← nav with active-route highlighting
packages/ui/src/shell/topbar.tsx               ← user menu + logout

packages/ui/src/states/entity-list-loading.tsx
packages/ui/src/states/entity-detail-loading.tsx
packages/ui/src/states/entity-empty-state.tsx
packages/ui/src/states/error-boundary-fallback.tsx

packages/ui/src/today/today-panel.tsx          ← layout shell for left/center/right column
packages/ui/src/today/quick-capture-panel.tsx  ← textarea + intent dropdown + submit (no handler binding here)
packages/ui/src/today/count-strip.tsx          ← top strip: open leads | active clients | active projects | overdue tasks

packages/ui/src/styles/globals.css             ← base resets, font setup, CSS-vars from tokens
packages/ui/package.json                       ← exports config: ./styles/globals.css, ./tokens

apps/internal-ops/src/app/(dashboard)/layout.tsx        ← composes ShellLayout, gates via auth
apps/internal-ops/src/app/(dashboard)/page.tsx          ← Today View, mock data until face-f ships /api/today
apps/internal-ops/src/app/login/page.tsx                ← consumes face-d's /api/auth/login
apps/internal-ops/src/app/_dev/preview/page.tsx         ← (dev-only) every primitive rendered for sanity check

apps/internal-ops/src/app/globals.css                   ← imports @repo/ui styles + app-specific extensions
apps/internal-ops/src/app/layout.tsx                    ← font loading, root metadata, theme color
```

## Files this face deletes (only if extraction is complete)

After confirming the public-site still builds, remove duplicated component definitions from `apps/public-site/src/components/` if they were extracted to `@repo/ui` and the public-site is updated to import from `@repo/ui`.

---

## Dashboard layout spec

```
┌──────────────────────────────────────────────────┐
│  TopBar  [wordmark]              [user menu] [⏻] │
├────────┬─────────────────────────────────────────┤
│        │                                         │
│  Side  │       Main slot                         │
│  bar   │                                         │
│        │   (Today, Leads, Clients, Projects,     │
│        │    Tasks, Schedule, Audits routes)      │
│        │                                         │
└────────┴─────────────────────────────────────────┘
```

Sidebar nav items (icon + label, active-route highlight, glass hover):

- Today (Home icon, default landing)
- Leads (Sparkles icon)
- Clients (Users icon)
- Projects (Folder icon)
- Tasks (Check-square icon)
- Schedule (Calendar icon)
- Audits (Clipboard-check icon)
- ─── divider ───
- Settings (Cog icon, footer of sidebar)

Sidebar collapses to icons-only on screens <1280px. Below 768px, hidden behind a hamburger overlay.

TopBar:

- Left: Wordmark (links to /, matches public-site styling)
- Right: user-menu dropdown with name + email + role + logout button. Activate on click, dismiss on outside click.

---

## Today View composition

Three columns + top strip. Mock data until face-f ships `GET /api/today`; after that, bind to real data.

```
┌─────────────────────────────────────────────────────────────────┐
│  CountStrip:  [12 leads]  [4 clients]  [7 projects]  [3 overdue]│
├──────────────────┬─────────────────────┬────────────────────────┤
│ TODAY'S TASKS    │ UPCOMING            │ QUICK CAPTURE          │
│                  │                     │                        │
│ ▢ Follow up Acme │ Tue 10am ─ Audit X  │ ┌────────────────────┐ │
│ ▢ Send proposal  │ Wed 2pm ─ Call Y    │ │ Note...            │ │
│ ▢ Review specs   │ Thu ─ Deadline Z    │ │                    │ │
│ ▢ ...            │ Fri ─ Follow-up W   │ │                    │ │
│                  │                     │ └────────────────────┘ │
│ OVERDUE          │                     │ As: [task ▾] Submit ▶ │
│ ! Call Beta Inc  │                     │                        │
└──────────────────┴─────────────────────┴────────────────────────┘
```

CountStrip pulls counts from `/api/today` (single round-trip per Pory's recommendation against N+1).

Quick-Capture intent options: `task | event | lead-followup`. Posts to `/api/quick-capture` (face-f handler). On success, the relevant column refreshes. On failure, surface inline error in the panel.

---

## Login page UI

Single centered card on dark backdrop. Wordmark above. Email + password fields. Single primary button "Sign in." Error state under the button: `Invalid email or password.` (no leak of which field was wrong). Redirect on success to `?redirect=` param or `/`.

After 5 failed attempts the form locks for 15 min and shows: `Too many attempts. Try again in 15 minutes.`

---

## Acceptance criteria

- [ ] `pnpm --filter @repo/ui build` produces a clean library artifact
- [ ] All names in the publish list have at least a stub export (face-f never sees a missing import)
- [ ] All publish-list components have a visible preview at `apps/internal-ops/src/app/_dev/preview/` (gated to `process.env.NODE_ENV === 'development'`, returns 404 in prod)
- [ ] Dashboard layout renders correctly at desktop (1440), laptop (1280), tablet (1024), mobile (375) breakpoints
- [ ] Login page consumes face-d's `/api/auth/login` and redirects on success
- [ ] Today View renders with mock data; switches to real data when `/api/today` exists
- [ ] Quick-capture panel renders; submit button stub binding works (face-f handler arrives later)
- [ ] No primitive duplicated by face-f (verify by scanning face-f's diff for inline status badges, priority chips, etc.)
- [ ] Locked aesthetic preserved: glass cards, wordmark with shimmer, electric-blue accent system, Geist typography
- [ ] Empty + loading + error states implemented for all list and detail layouts
- [ ] Sidebar nav active-route highlight works correctly across all 7 sections
- [ ] No regressions to public-site rendering (extracted components still work there)

---

## Pory cosign triggers (3)

1. **Pre-flight:** before any code runs, Pory reviews this packet against the M0 plan and the THREE-FACE plan.
2. **End-of-phase:** after dashboard layout + Today View shell + login page + form primitives all render, Pory reviews against acceptance criteria. Includes brand-fidelity check vs locked design.
3. **Pre-merge:** Pory reviews unified PR diff for cross-face primitive consistency (face-f composing as expected, no inline duplications).

**Mid-execution cosign conditional:** triggered only if face-e changes the layout architecture (e.g., switching from sidebar+topbar to top-only nav) or modifies the `@repo/ui` package boundary shape. Skipped for component-level work.

---

## Stage timing

- Stage 1 (waiting on face-d skeleton): ~30 min idle, use to read M0 plan + audit current public-site components
- Stage 2 (foundation parallel with face-d): ~2-3 hours actual work
- Stage 3 (polish parallel with face-f): ~1-2 hours
- Stage 4 (pre-merge cosign): ~30 min
- **Total face-e engaged time: ~3-4 hours wall-clock**

---

## Risks specific to face-e

- **Brand drift in extraction.** Current public-site components have evolved over multiple commits; some have one-off styling. Extract to a clean canonical version using tokens — do not preserve every CSS exception. If a public-site usage breaks, fix the consumer, not the primitive.
- **Form primitive UX.** Native `<input type="datetime-local">` works but looks platform-y on Mac. Document the trade-off in the component file; defer custom date picker to M2.
- **Aura performance.** Multiple radial blue gradients can cost paint frames. Limit to ≤3 active aura glows per visible viewport, prefer CSS `radial-gradient` over SVG, no animated auras except on the hero ring.
- **Tablet layout.** The 3-column Today View doesn't fit at <1280px. Reflow to stacked-vertical at smaller breakpoints; do not crush.

---

## Handoff signals from this face

- Once `@repo/ui` publish list ships (even with stubs): post `[TYPE: ACTION] face-e primitives published, face-f can compose against them` to `#conscience-os-app`
- Once dashboard layout + login + Today shell render: post `[TYPE: ACTION] face-e shell green, ready for /api/today binding`

---

## Substrate engagement

- Face state: `~/.consciousos/state/faces/face-e.json` (created at claim)
- Receipts: every cosign result logs to `~/.consciousos/logs/receipts.jsonl`
- Discord: status posts as `Jr` to `#conscience-os-app` (one Jr session per face; this is face-e's session, distinct from face-d's)
- Claim command on greenlight:
  ```bash
  ~/.consciousos/scripts/shadow-face-assign.sh face-e \
    --project conscience-os-internal \
    --lane "UI shell + design system extraction (@repo/ui) + dashboard chrome" \
    --codex-scope "design-system extraction + dashboard chrome cosign + brand-fidelity audit" \
    --codex-id pory-codex-conscience-internal-ui \
    --task-packet ~/projects/conscience-os/m1/internal-ops/FACE-E-UI.md
  ```
