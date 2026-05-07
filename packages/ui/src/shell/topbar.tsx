"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "../primitives/wordmark";
import { Avatar } from "../primitives/avatar";
import { cn } from "../lib/cn";

type SessionView = {
  email: string;
  name?: string | null;
  role: string;
};

export function TopBar({
  session,
  logoutAction = "/api/auth/logout",
  className,
  onMobileToggle,
}: {
  session: SessionView;
  logoutAction?: string;
  className?: string;
  onMobileToggle?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[rgba(6,8,13,0.85)] backdrop-blur-md px-4 md:px-5",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {onMobileToggle ? (
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={onMobileToggle}
            className="md:hidden inline-flex items-center justify-center size-9 rounded-md text-[var(--color-foreground)]/70 hover:bg-white/[0.05]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        ) : null}
        <Link href="/" aria-label="Conscience Os — Today" className="shrink-0">
          <Wordmark markSize={18} />
        </Link>
        <span className="hidden md:inline-block ml-3 px-2 py-0.5 rounded text-[0.62rem] font-mono uppercase tracking-[0.18em] text-[var(--color-foreground)]/45 border border-dashed border-[var(--color-foreground)]/15">
          internal · ops
        </span>
      </div>

      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-full pl-1 pr-3 py-1 hover:bg-white/[0.04] transition-colors"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <Avatar name={session.name || session.email} size="sm" />
          <span className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-[0.78rem] text-[var(--color-foreground)] truncate max-w-[180px] leading-tight">
              {session.name ?? session.email}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider font-mono text-[var(--color-foreground)]/45 leading-tight">
              {session.role}
            </span>
          </span>
        </button>
        {open ? (
          <div
            role="menu"
            className="absolute right-0 top-full mt-1.5 min-w-[220px] rounded-lg border border-[var(--color-border)] bg-[#0a0d14] shadow-xl py-1 z-30"
          >
            <div className="px-3 py-2 border-b border-[var(--color-border)]">
              <div className="text-sm text-[var(--color-foreground)] truncate">
                {session.name ?? session.email}
              </div>
              {session.name ? (
                <div className="text-xs text-[var(--color-foreground)]/50 truncate">
                  {session.email}
                </div>
              ) : null}
              <div className="mt-1 text-[0.65rem] uppercase tracking-wider font-mono text-[var(--color-foreground)]/45">
                {session.role}
              </div>
            </div>
            <form action={logoutAction} method="POST" className="px-1 py-1">
              <button
                type="submit"
                className="block w-full px-2 py-1.5 text-left text-sm rounded text-[var(--color-foreground)]/85 hover:bg-white/[0.04] transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  );
}
