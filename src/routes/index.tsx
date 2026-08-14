import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BedDouble, HeartPulse, RefreshCcw, TrendingUp, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChartCard, ExportButton, GlassCard, KpiCard, PageHeader, axisProps, tooltipStyle } from "@/components/dash/primitives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { monthlyTrend, serviceLineMix, topHospitals } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — Medicare Health Intelligence" },
      {
        name: "description",
        content:
          "Enterprise healthcare analytics: revenue, patient volume, readmission rate and length of stay across 42 facilities.",
      },
      { property: "og:title", content: "Executive Dashboard — Medicare Health Intelligence" },
      {
        property: "og:description",
        content: "Real-time Medicare claims and clinical KPIs for health system executives.",
      },
    ],
  }),
  component: ExecutiveDashboard,
});

function ExecutiveDashboard() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Executive"
        title="Health System Overview"
        description="Consolidated performance across 42 facilities, FY2026 to date."
        actions={
          <>
            <Select defaultValue="ytd">
              <SelectTrigger className="glass h-9 w-[150px] border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="qtd">Quarter to date</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
            <ExportButton label="Export board pack" />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Revenue" value="$299.3M" delta={12.4} caption="vs. prior year" icon={TrendingUp} />
        <KpiCard label="Total Patients" value="134,650" delta={8.1} caption="encounters YTD" icon={Users} tone="teal" />
        <KpiCard label="Readmission Rate" value="11.9%" delta={-3.9} caption="30-day, all-cause" icon={RefreshCcw} tone="success" />
        <KpiCard label="Avg Length of Stay" value="4.3 days" delta={-2.1} caption="acute inpatient" icon={BedDouble} tone="violet" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          title="Revenue & patient volume"
          subtitle="Monthly, revenue in $M"
          className="xl:col-span-2"
          height={300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ left: -18, right: 8, top: 6 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="pat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis yAxisId="l" {...axisProps} />
              <YAxis yAxisId="r" orientation="right" {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area
                yAxisId="l"
                type="monotone"
                dataKey="revenue"
                name="Revenue ($M)"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#rev)"
              />
              <Area
                yAxisId="r"
                type="monotone"
                dataKey="patients"
                name="Patients"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                fill="url(#pat)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Service line mix" subtitle="Share of net revenue" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={serviceLineMix} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                {serviceLineMix.map((s) => (
                  <Cell key={s.name} fill={s.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Readmission rate trend" subtitle="30-day all-cause, %">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend} margin={{ left: -22, right: 8, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis domain={[10, 17]} {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="readmission" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average length of stay" subtitle="Days per acute admission">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend} margin={{ left: -22, right: 8, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis domain={[0, 6]} {...axisProps} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.35 }} />
              <Bar dataKey="los" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Facility leaderboard</h3>
            <HeartPulse className="size-4 text-primary" />
          </div>
          <ul className="mt-4 space-y-3">
            {topHospitals.map((h, i) => (
              <li key={h.name} className="flex items-center gap-3">
                <span className="num grid size-7 shrink-0 place-items-center rounded-lg bg-accent/70 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{h.name}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {h.region} · margin {h.margin}%
                  </span>
                </span>
                <span className="num text-sm font-semibold">${h.revenue}M</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </AppShell>
  );
}
