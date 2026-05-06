import { Container } from "@/components/ui/container";
import { ConscienceWordmark } from "@/components/conscience-mark";
import { LoginForm } from "@/components/app/login-form";

export const metadata = {
  title: "Sign in · Owner OS",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16">
      <Container size="narrow">
        <div className="flex justify-center mb-10">
          <ConscienceWordmark markSize={22} />
        </div>
        <div className="rounded-2xl glass-card p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
            Owner OS
          </p>
          <h1 className="font-semibold tracking-[-0.02em] text-2xl sm:text-3xl leading-tight">
            Sign in
          </h1>
          <p className="mt-3 text-[0.95rem] text-muted-foreground leading-relaxed">
            Internal access only.
          </p>
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
