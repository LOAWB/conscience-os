import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { engagementStages, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "How to work together",
  description:
    "Every engagement is custom. We start with a System Audit, then build the system around your business.",
};

export default function WorkTogetherPage() {
  return (
    <>
      <Section className="!pt-28 !pb-12 sm:!pt-32 sm:!pb-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Engagement
            </p>
            <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-lg)] leading-[1.05]">
              How to work together
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every engagement starts with a System Audit. From there, the
              system is built around your operations and supported through
              deployment. Each engagement is custom, scoped to the business it
              serves.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <div className="grid md:grid-cols-2 gap-5">
            {engagementStages.map((s, i) => (
              <div
                key={s.slug}
                className={cn(
                  "relative rounded-2xl p-7 sm:p-9 flex flex-col",
                  s.highlight
                    ? "bg-ink text-white border border-ink"
                    : "bg-white border border-border",
                )}
              >
                <p
                  className={cn(
                    "font-mono text-xs",
                    s.highlight ? "text-accent" : "text-accent",
                  )}
                >
                  0{i + 1}
                </p>
                <h2
                  className={cn(
                    "mt-4 font-semibold tracking-tight text-2xl",
                    s.highlight ? "text-white" : "text-foreground",
                  )}
                >
                  {s.name}
                </h2>
                <p
                  className={cn(
                    "mt-4 text-[1rem] leading-relaxed",
                    s.highlight ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  {s.description}
                </p>

                <ul className="mt-7 space-y-3 flex-1">
                  {s.includes.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "flex gap-3 text-[0.95rem] leading-relaxed",
                        s.highlight ? "text-white/85" : "text-foreground",
                      )}
                    >
                      <Check
                        className="size-4 mt-0.5 shrink-0 text-accent"
                        strokeWidth={2.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-9">
                  <ButtonLink
                    href={s.cta.href}
                    variant={s.highlight ? "primary" : "secondary"}
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    {s.cta.label}
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>

          {/* Subtle support band — lifecycle, not a standalone product */}
          <div className="mt-10 rounded-xl border border-border bg-muted/40 p-7 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[0.7rem] font-mono uppercase tracking-[0.16em] text-subtle mb-2">
                  Lifecycle
                </p>
                <p className="text-[1rem] text-foreground leading-relaxed">
                  Post-build support is available as part of your system
                  deployment, where ongoing care is needed.
                </p>
              </div>
              <div className="text-xs text-subtle font-mono">
                Scoped per engagement
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container size="narrow">
          <div className="grid md:grid-cols-3 gap-y-10 md:gap-x-12">
            {[
              {
                q: "Why an audit first?",
                a: "Because building software is expensive when it's wrong. The audit makes sure the system is built around what your business actually needs. Most clients walk away from the audit with a clearer plan than they had after months of trying to scope it themselves.",
              },
              {
                q: "What does an engagement cost?",
                a: "Every engagement is scoped to the business it serves. The audit gives you a clear picture of what's needed and what it'd take to build. You decide from there.",
              },
              {
                q: "Do I own the code?",
                a: "Yes. Source transferred to your repository on delivery. No license keys, no SaaS lock-in, no hostage situation.",
              },
            ].map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold tracking-tight text-[1.05rem]">
                  {f.q}
                </h3>
                <p className="mt-2 text-[0.92rem] text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="ink" className="!py-20">
        <Container size="narrow">
          <div className="text-center">
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1] text-white">
              Start with a System Audit.
            </h2>
            <p className="mt-5 text-[0.95rem] text-white/80 leading-relaxed max-w-xl mx-auto">
              Every engagement begins here. We analyze your business and tell
              you exactly where systems can improve.
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
