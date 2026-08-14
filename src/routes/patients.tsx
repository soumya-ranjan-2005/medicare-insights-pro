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
import { Activity, Search, UserRound, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChartCard, ExportButton, GlassCard, KpiCard, PageHeader, axisProps, tooltipStyle } from "@/components/dash/primitives";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ageDistribution, diseaseCategories, genderSplit } from "@/lib/mock-data";

export const Route = createFileRoute("/patients")({
  head: () => ({
    meta: [
      { title: "Patient Analytics — Medicare Health Intelligence" },
      {
        name: "description",
        content: "Explore patient demographics, age distribution, gender analysis and disease category outcomes.",
      },
      { property: "og:title", content: "Patient Analytics — Medicare Health Intelligence" },
      { property: "og:description", content: "Demographics, age bands and disease cohorts across the health system." },
    ],
  }),
  component: PatientAnalytics,
});

function PatientAnalytics() {
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () => diseaseCategories.filter((d) => d.category.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Population"
        title="Patient Analytics"
        description="Demographic and clinical cohort breakdown for 134,650 encounters."
        actions={<ExportButton label="Export cohort" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Unique Patients" value="98,412" delta={6.3} caption="distinct MRNs" icon={Users} />
        <KpiCard label="Median Age" value="68 yrs" delta={1.2} caption="Medicare skewed" icon={UserRound} tone="teal" />
        <KpiCard label="Chronic Comorbidity" value="63.8%" delta={2.7} caption="2+ conditions" icon={Activity} tone="warning" />
        <KpiCard label="Follow-up Adherence" value="81.4%" delta={4.5} caption="within 14 days" icon={Activity} tone="success" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Age distribution by gender" subtitle="Encounters per age band" className="xl:col-span-2" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageDistribution} margin={{ left: -18, right: 8, top: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="band" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.35 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="female" name="Female" stackId="a" fill="var(--color-chart-4)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="male" name="Male" stackId="a" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gender analysis" subtitle="Share of encounters" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={genderSplit} dataKey="value" nameKey="name" innerRadius={56} outerRadius={92} paddingAngle={3}>
                {genderSplit.map((g) => (
                  <Cell key={g.name} fill={g.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Disease categories</h3>
            <p className="text-xs text-muted-foreground">Case volume and in-hospital mortality rate</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter categories…"
              className="h-9 rounded-xl pl-9"
            />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Cases</TableHead>
                <TableHead className="text-right">Mortality</TableHead>
                <TableHead>Risk tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.category}>
                  <TableCell className="font-medium">{d.category}</TableCell>
                  <TableCell className="num text-right">{d.cases.toLocaleString()}</TableCell>
                  <TableCell className="num text-right">{d.mortality}%</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        d.mortality > 10
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : d.mortality > 7
                            ? "border-warning/40 bg-warning/10 text-warning"
                            : "border-success/40 bg-success/10 text-success"
                      }
                    >
                      {d.mortality > 10 ? "High" : d.mortality > 7 ? "Elevated" : "Managed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No categories match “{query}”.
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
