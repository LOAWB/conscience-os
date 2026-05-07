import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  aura?: boolean;
  ink?: boolean;
};

/**
 * Glass card primitive — translucent surface, backdrop-blur, white-alpha edge.
 * The locked container language for every panel in internal-ops.
 *
 * Variants:
 *   default — flat glass surface
 *   hover   — adds blue edge on hover
 *   aura    — slightly lifted with blue edge glow
 *   ink     — solid ink background with strong blue ring (accent panels)
 */
export function GlassCard({
  hover,
  aura,
  ink,
  className,
  children,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        ink ? "aura-card-ink" : aura ? "aura-card" : "glass-card",
        hover && "glass-card-hover",
        "rounded-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
