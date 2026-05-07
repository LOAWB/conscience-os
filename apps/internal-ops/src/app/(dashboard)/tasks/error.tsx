"use client";

import { ErrorBoundaryFallback } from "@repo/ui";

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundaryFallback
      title="Couldn't load tasks"
      description={
        error.message ||
        "Try again, or contact the operator if this keeps happening."
      }
      reset={reset}
      digest={error.digest}
    />
  );
}
