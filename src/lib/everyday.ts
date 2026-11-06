/**
 * Spidy Calculator — Everyday & Specialized Calculation Engine
 * 1. BMI Calculator (metric/imperial, WHO categories, healthy weight range)
 * 2. Ring Size Converter (diameter, circumference, US/UK/EU/JP systems)
 * 3. Patio & Paver Calculator (rectangular/circular/L-shaped, paver counts, wastage, base sand/gravel, cost)
 */

// =============================================================
// 1. BMI CALCULATOR
// =============================================================

export type BMICategoryKey =
  "underweight" | "normal" | "overweight" | "obese-1" | "obese-2" | "obese-3";

export interface BMICategoryInfo {
  key: BMICategoryKey;
  label: string;
  rangeLabel: string;
  comicBadge: string;
  badgeColor: string;
  description: string;
}

export const BMI_CATEGORIES: Record<BMICategoryKey, BMICategoryInfo> = {
  underweight: {
    key: "underweight",
    label: "Underweight",
    rangeLabel: "< 18.5",
    comicBadge: "DEFENSE BOOST NEEDED!",
    badgeColor: "bg-hero-blue text-paper",
    description:
      "May indicate nutritional deficiency or underlying health concerns. Consult a healthcare provider.",
  },
  normal: {
    key: "normal",
    label: "Normal Weight",
    rangeLabel: "18.5 – 24.9",
    comicBadge: "HERO PRIME CONDITION!",
    badgeColor: "bg-emerald-600 text-paper",
    description:
      "Optimal BMI range associated with lowest risk of cardiovascular and metabolic conditions.",
  },
  overweight: {
    key: "overweight",
    label: "Overweight",
    rangeLabel: "25.0 – 29.9",
    comicBadge: "STRENGTH TRAINING FOCUS!",
    badgeColor: "bg-mustard text-ink",
    description:
      "Modest increase in risk for cardiovascular disease. Regular activity and balanced nutrition advised.",
  },
  "obese-1": {
    key: "obese-1",
    label: "Obesity Class I",
    rangeLabel: "30.0 – 34.9",
    comicBadge: "HEALTH ALERT!",
    badgeColor: "bg-amber-600 text-paper",
    description:
      "Increased risk of type 2 diabetes, hypertension, and cardiovascular issues. Medical guidance recommended.",
  },
  "obese-2": {
    key: "obese-2",
    label: "Obesity Class II",
    rangeLabel: "35.0 – 39.9",
    comicBadge: "HIGH VULNERABILITY!",
    badgeColor: "bg-orange-600 text-paper",
    description:
      "High risk of health complications. Consider physician-guided lifestyle or therapeutic strategies.",
  },
  "obese-3": {
    key: "obese-3",
    label: "Obesity Class III",
    rangeLabel: "≥ 40.0",
    comicBadge: "CRITICAL RECOVERY NEEDED!",
    badgeColor: "bg-hero-red text-paper",
    description:
      "Very high risk of severe complications. Immediate comprehensive medical evaluation is advised.",
  },
};

export interface BMIResult {
  bmi: number;
  category: BMICategoryInfo;
  gaugePercent: number; // 0 to 100%
  healthyWeightRange: { minKg: number; maxKg: number; minLbs: number; maxLbs: number };
  heightCm: number;
  weightKg: number;
  disclaimer: string;
}

