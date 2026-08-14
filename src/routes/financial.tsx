import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Coins, PiggyBank, Receipt, Search, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChartCard, ExportButton, GlassCard, KpiCard, PageHeader, axisProps, tooltipStyle } from "@/components/dash/primitives";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { costBreakdown, drgRows, payerMix, topHospitals } from "@/lib/mock-data";

export const Route = createFileRoute("/financial")({
  head: () => ({
    meta: [
      { title: "Financial Dashboard — Medicare Health Intelligence" },
      {
        name: "description",
        content: "Revenue by DRG and payer, cost structure analysis and top performing hospitals by margin.",
      },
      { property: "og:title", content: "Financial Dashboard — Medicare Health Intelligence" },
      { property: "og:description", content: "DRG revenue, payer mix and cost analysis for health system finance teams." },
    ],
  }),
  component: FinancialDashboard,
});

function FinancialDashboard() {
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () =>
      drgRows.filter(
        (r) => r.drg.includes(query) || r.description.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Finance"
        title="Financial Performance"
        description="Reimbursement, cost structure and margin performance by DRG, payer and facility."
        actions={<ExportButton label="Export ledger" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Net Revenue" value="$299.3M" delta={12.4} caption="YTD collected" icon={TrendingUp} />
        <KpiCard label="Operating Margin" value="16.2%" delta={1.8} caption="vs. 14.4% LY" icon={PiggyBank} tone="success" />
        <KpiCard label="Cost per Case" value="$14,820" delta={-2.6} caption="risk adjusted" icon={Coins} tone="teal" />
        <KpiCard label="Denial Rate" value="4.7%" delta={-1.1} caption="first-pass claims" icon={Receipt} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Revenue by DRG" subtitle="Top 10 DRGs, $M" className="xl:col-span-2" height={320}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={drgRows} layout="vertical" margin={{ left: 34, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" {...axisProps} />
              <YAxis type="category" dataKey="drg" width={44} {...axisProps} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.35 }} />
              <Bar dataKey="revenue" name="Revenue ($M)" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by payer" subtitle="Share of net revenue" height={320}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={payerMix} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={3}>
                {payerMix.map((p) => (
                  <Cell key={p.name} fill={p.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Cost analysis" subtitle="Share of total operating cost, %">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costBreakdown} margin={{ left: -20, right: 8, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="category" {...axisProps} interval={0} angle={-18} dy={8} height={48} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.35 }} />
              <Bar dataKey="value" name="% of cost" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <GlassCard className="p-5 xl:col-span-2">
          <h3 className="text-sm font-semibold">Top performing hospitals</h3>
          <p className="text-xs text-muted-foreground">Ranked by contribution margin</p>
          <div className="mt-4 space-y-4">
            {topHospitals.map((h) => (
              <div key={h.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{h.name}</span>
                  <span className="num text-muted-foreground">
                    ${h.revenue}M · {h.margin}%
                  </span>
                </div>
                <Progress value={h.margin * 4} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">DRG profitability detail</h3>
            <p className="text-xs text-muted-foreground">Case volume, revenue and margin by diagnosis-related group</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search DRG code or description…"
              className="h-9 rounded-xl pl-9"
            />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DRG</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Cases</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg cost</TableHead>
                <TableHead className="text-right">Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.drg}>
                  <TableCell className="num font-semibold">{r.drg}</TableCell>
                  <TableCell className="max-w-[260px] truncate">{r.description}</TableCell>
                  <TableCell className="num text-right">{r.cases.toLocaleString()}</TableCell>
                  <TableCell className="num text-right">${r.revenue}M</TableCell>
                  <TableCell className="num text-right">${r.avgCost.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        r.margin >= 15
                          ? "border-success/40 bg-success/10 text-success"
                          : r.margin >= 8
                            ? "border-warning/40 bg-warning/10 text-warning"
                            : "border-destructive/40 bg-destructive/10 text-destructive"
                      }
                    >
                      {r.margin}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    No DRGs match “{query}”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </AppShell>
  );
}
