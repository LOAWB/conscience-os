import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "About",
  description:
    "Built by an operator. Conscience OS designs and builds custom software for businesses that have outgrown off-the-shelf tools.",
};

export default function AboutPage() {
  return (
    <>
      <Section className="!pt-28 !pb-16 sm:!pt-32 sm:!pb-20">
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            About
          </p>
          <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-lg)] leading-[1.05]">
            Built by an operator. Run by software.
          </h1>
          <p className="mt-7 text-lg text-muted-foreground leading-relaxed">
            Conscience OS is a premium development company for businesses that
            have outgrown off-the-shelf tools. We design and build the custom
            software systems that real operations actually need — and we do it
            from the operator's chair, not the conference room.
          </p>
        </Container>
      </Section>

      <Section variant="muted" className="!py-16 sm:!py-20">
        <Container size="narrow">
          <div className="grid md:grid-cols-[auto_1fr] gap-x-10 gap-y-6 items-start">
            <div className="md:w-44 shrink-0">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-accent to-ink ring-1 ring-border" />
              <p className="mt-3 text-xs text-subtle font-mono uppercase tracking-wider">
                [Vessel: founder photo]
              </p>
            </div>
            <div className="space-y-5 text-[1.05rem] text-foreground leading-relaxed">
              <p>
                Conscience Os came out of running a business, not building
                software for one. I was working in a car wash that was held
                together with six different apps — one for scheduling, one for
                payments, one for tracking the crew, none of them talking to
                each other. Closing shift was two hours of typing the same
                numbers into three different screens.
              </p>
              <p>
                So I built one tool that did all of it. One dashboard. Real
                numbers. Something I could actually look at and understand.
                After that, the work just felt different. The crew got out
                earlier. I stopped guessing about what was happening on the lot.
                Decisions got made on what was actually true.
              </p>
              <p>
                That's where this came from, and it's still how I work. I come
                in, I look at how your business actually runs, and I build the
                system that fits — not the other way around. If something's
                leaking time or money, I want to know about it. Then we fix it
                together.
              </p>
              <p className="text-subtle font-mono text-sm pt-2 border-t border-border mt-7">
                [Vessel: drop in 200-400 word operator-voice founder bio when
                ready. The above is a draft scaffold.]
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="!py-16 sm:!py-20">
        <Container size="narrow">
          <h2 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
            What we believe
          </h2>
          <div className="mt-10 space-y-7">
            {[
              {
                title:
                  "Software should fit the business, not the other way around.",
                body: "Every off-the-shelf tool has assumptions baked in. When yours don't match, you spend the rest of your career patching the gap. Custom software costs more upfront and pays for itself the moment it stops costing you staff time.",
              },
              {
                title: "Numbers beat opinions.",
                body: "We measure throughput, error rate, and revenue before and after every engagement. If the system doesn't move the number, we keep working until it does. No hand-waving.",
              },
              {
                title: "You own the work.",
                body: "Source code transferred to your repo on delivery. No license keys, no SaaS lock-in, no hostage situation. You can fire us next month and the system still runs.",
              },
              {
                title: "Operator-first, always.",
                body: "Decisions get made from the chair where the work actually happens. Not from a slide deck.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="pb-6 border-b border-border last:border-0"
              >
                <h3 className="font-semibold tracking-tight text-[1.1rem]">
                  {b.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] text-muted-foreground leading-relaxed">
                  {b.body}
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
              Talk to the operator.
            </h2>
            <p className="mt-5 text-[0.95rem] text-white/80 leading-relaxed max-w-xl mx-auto">
              Every audit starts with a 60-minute call. No sales pitch — we
              listen, we ask, we tell you what we'd do.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={siteConfig.ctaPrimary.href} size="lg">
                {siteConfig.ctaPrimary.label}
                <ArrowRight className="size-4" />
              </ButtonLink>
              <Link
                href={`mailto:${siteConfig.contact.email}`}
                className="text-[0.95rem] text-white/80 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                or {siteConfig.contact.email}
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
