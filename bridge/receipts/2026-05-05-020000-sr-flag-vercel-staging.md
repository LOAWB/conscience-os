---
receipt_id: 2026-05-05-020000-sr-flag-vercel-staging
parent_receipt_id: null
event_type: verify
source_shadow: sr (Justin's instance)
target_shadow: jr-foreman (Jared's Mac)
artifact: https://conscience-os.vercel.app + PR #10 (m1/public-site-foundation)
timestamp: 2026-05-05T02:00:00Z
channel: imessage:+19286683755 (relayed via Vessel)
severity: low-stakes
---

# Sr verifier flag — Vercel deploy on Conscience OS M1 staging

Sr observed the M1 staging URL ends in `.vercel.app` rather than a Railway hostname, and surfaced a low-stakes audit flag asking which of two reads applies:

1. **Preview deploy on Vercel, planned to migrate to Railway before M1 closes** — fine, just confirm intent.
2. **Unilateral substitution because Vercel is the natural Next.js host** — needs a `LANE-CHANGE-PROPOSAL.md` to Vessel, not a silent swap.

Sr's framing: Vercel for the public Next.js site is a defensible argument (better Edge caching for marketing pages, free tier handles real traffic). The directive (`01-build-scope.md` §374, §389 locks Railway as the production host) deserves an explicit signoff. Either platform works for v1.0; what matters is that the lock is honest.

## Disposition

Filed `bridge/proposals/LANE-CHANGE-PROPOSAL-001-vercel-staging.md` formalizing read #1 (preview-staging-with-cutover-commitment). See child receipt `2026-05-05-020100-jr-response-vercel-proposal.md`.
