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
import { AlertTriangle, BrainCircuit, Gauge, Search, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChartCard, ExportButton, GlassCard, KpiCard, PageHeader, axisProps, tooltipStyle } from "@/components/dash/primitives";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { predictionRows, riskCohort, shapFactors } from "@/lib/mock-data";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "AI Prediction Center — Medicare Health Intelligence" },
      {
        name: "description",
        content: "Risk scoring, readmission and sepsis predictions with an explainable AI feature-attribution panel.",
      },
      { property: "og:title", content: "AI Prediction Center — Medicare Health Intelligence" },
      { property: "og:description", content: "Explainable clinical risk models for readmission, ICU transfer and sepsis." },
    ],
  }),
  component: PredictionCenter,
});

function riskTone(risk: number) {
  if (risk >= 75) return "border-destructive/40 bg-destructive/10 text-destructive";
  if (risk >= 50) return "border-warning/40 bg-warning/10 text-warning";
  return "border-success/40 bg-success/10 text-success";
}

function PredictionCenter() {
  const [query, setQuery] = useState("");
  const [outcome, setOutcome] = useState("all");
  const rows = useMemo(
    () =>
      predictionRows.filter(
        (r) =>
          (outcome === "all" || r.outcome === outcome) &&
          (r.id.toLowerCase().includes(query.toLowerCase()) ||
            r.unit.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, outcome],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Machine Learning"
        title="AI Prediction Center"
        description="Gradient-boosted risk models scored nightly on 1.2M Medicare claims and live ICU telemetry."
        actions={<ExportButton label="Export scores" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Model AUC" value="0.891" delta={2.3} caption="readmission v4.2" icon={Gauge} />
        <KpiCard label="High-Risk Patients" value="1,284" delta={5.6} caption="score ≥ 75" icon={AlertTriangle} tone="warning" />
        <KpiCard label="Interventions Fired" value="642" delta={11.2} caption="care-team alerts" icon={Sparkles} tone="teal" />
        <KpiCard label="Prevented Readmits" value="218" delta={9.4} caption="est. $4.1M saved" icon={ShieldCheck} tone="success" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">Prediction results</h3>
              <p className="text-xs text-muted-foreground">Live scoring queue, refreshed every 15 minutes</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-52">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Patient ID or unit…"
                  className="h-9 rounded-xl pl-9"
                />
              </div>
              <Select value={outcome} onValueChange={setOutcome}>
                <SelectTrigger className="h-9 w-[160px] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All outcomes</SelectItem>
                  <SelectItem value="Readmission">Readmission</SelectItem>
                  <SelectItem value="ICU Transfer">ICU Transfer</SelectItem>
                  <SelectItem value="Sepsis Onset">Sepsis Onset</SelectItem>
                  <SelectItem value="Mortality">Mortality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Predicted outcome</TableHead>
                  <TableHead>Top driver</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <span className="num block text-sm font-semibold">{r.id}</span>
                      <span className="block text-[11px] text-muted-foreground">{r.patient}</span>
                    </TableCell>
                    <TableCell>{r.unit}</TableCell>
                    <TableCell>{r.outcome}</TableCell>
                    <TableCell className="text-muted-foreground">{r.driver}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={riskTone(r.risk)}>
                        {r.risk}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      No predictions match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <ChartCard title="Risk cohort split" subtitle="Active inpatients" height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskCohort} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                  {riskCohort.map((c) => (
                    <Cell key={c.name} fill={c.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Model confidence</h3>
            <div className="mt-4 space-y-3 text-xs">
              {[
                { label: "Precision", value: 84 },
                { label: "Recall", value: 79 },
                { label: "Calibration", value: 91 },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="num font-semibold">{m.value}%</span>
                  </div>
                  <Progress value={m.value} className="mt-1.5 h-1.5" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <ChartCard
        title="Explainable AI — SHAP feature attribution"
        subtitle="Contribution of each feature to the readmission risk score"
        height={300}
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            <BrainCircuit className="size-3.5" /> readmission-v4.2
          </span>
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={shapFactors} layout="vertical" margin={{ left: 110, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis type="number" domain={[-0.3, 0.35]} {...axisProps} />
            <YAxis type="category" dataKey="feature" width={160} {...axisProps} />
            <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
            <Bar dataKey="impact" name="SHAP value" radius={[0, 6, 6, 0]}>
              {shapFactors.map((f) => (
                <Cell key={f.feature} fill={f.impact >= 0 ? "var(--color-destructive)" : "var(--color-chart-3)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </AppShell>
  );
}
