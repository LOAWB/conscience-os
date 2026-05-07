/**
 * Login page — composes face-d's auth contract through @repo/ui primitives.
 *
 *   POST /api/auth/login  body { email, password }
 *     -> 200 { ok: true } + sets conscience_ops_session cookie
 *     -> 401 { error: 'Invalid email or password.' }
 *     -> 429 { error: 'Too many attempts. Try again in 15 minutes.' }
 *
 * Face-e residual-risk note from Pory round 2: do NOT invent a client-only
 * lockout counter. Consume face-d's locked /api/auth/login behavior.
 */
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AuraGlow,
  Button,
  FormError,
  FormField,
  GlassCard,
  TextInput,
  Wordmark,
} from "@repo/ui";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 429) {
        setError("Too many attempts. Try again in 15 minutes.");
        return;
      }
      if (!res.ok) {
        setError("Invalid email or password.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <AuraGlow position="top-right" size={620} intensity={0.16} />
      <AuraGlow position="bottom-left" size={520} intensity={0.1} />

      <div className="relative w-full max-w-[400px]">
        <div className="flex justify-center mb-6">
          <Wordmark markSize={22} />
        </div>

        <GlassCard aura className="p-7">
          <header className="mb-5 text-center">
            <h1 className="text-[1.1rem] font-semibold tracking-tight text-[var(--color-foreground)]">
              Sign in to internal ops
            </h1>
            <p className="mt-1 text-[0.78rem] text-[var(--color-foreground)]/55">
              Authorized access only.
            </p>
          </header>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FormField label="Email" htmlFor="email" required>
              <TextInput
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" required>
              <TextInput
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </FormField>

            {error ? <FormError>{error}</FormError> : null}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              className="mt-1"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </GlassCard>

        <p className="mt-6 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-foreground)]/35">
          Conscience Os · Internal Operations
        </p>
      </div>
    </main>
  );
}
