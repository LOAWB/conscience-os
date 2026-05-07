"use client";

import type { ReactNode } from "react";
import { Button } from "../primitives/button";
import { GlassCard } from "../primitives/glass-card";

/**
 * Error boundary fallback. Used by Next.js error.tsx files.
 * Caller passes the `reset` function (from Next's error boundary signature).
 */
export function ErrorBoundaryFallback({
  title = "Something went wrong.",
  description,
  reset,
  digest,
}: {
  title?: ReactNode;
  description?: ReactNode;
  reset?: () => void;
  digest?: string;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <GlassCard aura className="max-w-md w-full p-6 text-center">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--color-foreground)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm text-[var(--color-foreground)]/65">
            {description}
          </p>
        ) : null}
        {digest ? (
          <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/35">
            ref · {digest}
          </p>
        ) : null}
        {reset ? (
          <div className="mt-6 flex justify-center">
            <Button variant="secondary" size="sm" onClick={reset}>
              Try again
            </Button>
          </div>
        ) : null}
      </GlassCard>
    </div>
  );
}
