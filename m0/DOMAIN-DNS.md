# Domain + DNS — Conscience OS

State of `conscienceos.com` and the DNS work needed to ship M1.

## Current state (2026-05-04)

- **Domain:** `conscienceos.com`
- **Registrar:** Cloudflare Registrar (Vessel's account, `garciajared2203@yahoo.com`)
- **Cost:** \$10 paid at registration
- **ICANN verification:** complete
- **WHOIS Privacy:** ON
- **Auto-renew:** ON
- **DNS records:** none beyond default Cloudflare nameservers; no traffic routed yet
- **SSL:** Cloudflare Universal SSL active by default, no custom certs needed
- **Email:** Cloudflare Email Routing not yet configured
- **Status:** parked. No HTTP/HTTPS traffic served. Visiting the domain returns Cloudflare's default landing.

## What M1 needs

Per `01-build-scope.md` §232-234 (W02) and §304 (N01):

| Step | Action                                                                                                                                          | Owner                                                       |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| D1   | Provision Railway project + create `conscience-web` service                                                                                     | Shadow (face-a)                                             |
| D2   | In Railway, generate the public hostname for `conscience-web` (e.g. `conscience-web-production.up.railway.app`)                                 | Shadow (face-a)                                             |
| D3   | In Cloudflare DNS, add: `CNAME conscienceos.com → <railway-hostname>` (proxied OFF for Railway, since Railway terminates TLS)                   | Shadow (face-a) — Vessel must approve in Cloudflare console |
| D4   | In Railway custom-domain config, add `conscienceos.com` and verify ownership                                                                    | Shadow (face-a)                                             |
| D5   | In Cloudflare DNS, add: `CNAME app.conscienceos.com → <railway-hostname>` and `CNAME api.conscienceos.com → <railway-hostname>` if API is split | Shadow (face-a)                                             |
| D6   | Verify SSL cert provisions cleanly (Railway auto-issues Let's Encrypt)                                                                          | Shadow (face-a) + Sr                                        |
| D7   | `curl -I https://conscienceos.com` returns 200 from Railway                                                                                     | Shadow (face-a)                                             |

## Cloudflare proxy decision

Railway terminates TLS at its own edge and issues its own Let's Encrypt cert via the custom-domain flow. Cloudflare proxy ON would interfere with Railway's cert issuance unless Cloudflare is configured to use Full (strict) mode AND Railway's cert is trusted as the origin. Simpler v1.0: Cloudflare proxy OFF (DNS-only orange-cloud disabled). Re-enable later if we need Cloudflare's CDN/WAF.

Trade-off if proxy stays OFF:

- Lose Cloudflare DDoS shielding and the analytics overlay
- Gain a clean Railway-controlled deploy with no edge-config drift
- Re-enable in M6 (polish) if traffic warrants

## Email Routing (Vessel-only, M1 gate)

Per `02-itemized-needs.md` §A4 / §H, Cloudflare Email Routing has to be configured by Vessel:

- `hello@conscienceos.com` → Vessel's stable Gmail
- `contact@conscienceos.com` → Vessel's stable Gmail
- `jared@conscienceos.com` → Vessel's stable Gmail

Cloudflare Email Routing is free tier. Setup path: Cloudflare dashboard → Email → Email Routing → Routes. No SPF/DKIM/DMARC tweaks needed for inbound-only forwarding.

Outbound transactional email (booking confirms, lead notifs) is handled by Resend per `01-build-scope.md` §388-399, NOT by Cloudflare. Resend signup is also Vessel-only (free-tier API key).

## Subdomains needed for v1.0

| Subdomain              | Service                            | Notes                                                                  |
| ---------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `conscienceos.com`     | `conscience-web` (public site)     | Apex, primary brand surface                                            |
| `app.conscienceos.com` | `conscience-app` (Owner OS)        | Auth-gated, internal use                                               |
| `api.conscienceos.com` | `conscience-api` (Node.js backend) | Optional — can co-locate as Next.js API routes inside `conscience-web` |

If REPO-STRUCTURE recommendation is "single Next.js app," then `api.` subdomain is unnecessary; API routes live at `/api/*` on the apex.

## Open dependencies

- D3 requires Vessel access to Cloudflare console for DNS edits OR shadow access via Cloudflare API key (Vessel-only to provision)
- D4 requires Railway project provisioning, which is gated on `02-itemized-needs.md` §A4 ("Railway service auth — Vessel's Railway account hosts the apps; access shared with shadows via collaborator invite")
- M1 cannot ship until D1-D7 complete

## Risks

- **Cloudflare Email Routing limits:** free tier caps at 200 destinations and ~unlimited inbound forwarding. Within v1.0 envelope.
- **DNS propagation:** ~5-10 min typical, document-tested before declaring D7 green.
- **SSL provisioning lag:** Railway can take 5-15 min to issue the Let's Encrypt cert after custom domain is added. Don't false-flag M1 acceptance until cert is verified live.
