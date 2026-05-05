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
  const headlineMetric = splashBros.metrics[0];

  return (
    <>
      {/* HERO — at-a-glance scan in 5 seconds */}
      <Section className="!pt-28 !pb-12 sm:!pt-32 sm:!pb-16">
        <Container>
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-end">
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-subtle mb-5">
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
                  DRAFT — metrics pending Vessel verification before public
                  launch
                </p>
              )}
            </div>

            {/* Headline stat: scans in <2 seconds */}
            <div className="rounded-2xl bg-ink text-white p-8 sm:p-10">
              <p className="text-[0.7rem] font-mono uppercase tracking-[0.18em] text-white/55">
                Throughput
              </p>
              <p className="mt-4 font-semibold tracking-[-0.02em] text-[clamp(3rem,7vw,5rem)] leading-none text-white">
                {headlineMetric.delta}
              </p>
              <p className="mt-3 text-sm text-white/60 font-mono">
                {headlineMetric.before} → {headlineMetric.after}{" "}
                {headlineMetric.label.toLowerCase()}
              </p>
              <div className="mt-7 pt-6 border-t border-white/10">
                <p className="text-[0.85rem] text-white/75 leading-relaxed">
                  Plus 11 hours/week of staff time, $17K/month of revenue, and
                  5.5 percentage points off the dispute rate.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* PROBLEM */}
      <Section variant="muted" className="!py-20">
        <Container size="narrow">
          <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-4 items-start">
            <div className="md:w-32 shrink-0">
              <p className="font-mono text-xs text-accent">01 / Problem</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
                What was breaking
              </h2>
              <ul className="mt-7 space-y-3.5">
                {splashBros.problem.map((p) => (
                  <li
                    key={p}
                    className="flex gap-3.5 text-[0.98rem] text-foreground leading-relaxed"
                  >
                    <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                      →
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* SYSTEM */}
      <Section className="!py-20">
        <Container size="narrow">
          <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-4 items-start">
            <div className="md:w-32 shrink-0">
              <p className="font-mono text-xs text-accent">02 / System</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
                What we built
              </h2>
              <ul className="mt-7 space-y-3.5">
                {splashBros.solution.map((s) => (
                  <li
                    key={s}
                    className="flex gap-3.5 text-[0.98rem] text-foreground leading-relaxed"
                  >
                    <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                      ✓
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9 inline-flex items-center gap-2 text-xs font-mono text-subtle">
                <span className="size-1.5 rounded-full bg-success" />
                Stack: Postgres · Node · React · Railway
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* RESULT — full metric strip in narrative position */}
      <Section variant="muted" className="!py-20">
        <Container>
          <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-4 items-start mb-10">
            <div className="md:w-32 shrink-0">
              <p className="font-mono text-xs text-accent">03 / Result</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
                What changed in the numbers
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {splashBros.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl bg-white border border-border p-5"
              >
                <p className="text-[0.68rem] text-subtle font-mono uppercase tracking-wider">
                  {m.label}
                </p>
                <p className="mt-3 font-semibold text-2xl sm:text-3xl text-foreground tracking-tight">
                  {m.delta}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground font-mono">
                  {m.before} → {m.after}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* VALUE — operator's take + explicit framing */}
      <Section className="!py-20">
        <Container size="narrow">
          <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-4 items-start">
            <div className="md:w-32 shrink-0">
              <p className="font-mono text-xs text-accent">04 / Value</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
                What this is worth
              </h2>
              <blockquote className="mt-7 text-[1.35rem] sm:text-2xl tracking-[-0.005em] leading-[1.4] font-medium text-foreground">
                {splashBros.operatorTake}
              </blockquote>
              <p className="mt-5 text-sm text-subtle font-mono">
                — Conscience OS, post-launch retro
              </p>

              <div className="mt-10 grid sm:grid-cols-3 gap-4 pt-8 border-t border-border">
                <div>
                  <p className="text-[0.68rem] font-mono uppercase tracking-wider text-subtle">
                    Revenue lift
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    +$17K / month
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-mono uppercase tracking-wider text-subtle">
                    Time saved
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    12 staff-hours / week
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-mono uppercase tracking-wider text-subtle">
                    Risk reduced
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    −5.5pp dispute rate
                  </p>
                </div>
              </div>
            </div>
          </div>
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
            <div className="mt-9 flex justify-center">
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
