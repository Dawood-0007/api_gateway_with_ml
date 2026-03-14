import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "danger" | "warning" | "success";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  danger: "border-destructive/20 bg-destructive/5",
  warning: "border-warning/20 bg-warning/5",
  success: "border-primary/20 bg-primary/5",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  success: "bg-primary/10 text-primary",
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = "default", className }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-lg border p-5 bg-card animate-slide-in",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn("p-2 rounded-lg", iconVariantStyles[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
