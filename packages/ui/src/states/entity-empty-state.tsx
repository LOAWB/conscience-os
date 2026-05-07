import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { IconBox } from "../primitives/icon-box";

export function EntityEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-[var(--color-border)] flex flex-col items-center justify-center text-center px-6 py-12",
        className,
      )}
    >
      {icon ? (
        <IconBox size="lg" className="mb-4">
          {icon}
        </IconBox>
      ) : null}
      <h3 className="text-base font-semibold tracking-tight text-[var(--color-foreground)]">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-[var(--color-foreground)]/55">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
