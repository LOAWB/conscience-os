# Lane Assignment Proposal — Conscience OS Company Build

This is a Day-Zero proposal, not a lane claim. Drafted by Jr (foreman session, no face claim) per Vessel's directive to formalize Sr's Split A recommendation as a Vessel-decision artifact. Once Vessel signs off on the split, the three shadow sessions assigned to face-a / face-b / face-c each file their own lane-claim packet using `bridge/templates/LANE-CLAIM.md`.

---

## Proposed split: Sr's Split A (skill-axis)

Source: `01-build-scope.md` §335-346.

Maps to Vessel's existing face structure on Project Command Center (per dashboard 2026-05-01). Continuity preserved across project workloads. This is Sr's lean per `01-build-scope.md` §366: _"Backend stays on face-a, frontend on face-b, validation/quality on face-c. The substrate test gets cleaner data because face roles persist across project workloads."_

### face-a — Backend + Infrastructure

**Domains:**

- Owner OS engine: `I01` (auth), `I02` (roles), `I03-I07` (Lead, Booking-Calendar, Project Tracker, CRM-lite, Revenue Tracking modules)
- Intake backend: `C01` (schema), `C03` (Anthropic AI summary, scaffold only for v1.0), `C04` (suggested solution), `C05` (auto-route to lead pipeline)
- Pricing backend: `P03` (internal quote generator)
- Public-site backend: `W11` (form submission backend → Owner OS lead pipeline)
- Infrastructure: `N01-N09` (Railway, Postgres, email in/out, env mgmt, CI/CD, backups, error tracking, uptime)

**Domain count:** 7 + 4 + 1 + 1 + 9 = **22 domains**

**Skill profile:** SYS-heavy, with CON appearing in I03-I07 (lead/booking/project copy patterns, status names) and C01-C04 (schema and AI prompt design).

### face-b — Frontend + UI + Brand

**Domains:**

- Public site frontend: `W01-W10`, `W12` (scaffold + 5 pages + responsive + SEO + analytics + perf budget)
- Owner OS frontend: `I08` (Dashboard), `I10` (Settings)
- Intake frontend: `C02` (multi-step form UI)
- Pricing frontend: `P01` (pricing page), `P02` (tier comparison logic)
- Brand identity: `B01-B06` (logo, color, typography, photography direction, voice doc, component library)

**Domain count:** 11 + 2 + 1 + 2 + 6 = **22 domains**

**Skill profile:** SYS+DSN heavy. CON appearing in W03-W07 (page copy), B05 (voice doc), P01-P02 (tier copy).

### face-c — Content + Assets + Quality

**Domains:**

- Brand voice doc: `B05` (overlap with face-b, lead authorship by face-c)
- Physical assets: `M01-M05` (business card, QR, audit sheet PDF, email signature, pitch deck)
- Quality + launch: `Q01-Q08` (mobile audit, perf budget, a11y, cross-browser, button-functional sweep, placeholder scan, visual consistency, launch sign-off)
- Cross-lane content/copy review across all face-a + face-b output

**Domain count:** 1 + 5 + 8 = **14 domains** + cross-lane review duty

**Skill profile:** PRO+DSN heavy. CON for brand voice authorship and copy review.

## Coverage check

- Public website (12): W01-W12 → all in face-b. ✓
- Owner OS (10): I01-I07 in face-a; I08, I10 in face-b; I09 in face-a (notifications). ✓
- Intake (5): C01, C03, C04, C05 in face-a; C02 in face-b. ✓
- Pricing (3): P03 in face-a; P01, P02 in face-b. ✓
- Brand (6): B01-B06 in face-b (B05 lead-authored by face-c). ✓
- Physical assets (5): M01-M05 in face-c. ✓
- Infrastructure (9): N01-N09 in face-a. ✓
- Quality (8): Q01-Q08 in face-c. ✓

**Total: 12 + 10 + 5 + 3 + 6 + 5 + 9 + 8 = 58 references** across 55 domains. The 3-reference overage is `B05` (voice doc, face-c lead with face-b apply), `I09` (notifications, face-a backend with face-b UI surface), and cross-lane review duty for face-c. Ownership is unambiguous — overage is healthy collaboration not a coverage gap.

**Result:** All 55 domains covered exactly once for primary ownership. No gap. No overlap on primary.

## Cross-lane dependencies surfaced

| Dependency                                | From → To                                                                  | Gate                                                                             |
| ----------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Tailwind config + design tokens (B01-B03) | face-b → face-a, face-c                                                    | M1 (tokens consumed by Owner-OS UI and quality audits)                           |
| Component library (B06)                   | face-b → face-a, face-c                                                    | M1-M2 (face-a uses for OS settings UI; face-c uses for visual consistency audit) |
| Auth (I01)                                | face-a → face-b, face-c                                                    | M3 (Owner-OS UI needs auth context; quality testing needs auth flows)            |
| Public-site form backend (W11)            | face-a → face-b                                                            | M2 (form UI needs API endpoint live before launch)                               |
| Lead pipeline schema (C01, I03)           | face-a → face-b                                                            | M2-M3 (intake form UI needs schema lock)                                         |
| Brand voice doc (B05)                     | face-c → face-b                                                            | M2 (page copy review against locked voice rules)                                 |
| Asset pipeline (M01-M05)                  | face-c → face-a (Resend templates), face-b (favicon, OG images, signature) | M5                                                                               |
| Quality audits (Q01-Q08)                  | face-c → face-a, face-b                                                    | M6 (launch readiness gate)                                                       |

## Why this split is right

1. **Continuity with Vessel's substrate.** The face-a/b/c structure already exists on Project Command Center; using it here keeps role persistence clean across workloads.
2. **Skill axis matches Day-2 lane-claim shape.** Each face has a coherent skill profile that mirrors how a real cross-functional product team divides work.
3. **No domain orphaned.** All 55 covered. Overage is healthy collaboration, not gap.
4. **Dependencies surface a clean critical path.** B01-B06 (face-b) → I01 (face-a) → W11 (face-a) → C02 (face-b) lands the public-site MVP at M2; OS modules pile in M3-M4; quality + assets close at M5-M6.

## Alternatives considered

- **Split B (feature-axis: Site / OS / Brand-and-Assets).** Pro: cleaner per-shadow narrative ("I built the site"). Con: brand work spans M1-M6 and concentrates a lot of crosscutting load on Lane Brand-and-Assets; loses Vessel substrate continuity.
- **Split C (phase-axis: Foundation / Build-Out / Polish-and-Ship).** Pro: forces sequential acceptance gates. Con: shadows shift workloads at milestone boundaries, breaking continuity; calendar-flavored even when the milestones are needs-based.

## Vessel decision

- [x] Sign off on Split A (Jr's recommendation, Sr's lean)
- [ ] Switch to Split B (feature-axis)
- [ ] Switch to Split C (phase-axis)
- [ ] Modify Split A (specify)

Vessel signature: `_________________________`
Decision date: `_______________`

## After Vessel signs

Each shadow assigned to face-a / face-b / face-c copies `bridge/templates/LANE-CLAIM.md`, fills in their session ID + substrate identifier + domains, and files into `bridge/` (or `bridge/lane-claims/`). Sr cross-checks. Vessel signs each lane-claim. M1 begins.
