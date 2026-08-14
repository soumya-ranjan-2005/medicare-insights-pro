import { useEffect, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("glass rounded-2xl", className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{actions}</div>
    </div>
  );
}

export function ExportButton({ label = "Export" }: { label?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="glass border-0"
      onClick={() => toast.success("Export queued", { description: "CSV will be emailed to you shortly." })}
    >
      <Download className="size-4" />
      {label}
    </Button>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  caption,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta: number;
  caption: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "teal" | "success" | "violet" | "warning";
}) {
  const positive = delta >= 0;
  const toneRing: Record<string, string> = {
    primary: "text-primary",
    teal: "text-teal",
    success: "text-success",
    violet: "text-violet",
    warning: "text-warning",
  };
  return (
    <GlassCard className="relative overflow-hidden p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-current opacity-[0.07] blur-2xl"
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={cn("rounded-lg bg-accent/60 p-2", toneRing[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="num mt-3 text-3xl font-bold">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
            positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
          )}
        >
          {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(delta)}%
        </span>
        <span className="text-muted-foreground">{caption}</span>
      </div>
    </GlassCard>
  );
}

export function ChartCard({
  title,
  subtitle,
  action,
  className,
  height = 280,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  height?: number;
  children: ReactNode;
}) {
  const mounted = useMounted();
  return (
    <GlassCard className={cn("p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-4" style={{ height }}>
        {mounted ? children : <div className="size-full animate-pulse rounded-xl bg-muted/50" />}
      </div>
    </GlassCard>
  );
}

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const tooltipStyle = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--color-popover-foreground)",
  },
  labelStyle: { color: "var(--color-muted-foreground)", fontSize: "11px" },
  itemStyle: { color: "var(--color-popover-foreground)" },
} as const;
