import { ArrowRight, Search, Layers, Cpu, Rocket } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { HeroRing } from "@/components/hero-ring";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <>
      {/* 1. HERO — dark cinematic, headline left + ring system right */}
      <section className="relative overflow-hidden aura-hero">
        <div aria-hidden className="absolute inset-0 grid-pattern opacity-50" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[80vh] bg-gradient-to-b from-background/0 via-background/0 to-background"
        />
        <div className="relative">
          <Container size="wide">
            <div className="pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-36 lg:pb-32 grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-center">
              <div className="fade-in-up max-w-2xl">
                <h1 className="font-semibold tracking-[-0.02em] text-foreground leading-[1.05] text-[length:var(--text-display-xl)]">
                  {siteConfig.headline}
                </h1>
                <p className="mt-7 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {siteConfig.subhead}
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <ButtonLink href={siteConfig.ctaPrimary.href} size="lg">
                    {siteConfig.ctaPrimary.label}
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                  <ButtonLink
                    href={siteConfig.ctaSecondary.href}
                    variant="secondary"
                    size="lg"
                  >
                    {siteConfig.ctaSecondary.label}
                  </ButtonLink>
                </div>
              </div>

              <div className="hidden lg:block fade-in-up">
                <HeroRing />
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* TRUST STRIP — subtle credibility band */}
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

      {/* 2. PROBLEM — make the user feel understood */}
      <Section variant="muted">
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            The problem
          </p>
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
            Three to five tools, a spreadsheet, and a group text holding it all
            together.
          </h2>
          <ul className="mt-9 space-y-3.5">
            {[
              "A dispatcher copy-pasting between systems all day",
              "Sunday reconciliation because nothing closes the loop automatically",
              "Reports nobody can run because the data lives in five places",
              "Staff on different versions of the same number",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3.5 text-[1.05rem] text-foreground leading-relaxed"
              >
                <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                  →
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-9 text-[1.1rem] text-muted-foreground leading-relaxed">
            It works. It also costs you money every shift.
          </p>
        </Container>
      </Section>

      {/* 3. SOLUTION — define what we do simply */}
      <Section>
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            What we do
          </p>
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
            We don't sell software.
            <br />
            We build systems around your business.
          </h2>
          <ul className="mt-9 space-y-3.5">
            {[
              "Centralized operations",
              "Custom workflows",
              "Tools that match how your team actually works",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3.5 text-[1.05rem] text-foreground leading-relaxed"
              >
                <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-9 text-[1.1rem] text-foreground font-medium">
            One system. Built for how you operate.
          </p>
          <p className="mt-5 text-[0.95rem] text-muted-foreground leading-relaxed">
            Behind every system we build is a centralized platform designed to
            manage operations, workflows, and ongoing execution.
          </p>
        </Container>
      </Section>

      {/* 4. ORIGIN STORY — credibility without hype */}
      <Section variant="ink">
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            Origin
          </p>
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1] text-white">
            We run a car wash. That is why this exists.
          </h2>
          <div className="mt-10 space-y-6 text-[1.05rem] text-white/85 leading-relaxed">
            <p>
              Splash Bros. Three locations in the Bay Area. Multi-shift, real
              throughput, real customers.
            </p>
            <p>
              When we started, the operation ran on three tools that did not
              talk to each other and a spreadsheet holding the rest together.
              Every off-the-shelf option fit our business badly enough that
              someone was always copy-pasting data between systems to keep the
              day moving.
            </p>
            <p className="text-white">
              So we built the system we wished existed. One platform. Phase by
              phase. Replaced the stack in ten phases.
            </p>
            <p>
              Splash Bros runs on it now. The same one we hand to operators who
              hire us.
            </p>
            <p className="text-white font-medium">
              That is the difference. Most dev shops show you logos of clients.
              We show you the business we run.
            </p>
          </div>
        </Container>
      </Section>

      {/* 5. VALUE TRANSLATION — story → benefits */}
      <Section>
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            What it means for your business
          </p>
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
            What you get
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 gap-y-5 gap-x-10">
            {[
              "One system replacing three to five disconnected tools",
              "Real-time visibility into bookings, dispatch, revenue",
              "Hours back per week on reconciliation and copy-paste work",
              "A team that adopts it because it fits how they actually work",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3.5 text-[1.05rem] text-foreground leading-relaxed"
              >
                <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. PROCESS — reduce uncertainty, build trust */}
      <Section variant="muted" id="how-it-works">
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Process
            </p>
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
              How it works
            </h2>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                icon: Search,
                title: "Audit",
                body: "We break down your current systems and identify friction.",
              },
              {
                step: "02",
                icon: Layers,
                title: "Design",
                body: "We map a system built around your workflow.",
              },
              {
                step: "03",
                icon: Cpu,
                title: "Build",
                body: "We create and implement your custom solution.",
              },
              {
                step: "04",
                icon: Rocket,
                title: "Deploy",
                body: "Your business runs on a system that actually fits.",
              },
            ].map(({ step, icon: Icon, title, body }) => (
              <div
                key={step}
                className="rounded-xl glass-card glass-card-hover p-7 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-7">
                  <div className="inline-flex items-center justify-center size-12 rounded-lg icon-box">
                    <Icon className="size-5 text-white" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-xs text-accent">{step}</span>
                </div>
                <h3 className="font-semibold text-lg tracking-tight">
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

      {/* 7. LIGHT PROOF — real experience without fake metrics */}
      <Section>
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            Proof
          </p>
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
            We built it for ourselves first.
          </h2>
          <div className="mt-9 space-y-5 text-[1.05rem] text-foreground leading-relaxed">
            <p>
              Splash Bros runs on a system we built. Three locations, ten
              phases, one platform replacing three tools and a spreadsheet.
            </p>
            <p className="text-muted-foreground">
              The system you would hire us to build is the same one we use to
              run our own operation. The operator and the builder are the same
              person.
            </p>
          </div>
        </Container>
      </Section>

      {/* 8. OFFER — make the next step tangible */}
      <Section variant="muted">
        <Container size="narrow">
          <div className="rounded-2xl aura-card-ink p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Start here
            </p>
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
              System Audit
            </h2>
            <p className="mt-5 text-[1.05rem] text-muted-foreground leading-relaxed">
              Two to three weeks. Paid engagement, not a free consultation. You
              walk away with a written audit of your operation and a build
              proposal scoped to the highest-leverage intervention.
            </p>

            <ul className="mt-7 space-y-3.5">
              {[
                "Operational map of your current systems",
                "The single highest-leverage build, identified and scoped",
                "Build proposal you can take elsewhere if it is not us",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3.5 text-[1rem] text-foreground leading-relaxed"
                >
                  <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <ButtonLink href={siteConfig.ctaPrimary.href} size="lg">
                {siteConfig.ctaPrimary.label}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* 9. FINAL CLOSE — push action */}
      <Section variant="ink">
        <Container size="narrow">
          <div className="text-center">
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1] text-white">
              If your business feels more complicated than it should be, it's
              not your fault.
            </h2>
            <p className="mt-6 text-[1.1rem] text-white/75 leading-relaxed">
              It's your systems.
            </p>
            <p className="mt-2 text-[1.25rem] text-white font-medium">
              Let's fix that.
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
