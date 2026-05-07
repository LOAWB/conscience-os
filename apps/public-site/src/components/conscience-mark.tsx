// Re-export shim. The canonical implementations live in @repo/ui (extracted
// per A3 amendment). Existing public-site import paths are preserved so call
// sites do not churn during the M0 build.
//
// post-screenshot-verification: this file can be deleted and call sites
// rewritten to import directly from "@repo/ui". Tracked by Stage 4 integration.
export { ConscienceMark, Wordmark as ConscienceWordmark } from "@repo/ui";
