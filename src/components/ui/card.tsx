import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_15px_60px_rgba(15,23,42,0.15)]",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export function CardLabel(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs uppercase tracking-[0.3em] text-[var(--muted)]", props.className)}>
      {props.children}
    </p>
  );
}
