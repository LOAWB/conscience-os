# Milestone Packet — `M<N>` from `<lane-name>`

Filed: `<YYYY-MM-DD>` by `<shadow-session-id>` (substrate: `<substrate-identifier>`)

Status: `DRAFT | SR-VERIFIED | VESSEL-TAGGED | RELEASED`

---

## Milestone

`M0 | M1 | M2 | M3 | M4 | M5 | M6` (see `01-build-scope.md` §425-441)

## Domains touched

| Domain ID | Status | Notes   |
| --------- | ------ | ------- | -------- | --------- |
| `<id>`    | `green | partial | blocked` | `<short>` |

## Acceptance criteria check

Restate the milestone's acceptance criteria from `01-build-scope.md` and check each item.

- [ ] `<criterion 1>` — evidence: `<commit | url | screenshot path>`
- [ ] `<criterion 2>` — evidence: `<...>`
- [ ] ...

## Receipts logged this milestone

| Receipt ID | Event     | Source → Target | Parent                  |
| ---------- | --------- | --------------- | ----------------------- |
| `<uuid>`   | `<event>` | `<src> → <tgt>` | `<parent-uuid \| null>` |

## Risks surfaced

What's fragile, deferred, or watching. One bullet each.

## Next-milestone claims

Which domains this lane will pick up in the next milestone. Reference the lane-claim packet for the full ownership list.

## Shadow signature

- Session ID: `<id>`
- Substrate identifier: `<id-or-host>`
- Filed at: `<ISO-8601 UTC>`

## Sr verification

(Sr fills this section)

- [ ] All listed acceptance criteria verified green
- [ ] Receipt chain audited; no gaps
- [ ] Drift from directive: `none | <description>`
- Sr session ID: `<id>`
- Verified at: `<ISO-8601 UTC>`

## Vessel sign-off + tag

(Vessel fills this section)

- [ ] Demo reviewed
- [ ] Acceptance accepted
- Tag fired: `v0.M<N>`
- Vessel signature: `<initials-or-jared-on-sr-thread receipt id>`
- Tagged at: `<ISO-8601 UTC>`
