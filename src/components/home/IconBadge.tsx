import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconBadgeProps = {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md";
};

export function IconBadge({ icon: Icon, className, size = "md" }: IconBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-signal/10 border border-signal/20",
        size === "sm" ? "h-9 w-9" : "h-10 w-10",
        className,
      )}
    >
      <Icon
        className={cn("text-signal", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")}
        strokeWidth={1.75}
      />
    </div>
  );
}
