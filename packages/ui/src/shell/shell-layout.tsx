"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { cn } from "../lib/cn";

type SessionView = {
  email: string;
  name?: string | null;
  role: string;
};

/**
 * ShellLayout — the locked dashboard chrome composition.
 * TopBar (wordmark + user menu) + Sidebar (left) + main slot.
 *
 * Responsive: sidebar collapses to icons-only at <1280px; hidden behind
 * mobile drawer at <768px (toggled from TopBar hamburger).
 */
export function ShellLayout({
  session,
  children,
  className,
}: {
  session: SessionView;
  children: ReactNode;
  className?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-[var(--color-background)]",
        className,
      )}
    >
      <TopBar
        session={session}
        onMobileToggle={() => setMobileOpen((v) => !v)}
      />
      <div className="flex-1 flex min-h-0">
        <aside
          className={cn(
            "hidden md:flex shrink-0 border-r border-[var(--color-border)] bg-[rgba(255,255,255,0.012)]",
            "w-14 xl:w-56",
          )}
        >
          <SidebarResponsive />
        </aside>
        {mobileOpen ? (
          <div
            className="md:hidden fixed inset-0 z-40"
            onClick={() => setMobileOpen(false)}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
            <aside
              className="absolute left-0 top-0 h-full w-60 border-r border-[var(--color-border)] bg-[var(--color-background)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </aside>
          </div>
        ) : null}
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarResponsive() {
  // tailwind doesn't expose a "below xl" media-query branch in JS without a hook,
  // so we render the full nav and let CSS hide labels at < xl via Sidebar's
  // className-based collapse driven by container width — using two render passes
  // is heavier; cleaner: use the same `collapsed` variant CSS via media query.
  // Implementation: render two sidebars, one labeled (hidden below xl), one
  // icons-only (visible md..xl).
  return (
    <>
      <div className="xl:hidden flex w-full">
        <Sidebar collapsed />
      </div>
      <div className="hidden xl:flex w-full">
        <Sidebar />
      </div>
    </>
  );
}
