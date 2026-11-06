// Pure Percentage Math Engine — no eval, no UI.
// Supports 5 standard percentage modes with high precision.

export interface PercentageResult {
  value: number;
  formatted: string;
  formula: string;
  explanation: string;
}

function cleanRound(n: number, decimals = 4): number {
  if (!Number.isFinite(n)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((n + Number.EPSILON) * factor) / factor;
}

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  const rounded = cleanRound(n, 4);
  return Number.isInteger(rounded)
    ? rounded.toLocaleString("en-US")
    : rounded.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

/** Mode 1: What is P% of X? */
export function calcPercentOf(percent: number, total: number): PercentageResult {
  const value = (percent / 100) * total;
  return {
    value,
    formatted: formatNumber(value),
    formula: `(${percent} ÷ 100) × ${total}`,
    explanation: `${percent}% of ${total} is ${formatNumber(value)}.`,
  };
}

/** Mode 2: X is what percentage of Y? */
export function calcWhatPercent(part: number, total: number): PercentageResult {
  if (total === 0) {
    return {
      value: 0,
      formatted: "Undefined (div by zero)",
      formula: `(${part} ÷ 0) × 100`,
      explanation: "Cannot calculate percentage of zero.",
    };
  }
  const value = (part / total) * 100;
  return {
    value,
    formatted: `${formatNumber(value)}%`,
    formula: `(${part} ÷ ${total}) × 100`,
    explanation: `${part} represents ${formatNumber(value)}% of ${total}.`,
  };
}

/** Mode 3: Percentage increase or decrease from X to Y */
export function calcPercentChange(initial: number, final: number): PercentageResult {
  if (initial === 0) {
    return {
      value: 0,
      formatted: "Undefined (initial value is 0)",
      formula: `((${final} - 0) ÷ 0) × 100`,
      explanation: "Percentage change from 0 is undefined.",
    };
  }
  const diff = final - initial;
  const value = (diff / Math.abs(initial)) * 100;
  const isIncrease = diff >= 0;
  return {
    value,
    formatted: `${isIncrease ? "+" : ""}${formatNumber(value)}%`,
    formula: `((${final} - ${initial}) ÷ |${initial}|) × 100`,
    explanation: `From ${initial} to ${final} is a ${formatNumber(Math.abs(value))}% ${isIncrease ? "increase" : "decrease"}.`,
  };
}

/** Mode 4: Discount & Savings Calculator */
export function calcDiscount(
  originalPrice: number,
  discountPercent: number,
): {
  savings: number;
  finalPrice: number;
  formattedSavings: string;
  formattedFinalPrice: string;
  formula: string;
  explanation: string;
} {
  const savings = Math.max(0, (discountPercent / 100) * originalPrice);
  const finalPrice = Math.max(0, originalPrice - savings);
  return {
    savings,
    finalPrice,
    formattedSavings: formatNumber(savings),
    formattedFinalPrice: formatNumber(finalPrice),
    formula: `${originalPrice} - (${originalPrice} × ${discountPercent}%)`,
    explanation: `With a ${discountPercent}% discount, you save ${formatNumber(savings)} and pay ${formatNumber(finalPrice)}.`,
  };
}

/** Mode 5: Percentage Difference between two numbers |A - B| / ((A + B) / 2) * 100 */
export function calcPercentDifference(a: number, b: number): PercentageResult {
  const avg = (a + b) / 2;
  if (avg === 0) {
    return {
      value: 0,
      formatted: "0%",
      formula: `|${a} - ${b}| ÷ 0`,
      explanation: "Both numbers sum to zero.",
    };
  }
  const diff = Math.abs(a - b);
  const value = (diff / Math.abs(avg)) * 100;
  return {
    value,
    formatted: `${formatNumber(value)}%`,
    formula: `(|${a} - ${b}| ÷ ((|${a}| + |${b}|) ÷ 2)) × 100`,
    explanation: `The percentage difference between ${a} and ${b} is ${formatNumber(value)}%.`,
  };
}
