import { cn } from "@/lib/utils";

/**
 * Conscience OS mark — simple ring + center dot with a pulsing blue halo.
 * Geometric. Tech. Calm. Alive.
 */
export function ConscienceMark({
  size = 26,
  className,
  animated = true,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center shrink-0",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Pulsing blue halo — the alive part */}
      <span
        className={cn(
          "absolute inset-0 rounded-full",
          animated && "pulse-soft",
        )}
        style={{
          background:
            "radial-gradient(circle, rgba(59,125,255,0.50) 0%, rgba(59,125,255,0.15) 35%, transparent 70%)",
        }}
      />
      {/* Outer ring */}
      <span
        className="relative inline-block rounded-full"
        style={{
          width: size * 0.72,
          height: size * 0.72,
          border: "1.5px solid #3b7dff",
        }}
      />
      {/* Center dot */}
      <span
        className="absolute rounded-full"
        style={{
          width: size * 0.22,
          height: size * 0.22,
          background: "#3b7dff",
        }}
      />
    </span>
  );
}
