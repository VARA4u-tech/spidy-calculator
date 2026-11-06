// Pure Unit Conversion Engine — no eval, no UI.
// Supports Length, Weight, Volume, Temperature, Speed, and Time.

export type UnitCategory = "length" | "weight" | "volume" | "temperature" | "speed" | "time";

export interface UnitDefinition {
  id: string;
  label: string;
  symbol: string;
  factorToBase: number; // For linear units: valueInBase = value * factorToBase
}

export interface ConversionResult {
  value: number;
  formatted: string;
  fromUnit: string;
  toUnit: string;
  formula: string;
  fullStep: string;
}

// ── 1. LENGTH (Base unit: meter) ──────────────────────────────────
export const LENGTH_UNITS: UnitDefinition[] = [
  { id: "mm", label: "Millimeters", symbol: "mm", factorToBase: 0.001 },
  { id: "cm", label: "Centimeters", symbol: "cm", factorToBase: 0.01 },
  { id: "m", label: "Meters", symbol: "m", factorToBase: 1 },
  { id: "km", label: "Kilometers", symbol: "km", factorToBase: 1000 },
  { id: "in", label: "Inches", symbol: "in", factorToBase: 0.0254 },
  { id: "ft", label: "Feet", symbol: "ft", factorToBase: 0.3048 },
  { id: "yd", label: "Yards", symbol: "yd", factorToBase: 0.9144 },
  { id: "mi", label: "Miles", symbol: "mi", factorToBase: 1609.344 },
  { id: "nmi", label: "Nautical Miles", symbol: "NM", factorToBase: 1852 },
];

// ── 2. WEIGHT (Base unit: kilogram) ───────────────────────────────
export const WEIGHT_UNITS: UnitDefinition[] = [
  { id: "mg", label: "Milligrams", symbol: "mg", factorToBase: 0.000001 },
  { id: "g", label: "Grams", symbol: "g", factorToBase: 0.001 },
  { id: "kg", label: "Kilograms", symbol: "kg", factorToBase: 1 },
  { id: "tonne", label: "Metric Tonnes", symbol: "t", factorToBase: 1000 },
  { id: "oz", label: "Ounces", symbol: "oz", factorToBase: 0.028349523125 },
  { id: "lb", label: "Pounds", symbol: "lb", factorToBase: 0.45359237 },
  { id: "st", label: "Stone", symbol: "st", factorToBase: 6.35029318 },
];

// ── 3. VOLUME (Base unit: liter) ──────────────────────────────────
export const VOLUME_UNITS: UnitDefinition[] = [
  { id: "ml", label: "Milliliters", symbol: "mL", factorToBase: 0.001 },
  { id: "l", label: "Liters", symbol: "L", factorToBase: 1 },
  { id: "cm3", label: "Cubic Centimeters", symbol: "cm³", factorToBase: 0.001 },
  { id: "m3", label: "Cubic Meters", symbol: "m³", factorToBase: 1000 },
  { id: "us_gal", label: "US Gallons", symbol: "gal", factorToBase: 3.785411784 },
  { id: "us_qt", label: "US Quarts", symbol: "qt", factorToBase: 0.946352946 },
  { id: "us_pt", label: "US Pints", symbol: "pt", factorToBase: 0.473176473 },
  { id: "us_cup", label: "US Cups", symbol: "cup", factorToBase: 0.2365882365 },
  { id: "us_floz", label: "US Fluid Ounces", symbol: "fl oz", factorToBase: 0.0295735295625 },
];

// ── 4. TEMPERATURE (Special affine transformations) ───────────────
export const TEMPERATURE_UNITS: UnitDefinition[] = [
  { id: "c", label: "Celsius", symbol: "°C", factorToBase: 1 },
  { id: "f", label: "Fahrenheit", symbol: "°F", factorToBase: 1 },
  { id: "k", label: "Kelvin", symbol: "K", factorToBase: 1 },
];

// ── 5. SPEED (Base unit: meters per second) ───────────────────────
export const SPEED_UNITS: UnitDefinition[] = [
  { id: "ms", label: "Meters per second", symbol: "m/s", factorToBase: 1 },
  { id: "kmh", label: "Kilometers per hour", symbol: "km/h", factorToBase: 1 / 3.6 },
  { id: "mph", label: "Miles per hour", symbol: "mph", factorToBase: 0.44704 },
  { id: "knot", label: "Knots", symbol: "kn", factorToBase: 1852 / 3600 },
  { id: "fts", label: "Feet per second", symbol: "ft/s", factorToBase: 0.3048 },
];

