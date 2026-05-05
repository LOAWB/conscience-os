export const siteConfig = {
  name: "Conscience OS",
  url: "https://conscienceos.com",
  description:
    "Custom software that makes your business run better. We analyze your business, identify inefficiencies, and build systems that increase revenue and eliminate operational friction.",
  headline: "Custom software that makes your business run better",
  pillar:
    "We analyze your business, identify inefficiencies, and build custom software systems that increase revenue and eliminate operational friction.",
  ctaPrimary: { label: "Book a System Audit", href: "/book" },
  ctaSecondary: { label: "See the work", href: "/case-study/splash-bros" },
  contact: { email: "hello@conscienceos.com" },
  nav: [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Case study", href: "/case-study/splash-bros" },
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

export type PricingTier = {
  slug: string;
  name: string;
  price: string;
  period: string;
  summary: string;
  includes: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
  flag?: "DRAFT_PRICE";
};

export const pricingTiers: PricingTier[] = [
  {
    slug: "audit",
    name: "Business System Audit",
    price: "$2,500",
    period: "one-time",
    summary:
      "Two-week deep dive. Concrete fix list. The fastest way to know what to do next.",
    includes: [
      "60-minute kickoff call",
      "Two-week audit of every business system",
      "Written report: what's broken, ranked by ROI",
      "Prioritized fix list with effort vs impact",
      "30-minute walkthrough call",
      "Audit yours forever — build with anyone",
    ],
    cta: { label: "Book the audit", href: "/book" },
    flag: "DRAFT_PRICE",
  },
  {
    slug: "build",
    name: "Custom Software Build",
    price: "Custom quoted",
    period: "after audit",
    summary:
      "Production-grade software, scoped from your audit. Fixed price, fixed timeline, ownership transferred on delivery.",
    includes: [
      "Scope written directly from audit findings",
      "Fixed-price proposal with clear deliverables",
      "Production-grade code: Node, Postgres, React",
      "Deployed to your infrastructure",
      "Source code transferred outright",
      "30-day post-launch support included",
    ],
    cta: { label: "Start with an audit", href: "/book" },
    highlight: true,
    flag: "DRAFT_PRICE",
  },
  {
    slug: "support",
    name: "Monthly Support",
    price: "$4,000",
    period: "/month",
    summary:
      "Ongoing engineering. Bug fixes, feature work, infrastructure care. For businesses whose software needs to keep moving.",
    includes: [
      "Up to 40 hours of engineering each month",
      "Bug fixes and small features prioritized weekly",
      "Infrastructure monitoring and maintenance",
      "Quarterly business review tied to system performance",
      "First-response SLA on critical issues",
      "Cancel any time after the first 90 days",
    ],
    cta: { label: "Talk to us", href: "/book" },
    flag: "DRAFT_PRICE",
  },
];

export const splashBros = {
  client: "Splash Bros",
  industry: "Car wash operation",
  engagement: "Audit + Build + Monthly Support",
  timeline: "Q4 2025 → ongoing",
  oneLine:
    "Custom operations system replaced four off-the-shelf tools, cut staff overhead 12 hours a week, lifted throughput by ~75%.",
  problem: [
    "Three different scheduling tools, none of them talking to each other.",
    "Manual end-of-day reconciliation eating two hours every closing shift.",
    "No visibility into crew productivity beyond gut feel.",
    "Recurring payment disputes from customers because the system couldn't prove what services they got.",
  ],
  solution: [
    "Single Postgres-backed operations system. One place for bookings, crew dispatch, customer history, and revenue.",
    "Dashboard for the operator: cars in flight, crew utilization, revenue today, this week, this month.",
    "Customer-facing booking flow with payment captured up-front, dispute-proof receipt history.",
    "Mobile-first crew app: each crew member sees their queue, marks complete, surfaces issues to the operator in real time.",
  ],
  metrics: [
    {
      label: "Cars per hour",
      before: "8",
      after: "14",
      delta: "+75%",
      flag: "DRAFT" as const,
    },
    {
      label: "Monthly revenue",
      before: "~$28K",
      after: "~$45K",
      delta: "+61%",
      flag: "DRAFT" as const,
    },
    {
      label: "Reconciliation time per close",
      before: "120 min",
      after: "10 min",
      delta: "−92%",
      flag: "DRAFT" as const,
    },
    {
      label: "Payment-dispute rate",
      before: "7%",
      after: "1.5%",
      delta: "−79%",
      flag: "DRAFT" as const,
    },
    {
      label: "Staff hours saved per week",
      before: "—",
      after: "12 hrs",
      delta: "new",
      flag: "DRAFT" as const,
    },
  ],
  operatorTake:
    "The wins compounded fast. The dashboard turned the operation legible — the owner stopped making decisions on memory and started making them on numbers. Reconciliation went from a closing-shift ritual to a 10-minute glance. The crew liked it because they got out earlier.",
  customerVoice: null as null | { quote: string; attribution: string },
};
