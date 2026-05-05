import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { pricingTiers } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pricing",
  description:
    "Three tiers: Audit, Custom Build, Monthly Support. Transparent and operator-fair.",
};

export default function PricingPage() {
  return (
    <>
      <Section className="!pt-28 !pb-12 sm:!pt-32 sm:!pb-16">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Pricing
            </p>
            <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-lg)] leading-[1.05]">
              Three tiers. Transparent. Operator-fair.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Audit gets you a written report. Build delivers a finished system.
              Monthly Support keeps it running. Pricing scales with the size of
              the work, not with your headcount.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container size="wide">
          <div className="grid md:grid-cols-3 gap-5">
            {pricingTiers.map((t) => (
              <div
                key={t.slug}
                className={cn(
                  "relative rounded-2xl p-7 sm:p-8 flex flex-col",
                  t.highlight
                    ? "bg-ink text-white border border-ink"
                    : "bg-white border border-border",
                )}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-7 inline-flex items-center px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[0.7rem] font-semibold uppercase tracking-wider">
                    Most engagements
                  </span>
                )}
                <h2
                  className={cn(
                    "font-semibold tracking-tight text-xl",
                    t.highlight ? "text-white" : "text-foreground",
                  )}
                >
                  {t.name}
                </h2>
                <div className="mt-5 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-semibold tracking-tight text-3xl sm:text-4xl",
                      t.highlight ? "text-white" : "text-foreground",
                    )}
                  >
                    {t.price}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      t.highlight ? "text-white/60" : "text-muted-foreground",
                    )}
                  >
                    {t.period}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-4 text-[0.95rem] leading-relaxed",
                    t.highlight ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  {t.summary}
                </p>

                <ul className="mt-7 space-y-3 flex-1">
                  {t.includes.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "flex gap-3 text-[0.92rem] leading-relaxed",
                        t.highlight ? "text-white/85" : "text-foreground",
                      )}
                    >
                      <Check
                        className={cn(
                          "size-4 mt-0.5 shrink-0",
                          t.highlight ? "text-accent" : "text-accent",
                        )}
                        strokeWidth={2.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <ButtonLink
                    href={t.cta.href}
                    variant={t.highlight ? "primary" : "secondary"}
                    size="md"
                    className="w-full"
                  >
                    {t.cta.label}
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-subtle font-mono">
            Pricing in USD.{" "}
            {pricingTiers.some((t) => t.flag === "DRAFT_PRICE")
              ? "[DRAFT — Vessel-confirm before public launch]"
              : ""}
          </p>
        </Container>
      </Section>

      <Section variant="muted">
        <Container size="narrow">
          <div className="grid md:grid-cols-3 gap-y-10 md:gap-x-12">
            {[
              {
                q: "Why an audit first?",
                a: "Because building software is expensive. The audit makes sure we build the right thing. Most clients walk away from the audit with a clearer plan than they had after months of trying to scope it themselves.",
              },
              {
                q: "What if I just want one fix?",
                a: "We can do that. The audit identifies it, we quote it, you approve, we build it. Small fixes don't need monthly support — most close out in two to four weeks.",
              },
              {
                q: "Do I own the code?",
                a: "Yes. Full source transferred to your repository on delivery. No license keys, no SaaS lock-in, no hostage situation.",
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
    </>
  );
}
