import { Container } from "@/components/ui/container";
import { Section } from "@/components/section";
import { BookingForm } from "@/components/booking-form";

export const metadata = {
  title: "Book a System Audit",
  description:
    "Tell us what's slowing you down. Every engagement starts with a System Audit.",
};

export default function BookPage() {
  return (
    <>
      <Section className="!pt-28 !pb-12 sm:!pt-32 sm:!pb-16">
        <Container size="narrow">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            Book a System Audit
          </p>
          <h1 className="font-semibold tracking-[-0.02em] text-[length:var(--text-display-lg)] leading-[1.05]">
            Tell us what's slowing you down.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Fill this in like you'd describe it to a friend. We'll get back to
            you within one business day to schedule the kickoff call. Every
            engagement is custom; the audit findings are yours either way.
          </p>
        </Container>
      </Section>

      <Section className="!pt-0 !pb-24">
        <Container size="narrow">
          <BookingForm />

          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
            {[
              {
                title: "Custom engagement",
                body: "Tailored to how your business actually runs.",
              },
              {
                title: "Real reply",
                body: "From a real person, within one business day.",
              },
              {
                title: "Yours either way",
                body: "Audit findings are yours. Build with anyone.",
              },
            ].map((s) => (
              <div key={s.title} className="p-5 rounded-xl bg-muted">
                <p className="font-semibold tracking-tight text-foreground text-[1rem]">
                  {s.title}
                </p>
                <p className="mt-1.5 text-[0.85rem] text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
