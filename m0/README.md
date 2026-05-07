# M0 — Day Zero Foundation

This directory holds Day-Zero foundation artifacts: the non-code work that has to land before shadows file lane-claim packets and M1 build labor begins.

Per `01-build-scope.md` §425-441, M0 acceptance criteria are:

> Vessel checklist complete: free accounts created (Sentry, Resend, Cal.com or self-host decision, Plausible/Umami decision), Cloudflare Email Routing configured, Splash Bros case study metrics gathered, voice samples written, repo structure decision made.

## Files in this directory

| File                | What it covers                                        | Owner                      |
| ------------------- | ----------------------------------------------------- | -------------------------- |
| `README.md`         | This index                                            | Jr                         |
| `DOMAIN-DNS.md`     | Current domain state and the M1 DNS cutover plan      | Jr                         |
| `REPO-STRUCTURE.md` | Monorepo vs single-Next.js trade-off + recommendation | Jr drafts → Vessel decides |
| `LANE-PROPOSAL.md`  | Sr's Split A formalized as a lane-claim packet draft  | Jr drafts → Vessel signs   |

## Vessel-only items still open (per `02-itemized-needs.md` §A1, §E, §H)

These are not shadow-delegable and stay on Vessel's plate:

- [ ] Sentry free-tier signup, capture DSNs (web + api)
- [ ] Resend free-tier signup, capture API key
- [ ] Cal.com decision (free tier vs self-host)
- [ ] Plausible vs self-host Umami decision
- [ ] Cloudflare Email Routing config (`hello@` / `contact@` / `jared@` → Vessel Gmail)
- [ ] Splash Bros case-study metrics (numbers, photos, testimonial)
- [ ] 5 sample sentences in operator voice (source samples for shadow voice mimicry)

## Done

- [x] Domain `conscienceos.com` registered on Cloudflare Registrar (2026-05-04)
- [x] GitHub repo `LOAWB/conscience-os` created and scoped
- [x] Build scope locked (`01-build-scope.md`)
- [x] Itemized needs locked (`02-itemized-needs.md`)
- [x] Milestones converted from time-based to needs-based (commit `69afb52`)
- [x] Bridge protocol locked
- [x] Tech stack locked (Node + Postgres + React + Railway)
- [x] Auth pattern locked (JWT + refresh in localStorage + body, Splash Bros pattern)
- [x] Zero-spend discipline locked
