import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { splashBros } from "@/lib/site-config";

export const metadata = {
  title: "Case studies",
  description: "Real businesses, real systems, real numbers.",
};

export default function CaseStudyIndexPage() {
  return (
    <>
      <Section className="!pt-28 !pb-12 sm:!pt-32 sm:!pb-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Case studies
            </p>
            <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-lg)] leading-[1.05]">
              Real businesses. Real systems. Real numbers.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every engagement ends with a working system. Here's what that
              looks like in practice.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <Link
            href="/case-study/splash-bros"
            className="group block rounded-2xl border border-border overflow-hidden hover:border-accent transition-colors duration-150"
          >
            <div className="grid md:grid-cols-[1fr_1fr]">
              <div className="bg-ink text-white p-10 sm:p-12 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                    {splashBros.industry}
                  </p>
                  <h2 className="font-semibold tracking-[-0.01em] text-2xl sm:text-3xl leading-tight text-white">
                    {splashBros.client}
                  </h2>
                  <p className="mt-4 text-[0.95rem] text-white/80 leading-relaxed">
                    {splashBros.oneLine}
                  </p>
                </div>
                <div className="mt-10 inline-flex items-center gap-1.5 text-accent group-hover:gap-2.5 transition-all text-sm font-medium">
                  Read the case study
                  <ArrowRight className="size-4" />
                </div>
              </div>
              <div className="bg-muted p-10 sm:p-12 grid grid-cols-2 gap-5 content-center">
                {splashBros.metrics.slice(0, 4).map((m) => (
                  <div key={m.label}>
                    <p className="text-xs text-subtle font-mono uppercase tracking-wider">
                      {m.label}
                    </p>
                    <p className="mt-2 font-semibold text-2xl text-foreground tracking-tight">
                      {m.delta}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          <p className="mt-8 text-sm text-subtle">
            More case studies in flight. We add them as engagements complete.
          </p>
        </Container>
      </Section>
    </>
  );
}
