import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { splashBros, siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `${splashBros.client} — Case study`,
  description: splashBros.oneLine,
};

export default function SplashBrosCaseStudy() {
  const hasDraftMetrics = splashBros.metrics.some((m) => m.flag === "DRAFT");

  return (
    <>
      <Section className="!pt-28 !pb-12 sm:!pt-32 sm:!pb-16">
        <Container>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-subtle mb-4">
              <span className="uppercase tracking-wider text-accent font-semibold">
                Case study
              </span>
              <span>·</span>
              <span>{splashBros.industry}</span>
              <span>·</span>
              <span>{splashBros.engagement}</span>
              <span>·</span>
              <span>{splashBros.timeline}</span>
            </div>
            <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-lg)] leading-[1.05]">
              {splashBros.client}
            </h1>
            <p className="mt-5 text-xl text-muted-foreground leading-relaxed">
              {splashBros.oneLine}
            </p>
            {hasDraftMetrics && (
              <p className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-warn/10 text-warn text-[0.78rem] font-medium font-mono">
                <span className="size-1.5 rounded-full bg-warn" />
                DRAFT — metrics pending Vessel verification before public launch
              </p>
            )}
          </div>
        </Container>
      </Section>

      <Section variant="muted" className="!pt-12 !pb-16 sm:!pt-16 sm:!pb-20">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {splashBros.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl bg-white border border-border p-5"
              >
                <p className="text-[0.7rem] text-subtle font-mono uppercase tracking-wider">
                  {m.label}
                </p>
                <p className="mt-3 font-semibold text-2xl text-foreground tracking-tight">
                  {m.delta}
                </p>
                <p className="mt-1 text-xs text-muted-foreground font-mono">
                  {m.before} → {m.after}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Problem */}
      <Section className="!py-20">
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            The problem
          </p>
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
            What was breaking
          </h2>
          <ul className="mt-8 space-y-4">
            {splashBros.problem.map((p) => (
              <li
                key={p}
                className="flex gap-4 text-[1rem] text-foreground leading-relaxed"
              >
                <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                  →
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Solution */}
      <Section variant="muted" className="!py-20">
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            The system we built
          </p>
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
            What replaced it
          </h2>
          <ul className="mt-8 space-y-4">
            {splashBros.solution.map((s) => (
              <li
                key={s}
                className="flex gap-4 text-[1rem] text-foreground leading-relaxed"
              >
                <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                  ✓
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 inline-flex items-center gap-2 text-xs font-mono text-subtle">
            <span className="size-1.5 rounded-full bg-success" />
            Stack: Postgres · Node · React · Railway
          </div>
        </Container>
      </Section>

      {/* Operator's take */}
      <Section className="!py-20">
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            Operator's take
          </p>
          <blockquote className="text-2xl sm:text-3xl tracking-[-0.01em] leading-[1.3] font-medium text-foreground">
            {splashBros.operatorTake}
          </blockquote>
          <p className="mt-6 text-sm text-subtle font-mono">
            — Conscience OS, post-launch retro
          </p>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="ink" className="!py-20">
        <Container size="narrow">
          <div className="text-center">
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1] text-white">
              This is the kind of system we build.
            </h2>
            <p className="mt-5 text-[0.95rem] text-white/80 leading-relaxed max-w-xl mx-auto">
              Every engagement ends like this: a working system, real numbers,
              ownership transferred. Start with an audit and find out what's
              possible in your business.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={siteConfig.ctaPrimary.href} size="lg">
                {siteConfig.ctaPrimary.label}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
