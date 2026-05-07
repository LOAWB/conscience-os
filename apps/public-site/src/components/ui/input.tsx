// Re-export shim. Input + Textarea live in @repo/ui as TextInput + TextArea
// per A3 extraction. Label stays here (small public-site-specific helper —
// FormField in @repo/ui handles labeling for internal-ops).
//
// post-screenshot-verification: delete and rewrite call sites to import
// directly from "@repo/ui".
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export { TextInput as Input, TextArea as Textarea } from "@repo/ui";

export function Label({
  className,
  children,
  ...props
}: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-foreground block mb-2",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
