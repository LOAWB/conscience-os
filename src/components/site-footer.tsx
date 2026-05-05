import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <span
                aria-hidden
                className="relative inline-flex items-center justify-center size-7"
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59,125,255,0.35) 0%, transparent 70%)",
                  }}
                />
                <span
                  className="relative inline-block size-5 rounded-full border-[1.5px]"
                  style={{ borderColor: "#3b7dff" }}
                />
                <span
                  className="absolute size-1.5 rounded-full"
                  style={{ background: "#3b7dff" }}
                />
              </span>
              <span className="text-[0.95rem]">Conscience OS</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-[16rem] leading-relaxed">
              Custom software that makes your business run better.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Work
            </h4>
            <ul className="space-y-2.5">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Get started
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/book"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Book a System Audit
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-subtle">
            © {new Date().getFullYear()} Conscience OS. All rights reserved.
          </p>
          <p className="text-xs text-subtle font-mono">
            Built by an operator. Run by software.
          </p>
        </div>
      </div>
    </footer>
  );
}
