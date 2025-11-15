import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "danger";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border";

  const variants = {
    default: "bg-gray-200 text-gray-800 border-gray-300",
    secondary: "bg-blue-100 text-blue-700 border-blue-200",
    success: "bg-green-100 text-green-700 border-green-200",
    danger: "bg-red-100 text-red-700 border-red-200",
  };

  return <div className={cn(base, variants[variant], className)} {...props} />;
}
