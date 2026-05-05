import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#06080d",
        padding: "80px 96px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Soft blue radial in the corner */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(59,125,255,0.18), transparent 60%)",
        }}
      />

      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Wordmark row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          strokeLinecap="round"
        >
          <circle cx="50" cy="50" r="44" stroke="#ffffff" strokeWidth="6" />
          <path
            d="M 28 32 C 78 32, 22 68, 72 68"
            stroke="#3b7dff"
            strokeWidth="5"
          />
        </svg>
        <div style={{ fontSize: 26, fontWeight: 600, color: "#f4f4f5" }}>
          Conscience OS
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          marginTop: 80,
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#f4f4f5",
          lineHeight: 1.05,
          maxWidth: 920,
          position: "relative",
        }}
      >
        {siteConfig.headline}
      </div>

      {/* Footer row */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#94a3b8",
          fontSize: 22,
          position: "relative",
        }}
      >
        <div>conscienceos.com</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#3b7dff",
            }}
          />
          <div>Premium development</div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
