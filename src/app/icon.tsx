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
      }}
    >
      <svg
        width="56"
        height="56"
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
    </div>,
    { ...size },
  );
}