export function calculateBmiMetric(heightCm: number, weightKg: number): BMIResult {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error("Height and weight must be greater than zero.");
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Number(bmiRaw.toFixed(1));

  let categoryKey: BMICategoryKey = "normal";
  if (bmi < 18.5) categoryKey = "underweight";
  else if (bmi < 25.0) categoryKey = "normal";
  else if (bmi < 30.0) categoryKey = "overweight";
  else if (bmi < 35.0) categoryKey = "obese-1";
  else if (bmi < 40.0) categoryKey = "obese-2";
  else categoryKey = "obese-3";

  // Map 14-45 BMI to 0-100% gauge
  const gaugePercent = Math.min(100, Math.max(0, ((bmi - 14) / (45 - 14)) * 100));

  // Healthy weight: 18.5 to 24.9 BMI
  const minKg = Number((18.5 * heightM * heightM).toFixed(1));
  const maxKg = Number((24.9 * heightM * heightM).toFixed(1));
  const minLbs = Number((minKg * 2.20462).toFixed(1));
  const maxLbs = Number((maxKg * 2.20462).toFixed(1));

  return {
    bmi,
    category: BMI_CATEGORIES[categoryKey],
    gaugePercent,
    healthyWeightRange: { minKg, maxKg, minLbs, maxLbs },
    heightCm,
    weightKg,
    disclaimer:
      "Important Medical Disclaimer: BMI is a screening indicator, not a diagnostic measurement of body fat or health. It does not account for muscle mass, bone density, age, sex, or ethnicity. Consult a licensed medical professional for personal clinical advice.",
  };
}

export function calculateBmiImperial(feet: number, inches: number, weightLbs: number): BMIResult {
  const totalInches = feet * 12 + inches;
  if (totalInches <= 0 || weightLbs <= 0) {
    throw new Error("Height and weight must be greater than zero.");
  }
  const heightCm = totalInches * 2.54;
  const weightKg = weightLbs / 2.20462;
  return calculateBmiMetric(heightCm, weightKg);
}

// =============================================================
// 2. RING SIZE CONVERTER
// =============================================================

export interface RingSizeRow {
  us: string;
  uk: string;
  eu: number; // ISO standard (inside circumference in mm)
  jp: number;
  diameterMm: number;
  circumferenceMm: number;
}

export const RING_SIZE_CHART: RingSizeRow[] = [
  { us: "3", uk: "F", eu: 44, jp: 4, diameterMm: 14.1, circumferenceMm: 44.2 },
  { us: "3.5", uk: "G", eu: 45, jp: 5, diameterMm: 14.5, circumferenceMm: 45.5 },
  { us: "4", uk: "H", eu: 47, jp: 7, diameterMm: 14.9, circumferenceMm: 46.8 },
  { us: "4.5", uk: "I", eu: 48, jp: 8, diameterMm: 15.3, circumferenceMm: 48.0 },
  { us: "5", uk: "J 1/2", eu: 49, jp: 9, diameterMm: 15.7, circumferenceMm: 49.3 },
  { us: "5.5", uk: "K 1/2", eu: 51, jp: 10, diameterMm: 16.1, circumferenceMm: 50.6 },
  { us: "6", uk: "L 1/2", eu: 52, jp: 11, diameterMm: 16.5, circumferenceMm: 51.9 },
  { us: "6.5", uk: "M 1/2", eu: 53, jp: 13, diameterMm: 16.9, circumferenceMm: 53.1 },
  { us: "7", uk: "N 1/2", eu: 55, jp: 14, diameterMm: 17.3, circumferenceMm: 54.4 },
  { us: "7.5", uk: "O 1/2", eu: 56, jp: 15, diameterMm: 17.7, circumferenceMm: 55.7 },
  { us: "8", uk: "P 1/2", eu: 57, jp: 16, diameterMm: 18.1, circumferenceMm: 57.0 },
  { us: "8.5", uk: "Q 1/2", eu: 58, jp: 17, diameterMm: 18.5, circumferenceMm: 58.3 },
  { us: "9", uk: "R 1/2", eu: 60, jp: 18, diameterMm: 18.9, circumferenceMm: 59.5 },
  { us: "9.5", uk: "S 1/2", eu: 61, jp: 19, diameterMm: 19.4, circumferenceMm: 60.8 },
  { us: "10", uk: "T 1/2", eu: 62, jp: 20, diameterMm: 19.8, circumferenceMm: 62.1 },
  { us: "10.5", uk: "U 1/2", eu: 64, jp: 22, diameterMm: 20.2, circumferenceMm: 63.4 },
  { us: "11", uk: "V 1/2", eu: 65, jp: 23, diameterMm: 20.6, circumferenceMm: 64.6 },
  { us: "11.5", uk: "W 1/2", eu: 66, jp: 24, diameterMm: 21.0, circumferenceMm: 65.9 },
  { us: "12", uk: "X 1/2", eu: 68, jp: 25, diameterMm: 21.4, circumferenceMm: 67.2 },
  { us: "12.5", uk: "Z", eu: 69, jp: 26, diameterMm: 21.8, circumferenceMm: 68.5 },
  { us: "13", uk: "Z+1", eu: 70, jp: 27, diameterMm: 22.2, circumferenceMm: 69.7 },
];

