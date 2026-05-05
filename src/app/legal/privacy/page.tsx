import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";

export const metadata = {
  title: "Privacy",
  description: "How Conscience OS handles your data.",
};

export default function PrivacyPage() {
  return (
    <Section className="!pt-28 !pb-24 sm:!pt-32">
      <Container size="narrow">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
          Legal
        </p>
        <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-md)] leading-[1.1]">
          Privacy
        </h1>
        <p className="mt-3 text-sm text-subtle font-mono">
          Last updated: {new Date().getFullYear()}. Working draft.
        </p>

        <div className="mt-12 space-y-10 text-[0.95rem] text-foreground leading-relaxed">
          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              What we collect
            </h2>
            <p className="text-muted-foreground">
              When you submit the audit form, we collect the name, email,
              business name and type, and the descriptive answers you give us.
              That data is used to schedule a conversation with you and to scope
              an audit. We don't sell it, share it with advertisers, or use it
              to retarget you.
            </p>
          </section>

          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              Where it lives
            </h2>
            <p className="text-muted-foreground">
              Submissions reach our internal inbox. We use Resend for
              transactional email and a small operations system to track active
              engagements. Both are operated by us; both are scoped to U.S.
              providers.
            </p>
          </section>

          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              How long we keep it
            </h2>
            <p className="text-muted-foreground">
              If you become a client, we keep engagement records for the
              duration of the engagement plus seven years (standard for tax and
              legal records). If you don't, we delete intake records after one
              year.
            </p>
          </section>

          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              Your rights
            </h2>
            <p className="text-muted-foreground">
              Email{" "}
              <a
                href="mailto:hello@conscienceos.com"
                className="underline text-foreground"
              >
                hello@conscienceos.com
              </a>{" "}
              to request a copy or deletion of your data. We respond within five
              business days.
            </p>
          </section>

          <section>
            <h2 className="font-semibold tracking-tight text-xl mb-3">
              Cookies and analytics
            </h2>
            <p className="text-muted-foreground">
              We run privacy-respecting analytics with no third-party tracking
              cookies. We don't ship Google Analytics, Facebook Pixel, or any
              advertising network beacons.
            </p>
          </section>

          <p className="pt-4 text-subtle font-mono text-sm border-t border-border">
            [Vessel: legal review before public launch.]
          </p>
        </div>
      </Container>
    </Section>
  );
}
