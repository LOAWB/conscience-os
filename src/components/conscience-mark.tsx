import { cn } from "@/lib/utils";

/**
 * Conscience OS mark — pulsing blue ring (O), no center dot.
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
      {/* Inner ring core glow */}
      <span
        className="absolute rounded-full"
        style={{
          width: size * 0.55,
          height: size * 0.55,
          background:
            "radial-gradient(circle, rgba(123,162,255,0.35) 0%, transparent 70%)",
        }}
      />
      {/* The ring */}
      <span
        className="relative inline-block rounded-full"
        style={{
          width: size * 0.78,
          height: size * 0.78,
          border: "2px solid #3b7dff",
          boxShadow: "0 0 8px rgba(59,125,255,0.35)",
        }}
      />
    </span>
  );
}

/**
 * Full styled wordmark — for nav and footer.
 * 'Conscience' + accent 'OS' in uppercase tracked treatment.
 */
export function ConscienceWordmark({
  className,
  markSize = 20,
}: {
  className?: string;
  markSize?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="text-[0.78rem] sm:text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-foreground">
        Conscience
        <span className="text-accent ml-1.5">OS</span>
      </span>
      <ConscienceMark size={markSize} />
    </span>
  );
}
