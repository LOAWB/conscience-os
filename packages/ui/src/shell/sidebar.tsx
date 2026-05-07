"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CheckSquare,
  ClipboardCheck,
  Cog,
  Folder,
  Home,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "../lib/cn";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const SIDEBAR_NAV: Item[] = [
  { href: "/", label: "Today", icon: Home },
  { href: "/leads", label: "Leads", icon: Sparkles },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/audits", label: "Audits", icon: ClipboardCheck },
];

export const SIDEBAR_FOOTER_NAV: Item[] = [
  { href: "/settings", label: "Settings", icon: Cog },
];

export function Sidebar({
  className,
  collapsed,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex h-full flex-col gap-1 px-2 py-4",
        collapsed && "items-center px-1",
        className,
      )}
    >
      <ul className="flex flex-col gap-0.5">
        {SIDEBAR_NAV.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            collapsed={collapsed}
          />
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <ul className="flex flex-col gap-0.5">
          {SIDEBAR_FOOTER_NAV.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              collapsed={collapsed}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarItem({
  item,
  active,
  collapsed,
}: {
  item: Item;
  active: boolean;
  collapsed?: boolean;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-md transition-colors duration-150",
          collapsed ? "size-10 justify-center" : "h-9 px-2.5",
          active
            ? "bg-[rgba(59,125,255,0.10)] text-[var(--color-foreground)]"
            : "text-[var(--color-foreground)]/65 hover:text-[var(--color-foreground)] hover:bg-white/[0.04]",
        )}
      >
        {active ? (
          <span
            aria-hidden
            className="absolute left-0 top-1.5 bottom-1.5 w-px bg-[var(--color-accent)]"
            style={{ boxShadow: "0 0 6px rgba(59,125,255,0.55)" }}
          />
        ) : null}
        <Icon
          className={cn(
            "size-[18px] shrink-0 transition-colors",
            active
              ? "text-[#9bbcff]"
              : "text-[var(--color-foreground)]/55 group-hover:text-[var(--color-foreground)]/85",
          )}
        />
        {!collapsed ? (
          <span className="text-[0.88rem] font-medium tracking-tight">
            {item.label}
          </span>
        ) : null}
      </Link>
    </li>
  );
}
