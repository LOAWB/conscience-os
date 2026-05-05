# Itemized Needs — Conscience OS v1.0

Comprehensive list of everything required to ship Conscience OS v1.0 under the zero-spend discipline locked in `01-build-scope.md`. Organized by ownership (Vessel vs Shadow) so each side knows what they own, and by category so nothing slips.

Already paid: $10 for conscienceos.com domain (Cloudflare Registrar, ICANN-verified 2026-05-04).
Remaining v1.0 spend until first client signs: **$0**.

---

## A. Vessel-owned actions (Jared's responsibility)

### A1. Free accounts to create or confirm

| Item | Status | Notes |
|------|--------|-------|
| GitHub account with LOAWB org access | Existing | Owner of LOAWB/conscience-os already created |
| Cloudflare account | Existing | conscienceos.com lives here |
| Railway account | Existing | Vessel's Railway — billing under his name from day-one |
| Sentry account | TODO | Free tier (5K errors/mo). Sign up at sentry.io |
| Resend account | TODO | Free tier (100 emails/day). Sign up at resend.com |
| Cal.com account | TODO | Free tier OR self-host on Railway. Sign up at cal.com |
| Plausible (or Umami) | TODO | Self-host on Railway (free). Or Plausible SaaS free tier (limited) |
| Anthropic API console | DEFER | Wait until first paying client triggers AI summary feature |

### A2. Brand decisions Vessel must lock

| Item | What's needed | When |
|------|---------------|------|
| Logo direction | Either commission designer OR pick from shadow-proposed AI-generated options | Week 1 |
| Color palette | Lock primary + secondary + semantic colors (or pick from shadow proposals) | Week 1 |
| Typography pairing | Sign off on display + body + mono fonts (shadow proposes 3 options) | Week 1 |
| Voice + tone samples | Provide 5 sample sentences in operator voice that shadows can mimic | Week 1 |
| Founder photo / headshot | Operator photo for About page hero | Week 2 |

### A3. Content Vessel must provide

| Item | What's needed | When |
|------|---------------|------|
| Founder bio | 200-400 word About page narrative (operator-first identity) | Week 2 |
| Splash Bros case study metrics | Real before/after numbers (cars/hour, revenue, errors, etc.) | Week 2 |
| Splash Bros customer quote | If available, a real customer testimonial | Week 2 |
| Audit pricing decision | Explicit dollar amount for the Audit tier (entry-point lead magnet) | Week 5 |
| Monthly Support pricing decision | Explicit dollar amount per month | Week 5 |
| Build tier example ranges | Realistic price ranges to display under "custom quoted" | Week 5 |

### A4. Deployment ops Vessel owns

| Item | What's needed | When |
|------|---------------|------|
| Railway service auth | Vessel's Railway account hosts the apps; access shared with shadows via collaborator invite | Week 1 |
| DNS pointing | conscienceos.com CNAME → Railway service hostname | Week 1 |
| Email forwarding | Cloudflare Email Routing: hello@ / contact@ / jared@ → Vessel's stable Gmail | Week 1 |
| Sentry DSN | Add Sentry DSN to Railway environment variables for web + api | Week 2 |
| Resend API key | Add to Railway env vars for outbound transactional email | Week 2 |
| Plausible / Umami | Self-hosted on Railway, or SaaS account; analytics ID added to web env | Week 2 |
| Anthropic API key | DEFERRED — added to env vars when first paying client lands | Post-launch |

### A5. Weekly milestone sign-offs

| Item | What's needed | Cadence |
|------|---------------|---------|
| End-of-week demo | Vessel reviews shipped milestone, confirms acceptance criteria met | Weekly |
| Asset master list review | Verify status flags (PROMPTED / RENDERING / SELECTED / REFINED / SHIPPED) | Weekly |
| Lane-claim packet sign-off | Sign off on shadow lane claims at day 2 before build begins | Day 2 |
| Brand asset sign-off | Approve logo, colors, typography before component library locks | Week 1 |
| Content sign-off | Approve founder bio, case study, voice samples before site launch | Week 2 |
| Pricing sign-off | Lock final prices before pricing page ships | Week 5 |
| Launch readiness signoff | Approve final v1.0 launch after all Q01-Q08 audits pass | Week 6 |

---

## B. Shadow-owned actions (build labor)

### B1. Repository structure

Recommended: monorepo at `LOAWB/conscience-os` with two Next.js apps:
- `/web` — public marketing site (conscienceos.com)
- `/app` — internal Owner OS (app.conscienceos.com)
- `/api` — shared Node.js backend
- `/db` — PostgreSQL schema + migrations
- `/packages/ui` — shared component library (shadcn/ui themed)
- `/packages/types` — shared TypeScript types

Alternative: single Next.js app with /app routes auth-gated. Cleaner for v1.0 simplicity.

Shadows decide repo structure in lane-claim packet day 2.

### B2. Tech setup per app

