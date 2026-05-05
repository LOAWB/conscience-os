# Lane-Change Proposal 001 — Vercel as M1 staging surface

Filed: `2026-05-05T02:03:53Z` by Jr (foreman session, no face claim) on host `Jared's Mac`.

Status: `DRAFT — pending Vessel sign-off and Sr verification`

Surfaced by: Sr verifier flag (low-stakes), `2026-05-05T02:00 UTC` via iMessage bridge (`+19286683755`)

---

## What is being proposed

Permit Vercel as an **interim staging surface** for the Conscience OS public-facing site during the M0 access-blocked window, while preserving Railway as the **canonical production host** locked in `01-build-scope.md` §374, §389.

This is a **scope clarification**, not a stack substitution. Same Next.js codebase. Same build. Vercel hosts the staging URL until Railway access lands; the canonical production deploy goes to Railway as locked.

## What is NOT changing

- Railway is the **canonical production host** for Conscience OS. Lock preserved.
- Tech stack lock preserved: Node.js + PostgreSQL + React (Next.js for public site) + Railway (`01-build-scope.md` §374).
- Zero-spend discipline preserved: Vercel hobby tier costs \$0; no marginal spend.
- DNS lock preserved: `conscienceos.com` → Railway when M1 access unblocks (per `m0/DOMAIN-DNS.md` D1-D7).

## Why this happened

M1 build kicked off under three concurrent access blockers:

1. `JaredBlvck` lacks LOAWB org write access (surfaced in PR #9 BLOCKER post)
2. `JaredBlvck` is not yet a Railway collaborator on Vessel's Railway account
3. Vessel-side M0 CHECKLIST account signups (Sentry, Resend, Cal.com decision, Plausible decision) are still open

Without Railway collab, I cannot provision `conscience-web`, `conscience-api`, or `conscience-db` services on Vessel's account. Without those services, the directive's "First live version required: Public URL" cannot be satisfied via the canonical path inside this turn.

The options at decision time:

| Option                                                                         | Cost                                                  | Trade-off                                                   |
| ------------------------------------------------------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------- |
| Wait for Railway access, ship dark                                             | $0                                                    | Violates "First live version required: Public URL" deadline |
| Provision Railway under JaredBlvck's own account                               | Future migration friction (account-transfer overhead) | Bypasses Vessel's account-control on the production target  |
| Deploy to Vercel hobby (no team needed, Vessel-account-independent) as staging | $0                                                    | Requires this proposal to formalize                         |

I picked Vercel staging and surfaced it to Vessel pre-deploy in chat. Vessel responded "Green-lit. Building." — informal approval. **Sr's audit is correct that informal approval is not a written lock for a deviation from a locked decision.** This proposal formalizes what was conversationally agreed, on the record, with explicit cutover commitments.

## Defensible-on-its-own-merits points (for Vessel evaluation)

These are reasons Vercel could plausibly _also_ be considered for production for the public marketing site, surfaced for transparency. None of them change this proposal's recommendation, which is Railway-as-production. Vessel can decide whether any are worth a separate evaluation later.

- Vercel's edge cache handles marketing-page traffic well by default; Railway requires hand-tuning Cloudflare in front for similar.
- Vercel's preview-per-PR flow is a strong review surface for design iterations.
- Vercel's free hobby tier ships real bandwidth (~100GB/mo) — sufficient for v1.0 traffic.
- Counter: Railway is the locked stack across all of Vessel's substrate (Splash Bros, others). Continuity of ops matters. Single platform ⇒ single auth, single ops surface, single bill.

## Cutover commitments

If approved, these become binding:

1. Within **48 hours of Vessel granting Railway collaborator access** + LOAWB org write access, the canonical production deploy moves to Railway.
2. DNS cutover (`conscienceos.com` → Railway) per `m0/DOMAIN-DNS.md` D1-D7. Vessel-side: Cloudflare DNS edits.
3. Vercel staging URL `conscience-os.vercel.app` is **retired** after Railway production verification. URL goes dark or 301-redirects to apex.
4. No `conscienceos.com` A/CNAME ever points to Vercel — apex stays Railway-only.
5. Receipts filed in `bridge/receipts/` at each cutover step.

## Surface to Sr

- Sr-thread bridge channel: `imessage:+19286683755`
- Audit ask: confirm coverage check holds across all 55 domains under this clarification (none should re-allocate; this is a hosting-surface clarification, not a domain reassignment).

## Vessel sign-off

- [ ] **Approve as written** — Vercel staging permitted during access-blocked window; Railway remains canonical production with cutover commitments above
- [ ] **Approve with amendments** — specify
- [ ] **Reject** — pull staging URL; ship M1 dark until Railway access lands
- [ ] **Convert to permanent split** — Vercel for public marketing, Railway for app/api/db (would require separate evaluation; not what's proposed here)

Vessel signature: `_________________________`
Decision date: `_______________`

## Sr verification

- [ ] Cutover commitments are sufficient to preserve directive integrity
- [ ] No domain coverage gap introduced
- [ ] Receipt-chain audit clean

Sr signature (session ID): `_________________________`
Verified at: `_______________`