export function findClosestRingSizeByDiameter(diameterMm: number): RingSizeRow {
  let best: RingSizeRow = RING_SIZE_CHART[0] as RingSizeRow;
  let minDiff = Math.abs(best.diameterMm - diameterMm);
  for (const row of RING_SIZE_CHART) {
    const diff = Math.abs(row.diameterMm - diameterMm);
    if (diff < minDiff) {
      minDiff = diff;
      best = row;
    }
  }
  return best;
}

export function findClosestRingSizeByCircumference(circumferenceMm: number): RingSizeRow {
  let best: RingSizeRow = RING_SIZE_CHART[0] as RingSizeRow;
  let minDiff = Math.abs(best.circumferenceMm - circumferenceMm);
  for (const row of RING_SIZE_CHART) {
    const diff = Math.abs(row.circumferenceMm - circumferenceMm);
    if (diff < minDiff) {
      minDiff = diff;
      best = row;
    }
  }
  return best;
}

// =============================================================
// 3. PATIO & PAVER CALCULATOR
// =============================================================

export type PatioShape = "rectangle" | "circle" | "l-shape";

export interface PatioDimensions {
  shape: PatioShape;
  // Rectangle
  lengthFt?: number;
  widthFt?: number;
  // Circle
  diameterFt?: number;
  // L-Shape (Main section + Wing section)
  mainLengthFt?: number;
  mainWidthFt?: number;
  wingLengthFt?: number;
  wingWidthFt?: number;
}

export interface PaverSpecification {
  lengthInches: number;
  widthInches: number;
  costPerPaver?: number;
}

export interface PatioMaterialResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  paverAreaSqFt: number;
  rawPaversNeeded: number;
  wastagePercent: number;
  totalPaversWithWastage: number;
  // Sub-base (4" gravel depth default)
  gravelDepthInches: number;
  gravelCubicFeet: number;
  gravelCubicYards: number;
  gravelTons: number; // ~1.4 tons per cubic yard
  // Bedding sand (1" sand depth default)
  sandDepthInches: number;
  sandCubicFeet: number;
  sandCubicYards: number;
  sandTons: number; // ~1.3 tons per cubic yard
  // Costs
  paverCostTotal: number;
  gravelCostTotal: number;
  sandCostTotal: number;
  estimatedGrandTotal: number;
  steps: string[];
}

