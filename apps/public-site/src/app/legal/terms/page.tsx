import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";

export const metadata = {
  title: "Terms",
  description: "Terms of service for Conscience OS.",
};

export default function TermsPage() {
  return (
    <Section className="!pt-28 !pb-24 sm:!pt-32">
      <Container size="narrow">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
          Legal
        </p>
        <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
          Terms
        </h1>
        <p className="mt-3 text-sm text-subtle font-mono">
          Last updated: {new Date().getFullYear()}. Working draft.
        </p>

        <div className="mt-12 space-y-10 text-[0.95rem] text-foreground leading-relaxed">
          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              Engagement scope
            </h2>
            <p className="text-muted-foreground">
              Each engagement is governed by a written statement of work signed
              by both parties. Audits are fixed-price, fixed-timeline. Custom
              builds are fixed-price, fixed-scope, with mutually-agreed change
              orders if scope shifts. Monthly Support is a recurring agreement
              with 30-day notice on cancellation after the initial 90-day
              commitment.
            </p>
          </section>

          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              Intellectual property
            </h2>
            <p className="text-muted-foreground">
              Source code we write for you is yours on delivery. We retain
              rights only to general-purpose libraries, tooling, and patterns
              developed independently. We don't claim ongoing ownership of your
              business systems.
            </p>
          </section>

          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              Confidentiality
            </h2>
            <p className="text-muted-foreground">
              Audits and engagements are confidential by default. We won't
              disclose business specifics, financials, or proprietary details
              without written permission, except for case studies (which require
              your explicit sign-off before publishing).
            </p>
          </section>

          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              Liability
            </h2>
            <p className="text-muted-foreground">
              Standard professional services terms. Liability capped at
              engagement fees paid. We carry professional liability insurance
              and are happy to share certificates of insurance for larger
              engagements.
            </p>
          </section>

          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              Governing law
            </h2>
            <p className="text-muted-foreground">
              Engagements are governed by the laws of the United States.
              Disputes resolved by good-faith negotiation first, mediation if
              needed, then formal arbitration as the final step.
            </p>
          </section>

          <p className="pt-4 text-subtle font-mono text-sm border-t border-border">
            [Vessel: legal review before public launch. Update jurisdiction once
            LLC formation completes.]
          </p>
        </div>
      </Container>
    </Section>
  );
}
