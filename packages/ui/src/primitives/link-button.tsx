"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import {
  buttonBase,
  buttonSizeStyles,
  buttonVariantStyles,
  type ButtonSize,
  type ButtonVariant,
} from "./button";

type Props = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  return (
    <Link
      className={cn(
        buttonBase,
        buttonVariantStyles[variant],
        buttonSizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
