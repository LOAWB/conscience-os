# Repo Structure Decision — Vessel-locked

Issue #1 checkbox: _"Decide repo structure: monorepo OR single Next.js app."_

Per `02-itemized-needs.md` §B1, both options are on the table. This doc surfaces the trade-off and Jr's recommendation. **Vessel decides.**

## Option A — Monorepo (Sr's "recommended" in §B1)

```
LOAWB/conscience-os/
├── web/                  Next.js public marketing site (conscienceos.com)
├── app/                  Next.js Owner OS (app.conscienceos.com)
├── api/                  Node.js backend (api.conscienceos.com OR co-located)
├── db/                   Postgres schema + migrations (Drizzle)
├── packages/
│   ├── ui/               Shared shadcn-themed component library
│   └── types/            Shared TypeScript types + zod schemas
├── package.json          Workspace root
└── pnpm-workspace.yaml   (or turbo.json)
```

Tooling: pnpm workspaces or Turborepo. Three Railway services.

## Option B — Single Next.js app (Sr's "alternative")

```
LOAWB/conscience-os/
├── src/
│   ├── app/                    Next.js App Router
│   │   ├── (marketing)/        Public marketing routes (/, /services, /case-study, /pricing, /book, /about, /intake)
│   │   ├── (legal)/            /legal/privacy, /legal/terms
│   │   ├── app/                Auth-gated Owner OS routes (/app, /app/leads, /app/calendar, /app/projects, /app/clients, /app/revenue, /app/settings)
│   │   └── api/                Backend API routes (auth, leads, bookings, projects, clients, revenue, intake)
│   ├── components/             Shared component library (shadcn-themed)
│   ├── lib/                    Utilities, db client, auth helpers
│   └── types/                  Shared TypeScript types + zod schemas
├── db/
│   ├── schema.ts               Drizzle schema
│   └── migrations/             Migration history
└── package.json
```

Tooling: standard Next.js. One Railway service for web+api, one for Postgres.

## Trade-off table

| Dimension                     | Monorepo (A)                                                                  | Single app (B)                                                          |
| ----------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Setup overhead                | High (pnpm workspaces, Turborepo, build orchestration, three Next.js configs) | Low (one Next.js init, done)                                            |
| Time to M1-M2                 | Slower (foundation wiring eats days before any user-visible work)             | Faster (M1 brand foundation lands sooner)                               |
| Railway services needed       | 3 (web, app, api) + db                                                        | 1 (web+api) + db                                                        |
| Zero-spend fit                | Marginal (Railway free tier service quota is real)                            | Strong (one service vs three)                                           |
| Type / component sharing      | Explicit `packages/` workspaces                                               | Trivial (same `src/`)                                                   |
| CI complexity                 | Moderate (per-app build matrices)                                             | Low (single build)                                                      |
| Auth split                    | Clean (separate apps, separate sessions)                                      | Clean (auth-gated route group `/app/*`, middleware enforces)            |
| Future split-out cost         | Already split                                                                 | Moderate (refactor when team grows past Client #5 per zero-spend tiers) |
| Deploy story                  | Multi-service orchestration                                                   | Single-deploy simplicity                                                |
| Vercel Cache Components / PPR | Same                                                                          | Same (Next.js feature, both work)                                       |
| Linear / Stripe-tier feel     | Independent of structure                                                      | Independent of structure                                                |

## Jr's recommendation: **Option B (single Next.js app)** for v1.0

### Why

1. **Zero-spend discipline cuts both ways.** Monorepo at the size of v1.0 (5 public pages + 7 Owner-OS pages + ~9 API modules) is over-engineered. The split exists to manage scale; we don't have scale yet.
2. **Time to M1 matters.** `01-build-scope.md` is needs-based, but the directive's "deliver a system that feels complete on first use" plus the "first audit client funds the rest" model both reward shipping fast.
3. **Auth-gated route groups are clean.** Next.js 15 App Router with `(marketing)` + `app/` route groups + middleware-based auth on `/app/*` gives the same separation you'd get from two apps, without the overhead.
4. **Splitting later is cheap.** When Client #5 lands and we add a second Next.js app (e.g. team-tier portal), `packages/ui` extraction is a one-day refactor on a working codebase. Pre-paying that cost on day 1 is premature.
5. **Operator-first identity matches a single deploy target.** "We analyze your business, identify inefficiencies, and build custom software systems." Demoing a unified app reinforces the message; demoing three repos and a build matrix doesn't.

### When to revisit

- Client #3-5 lands and team-tier expansion is actively built → split `packages/ui` and consider extracting `app/*` to its own Next.js app
- Backend needs a non-Next.js runtime (e.g. Bun, Hono, Fastify) for performance reasons → extract `api/` to a sibling
- Mobile native client is built (post-v1.0 per scope §504-514) → extract shared types to `packages/types`

## Risks if Option B is picked

- Single Railway service means a deploy failure on the marketing site can take down `/app/*` too. Mitigation: Sentry on every page + uptime monitoring per `01-build-scope.md` §312 (N09).
- Bundle size: marketing routes get the `/app/*` JS by default. Mitigation: Next.js route-segment code splitting + dynamic imports inside `/app/*` keep marketing bundles lean.
- API routes share Next.js runtime constraints (no long-running background jobs). Mitigation: lambda-style request/response pattern is sufficient for v1.0; queue work (if any) deferred per scope §504-514.

## Vessel decision

- [ ] Option A — Monorepo
- [x] Option B — Single Next.js app — _Jr's recommendation_
- [ ] Other (specify)

Vessel signature: `_________________________`
Decision date: `_______________`
