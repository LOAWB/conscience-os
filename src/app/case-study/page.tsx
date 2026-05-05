import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { systemImplementation, siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Real System Implementation",
  description: systemImplementation.oneLine,
};

export default function CaseStudyPage() {
  return (
    <>
      {/* HERO */}
      <Section className="!pt-28 !pb-12 sm:!pt-32 sm:!pb-16">
        <Container>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-subtle mb-5">
              <span className="uppercase tracking-wider text-accent font-semibold">
                Use case
              </span>
              <span>·</span>
              <span>{systemImplementation.industry}</span>
              <span>·</span>
              <span>{systemImplementation.engagement}</span>
              <span>·</span>
              <span>{systemImplementation.timeline}</span>
            </div>
            <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-lg)] leading-[1.05]">
              Real system implementation
            </h1>
            <p className="mt-5 text-xl text-muted-foreground leading-relaxed">
              {systemImplementation.oneLine}
            </p>
          </div>
        </Container>
      </Section>

      {/* 01 / Context */}
      <Section variant="muted" className="!py-20">
        <Container size="narrow">
          <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-4 items-start">
            <div className="md:w-32 shrink-0">
              <p className="font-mono text-xs text-accent">01 / Context</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
                What we walked into
              </h2>
              <ul className="mt-7 space-y-3.5">
                {systemImplementation.context.map((c) => (
                  <li
                    key={c}
                    className="flex gap-3.5 text-[0.98rem] text-foreground leading-relaxed"
                  >
                    <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                      —
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* 02 / Problem */}
      <Section className="!py-20">
        <Container size="narrow">
          <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-4 items-start">
            <div className="md:w-32 shrink-0">
              <p className="font-mono text-xs text-accent">02 / Problem</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
                What was breaking
              </h2>
              <ul className="mt-7 space-y-3.5">
                {systemImplementation.problem.map((p) => (
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

      {/* 03 / Solution */}
      <Section variant="muted" className="!py-20">
        <Container size="narrow">
          <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-4 items-start">
            <div className="md:w-32 shrink-0">
              <p className="font-mono text-xs text-accent">03 / Solution</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
                What we built
              </h2>
              <ul className="mt-7 space-y-3.5">
                {systemImplementation.solution.map((s) => (
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

      {/* 04 / Outcome */}
      <Section className="!py-20">
        <Container size="narrow">
          <div className="grid md:grid-cols-[auto_1fr] gap-x-12 gap-y-4 items-start">
            <div className="md:w-32 shrink-0">
              <p className="font-mono text-xs text-accent">04 / Outcome</p>
            </div>
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-sm)] leading-[1.15]">
                What changed
              </h2>
              <ul className="mt-7 space-y-3.5">
                {systemImplementation.outcome.map((o) => (
                  <li
                    key={o}
                    className="flex gap-3.5 text-[0.98rem] text-foreground leading-relaxed"
                  >
                    <span className="font-mono text-xs text-accent pt-1.5 shrink-0">
                      ✓
                    </span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>

              <blockquote className="mt-10 pt-8 border-t border-border text-[1.2rem] sm:text-[1.3rem] tracking-[-0.005em] leading-[1.45] font-medium text-foreground">
                {systemImplementation.operatorTake}
              </blockquote>
              <p className="mt-5 text-sm text-subtle font-mono">
                — Conscience OS, post-launch retro
              </p>
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
              Every engagement ends like this: a working system, simplified
              workflows, ownership transferred. Start with an audit and find out
              what's possible in your business.
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
