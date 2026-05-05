import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
        background: "linear-gradient(135deg, #3b7dff 0%, #0b0f14 100%)",
        borderRadius: 6,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 4,
          background: "#ffffff",
          borderRadius: 3,
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
    </div>,
    { ...size },
  );
}
