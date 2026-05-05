import { cn } from "@/lib/utils";

export function HeroRing({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-[420px] mx-auto pointer-events-none select-none",
        className,
      )}
      aria-hidden
    >
      {/* Soft blue glow behind the ring */}
      <div
        className="absolute inset-[10%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,125,255,0.32) 0%, rgba(59,125,255,0.08) 35%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <svg viewBox="0 0 400 400" className="relative w-full h-full" fill="none">
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b7dff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b7dff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5b8eff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#3b7dff" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b7dff" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient
            id="ringStrokeFaint"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#5b8eff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b7dff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Outermost orbit, very faint */}
        <circle
          cx="200"
          cy="200"
          r="190"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />

        {/* Outer ring */}
        <circle
          cx="200"
          cy="200"
          r="160"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />

        {/* Mid ring with dashed orbit accent */}
        <g className="orbit-slow">
          <circle
            cx="200"
            cy="200"
            r="130"
            stroke="url(#ringStrokeFaint)"
            strokeWidth="1.25"
            strokeDasharray="3 6"
          />
          {/* Orbit dot */}
          <circle cx="330" cy="200" r="3.5" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* Primary ring — the brand */}
        <circle
          cx="200"
          cy="200"
          r="100"
          stroke="url(#ringStroke)"
          strokeWidth="2"
          className="pulse-soft"
          style={{ transformOrigin: "200px 200px" }}
        />

        {/* Inner ring */}
        <circle
          cx="200"
          cy="200"
          r="60"
          stroke="rgba(91,142,255,0.6)"
          strokeWidth="1.5"
        />

        {/* Inner-most filled ring (the "system core") */}
        <circle
          cx="200"
          cy="200"
          r="30"
          fill="rgba(59,125,255,0.10)"
          stroke="rgba(91,142,255,0.7)"
          strokeWidth="1"
        />

        {/* Center dot — bright blue */}
        <circle cx="200" cy="200" r="6" fill="#3b7dff" />
        <circle cx="200" cy="200" r="12" fill="url(#ringGlow)" />

        {/* Counter-rotating tick orbit */}
        <g className="orbit-medium" style={{ transformOrigin: "200px 200px" }}>
          <line
            x1="200"
            y1="40"
            x2="200"
            y2="48"
            stroke="rgba(91,142,255,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
