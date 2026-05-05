import Link from "next/link";
import { ArrowRight, Activity, GitBranch, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { siteConfig, services, splashBros } from "@/lib/site-config";

export default function Home() {
  return (
    <>
      {/* HERO — single dominant CTA */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 grid-pattern opacity-40" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-background via-background/95 to-transparent"
        />
        <div className="relative">
          <Container>
            <div className="pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-36 lg:pb-28 max-w-3xl fade-in-up">
              <h1 className="font-semibold tracking-[-0.02em] text-foreground leading-[1.05] text-[length:var(--text-display-xl)]">
                {siteConfig.headline}
              </h1>
              <p className="mt-7 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {siteConfig.subhead}
              </p>
              <div className="mt-10">
                <ButtonLink href={siteConfig.ctaPrimary.href} size="lg">
                  {siteConfig.ctaPrimary.label}
                  <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-subtle">
                Two-week audit. Concrete fix list. Decide next steps with real
                numbers.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* TRUST STRIP — subtle credibility */}
      <div className="border-y border-border bg-muted/40">
        <Container>
          <div className="py-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[0.72rem] font-mono uppercase tracking-[0.16em] text-subtle">
            {siteConfig.trustSignals.map((signal, i) => (
              <span key={signal} className="flex items-center gap-x-7">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="size-1 rounded-full bg-border-strong"
                  />
                )}
                <span>{signal}</span>
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* PROBLEM */}
      <Section variant="muted">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              The problem
            </p>
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
              Software is supposed to make business easier. Most of it makes you
              slower.
            </h2>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Activity,
                title: "Operational drag",
                body: "Three tools that don't talk to each other. Manual reconciliation eating closing-shift hours. Reports nobody can run.",
              },
              {
                icon: GitBranch,
                title: "Manual rework",
                body: "Repetitive tasks staff can do in their sleep — and increasingly do, by mistake. Errors compound. Customers feel them.",
              },
              {
                icon: Sparkles,
                title: "Missed revenue",
                body: "Booking forms that drop leads. Quotes that get forgotten. Customer flows that leak at every step.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl bg-white border border-border p-7 shadow-soft"
              >
                <div className="inline-flex items-center justify-center size-10 rounded-lg bg-accent-soft text-accent">
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-semibold text-lg tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-[0.95rem] text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SOLUTION */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                How we work
              </p>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
                Analyze. Identify. Build. Measure.
              </h2>
              <p className="mt-6 text-[0.95rem] text-muted-foreground leading-relaxed">
                Every engagement starts with an audit. We map every system in
                your business, find what's leaking, then quote what it costs to
                fix. You decide what to build.
              </p>
            </div>

            <div className="space-y-0">
              {[
                {
                  step: "01",
                  title: "Analyze",
                  body: "Two-week deep audit. Every system, every workflow, every integration. We talk to your operators and shadow your day.",
                },
                {
                  step: "02",
                  title: "Identify",
                  body: "Written report ranks every problem by ROI. Effort vs impact. The fixes you'd do this quarter, the fixes that wait.",
                },
                {
                  step: "03",
                  title: "Build",
                  body: "Production-grade software, scoped from your audit. Fixed price, fixed timeline. Source transferred on delivery.",
                },
                {
                  step: "04",
                  title: "Measure",
                  body: "Numbers on every fix. Throughput, error rate, revenue. We tell you what the system is doing, and we tell you what to do next.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex gap-5 py-6 border-b border-border last:border-0"
                >
                  <div className="font-mono text-xs text-accent pt-1 w-7 shrink-0">
                    {s.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[1.05rem] tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[0.95rem] text-muted-foreground leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* OUTCOME / Splash Bros teaser */}
      <Section variant="ink">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Real results
            </p>
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1] text-white">
              {splashBros.client}: {splashBros.oneLine}
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {splashBros.metrics.slice(0, 4).map((m) => (
              <div
                key={m.label}
                className="rounded-xl bg-white/5 border border-white/10 p-6"
              >
                <p className="text-xs text-white/60 font-mono uppercase tracking-wider">
                  {m.label}
                </p>
                <p className="mt-3 font-semibold text-2xl sm:text-3xl text-white tracking-tight">
                  {m.delta}
                </p>
                <p className="mt-1 text-xs text-white/50 font-mono">
                  {m.before} → {m.after}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/case-study/splash-bros"
              className="inline-flex items-center gap-1.5 text-white hover:text-accent transition-colors text-[0.95rem] font-medium"
            >
              Read the full case study
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* SERVICES PREVIEW */}
      <Section>
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                What we do
              </p>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
                Four services. Every one of them ships finished.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors text-[0.95rem] font-medium"
            >
              See all services
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services#${s.slug}`}
                className="group rounded-xl border border-border bg-white p-7 hover:border-accent transition-colors duration-150"
              >
                <h3 className="font-semibold text-[1.1rem] tracking-tight">
                  {s.name}
                </h3>
                <p className="mt-2 text-[0.95rem] text-muted-foreground leading-relaxed">
                  {s.short}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent font-medium">
                  Learn more
                  <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA — single dominant button */}
      <Section variant="muted">
        <Container size="narrow">
          <div className="text-center">
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
              Ready to know what's actually slowing you down?
            </h2>
            <p className="mt-5 text-[0.95rem] text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Start with a Business System Audit. Two weeks. Concrete fix list.
              You walk away with a written plan, whether you build with us or
              anyone else.
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href={siteConfig.ctaPrimary.href} size="lg">
                {siteConfig.ctaPrimary.label}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
            <p className="mt-5 text-xs text-subtle">
              Or{" "}
              <Link
                href="/pricing"
                className="text-foreground hover:text-accent transition-colors underline-offset-4 hover:underline"
              >
                see pricing
              </Link>{" "}
              first.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
