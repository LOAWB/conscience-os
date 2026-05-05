import { cn } from "@/lib/utils";

export function HeroRing({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-[520px] mx-auto pointer-events-none select-none",
        className,
      )}
      aria-hidden
    >
      {/* Layered radial glow halo */}
      <div
        className="absolute inset-[8%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,125,255,0.55) 0%, rgba(59,125,255,0.20) 30%, rgba(59,125,255,0.06) 55%, transparent 75%)",
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute inset-[20%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(91,142,255,0.45) 0%, rgba(59,125,255,0.10) 50%, transparent 75%)",
          filter: "blur(8px)",
        }}
      />

      <svg viewBox="0 0 520 520" className="relative w-full h-full" fill="none">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dbe7ff" stopOpacity="1" />
            <stop offset="20%" stopColor="#7aa3ff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#3b7dff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#3b7dff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9bbcff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#3b7dff" stopOpacity="1" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient
            id="ringStrokeFaint"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7aa3ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b7dff" stopOpacity="0.1" />
          </linearGradient>

          <filter id="ringBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          <filter id="strongBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* Outermost faint orbit */}
        <circle
          cx="260"
          cy="260"
          r="248"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />

        {/* Outer ring */}
        <circle
          cx="260"
          cy="260"
          r="210"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
        />

        {/* Mid dashed orbit (rotates) */}
        <g className="orbit-slow" style={{ transformOrigin: "260px 260px" }}>
          <circle
            cx="260"
            cy="260"
            r="170"
            stroke="url(#ringStrokeFaint)"
            strokeWidth="1.25"
            strokeDasharray="3 7"
          />
          {/* Orbital satellite dot */}
          <circle cx="430" cy="260" r="4" fill="#9bbcff" opacity="0.85" />
          <circle cx="430" cy="260" r="9" fill="#3b7dff" opacity="0.25" />
        </g>

        {/* Soft glow halo behind primary ring */}
        <circle
          cx="260"
          cy="260"
          r="135"
          fill="none"
          stroke="rgba(59,125,255,0.55)"
          strokeWidth="14"
          filter="url(#strongBlur)"
        />

        {/* Primary ring — the brand mark */}
        <circle
          cx="260"
          cy="260"
          r="135"
          stroke="url(#ringStroke)"
          strokeWidth="3"
          className="pulse-soft"
          style={{ transformOrigin: "260px 260px" }}
        />

        {/* Secondary inner ring */}
        <circle
          cx="260"
          cy="260"
          r="92"
          stroke="rgba(123,162,255,0.55)"
          strokeWidth="1.5"
          strokeDasharray="1 3"
        />

        {/* Inner ring */}
        <circle
          cx="260"
          cy="260"
          r="62"
          stroke="rgba(123,162,255,0.85)"
          strokeWidth="2"
        />

        {/* Glowing core */}
        <circle cx="260" cy="260" r="48" fill="url(#coreGlow)" />
        <circle cx="260" cy="260" r="14" fill="#ffffff" opacity="0.95" />
        <circle cx="260" cy="260" r="6" fill="#ffffff" />

        {/* Counter-rotating tick orbit */}
        <g className="orbit-medium" style={{ transformOrigin: "260px 260px" }}>
          <line
            x1="260"
            y1="50"
            x2="260"
            y2="62"
            stroke="rgba(123,162,255,0.55)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="260"
            y1="458"
            x2="260"
            y2="470"
            stroke="rgba(123,162,255,0.30)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
