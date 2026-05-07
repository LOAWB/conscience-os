import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  variant = "default",
  id,
}: {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "muted" | "ink";
  id?: string;
}) {
  const variants = {
    default: "bg-background",
    muted: "bg-muted",
    ink: "aura-ink text-white",
  };
  return (
    <section
      id={id}
      className={cn(
        "w-full py-20 sm:py-24 lg:py-28",
        variants[variant],
        className,
      )}
    >
      {children}
    </section>
  );
}
