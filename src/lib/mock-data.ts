export const monthlyTrend = [
  { month: "Jan", revenue: 18.4, patients: 9120, readmission: 15.8, los: 5.2 },
  { month: "Feb", revenue: 19.1, patients: 9340, readmission: 15.4, los: 5.1 },
  { month: "Mar", revenue: 21.6, patients: 10120, readmission: 14.9, los: 5.0 },
  { month: "Apr", revenue: 20.8, patients: 9880, readmission: 14.6, los: 4.9 },
  { month: "May", revenue: 23.2, patients: 10740, readmission: 14.1, los: 4.8 },
  { month: "Jun", revenue: 24.9, patients: 11230, readmission: 13.7, los: 4.7 },
  { month: "Jul", revenue: 26.1, patients: 11810, readmission: 13.4, los: 4.6 },
  { month: "Aug", revenue: 25.4, patients: 11460, readmission: 13.6, los: 4.7 },
  { month: "Sep", revenue: 27.8, patients: 12040, readmission: 12.9, los: 4.5 },
  { month: "Oct", revenue: 29.3, patients: 12610, readmission: 12.6, los: 4.4 },
  { month: "Nov", revenue: 30.1, patients: 12880, readmission: 12.3, los: 4.4 },
  { month: "Dec", revenue: 32.6, patients: 13420, readmission: 11.9, los: 4.3 },
];

export const serviceLineMix = [
  { name: "Cardiology", value: 27, color: "var(--color-chart-1)" },
  { name: "Oncology", value: 21, color: "var(--color-chart-2)" },
  { name: "Orthopedics", value: 18, color: "var(--color-chart-3)" },
  { name: "Neurology", value: 14, color: "var(--color-chart-4)" },
  { name: "Pulmonary", value: 20, color: "var(--color-chart-5)" },
];

export const ageDistribution = [
  { band: "0-17", male: 620, female: 580 },
  { band: "18-34", male: 1180, female: 1420 },
  { band: "35-49", male: 1640, female: 1710 },
  { band: "50-64", male: 2480, female: 2320 },
  { band: "65-79", male: 3120, female: 3340 },
  { band: "80+", male: 1560, female: 1980 },
];

export const genderSplit = [
  { name: "Female", value: 52.4, color: "var(--color-chart-4)" },
  { name: "Male", value: 46.1, color: "var(--color-chart-1)" },
  { name: "Other / Undisclosed", value: 1.5, color: "var(--color-chart-2)" },
];

export const diseaseCategories = [
  { category: "Sepsis", cases: 4210, mortality: 12.4 },
  { category: "Heart Failure", cases: 3880, mortality: 9.1 },
  { category: "COPD", cases: 3120, mortality: 6.8 },
  { category: "Pneumonia", cases: 2960, mortality: 7.4 },
  { category: "Stroke", cases: 2410, mortality: 11.2 },
  { category: "Diabetes", cases: 2190, mortality: 3.6 },
  { category: "Renal Failure", cases: 1880, mortality: 8.9 },
];

export const payerMix = [
  { name: "Medicare", value: 44, color: "var(--color-chart-1)" },
  { name: "Medicaid", value: 18, color: "var(--color-chart-2)" },
  { name: "Commercial", value: 29, color: "var(--color-chart-3)" },
  { name: "Self-Pay", value: 9, color: "var(--color-chart-5)" },
];

export type DrgRow = {
  drg: string;
  description: string;
  cases: number;
  revenue: number;
  avgCost: number;
  margin: number;
};

export const drgRows: DrgRow[] = [
  { drg: "470", description: "Major joint replacement", cases: 1284, revenue: 24.6, avgCost: 14200, margin: 24.1 },
  { drg: "871", description: "Septicemia w/ MCC", cases: 1102, revenue: 21.8, avgCost: 16850, margin: 12.4 },
  { drg: "291", description: "Heart failure & shock w/ MCC", cases: 968, revenue: 17.4, avgCost: 12980, margin: 18.7 },
  { drg: "247", description: "Percutaneous cardiovascular proc", cases: 812, revenue: 16.9, avgCost: 15340, margin: 21.5 },
  { drg: "690", description: "Kidney & urinary tract infections", cases: 744, revenue: 9.2, avgCost: 8110, margin: 15.2 },
  { drg: "193", description: "Simple pneumonia w/ MCC", cases: 690, revenue: 8.4, avgCost: 7940, margin: 9.8 },
  { drg: "064", description: "Intracranial hemorrhage / stroke", cases: 612, revenue: 12.1, avgCost: 17420, margin: 7.3 },
  { drg: "480", description: "Hip & femur procedures", cases: 548, revenue: 11.3, avgCost: 15980, margin: 16.4 },
  { drg: "329", description: "Major small & large bowel proc", cases: 431, revenue: 13.7, avgCost: 21400, margin: 11.1 },
  { drg: "003", description: "ECMO / tracheostomy w/ MV", cases: 118, revenue: 14.9, avgCost: 92600, margin: 4.2 },
];

