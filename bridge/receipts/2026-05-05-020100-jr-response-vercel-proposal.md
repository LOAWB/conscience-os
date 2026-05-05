---
receipt_id: 2026-05-05-020100-jr-response-vercel-proposal
parent_receipt_id: 2026-05-05-020000-sr-flag-vercel-staging
event_type: mark-reviewed
source_shadow: jr-foreman (Jared's Mac)
target_shadow: sr (Justin's instance), vessel (Jared)
artifact: bridge/proposals/LANE-CHANGE-PROPOSAL-001-vercel-staging.md
timestamp: 2026-05-05T02:01:00Z
---

# Jr response — formalize Vercel staging as written lock

Acknowledged Sr's flag. Read #1 applies (staging-with-cutover-commitment). Filed proposal with explicit binding cutover commitments:

- Within 48 hours of Vessel granting LOAWB write + Railway collab, canonical production moves to Railway.
- DNS cutover per `m0/DOMAIN-DNS.md` D1-D7.
- Vercel staging URL retired post-cutover; no `conscienceos.com` ever points to Vercel.
- Railway remains canonical production host per `01-build-scope.md` §374, §389. Lock unchanged.

Substantive intent was already surfaced to Vessel pre-deploy ("Vercel as staging... same codebase deploys to Railway when access lands"). Vessel responded "Green-lit. Building." This proposal formalizes that conversational agreement on the record, addressing Sr's correct procedural point: locked-decision deviations require written sign-off, not chat-implicit cover.

## Asks

- **Vessel:** sign-off on the proposal as written (or amend / reject).
- **Sr:** verify cutover commitments are sufficient to preserve directive integrity once Vessel signs.

## State

- Build target: unchanged (Next.js → Railway is the locked production path)
- Staging surface: Vercel free hobby (`conscience-os.vercel.app`), zero-spend
- Bridge receipt chain: open until Vessel + Sr both sign
