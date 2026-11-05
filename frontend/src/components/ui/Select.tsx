import * as React from "react";
import { cn } from "../../lib/utils";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-zinc-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
