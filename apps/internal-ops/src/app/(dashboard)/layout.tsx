/**
 * Stage 2 stub. face-e replaces with <ShellLayout> from @repo/ui (sidebar +
 * topbar + main slot composition). For now, render children with auth gate.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (face-e replaces with full ShellLayout) */}
      <aside className="hidden md:flex md:flex-col w-56 border-r border-[var(--border-soft)] bg-[var(--card-glass)] p-4">
        <div className="mb-8">
          <Link href="/" className="text-base font-bold tracking-tight">
            Conscience <span className="text-[var(--accent)]">Os</span>
          </Link>
          <div className="mt-1 text-xs opacity-50">internal ops</div>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <SidebarLink href="/">Today</SidebarLink>
          <SidebarLink href="/leads">Leads</SidebarLink>
          <SidebarLink href="/clients">Clients</SidebarLink>
          <SidebarLink href="/projects">Projects</SidebarLink>
          <SidebarLink href="/tasks">Tasks</SidebarLink>
          <SidebarLink href="/schedule">Schedule</SidebarLink>
          <SidebarLink href="/audits">Audits</SidebarLink>
        </nav>
        <div className="mt-auto border-t border-[var(--border-soft)] pt-4 text-xs">
          <div className="opacity-60">{session.email}</div>
          <div className="opacity-40 capitalize">{session.role}</div>
          <form action="/api/auth/logout" method="POST" className="mt-2">
            <button
              type="submit"
              className="text-xs underline opacity-60 hover:opacity-100"
            >
              sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 transition hover:bg-white/5"
    >
      {children}
    </Link>
  );
}
