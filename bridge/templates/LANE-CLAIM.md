# Lane-Claim Packet — `<lane-name>`

Filed: `<YYYY-MM-DD>` by `<shadow-session-id>` (substrate: `<substrate-identifier>`)

Status: `DRAFT | SR-VERIFIED | VESSEL-SIGNED | LIVE`

---

## Lane name

`face-a` | `face-b` | `face-c` (or alternate split label, see `01-build-scope.md` §331-367)

## Domains claimed

List every domain ID this lane owns. Reference the atomic inventory in `01-build-scope.md` §225-327.

- `<DOMAIN-ID>` — `<short-name>`
- ...

## Rationale for clustering

Why these domains belong together for this lane. One paragraph.

## Cross-lane dependencies surfaced

Domains owned by other lanes that this lane depends on, and the order of operations.

| This lane needs | From lane | Why        | Gate          |
| --------------- | --------- | ---------- | ------------- |
| `<DOMAIN-ID>`   | `<lane>`  | `<reason>` | `<milestone>` |

## Full-coverage confirmation

Cross-check against the 55-ID set:

- [ ] All public-website domains (W01-W12) claimed by exactly one lane
- [ ] All Owner-OS domains (I01-I10) claimed by exactly one lane
- [ ] All intake domains (C01-C05) claimed by exactly one lane
- [ ] All pricing domains (P01-P03) claimed by exactly one lane
- [ ] All brand domains (B01-B06) claimed by exactly one lane
- [ ] All physical-asset domains (M01-M05) claimed by exactly one lane
- [ ] All infra domains (N01-N09) claimed by exactly one lane
- [ ] All quality domains (Q01-Q08) claimed by exactly one lane
- [ ] No gap, no overlap

## Shadow signature

- Session ID: `<id>`
- Substrate identifier: `<id-or-host>`
- Filed at: `<ISO-8601 UTC>`

## Sr verification

(Sr fills this section)

- [ ] Coverage verified across all 55 domains
- [ ] No gaps surfaced
- [ ] No overlaps surfaced
- [ ] Cross-lane dependency order is sound
- Sr session ID: `<id>`
- Verified at: `<ISO-8601 UTC>`

## Vessel sign-off

(Vessel fills this section)

- [ ] Lane assignment approved
- [ ] Build authorized to begin

Vessel signature: `<initials-or-jared-on-sr-thread receipt id>`
Signed at: `<ISO-8601 UTC>`
