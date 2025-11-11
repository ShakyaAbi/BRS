"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "secondary" | "ghost";
  size?: "default" | "lg" | "sm";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-gradient-to-r from-violet-500 to-orange-400 text-white hover:opacity-90 shadow-lg shadow-violet-500/30",
  secondary:
    "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-violet-400",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface)]/60",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
  sm: "h-9 px-4 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 gap-2",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
