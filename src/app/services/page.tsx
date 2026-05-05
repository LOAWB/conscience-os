import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { siteConfig, services } from "@/lib/site-config";

export const metadata = {
  title: "Services",
  description:
    "Four services that ship finished: System Audit, Custom Software, Automation + AI, Websites.",
};

export default function ServicesPage() {
  return (
    <>
      <Section className="!pt-28 !pb-12 sm:!pt-32 sm:!pb-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Services
            </p>
            <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-lg)] leading-[1.05]">
              Four services. Every one of them ships finished.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              No half-builds. No "starting points to expand from." Each
              engagement ends with a working system in your business.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <div className="space-y-12">
            {services.map((s, i) => (
              <article
                key={s.slug}
                id={s.slug}
                className="grid md:grid-cols-[auto_1fr] gap-x-10 gap-y-6 pt-12 border-t border-border first:pt-0 first:border-0 scroll-mt-24"
              >
                <div className="md:w-48 shrink-0">
                  <p className="font-mono text-xs text-subtle">0{i + 1}</p>
                  <h2 className="mt-3 font-semibold tracking-tight text-2xl leading-tight">
                    {s.name}
                  </h2>
                  <p className="mt-3 text-[0.95rem] text-muted-foreground">
                    {s.short}
                  </p>
                </div>

                <div className="space-y-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      What it solves
                    </p>
                    <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                      {s.solves}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      What gets built
                    </p>
                    <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                      {s.builds}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Expected outcomes
                    </p>
                    <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                      {s.outcomes}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container size="narrow">
          <div className="text-center">
            <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
              Start with an audit.
            </h2>
            <p className="mt-5 text-[0.95rem] text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Every engagement begins with the System Audit. It's the cheapest,
              fastest way to know what to do next — whether that's building with
              us or fixing things yourself.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={siteConfig.ctaPrimary.href} size="lg">
                {siteConfig.ctaPrimary.label}
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="ghost" size="lg">
                See pricing
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
