import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "ink"
  | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent-hover)] btn-glow",
  secondary:
    "glass-card text-[var(--color-foreground)] hover:bg-white/[0.06] hover:border-[var(--color-accent)]/40",
  ghost: "text-[var(--color-foreground)] hover:bg-white/[0.05]",
  ink: "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-soft)]",
  destructive:
    "bg-[rgba(248,113,113,0.10)] text-[var(--color-error)] border border-[rgba(248,113,113,0.30)] hover:bg-[rgba(248,113,113,0.18)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-12 px-6 text-base",
};

type Props = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(base, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export {
  base as buttonBase,
  variantStyles as buttonVariantStyles,
  sizeStyles as buttonSizeStyles,
};
