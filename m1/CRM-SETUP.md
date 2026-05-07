# Owner OS / CRM — Setup Runbook

Backend CRM for Conscience Os. Captures public intake → DB → operator dashboard at `/app/leads` with status pipeline + notes.

This runbook gets the system **functional in ~10 minutes** end-to-end. Vessel-side actions only.

---

## What's already built

- ✅ Schema: `leads` + `lead_notes` (Drizzle ORM, Postgres)
- ✅ API: `POST /api/lead` (public intake), `/api/leads` (auth-gated list), `/api/leads/[id]` (auth-gated get/patch/delete), `/api/leads/[id]/notes` (auth-gated)
- ✅ Auth: env-based admin login (`/app/login` → JWT cookie → middleware-gated `/app/*`)
- ✅ UI: `/app/leads` (list with status badges), `/app/leads/[id]` (detail w/ status + tier controls + notes timeline)
- ✅ Migration: `drizzle/0000_init.sql` (ready to apply)
- ✅ Graceful degradation: pages show a "Database not connected" panel until `DATABASE_URL` is set

---

## What you need to do (~10 min)

### 1. Provision Postgres on Neon (free tier, zero-spend)

The fastest path is Vercel Marketplace → Neon. It auto-injects `DATABASE_URL` into the Vercel project.

1. Open the Vercel dashboard for the `conscience-os` project.
2. Storage tab → **Create Database** → **Neon Postgres** → Free tier.
3. Pick a region close to where most users will hit the app (default `us-east-1` is fine).
4. Connect it to the project. Vercel injects `DATABASE_URL` automatically into Production + Preview env scopes.

**Alternative (CLI):**

```bash
vercel link  # if not already linked
vercel storage create neon
vercel env pull .env.local  # syncs DATABASE_URL locally
```

### 2. Generate auth secrets

In your terminal, run:

```bash
# JWT secret
openssl rand -base64 48

# Password hash (replace 'your-actual-password')
node -e "console.log(require('bcryptjs').hashSync('your-actual-password', 12))"
```

Copy both outputs — you'll paste them into Vercel env in step 3.

### 3. Set Vercel env vars

```bash
vercel env add JWT_SECRET production            # paste the openssl output
vercel env add ADMIN_EMAIL production            # e.g. jared@conscienceos.com
vercel env add ADMIN_PASSWORD_HASH production    # paste the bcrypt output
```

(Repeat with `preview` and `development` scopes if you want them everywhere — recommended.)

### 4. Apply the migration

Pull the **production** env vars locally so Drizzle migrates against the same DB the deployed app will use:

```bash
vercel env pull .env.local --environment=production
```

Verify `.env.local` actually contains the Neon `DATABASE_URL` before migrating:

```bash
grep -q '^DATABASE_URL=' .env.local && echo "DATABASE_URL: present" || echo "DATABASE_URL: MISSING — re-run env pull"
```

If missing, the env scope was wrong. Re-run with explicit `--environment=production` and confirm the Vercel project link is `conscience-os`.

Run the migration:

```bash
npm run db:migrate
```

You should see `0000_init` applied. The `leads` and `lead_notes` tables now exist.

### 5. Trigger a redeploy

```bash
vercel deploy --prod --yes
```

(Vercel triggers an automatic deploy when env vars change, but a manual deploy ensures the new build picks up `DATABASE_URL`.)

### 6. Verify both paths (do not skip step 3)

An empty dashboard only proves auth works, not DB write-through. Both paths must be tested before declaring the CRM functional.

1. Open `https://conscience-os.vercel.app/app/login` and sign in with the email + password you set. You should land on `/app/leads`.
2. In another tab, submit a test intake at `/book` (name + email + business + business type + problems).
3. Refresh `/app/leads`. The test lead should appear within ~5 seconds.
4. Click into the lead. Change its status, change its tier, add a note. Refresh once more — all three should persist.

If step 3 fails (login works but no lead appears), the DB write path is broken. Most likely cause: `DATABASE_URL` was set to a different env scope than the deployed environment, or the migration ran against a different DB. Re-pull production env vars (`vercel env pull .env.local --environment=production`), confirm the URL host matches the live deploy, and force a fresh `vercel deploy --prod --yes`.

---

## Local development

Once `.env.local` is pulled (`vercel env pull .env.local`):

```bash
npm run dev
# open http://localhost:3000/app/login
```

Drizzle Studio (visual DB browser):

```bash
npm run db:studio
```

---

## Lock-state reference

| Item                 | Where                                              | Lock condition                         |
| -------------------- | -------------------------------------------------- | -------------------------------------- |
| Postgres provisioned | Vercel Storage                                     | DATABASE_URL injected automatically    |
| Migrations applied   | `npm run db:migrate`                               | `leads` + `lead_notes` exist           |
| Auth secrets         | `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | All 3 set in Vercel env                |
| First sign-in        | `/app/login`                                       | Cookie set, redirected to `/app/leads` |
| First lead through   | `/book` form submit                                | Lead row appears in `/app/leads`       |

When all five hold, the CRM is functional end-to-end.

---

## What's deferred (next rounds)

- Multi-user support (currently single env-based admin)
- Lead source attribution (UTM tracking on /book)
- Pagination + filter / search on the leads list
- Dashboard summary page (`/app` → currently redirects to `/app/leads`)
- Contacts / projects / revenue tracking (M4 modules)
- Notifications (email + in-app on new lead)
- AI summary integration on intake (deferred to first paying client per zero-spend)
- Rate limiting + bot mitigation on `POST /api/lead` (currently uncapped; PII writes to Vercel logs). Add when public traffic ramps. (Surfaced by Porygon audit on 2026-05-06.)