// ── 6. TIME (Base unit: second) ───────────────────────────────────
export const TIME_UNITS: UnitDefinition[] = [
  { id: "s", label: "Seconds", symbol: "s", factorToBase: 1 },
  { id: "min", label: "Minutes", symbol: "min", factorToBase: 60 },
  { id: "hr", label: "Hours", symbol: "hr", factorToBase: 3600 },
  { id: "day", label: "Days", symbol: "d", factorToBase: 86400 },
  { id: "week", label: "Weeks", symbol: "wk", factorToBase: 604800 },
  { id: "month", label: "Months (avg 30.44d)", symbol: "mo", factorToBase: 2629800 },
  { id: "year", label: "Years (avg 365.25d)", symbol: "yr", factorToBase: 31557600 },
];

export const CATEGORY_MAP: Record<UnitCategory, { title: string; units: UnitDefinition[] }> = {
  length: { title: "Length Converter", units: LENGTH_UNITS },
  weight: { title: "Weight Converter", units: WEIGHT_UNITS },
  volume: { title: "Volume Converter", units: VOLUME_UNITS },
  temperature: { title: "Temperature Converter", units: TEMPERATURE_UNITS },
  speed: { title: "Speed Converter", units: SPEED_UNITS },
  time: { title: "Time Converter", units: TIME_UNITS },
};

export function formatConversionValue(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) > 0 && Math.abs(n) < 1e-6)) {
    return n.toExponential(6).replace(/\.?0+e/, "e");
  }
  const rounded = Math.round((n + Number.EPSILON) * 1000000) / 1000000;
  return Number.isInteger(rounded)
    ? rounded.toLocaleString("en-US")
    : rounded.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export function convertUnits(
  category: UnitCategory,
  val: number,
  fromId: string,
  toId: string,
): ConversionResult {
  if (!Number.isFinite(val)) {
    return {
      value: 0,
      formatted: "0",
      fromUnit: fromId,
      toUnit: toId,
      formula: "0",
      fullStep: "Enter a valid number",
    };
  }

  // Handle Temperature special formulas
  if (category === "temperature") {
    let result = val;
    let formula = "";
    if (fromId === toId) {
      result = val;
      formula = `${val}`;
    } else if (fromId === "c" && toId === "f") {
      result = (val * 9) / 5 + 32;
      formula = `(${val} × 9/5) + 32`;
    } else if (fromId === "c" && toId === "k") {
      result = val + 273.15;
      formula = `${val} + 273.15`;
    } else if (fromId === "f" && toId === "c") {
      result = ((val - 32) * 5) / 9;
      formula = `(${val} - 32) × 5/9`;
    } else if (fromId === "f" && toId === "k") {
      result = ((val - 32) * 5) / 9 + 273.15;
      formula = `((${val} - 32) × 5/9) + 273.15`;
    } else if (fromId === "k" && toId === "c") {
      result = val - 273.15;
      formula = `${val} - 273.15`;
    } else if (fromId === "k" && toId === "f") {
      result = ((val - 273.15) * 9) / 5 + 32;
      formula = `((${val} - 273.15) × 9/5) + 32`;
    }
    const fromDef = TEMPERATURE_UNITS.find((u) => u.id === fromId);
    const toDef = TEMPERATURE_UNITS.find((u) => u.id === toId);
    const formatted = formatConversionValue(result);
    return {
      value: result,
      formatted,
      fromUnit: fromDef?.symbol ?? fromId,
      toUnit: toDef?.symbol ?? toId,
      formula,
      fullStep: `${val} ${fromDef?.symbol} = ${formatted} ${toDef?.symbol}`,
    };
  }

  // Standard Linear Unit Conversion via Base Factor
  const units = CATEGORY_MAP[category]?.units ?? [];
  const defaultUnit: UnitDefinition = units[0] ?? {
    id: "unit",
    label: "Unit",
    symbol: "u",
    factorToBase: 1,
  };
  const fromDef = units.find((u) => u.id === fromId) ?? defaultUnit;
  const toDef = units.find((u) => u.id === toId) ?? units[1] ?? defaultUnit;

  const inBase = val * fromDef.factorToBase;
  const result = inBase / toDef.factorToBase;
  const formatted = formatConversionValue(result);

  const ratio = fromDef.factorToBase / toDef.factorToBase;
  const formula = `${val} × ${formatConversionValue(ratio)}`;
  const fullStep = `${val} ${fromDef.symbol} × ${formatConversionValue(ratio)} = ${formatted} ${toDef.symbol}`;

  return {
    value: result,
    formatted,
    fromUnit: fromDef.symbol,
    toUnit: toDef.symbol,
    formula,
    fullStep,
  };
}
