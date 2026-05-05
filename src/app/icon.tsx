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
      {/* Soft halo */}
      <div
        style={{
          position: "absolute",
          inset: 8,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(59,125,255,0.45) 0%, transparent 65%)",
        }}
      />
      {/* Outer ring */}
      <div
        style={{
          position: "relative",
          width: 36,
          height: 36,
          borderRadius: 9999,
          border: "3px solid #3b7dff",
        }}
      />
      {/* Center dot */}
      <div
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: 9999,
          background: "#3b7dff",
        }}
      />
    </div>,
    { ...size },
  );
}
