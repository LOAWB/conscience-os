import { cn } from "@/lib/utils";

/**
 * Conscience OS mark — blue ring with a comet dot orbiting around it.
 * Pulsing halo behind. Alive and turning.
 */
export function ConscienceMark({
  size = 22,
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
      {/* Pulsing blue halo */}
      <span
        className={cn(
          "absolute inset-0 rounded-full",
          animated && "pulse-soft",
        )}
        style={{
          background:
            "radial-gradient(circle, rgba(59,125,255,0.55) 0%, rgba(59,125,255,0.18) 35%, transparent 72%)",
        }}
      />

      {/* Ring + orbital comet dot */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="#3b7dff"
          strokeWidth="6"
          style={{ filter: "drop-shadow(0 0 4px rgba(59,125,255,0.45))" }}
        />
        {animated && (
          <g className="orbit-medium" style={{ transformOrigin: "50px 50px" }}>
            {/* Comet glow */}
            <circle cx="50" cy="12" r="9" fill="rgba(59,125,255,0.45)" />
            {/* Comet bright core */}
            <circle cx="50" cy="12" r="4" fill="#dbe7ff" />
          </g>
        )}
      </svg>
    </span>
  );
}

/**
 * Full styled wordmark — glass pill + shimmer sweep + accent OS.
 */
export function ConscienceWordmark({
  className,
  markSize = 22,
}: {
  className?: string;
  markSize?: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full",
        "border border-white/[0.08] bg-white/[0.025] backdrop-blur-md",
        className,
      )}
    >
      <span className="text-[0.74rem] sm:text-[0.78rem] font-bold tracking-[0.20em] flex items-baseline gap-1.5">
        <span className="wordmark-shimmer">CONSCIENCE</span>
        <span
          className="text-accent"
          style={{
            textShadow: "0 0 10px rgba(59,125,255,0.55)",
          }}
        >
          Os
        </span>
      </span>
      <ConscienceMark size={markSize} />
    </span>
  );
}
