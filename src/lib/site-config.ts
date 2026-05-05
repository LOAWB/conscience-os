export const siteConfig = {
  name: "Conscience OS",
  url: "https://conscienceos.com",
  description:
    "We build systems that increase revenue and reduce operational friction. Custom-built software and workflows designed around how your business actually runs.",
  headline:
    "We build systems that increase revenue and reduce operational friction.",
  subhead:
    "Custom-built software and workflows designed around how your business actually runs.",
  pillar:
    "We analyze your business, identify inefficiencies, and build custom software systems that increase revenue and eliminate operational friction.",
  ctaPrimary: { label: "Book a System Audit", href: "/book" },
  ctaSecondary: { label: "See the work", href: "/case-study" },
  trustSignals: [
    "Built for real businesses",
    "Custom systems, not templates",
    "Operator-first identity",
  ],
  contact: { email: "hello@conscienceos.com" },
  nav: [
    { label: "Services", href: "/services" },
    { label: "How to work together", href: "/work-together" },
    { label: "Case study", href: "/case-study" },
    { label: "About", href: "/about" },
  ],
} as const;

export type Service = {
  slug: string;
  name: string;
  short: string;
  solves: string;
  builds: string;
  outcomes: string;
};

export const services: Service[] = [
  {
    slug: "audit",
    name: "Business System Audit",
    short: "Find what's costing you money. Two weeks. Concrete fix list.",
    solves:
      "Operational drag you can feel but can't quite name. Friction that compounds across staff, software, and customer flow.",
    builds:
      "A written audit covering every system in your business, what's broken, what's leaking revenue, and the specific software fixes ranked by ROI.",
    outcomes:
      "A prioritized punch list. Real numbers on each fix. Decision: build with us, hire someone, or do it yourself.",
  },
  {
    slug: "build",
    name: "Custom Software Builds",
    short: "Software that works for your business, not against it.",
    solves:
      "Off-the-shelf tools that don't fit. Manual processes that should be automated. Reports nobody can run.",
    builds:
      "Production-grade web apps, dashboards, internal tooling, customer-facing portals. Built on Node, Postgres, React, deployed to your infrastructure.",
    outcomes:
      "A working system in your business. Owned outright. No subscription tax. Maintained by us or handed off to your team.",
  },
  {
    slug: "automation-ai",
    name: "Automation + AI Systems",
    short: "Cut the manual. Keep the judgment.",
    solves:
      "Repetitive work eating staff time. AI-shaped tasks like summarization, classification, and extraction handled by humans because no one wired the API.",
    builds:
      "Targeted automations on Anthropic Claude, OpenAI, or open-source models. Workflows that route, draft, classify, and surface only the decisions humans should make.",
    outcomes:
      "Hours back per week. Faster turnaround on customer-facing work. Lower error rate on repetitive tasks.",
  },
  {
    slug: "websites",
    name: "Websites + Customer Flows",
    short: "A site that converts. A flow that closes.",
    solves:
      "Generic SaaS template sites. Dead booking forms. Customer journeys that leak at every step.",
    builds:
      "Premium-tier marketing sites, multi-step intake forms, payment + scheduling integrations, conversion-tracked funnels.",
    outcomes:
      "More qualified leads. Less time on inbox triage. A measurable funnel you can iterate on.",
  },
];

export type EngagementStage = {
  slug: string;
  name: string;
  description: string;
  includes: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
};

export const engagementStages: EngagementStage[] = [
  {
    slug: "audit",
    name: "System Audit",
    description:
      "We analyze your business and identify exactly where systems can improve efficiency and revenue.",
    includes: [
      "Breakdown of current setup",
      "Identified inefficiencies",
      "Custom system direction",
    ],
    cta: { label: "Book a System Audit", href: "/book" },
  },
  {
    slug: "build",
    name: "Custom Build",
    description:
      "Tailored to your business. Production-grade systems scoped directly from the audit findings, deployed on infrastructure you own.",
    includes: [
      "Scope written from audit findings",
      "Custom from start to finish",
      "Source transferred on delivery",
    ],
    cta: { label: "Book a System Audit", href: "/book" },
    highlight: true,
  },
];

export const systemImplementation = {
  industry: "Operational business",
  engagement: "Audit · Build · Ongoing support",
  timeline: "Live, ongoing",
  oneLine:
    "Built from real operational experience inside a working business. Custom centralized system replaced fragmented tools and simplified how the operation runs.",
  context: [
    "Multiple disconnected tools running scheduling, payments, customer history, and team dispatch in parallel",
    "Manual reconciliation and tribal-knowledge workarounds holding the operation together",
    "No unified view of throughput, revenue, or daily flow for the operator",
    "Different staff seeing different versions of the same data",
  ],
  problem: [
    "Fragmented systems: three tools for what should have been one workflow",
    "Manual rework eating hours every shift",
    "Operational friction the team felt every day",
    "No place to see the full state of the business at a glance",
  ],
  solution: [
    "Single centralized system replacing the fragmented stack",
    "Operator dashboard with real-time visibility into the live state of the business",
    "Customer-facing flow with clear receipt history and dispute-proof records",
    "Mobile-first team interface that fits how the operation actually works",
  ],
  outcome: [
    "Simplified workflows that match how the business operates",
    "Unified operations: one place for bookings, dispatch, customer history, revenue",
    "Reduced manual rework and end-of-shift reconciliation overhead",
    "Real-time operator visibility, with the team adopting the system because it actually fits",
  ],
  operatorTake:
    "The dashboard turned the operation legible. Decisions stopped getting made on memory and started getting made on the live state. Reconciliation went from a closing-shift ritual to a glance. The team adopted it because the system fit how they actually worked.",
};
