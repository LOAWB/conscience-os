# Railway production deploy — runbook (no cutover yet)

Per `LANE-CHANGE-PROPOSAL-001` (approved 2026-05-04): Railway is the canonical production host. Vercel is interim staging. This doc is the runbook for the cutover when LOAWB write access + Vessel Railway collab land.

**Status:** runbook prepped. Cutover gated on access. Do not execute until Vessel green-lights.

---

## Preconditions

- [ ] `JaredBlvck` granted write access to `LOAWB/conscience-os` (Issue #1 BLOCKER, see PR #9)
- [ ] `JaredBlvck` invited as Railway collaborator on Vessel's Railway account
- [ ] Vessel signs off on cutover (PR review or Discord `[TYPE: ACTION]` post)

## Stack profile

Railway provisions Next.js apps via Nixpacks (default builder). The repo needs no Dockerfile, no `railway.json`, no `nixpacks.toml`. Railway auto-detects Next.js from `package.json`.

What Railway will use:

- Build command: `npm run build` (auto-detected)
- Start command: `npm start` (auto-detected)
- Port: `$PORT` env (Railway-provided; Next.js reads it automatically since v13)
- Node version: pinned to current LTS via Railway's nixpacks default; can be locked via `engines.node` in `package.json` if needed

## Cutover steps

### 1. Provision Railway services (10 min)

In Railway dashboard:

- Create new project: `conscience-os`
- Connect GitHub: `LOAWB/conscience-os` repo, `main` branch
- Service 1: `conscience-web`
  - Source: this repo
  - Auto-deploy: on push to `main`
  - Region: us-east-1 (or operator's preference)
- Service 2: `conscience-db` (Postgres add-on)
  - Plugin: Railway Postgres
  - Captures `DATABASE_URL` env automatically and exposes to web service
- API runs as Next.js API routes inside `conscience-web` for v1.0 (no separate `conscience-api` service needed per REPO-STRUCTURE Option B)

### 2. Set environment variables (5 min)

In Railway → conscience-web → Variables, add the same env vars currently on Vercel:

```
RESEND_API_KEY=        (from Vessel M0 CHECKLIST item #2)
LEAD_INBOX=hello@conscienceos.com
LEAD_FROM="Conscience OS <hello@conscienceos.com>"
SENTRY_DSN_WEB=        (from Vessel M0 CHECKLIST item #1)
SENTRY_DSN_API=        (from Vessel M0 CHECKLIST item #1)
LEAD_DISCORD_WEBHOOK=  (optional, separate channel)
```

`DATABASE_URL` is auto-injected from the Postgres service.

### 3. First deploy (5 min)

- Push or merge a no-op commit to `main` → Railway auto-builds
- Watch build logs in Railway dashboard
- Verify Railway-issued hostname (e.g. `conscience-web-production.up.railway.app`) returns 200 from `/`

### 4. DNS cutover (per `m0/DOMAIN-DNS.md` D1-D7)

In Cloudflare DNS for `conscienceos.com`:

- Add `CNAME conscienceos.com → <railway-hostname>` (proxy OFF — Railway terminates TLS)
- (Optional) Add `CNAME app.conscienceos.com → <railway-hostname>` if Owner OS app is split later

In Railway → conscience-web → Settings → Custom Domain:

- Add `conscienceos.com`
- Verify ownership (Railway issues a TXT challenge)
- Wait for SSL cert issuance (Let's Encrypt, ~5-15 min)

Verify:

```
curl -I https://conscienceos.com
# → 200 from Railway with valid SSL
```

### 5. Retire Vercel staging

Once Railway production is verified live on `conscienceos.com`:

- In Vercel project settings → Domains → remove `conscience-os.vercel.app` alias OR set 301 redirect to `conscienceos.com`
- Pause Vercel deploys (project → settings → general → "Pause auto-deploys") so future pushes only fire on Railway
- Document the retirement in `bridge/receipts/<TS>-vercel-retired.md`

### 6. Audit-chain receipt

File `bridge/receipts/<TS>-railway-cutover-complete.md`:

```yaml
---
event_type: handoff
source_shadow: jr-foreman
target_shadow: vessel, sr
artifact: conscienceos.com → Railway
parent_receipt_id: 2026-05-05-020100-jr-response-vercel-proposal
---
```

Body: cutover complete, all five proposal commitments fulfilled, Vercel retired.

## Risks

- **DNS propagation lag:** typical 5-10 min on Cloudflare. Don't false-flag step 4 green until `dig conscienceos.com` returns the Railway IPs.
- **SSL cert issuance lag:** Let's Encrypt can take 5-15 min after Railway's custom-domain verification. Don't false-flag until `curl -I` returns valid cert.
- **Concurrent staging traffic:** if any staging URL is shared externally, switch traffic to apex first (DNS), confirm green, then retire Vercel. Don't pull Vercel before Railway is verified live.

## Estimated total time

20-30 minutes from "Vessel grants access" to "live on `conscienceos.com`," not counting SSL provisioning lag.
