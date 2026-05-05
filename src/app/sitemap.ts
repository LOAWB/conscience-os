import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/services",
    "/work-together",
    "/case-study",
    "/about",
    "/book",
    "/legal/privacy",
    "/legal/terms",
  ];
  return routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1.0 : path === "/book" ? 0.9 : 0.7,
  }));
}
