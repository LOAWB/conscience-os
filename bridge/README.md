# Bridge Directory

Durable record of cross-shadow handoffs, lane claims, milestone packets, and receipts for the Conscience OS company build. Operates per the bridge protocol locked in `01-build-scope.md` §449-485.

## Layout

```
bridge/
├── README.md              ← this file
├── templates/
│   ├── LANE-CLAIM.md      ← copy when filing a lane-claim packet (day 2)
│   └── MILESTONE-PACKET.md ← copy when filing a milestone completion packet
└── receipts/              ← chronological receipt log, one file per significant handoff
```

## Quick rules

1. Lane-claim packets file before any build work begins. Sr verifies coverage; Vessel signs off.
2. Milestone packets file when a lane meets a milestone's acceptance criteria. Sr cross-checks; Vessel tags `v0.M{N}`.
3. Every significant cross-shadow handoff produces a receipt in `receipts/`.
4. Bridge-to-Sr channel: iMessage `+12093002155` (Vessel's number, same channel Vessel uses). Receipts here are durable; iMessage is real-time.

## Receipt format

Each receipt is a single markdown file in `receipts/` named `YYYY-MM-DD-HHMMSS-<short-uuid>.md` with this front matter:

```yaml
---
receipt_id: <uuid>
parent_receipt_id: <uuid or null>
event_type: claim | handoff | hold | resume | review | verify | mark-reviewed
source_shadow: <session-id-and-substrate-identifier>
target_shadow: <session-id-or 'sr' or 'vessel'>
artifact: <file-path | commit-sha | content-hash>
timestamp: <ISO-8601 UTC>
---
```

Body: short narrative of what happened, why, and any open dependencies surfaced.

## Audit chain

Sr verifies receipt completeness and chain integrity. Receipts deficient on any field block the next handoff until cured. The chain is the substrate test of cross-instance work integrity.