| Item | Library / Tool |
|------|----------------|
| Framework | Next.js 15 + React 19 |
| Styling | Tailwind CSS 4 + shadcn/ui (themed) |
| ORM | Drizzle ORM (recommended) or Prisma |
| Auth | JWT + refresh tokens in localStorage + body (Splash Bros pattern) |
| Form handling | react-hook-form + zod validation |
| Email outbound | Resend SDK |
| Error tracking | Sentry SDK |
| Analytics | Plausible or Umami client |
| State | React Query (TanStack Query) for server state, Zustand for UI state |

### B3. Pages to implement

**Public site (web):**
- `/` — landing page
- `/services` — services with 4 cards
- `/case-study` — Splash Bros narrative
- `/book` — integrated scheduler
- `/about` — operator-first identity
- `/pricing` — three tiers visualized
- `/intake` — multi-step intake form (linked from CTAs)
- `/legal/privacy` — privacy policy
- `/legal/terms` — terms of service

**Owner OS (app, auth-gated):**
- `/app` — dashboard (live ops view)
- `/app/leads` — Lead Management module
- `/app/calendar` — Booking + Calendar module
- `/app/projects` — Project Tracker module
- `/app/clients` — CRM-lite module
- `/app/revenue` — Revenue Tracking module
- `/app/settings` — account, branding, integrations

### B4. Backend API modules

- Auth endpoints (login, refresh, logout, me)
- Leads CRUD + status transitions
- Bookings CRUD + calendar sync
- Projects CRUD + status / deliverable tracking
- Clients CRUD + contact management
- Revenue events (deal closed, MRR calc, monthly summary)
- Intake form submission handler (writes new lead with intake metadata)
- Anthropic AI summary integration (deferred wiring; scaffold ships v1.0)
- Notifications (email via Resend, in-app via WebSocket or polling)

### B5. Infrastructure setup

- Railway project with three services:
  - `conscience-web` (Next.js public site)
  - `conscience-app` (Next.js Owner OS — could be same service with route-based split)
  - `conscience-api` (Node.js backend, OR Next.js API routes)
  - `conscience-db` (PostgreSQL via Railway add-on)
- Environment vars:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `RESEND_API_KEY`
  - `SENTRY_DSN_WEB` / `SENTRY_DSN_API`
  - `CAL_COM_API_KEY` or webhook secret
  - `PLAUSIBLE_API_KEY` (if SaaS)
  - `ANTHROPIC_API_KEY` (deferred until first client)
- Custom domain: conscienceos.com → web service via Railway custom domain config
- App subdomain: app.conscienceos.com → app service (or same service, /app route)
- API subdomain: api.conscienceos.com → api service (optional — can co-locate)
- CI/CD: Railway auto-deploy on main branch push
- Backup strategy: Railway Postgres daily backup + weekly export to S3 (deferred to post-launch)

### B6. Brand identity implementation

- Tailwind config with color tokens, typography scale, spacing scale, shadow tokens
- Logo SVG embedded as React component
- Favicon set generated (favicon.ico, apple-touch-icon, manifest)
- OpenGraph image generated for each page
- Component library themed to brand:
  - Button variants (primary, secondary, ghost, link, destructive)
  - Card variants
  - Form inputs (text, textarea, select, checkbox, radio)
  - Navigation (top nav, mobile hamburger, footer)
  - Modal / sheet patterns
  - Toast notifications

### B7. Asset rendering pipeline (Vessel hands-on, shadow templating)

- Business card SVG/PDF templates (shadow generates, Vessel reviews and orders print)
- QR code generation utility (shadow builds, embeds in pitch deck and audit sheet)
- Audit sheet PDF template (shadow builds, Vessel fills per client)
- Email signature HTML template (shadow builds)
- Pitch deck Figma file or PDF template (shadow builds, Vessel reviews)

---

## C. API keys / secrets needed (free tier)

| Service | Purpose | Where to get | Status |
|---------|---------|--------------|--------|
| Sentry DSN (web) | Error tracking on public site | sentry.io after signup | TODO Week 2 |
| Sentry DSN (api) | Error tracking on backend | sentry.io after signup | TODO Week 2 |
| Resend API key | Outbound email (booking, lead notifs) | resend.com after signup | TODO Week 2 |
| Cal.com API key or webhook secret | Booking sync | cal.com after signup OR self-host | TODO Week 2 |
| Plausible / Umami | Site analytics | self-host on Railway | TODO Week 2 |
| JWT_SECRET | Auth signing | generate random 32-byte hex string | TODO Week 1 |
| JWT_REFRESH_SECRET | Refresh token signing | generate random 32-byte hex string | TODO Week 1 |
| Anthropic API key | Intake AI summary | console.anthropic.com (DEFERRED) | TODO post-first-client |

---

## D. Physical assets needed

