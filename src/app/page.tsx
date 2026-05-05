import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <>
      {/* 1. HERO — immediate clarity + action */}
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
              <div className="mt-10 flex items-center gap-6">
                <ButtonLink href={siteConfig.ctaPrimary.href} size="lg">
                  {siteConfig.ctaPrimary.label}
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <Link
                  href="#how-it-works"
                  className="text-[0.95rem] text-muted-foreground hover:text-foreground transition-colors duration-150 inline-flex items-center gap-1.5"
                >
                  See how it works
                  <ArrowRight className="size-3.5" />
                </Link>
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
            Most businesses are running on disconnected systems.
          </h2>
          <ul className="mt-9 space-y-3.5">
            {[
              "Scheduling in one place",
              "Inventory in another",
              "Operations held together manually",
              "Nothing truly working together",
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
            It works — but it creates friction everywhere.
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
            Why Conscience OS exists
          </h2>
          <div className="mt-10 space-y-6 text-[1.05rem] text-white/85 leading-relaxed">
            <p>
              After years operating inside the car wash industry, one thing
              became clear:
            </p>
            <p className="text-white">
              Everything existed — just not in a way that worked together.
            </p>
            <p>Different tools. Different systems. Constant workarounds.</p>
            <p>
              So instead of adapting to disconnected software, we built a system
              around the business itself.
            </p>
            <p className="text-white">
              Centralized. Custom. Built for real operations.
            </p>
            <p>It replaced multiple tools and simplified how everything ran.</p>
            <p className="text-white font-medium">
              That's what Conscience OS is built on.
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
              "Systems built around your workflow",
              "Less operational friction",
              "Clearer team execution",
              "Everything in one place",
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
                title: "Audit",
                body: "We break down your current systems and identify friction.",
              },
              {
                step: "02",
                title: "Design",
                body: "We map a system built around your workflow.",
              },
              {
                step: "03",
                title: "Build",
                body: "We create and implement your custom solution.",
              },
              {
                step: "04",
                title: "Deploy",
                body: "Your business runs on a system that actually fits.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-xl bg-white border border-border p-7 shadow-soft"
              >
                <p className="font-mono text-xs text-accent">{s.step}</p>
                <h3 className="mt-5 font-semibold text-lg tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.95rem] text-muted-foreground leading-relaxed">
                  {s.body}
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
            Real experience
          </p>
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
            Real system implementation
          </h2>
          <div className="mt-9 space-y-5 text-[1.05rem] text-foreground leading-relaxed">
            <p>
              Built from real operational experience inside a working business.
            </p>
            <p className="text-muted-foreground">
              Custom systems designed to replace fragmented tools and streamline
              operations.
            </p>
          </div>
        </Container>
      </Section>

      {/* 8. OFFER — make the next step tangible */}
      <Section variant="muted">
        <Container size="narrow">
          <div className="rounded-2xl bg-white border border-border p-8 sm:p-10 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Start here
            </p>
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
              System Audit
            </h2>
            <p className="mt-5 text-[1.05rem] text-muted-foreground leading-relaxed">
              We analyze your business and identify exactly where systems can
              improve efficiency and revenue.
            </p>

            <ul className="mt-7 space-y-3.5">
              {[
                "Breakdown of current setup",
                "Identified inefficiencies",
                "Custom system direction",
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
