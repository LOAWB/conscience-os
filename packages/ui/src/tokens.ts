export const tokens = {
  colors: {
    background: "#06080d",
    foreground: "#f4f4f5",
    muted: "#0c0f17",
    mutedForeground: "#94a3b8",
    subtle: "#6b7790",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.18)",
    accent: "#3b7dff",
    accentHover: "#5b8eff",
    accentSoft: "rgba(59, 125, 255, 0.12)",
    accentForeground: "#ffffff",
    ink: "#03050a",
    inkSoft: "#0a0d14",
    success: "#34d399",
    warn: "#fbbf24",
    error: "#f87171",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
    full: "9999px",
  },
  typography: {
    fontSans: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    fontMono: "var(--font-geist-mono), 'SFMono-Regular', Menlo, monospace",
  },
  motion: {
    fast: "150ms cubic-bezier(0.21, 0.61, 0.35, 1)",
    base: "200ms cubic-bezier(0.21, 0.61, 0.35, 1)",
    slow: "350ms cubic-bezier(0.21, 0.61, 0.35, 1)",
  },
} as const;

export type Tokens = typeof tokens;
