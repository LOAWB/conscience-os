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
        background: "#ffffff",
        padding: "80px 96px",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at top right, rgba(59,125,255,0.08), transparent 60%)",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #3b7dff, #0b0f14)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              background: "#ffffff",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#3b7dff",
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, color: "#0b0f14" }}>
          Conscience OS
        </div>
      </div>

      <div
        style={{
          marginTop: 80,
          fontSize: 76,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#0b0f14",
          lineHeight: 1.05,
          maxWidth: 920,
          position: "relative",
        }}
      >
        {siteConfig.headline}
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#64748b",
          fontSize: 22,
          position: "relative",
        }}
      >
        <div>conscienceos.com</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
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
