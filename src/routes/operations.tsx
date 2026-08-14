import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Ambulance, BedDouble, HeartPulse, Timer } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChartCard, ExportButton, GlassCard, KpiCard, PageHeader, axisProps, tooltipStyle } from "@/components/dash/primitives";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { occupancyByHour, resourceUsage, unitUtilization } from "@/lib/mock-data";

export const Route = createFileRoute("/operations")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — Medicare Health Intelligence" },
      {
        name: "description",
        content: "Monitor bed occupancy, ICU utilization and resource capacity across the health system in real time.",
      },
      { property: "og:title", content: "Operations Dashboard — Medicare Health Intelligence" },
      { property: "og:description", content: "Live capacity, ICU utilization and resource usage for hospital operations." },
    ],
  }),
  component: OperationsDashboard,
});

function OperationsDashboard() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Capacity & Resource Command"
        description="Live bed, ICU and resource telemetry streaming from 42 facilities."
        actions={<ExportButton label="Export capacity" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Bed Occupancy" value="88.4%" delta={3.2} caption="staffed beds in use" icon={BedDouble} />
        <KpiCard label="ICU Utilization" value="86.1%" delta={4.8} caption="critical care beds" icon={HeartPulse} tone="warning" />
        <KpiCard label="ED Boarding Time" value="2h 14m" delta={-6.3} caption="median wait to bed" icon={Timer} tone="success" />
        <KpiCard label="Transfers In" value="312" delta={7.5} caption="last 24 hours" icon={Ambulance} tone="teal" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Occupancy through the day" subtitle="% capacity by 3-hour interval" className="xl:col-span-2" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={occupancyByHour} margin={{ left: -20, right: 8, top: 6 }}>
              <defs>
                <linearGradient id="beds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="icu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-5)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-chart-5)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="hour" {...axisProps} />
              <YAxis domain={[0, 100]} {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="beds" name="Beds" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#beds)" />
              <Area type="monotone" dataKey="icu" name="ICU" stroke="var(--color-chart-5)" strokeWidth={2} fill="url(#icu)" />
              <Area type="monotone" dataKey="ed" name="ED" stroke="var(--color-chart-3)" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Unit utilization" subtitle="% of licensed beds occupied" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={unitUtilization} layout="vertical" margin={{ left: 24, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} {...axisProps} />
              <YAxis type="category" dataKey="unit" width={76} {...axisProps} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
              <Bar dataKey="used" name="% used" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-5 xl:col-span-2">
          <h3 className="text-sm font-semibold">Resource usage</h3>
          <p className="text-xs text-muted-foreground">Deployed vs. available inventory</p>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead className="text-right">In use</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[35%]">Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resourceUsage.map((r) => {
                  const pct = Math.round((r.used / r.total) * 100);
                  return (
                    <TableRow key={r.resource}>
                      <TableCell className="font-medium">{r.resource}</TableCell>
                      <TableCell className="num text-right">{r.used.toLocaleString()}</TableCell>
                      <TableCell className="num text-right text-muted-foreground">{r.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={pct} className="h-2" />
                          <span className="num w-9 text-right text-xs font-semibold">{pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold">Capacity alerts</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { unit: "Med-Surg", note: "91% occupied — divert threshold in 4 beds", tone: "destructive" },
              { unit: "ICU", note: "88% occupied — 2 ventilators unassigned", tone: "warning" },
              { unit: "Pediatrics", note: "47% occupied — flex staff available", tone: "success" },
            ].map((a) => (
              <li key={a.unit} className="rounded-xl bg-accent/40 p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${
                      a.tone === "destructive" ? "bg-destructive" : a.tone === "warning" ? "bg-warning" : "bg-success"
                    }`}
                  />
                  <span className="font-medium">{a.unit}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.note}</p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </AppShell>
  );
}