### D1. Day-1 (digital, $0)
- Vessel headshot for About page hero (use existing photo, or a clean phone-camera shot)
- Splash Bros before/after screenshots or photos (already exist in your archives)
- Logo files in SVG (designed by shadow OR commissioned)

### D2. Day-7+ (physical print, deferred until first audit booked)
- Business card print order (~$20-50 from MOO or Vistaprint, deferred)
- Branded QR codes (auto-generated, free, embed in audit sheet + pitch deck)
- Audit sheet PDF (templated by shadow, printed on-demand by Vessel before client meetings)

---

## E. Non-code work Vessel must execute (cannot be shadow-delegated)

| Item | Why Vessel-owned |
|------|------------------|
| Voice + tone sampling (5 sentences in operator voice) | Shadows can mimic but need source samples from you |
| Brand taste decisions (logo direction, color palette pick) | Subjective; vision-LLM scores but final pick is yours |
| Pricing decisions | Business decision based on your market knowledge + risk tolerance |
| Splash Bros case study metrics | Real numbers only you have access to |
| Customer testimonial outreach (if pursued) | Trust relationship between you and Splash Bros customers |
| Domain DNS configuration in Cloudflare | Brand ownership integrity |
| Each weekly milestone demo + sign-off | Vessel approval gates the next milestone |
| Krita / Figma hand-touch on hero portraits / logo | Final 2% from 98% AI gen to 100% finished |
| First audit client outreach + closing | Sales motion only you can execute |

---

## F. Post-first-client deferred spend (in priority order)

When first audit client signs and pays, this list gets funded with that revenue:

| Tier | Item | Cost | Trigger |
|------|------|------|---------|
| 1 | LLC formation (Doola or Stripe Atlas) | $500 setup + $50/mo state | First client signs |
| 1 | EIN from IRS | Free | Day after LLC formed |
| 1 | Mercury business banking | Free | EIN issued |
| 1 | Stripe activation | Free (% per transaction) | Mercury active |
| 1 | Anthropic API key + first $20 in credits | $20 | First client triggers AI summary |
| 2 | 1Password Business | $8/user/mo | Client #2 |
| 2 | Mac Mini M4 Pro 24GB + UPS + SSD | ~$1,749 | Client #3 (workstation upgrade for shadow bridge clone terminal load) |
| 2 | E&O / tech professional liability insurance | $600-1500/yr | Client #4-5 |
| 3 | Bookkeeper or QuickBooks | $30-100/mo | Client #5 (or build internal per Phase 4) |
| 3 | Contract management (DocuSign or build) | $25-60/mo | Client #6 (or build internal per Phase 3) |
| 3 | Paid uptime monitoring (BetterStack) | $25/mo | Client #6 (or build internal per Phase 2) |
| 3 | Backup hosting plan (DO or Hetzner) | $20/mo | Client #8 |
| 4 | First hire (VA or junior dev) | $1500-3500/mo VA, $5K-10K/mo dev | Client #10-12 |

Each tier is funded by clients in that tier, not pre-revenue burn. Discipline holds.

---

## G. Total v1.0 ledger

| Phase | Cost | Status |
|-------|------|--------|
| Domain (already paid) | $10 | DONE |
| All v1.0 build infrastructure | $0 | Locked under zero-spend discipline |
| First-client unlock (LLC + EIN + Mercury + Stripe + Anthropic credits) | ~$520 | Funded by first audit client revenue |

v1.0 ships at $10 total Vessel spend. Build labor is the shadow runtime on Vessel's existing Anthropic subscription. First audit client funds everything else.

---

## H. Day-zero checklist for Vessel

Before shadows start week 1, Vessel knocks out this checklist (~30 min total):

- [ ] Confirm GitHub LOAWB org access for shadows (already done)
- [ ] Confirm Cloudflare account holds conscienceos.com (done)
- [ ] Confirm Railway account active and billing OK (existing)
- [ ] Sign up Sentry free tier, capture DSNs for web + api projects
- [ ] Sign up Resend free tier, capture API key
- [ ] Sign up Cal.com free tier, OR delegate self-host to shadow (decide)
- [ ] Self-host Umami on Railway or sign up Plausible (decide; defer Plausible if budget-tight)
- [ ] Configure Cloudflare Email Routing: hello@ / contact@ / jared@ → Vessel's stable Gmail
- [ ] Pull together Splash Bros case study metrics (numbers, photos, testimonial if available)
- [ ] Write 5 sample sentences in your operator voice for shadow voice mimicry
- [ ] Decide: monorepo with /web /app /api OR single Next.js app — surface preference, shadows execute

After this, shadows file lane-claim packets day 2 and build begins.

---

## Bottom line

v1.0 ships for $10 total (the domain, already paid). Every other infrastructure choice is free tier. First audit client revenue funds the post-launch upgrade tiers. Vessel owns brand decisions, content sign-off, and weekly milestone gates. Shadows own code, infra, and integrations. Sr verifies the receipt chain and audits each milestone against acceptance criteria. The discipline is real and binding.
