import { cn } from "../lib/cn";

type Size = "sm" | "md" | "lg";

const sizeStyles: Record<Size, string> = {
  sm: "size-7 text-[0.7rem]",
  md: "size-9 text-[0.78rem]",
  lg: "size-11 text-sm",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: Size;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-wider",
        "bg-[rgba(59,125,255,0.14)] text-[#cbdaff] border border-[rgba(59,125,255,0.28)]",
        sizeStyles[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
