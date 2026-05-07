// Re-export shim. Canonical Button + LinkButton (here aliased ButtonLink) live
// in @repo/ui per A3 extraction. Existing public-site call sites continue to
// import from "@/components/ui/button" without churn during the M0 build.
//
// post-screenshot-verification: delete this file and rewrite call sites to
// import directly from "@repo/ui". Tracked by Stage 4 integration.
export { Button, LinkButton as ButtonLink } from "@repo/ui";
