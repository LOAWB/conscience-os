import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * TodayPanel — single-column glass panel used by the three Today columns
 * (Today's Tasks, Upcoming, Quick Capture).
 */
export function TodayPanel({
  header,
  children,
  className,
  footer,
}: {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-white/[0.018] backdrop-blur-md flex flex-col min-h-[260px]",
        className,
      )}
    >
      {header ? (
        <header className="px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
          {header}
        </header>
      ) : null}
      <div className="flex-1 px-4 py-3">{children}</div>
      {footer ? (
        <footer className="px-4 pb-4 pt-2 border-t border-[var(--color-border)]">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
