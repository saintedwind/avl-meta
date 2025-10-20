import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline";
};

export function Badge({ className, variant = "default", ...props }: Props) {
  const styles =
    variant === "default"
      ? "bg-gray-900 text-white"
      : variant === "secondary"
      ? "bg-gray-100 text-gray-900"
      : "border border-gray-300 text-gray-800";
  return <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs", styles, className)} {...props} />;
}
