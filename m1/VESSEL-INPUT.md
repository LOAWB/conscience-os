# Vessel Input — fields awaiting finalization

The site ships staged-but-real on `https://conscience-os.vercel.app`. This doc tracks every placeholder Vessel needs to replace before public launch. Each item is small; the site degrades gracefully until each is locked.

---

## 1. Pricing

**File:** `src/lib/site-config.ts`, `pricingTiers`

**Current values (flagged `DRAFT_PRICE`):**

| Tier                  | Price         | Period      | Status |
| --------------------- | ------------- | ----------- | ------ |
| Business System Audit | \$2,500       | one-time    | DRAFT  |
| Custom Software Build | Custom quoted | after audit | DRAFT  |
| Monthly Support       | \$4,000       | /month      | DRAFT  |

**To finalize:**

- [ ] Confirm or amend each `price` field
- [ ] Confirm `includes` bullet list per tier (six bullets each currently)
- [ ] When locked, remove `flag: "DRAFT_PRICE"` from each tier
- [ ] Pricing page foot-note `[DRAFT — Vessel-confirm before public launch]` auto-hides when no tier carries the flag

**Lock when:** real prices are committed and the foot-note disappears on `/pricing`.

---

## 2. Splash Bros real metrics

**File:** `src/lib/site-config.ts`, `splashBros.metrics`

**Current values (every metric flagged `DRAFT`):**

| Metric                        | Before  | After  | Delta |
| ----------------------------- | ------- | ------ | ----- |
| Cars per hour                 | 8       | 14     | +75%  |
| Monthly revenue               | ~\$28K  | ~\$45K | +61%  |
| Reconciliation time per close | 120 min | 10 min | −92%  |
| Payment-dispute rate          | 7%      | 1.5%   | −79%  |
| Staff hours saved per week    | —       | 12 hrs | new   |

**To finalize:**

- [ ] Replace each metric with real numbers from Splash Bros engagement
- [ ] When verified, remove `flag: "DRAFT"` from each row
- [ ] Optional: photos / screenshots for the case study (currently none — page renders fine without)
- [ ] Optional: customer testimonial (`splashBros.customerVoice`, currently `null`); set to `{ quote, attribution }` to render the quote block

**Lock when:** all five `flag: "DRAFT"` are removed; case-study DRAFT banner auto-hides.

**The `04 / Value` panel** on the case-study page hard-codes three derived numbers in the page layout (revenue lift, time saved, risk reduced). When metrics are finalized, also update those three values in `src/app/case-study/splash-bros/page.tsx` to match.

---

## 3. About bio

**File:** `src/app/about/page.tsx`

**Current state:** placeholder operator narrative scaffold (3 paragraphs) with a footer note flagging it as draft. Founder photo placeholder is a gradient block.

**To finalize:**

- [ ] Replace the three-paragraph scaffold with a real 200-400 word operator-voice bio
- [ ] Drop a real founder photo (square, 1024×1024+) at `public/founder.jpg` and replace the gradient block with `next/image`
- [ ] Remove the `[Vessel: drop in...]` scaffold marker line

---

## 4. Voice samples (for shadow copy mimicry across pages)

**File:** new file `m1/voice-samples.md` (Vessel writes this)

**Why:** per `02-itemized-needs.md` §A2 / §E, the operator-voice samples are not shadow-delegable. Five sample sentences in Vessel's natural voice anchor every page's copy direction.

**Format:** five sentences, each capturing a different beat:

1. How you describe the problem to a peer
2. How you describe what you do
3. How you talk to a skeptical customer
4. How you describe the outcome of an engagement
5. How you say "no" to a bad-fit lead

**To finalize:**

- [ ] Write the five samples (10–15 minutes)
- [ ] Drop into `m1/voice-samples.md` or paste into Discord
- [ ] Shadow uses these as the rewrite anchor for landing copy, services copy, case study copy, about copy, and the booking confirmation email

---

## 5. Email system (Resend wiring)

**File:** `src/app/api/lead/route.ts` (already plumbed; env-gated)

**Current state:** /api/lead works without `RESEND_API_KEY` (logs to console). When the key lands, two emails fire on every intake:

1. **Internal copy** to `LEAD_INBOX` (default `hello@conscienceos.com`) — full intake summary
2. **Confirmation** to the submitter — simple text email, no spam feel, sets the "real reply within one business day" expectation

**To finalize:**

- [ ] Sign up at `resend.com` (free tier: 100 emails/day, 3,000/mo — sufficient for v1.0)
- [ ] Add Resend's DNS records to Cloudflare for `conscienceos.com` (DKIM, SPF, return-path)
- [ ] Verify domain in Resend dashboard
- [ ] Capture `RESEND_API_KEY`
- [ ] Set Vercel env vars: `RESEND_API_KEY`, `LEAD_INBOX=hello@conscienceos.com`, `LEAD_FROM="Conscience OS <hello@conscienceos.com>"`
- [ ] Submit a test intake on `/book`; verify both emails deliver (internal copy + submitter confirmation)
- [ ] Mirror env vars on Railway when production cutover happens

**Reference:** `.env.example` at repo root has every var commented.

---

## Lock-state at a glance

| Item                | File                     | Lock condition                              |
| ------------------- | ------------------------ | ------------------------------------------- |
| Pricing             | `src/lib/site-config.ts` | Remove `flag: "DRAFT_PRICE"` from each tier |
| Splash Bros metrics | `src/lib/site-config.ts` | Remove `flag: "DRAFT"` from each row        |
| About bio           | `src/app/about/page.tsx` | Replace scaffold + photo placeholder        |
| Voice samples       | `m1/voice-samples.md`    | File exists with 5 sentences                |
| Email system        | Vercel + Railway env     | `RESEND_API_KEY` set + test intake delivers |

When all five lock conditions are met, M1.2 closes and M2 (post-launch growth + SEO + analytics + advanced flows) becomes available.