export function calculatePatioMaterials(
  dims: PatioDimensions,
  paver: PaverSpecification,
  wastagePercent: number = 10,
  gravelDepthInches: number = 4,
  sandDepthInches: number = 1,
  costOptions?: {
    gravelCostPerTon?: number;
    sandCostPerTon?: number;
  },
): PatioMaterialResult {
  const steps: string[] = [];
  let areaSqFt = 0;

  if (dims.shape === "rectangle") {
    const l = dims.lengthFt || 0;
    const w = dims.widthFt || 0;
    areaSqFt = l * w;
    steps.push(`Rectangular area: ${l} ft × ${w} ft = ${areaSqFt.toFixed(2)} sq ft`);
  } else if (dims.shape === "circle") {
    const d = dims.diameterFt || 0;
    const r = d / 2;
    areaSqFt = Math.PI * r * r;
    steps.push(`Circular area: π × (${r.toFixed(2)} ft)² = ${areaSqFt.toFixed(2)} sq ft`);
  } else if (dims.shape === "l-shape") {
    const a1 = (dims.mainLengthFt || 0) * (dims.mainWidthFt || 0);
    const a2 = (dims.wingLengthFt || 0) * (dims.wingWidthFt || 0);
    areaSqFt = a1 + a2;
    steps.push(
      `L-Shape Section 1: ${dims.mainLengthFt} × ${dims.mainWidthFt} = ${a1.toFixed(2)} sq ft`,
    );
    steps.push(
      `L-Shape Section 2: ${dims.wingLengthFt} × ${dims.wingWidthFt} = ${a2.toFixed(2)} sq ft`,
    );
    steps.push(`Combined L-Shape Area = ${areaSqFt.toFixed(2)} sq ft`);
  }

  const areaSqM = Number((areaSqFt * 0.092903).toFixed(2));
  const paverAreaSqFt = (paver.lengthInches * paver.widthInches) / 144;
  const rawPavers = Math.ceil(Number((areaSqFt / (paverAreaSqFt || 1)).toFixed(4)));
  const wastageMultiplier = 1 + wastagePercent / 100;
  const totalPavers = Math.ceil(Number((rawPavers * wastageMultiplier).toFixed(4)));

  steps.push(
    `Single paver area: (${paver.lengthInches}" × ${paver.widthInches}") / 144 = ${paverAreaSqFt.toFixed(3)} sq ft`,
  );
  steps.push(
    `Base paver count: ${areaSqFt.toFixed(1)} / ${paverAreaSqFt.toFixed(3)} = ${rawPavers} pavers`,
  );
  steps.push(
    `With ${wastagePercent}% wastage allowance for cutting/breakage: ${totalPavers} pavers`,
  );

  // Sub-base gravel
  const gravelCubicFeet = areaSqFt * (gravelDepthInches / 12);
  const gravelCubicYards = Number((gravelCubicFeet / 27).toFixed(2));
  const gravelTons = Number((gravelCubicYards * 1.4).toFixed(2));
  steps.push(
    `Compacted gravel sub-base (${gravelDepthInches}"): ${gravelCubicYards} cu yds (~${gravelTons} tons)`,
  );

  // Sand bedding
  const sandCubicFeet = areaSqFt * (sandDepthInches / 12);
  const sandCubicYards = Number((sandCubicFeet / 27).toFixed(2));
  const sandTons = Number((sandCubicYards * 1.3).toFixed(2));
  steps.push(
    `Bedding sand layer (${sandDepthInches}"): ${sandCubicYards} cu yds (~${sandTons} tons)`,
  );

  // Costs
  const paverCostTotal = Number(((paver.costPerPaver || 0) * totalPavers).toFixed(2));
  const gravelCostTotal = Number(((costOptions?.gravelCostPerTon || 0) * gravelTons).toFixed(2));
  const sandCostTotal = Number(((costOptions?.sandCostPerTon || 0) * sandTons).toFixed(2));
  const estimatedGrandTotal = Number((paverCostTotal + gravelCostTotal + sandCostTotal).toFixed(2));

  return {
    totalAreaSqFt: Number(areaSqFt.toFixed(2)),
    totalAreaSqM: areaSqM,
    paverAreaSqFt: Number(paverAreaSqFt.toFixed(3)),
    rawPaversNeeded: rawPavers,
    wastagePercent,
    totalPaversWithWastage: totalPavers,
    gravelDepthInches,
    gravelCubicFeet: Number(gravelCubicFeet.toFixed(2)),
    gravelCubicYards,
    gravelTons,
    sandDepthInches,
    sandCubicFeet: Number(sandCubicFeet.toFixed(2)),
    sandCubicYards,
    sandTons,
    paverCostTotal,
    gravelCostTotal,
    sandCostTotal,
    estimatedGrandTotal,
    steps,
  };
}
