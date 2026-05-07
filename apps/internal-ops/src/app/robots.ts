import type { MetadataRoute } from "next";

/**
 * Internal-ops is a private operations dashboard. Crawlers must not index it.
 * Combined with the noindex meta in layout.tsx and middleware-gated routes,
 * this gives belt-and-suspenders coverage.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
