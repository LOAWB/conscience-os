/**
 * Stage 2 stub. face-e replaces this with the locked Conscience Os design
 * system + form primitives from @repo/ui. The contract face-e ships against:
 *
 *   POST /api/auth/login  body { email, password }
 *     -> 200 { ok: true } + sets conscience_ops_session cookie
 *     -> 401 { error: 'Invalid email or password.' }
 *     -> 429 { error: 'Too many attempts. Try again in 15 minutes.' }
 *
 * On 200, redirect to ?redirect= query param or '/' (dashboard).
 */
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-[var(--border-soft)] bg-[var(--card-glass)] p-8 backdrop-blur-md"
      >
        <h1 className="mb-1 text-2xl font-bold tracking-tight">
          Conscience Os
        </h1>
        <p className="mb-6 text-sm opacity-60">Internal operations · sign in</p>

        <label className="mb-1 block text-xs uppercase tracking-wider opacity-60">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-[var(--border-soft)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />

        <label className="mb-1 block text-xs uppercase tracking-wider opacity-60">
          Password
        </label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-md border border-[var(--border-soft)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-400">{error}</p>
        ) : null}

        <p className="mt-8 text-center text-xs opacity-40">
          Authorized access only.
        </p>
      </form>
    </main>
  );
}
