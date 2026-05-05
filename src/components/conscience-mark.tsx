import { cn } from "@/lib/utils";

type Variant = "default" | "mono" | "soft";

/**
 * Conscience OS symbol — circle (O) + flowing S curve inside.
 *
 * Geometric, no spiritual cues. Outer ring carries the brand stroke;
 * inner S is the accent mark.
 */
export function ConscienceMark({
  size = 28,
  className,
  variant = "default",
  withGlow = false,
}: {
  size?: number;
  className?: string;
  variant?: Variant;
  withGlow?: boolean;
}) {
  const ringColor =
    variant === "mono"
      ? "currentColor"
      : variant === "soft"
        ? "rgba(255,255,255,0.85)"
        : "currentColor";

  const sCurveColor = variant === "mono" ? "currentColor" : "#3b7dff";

  return (
    <span
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {withGlow && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,125,255,0.45) 0%, transparent 70%)",
          }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* O — outer ring */}
        <circle cx="50" cy="50" r="44" stroke={ringColor} strokeWidth="6" />
        {/* S — flowing curve, single cubic bezier */}
        <path
          d="M 28 32 C 78 32, 22 68, 72 68"
          stroke={sCurveColor}
          strokeWidth="5"
        />
      </svg>
    </span>
  );
}
