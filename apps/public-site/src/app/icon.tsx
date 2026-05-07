import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#06080d",
        position: "relative",
      }}
    >
      {/* Halo */}
      <div
        style={{
          position: "absolute",
          inset: 4,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(59,125,255,0.55) 0%, rgba(59,125,255,0.18) 35%, transparent 72%)",
        }}
      />
      {/* Ring */}
      <div
        style={{
          position: "relative",
          width: 38,
          height: 38,
          borderRadius: 9999,
          border: "3px solid #3b7dff",
          boxShadow: "0 0 12px rgba(59,125,255,0.5)",
        }}
      />
    </div>,
    { ...size },
  );
}
