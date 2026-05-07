import { cn } from "../lib/cn";

type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

const positionStyles: Record<Position, string> = {
  "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4",
  "top-right": "top-0 right-0 translate-x-1/4 -translate-y-1/4",
  "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
  "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

/**
 * Aura glow — radial blue gradient anchor. Soft, ≤20% opacity, no neon.
 *
 * Per FACE-E-UI.md risk note: limit to ≤3 active aura glows per visible
 * viewport. Prefer this CSS-only primitive over SVG for paint cost.
 */
export function AuraGlow({
  position = "center",
  size = 480,
  intensity = 0.16,
  className,
}: {
  position?: Position;
  size?: number;
  intensity?: number;
  className?: string;
}) {
  const opacity = Math.min(0.2, intensity);
  return (
    <div
      aria-hidden
      className={cn(
        "absolute pointer-events-none -z-10 rounded-full blur-3xl",
        positionStyles[position],
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(59,125,255,${opacity}) 0%, rgba(59,125,255,${opacity * 0.5}) 35%, transparent 70%)`,
      }}
    />
  );
}
