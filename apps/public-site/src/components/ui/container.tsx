import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "narrow" | "wide";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-5xl",
    wide: "max-w-6xl",
  };
  return (
    <div
      className={cn("mx-auto px-6 sm:px-8 lg:px-10", widths[size], className)}
    >
      {children}
    </div>
  );
}
