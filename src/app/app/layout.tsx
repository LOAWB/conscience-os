import type { Metadata } from "next";
import Link from "next/link";
import { ConscienceWordmark } from "@/components/conscience-mark";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/app/logout-button";

export const metadata: Metadata = {
  title: "Owner OS",
  description: "Conscience Os — Owner OS",
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  // /app/login is rendered without nav chrome via its own layout-less branch.
  // Middleware already redirects unauthed traffic away from non-login routes.
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/75 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/app" className="inline-flex items-center">
              <ConscienceWordmark markSize={18} />
            </Link>
            <nav className="hidden sm:flex items-center gap-5">
              <Link
                href="/app/leads"
                className="text-[0.85rem] text-muted-foreground hover:text-foreground transition-colors"
              >
                Leads
              </Link>
            </nav>
          </div>

          {session && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-xs text-subtle font-mono">
                {session.email}
              </span>
              <LogoutButton />
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