export const costBreakdown = [
  { category: "Labor", value: 42.3 },
  { category: "Supplies", value: 21.7 },
  { category: "Pharmacy", value: 14.9 },
  { category: "Facilities", value: 10.2 },
  { category: "IT & Admin", value: 6.4 },
  { category: "Other", value: 4.5 },
];

export const topHospitals = [
  { name: "Northshore Medical Center", region: "Northeast", revenue: 84.2, margin: 19.4, readmission: 10.8, rating: 4.8 },
  { name: "Lakeview Regional", region: "Midwest", revenue: 71.6, margin: 17.1, readmission: 11.6, rating: 4.6 },
  { name: "Cedar Valley Health", region: "West", revenue: 66.9, margin: 15.8, readmission: 12.4, rating: 4.5 },
  { name: "St. Aurora General", region: "South", revenue: 58.3, margin: 13.2, readmission: 13.9, rating: 4.2 },
  { name: "Harborline Institute", region: "Northeast", revenue: 49.7, margin: 12.6, readmission: 14.5, rating: 4.0 },
];

export type PredictionRow = {
  id: string;
  patient: string;
  unit: string;
  risk: number;
  driver: string;
  outcome: "Readmission" | "ICU Transfer" | "Mortality" | "Sepsis Onset";
};

export const predictionRows: PredictionRow[] = [
  { id: "PT-10482", patient: "M, 78", unit: "ICU-2", risk: 92, driver: "Lactate 4.8 mmol/L", outcome: "Sepsis Onset" },
  { id: "PT-10513", patient: "F, 84", unit: "Cardiac", risk: 87, driver: "EF 28% + 3 prior admits", outcome: "Readmission" },
  { id: "PT-10577", patient: "M, 66", unit: "Med-Surg", risk: 74, driver: "SpO2 trend −6%", outcome: "ICU Transfer" },
  { id: "PT-10604", patient: "F, 71", unit: "Neuro", risk: 68, driver: "NIHSS 14", outcome: "Readmission" },
  { id: "PT-10658", patient: "M, 59", unit: "ICU-1", risk: 61, driver: "Creatinine 2.4 mg/dL", outcome: "Mortality" },
  { id: "PT-10690", patient: "F, 47", unit: "Pulmonary", risk: 43, driver: "COPD exacerbation history", outcome: "Readmission" },
  { id: "PT-10712", patient: "M, 35", unit: "Med-Surg", risk: 22, driver: "Stable vitals 48h", outcome: "Readmission" },
];

export const shapFactors = [
  { feature: "Prior admissions (12m)", impact: 0.28 },
  { feature: "Serum lactate", impact: 0.21 },
  { feature: "Age band 75+", impact: 0.16 },
  { feature: "Charlson comorbidity index", impact: 0.13 },
  { feature: "Length of stay", impact: 0.09 },
  { feature: "Discharge to home (no care)", impact: -0.07 },
  { feature: "Medication adherence score", impact: -0.11 },
];

export const riskCohort = [
  { name: "High risk", value: 12, color: "var(--color-destructive)" },
  { name: "Moderate", value: 27, color: "var(--color-chart-5)" },
  { name: "Low risk", value: 61, color: "var(--color-chart-3)" },
];

export const occupancyByHour = [
  { hour: "00", beds: 78, icu: 71, ed: 42 },
  { hour: "03", beds: 74, icu: 69, ed: 35 },
  { hour: "06", beds: 76, icu: 72, ed: 48 },
  { hour: "09", beds: 84, icu: 80, ed: 66 },
  { hour: "12", beds: 89, icu: 86, ed: 74 },
  { hour: "15", beds: 92, icu: 88, ed: 81 },
  { hour: "18", beds: 88, icu: 84, ed: 77 },
  { hour: "21", beds: 82, icu: 78, ed: 59 },
];

export const unitUtilization = [
  { unit: "ICU", used: 88, capacity: 100 },
  { unit: "Cardiac", used: 74, capacity: 100 },
  { unit: "Med-Surg", used: 91, capacity: 100 },
  { unit: "Neuro", used: 63, capacity: 100 },
  { unit: "Oncology", used: 69, capacity: 100 },
  { unit: "Pediatrics", used: 47, capacity: 100 },
];

export const resourceUsage = [
  { resource: "Ventilators", used: 64, total: 90 },
  { resource: "Infusion pumps", used: 412, total: 520 },
  { resource: "OR suites", used: 17, total: 22 },
  { resource: "Nursing FTEs", used: 1284, total: 1400 },
  { resource: "Dialysis stations", used: 28, total: 36 },
];
