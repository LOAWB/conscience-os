// Public-site keeps the @/lib/utils import path for backward compat with all
// existing call sites. The implementation is owned by @repo/ui per A2 amendment
// (cn ownership inside @repo/ui). NEVER reimplement cn here — the package is
// the single source of truth.
export { cn } from "@repo/ui";
