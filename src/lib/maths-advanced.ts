/**
 * Spidy Calculator — Advanced Maths Calculation Engine
 * Pure functions: fractions, ratios, LCM/GCD, primes, and basic algebra.
 * Zero UI, zero eval — designed for REST API extraction and unit testability.
 */

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface FractionStep {
  operation: string;
  expression: string;
  result: Fraction;
  mixed?: string | undefined;
  decimal: number;
  steps: string[];
}

export interface RatioResult {
  simplified: [number, number];
  ratioString: string;
  decimal: number;
  dividedParts?: number[] | undefined;
}

export interface LcmGcdResult {
  inputs: number[];
  gcd: number;
  lcm: number;
  gcdSteps: string[];
  lcmSteps: string[];
}

export interface PrimeFactorizationResult {
  n: number;
  isPrime: boolean;
  factors: number[];
  primePowers: { prime: number; power: number }[];
  steps: string[];
}

export interface LinearEquationResult {
  equation: string; // ax + b = c
  x: number | null;
  infiniteSolutions: boolean;
  noSolution: boolean;
  steps: string[];
}

export interface QuadraticEquationResult {
  equation: string; // ax^2 + bx + c = 0
  discriminant: number;
  rootType: "real-distinct" | "real-repeated" | "complex";
  roots: { real: number; imag: number }[];
  vertex: { x: number; y: number };
  steps: string[];
}

// -------------------------------------------------------------
// GCD & LCM Helpers
// -------------------------------------------------------------

export function computeGcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function computeLcm(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / computeGcd(a, b);
}

export function calculateLcmGcd(numbers: number[]): LcmGcdResult {
  const clean = numbers.filter((n) => Number.isFinite(n) && n > 0).map((n) => Math.round(n));
  if (clean.length === 0) {
    return {
      inputs: [],
      gcd: 0,
      lcm: 0,
      gcdSteps: ["Enter positive numbers to calculate GCD & LCM."],
      lcmSteps: [],
    };
  }

  const first = clean[0] ?? 0;
  if (clean.length === 1) {
    return {
      inputs: clean,
      gcd: first,
      lcm: first,
      gcdSteps: [`GCD of single number ${first} is ${first}`],
      lcmSteps: [`LCM of single number ${first} is ${first}`],
    };
  }

  let runningGcd = first;
  const gcdSteps: string[] = [`Start with GCD = ${first}`];
  for (let i = 1; i < clean.length; i++) {
    const val = clean[i];
    if (val === undefined) continue;
    const prev = runningGcd;
    runningGcd = computeGcd(runningGcd, val);
    gcdSteps.push(`GCD(${prev}, ${val}) = ${runningGcd}`);
  }

  let runningLcm = first;
  const lcmSteps: string[] = [`Start with LCM = ${first}`];
  for (let i = 1; i < clean.length; i++) {
    const val = clean[i];
    if (val === undefined) continue;
    const prev = runningLcm;
    runningLcm = computeLcm(runningLcm, val);
    lcmSteps.push(
      `LCM(${prev}, ${val}) = (${prev} × ${val}) / GCD(${prev}, ${val}) = ${runningLcm}`,
    );
  }

  return {
    inputs: clean,
    gcd: runningGcd,
    lcm: runningLcm,
    gcdSteps,
    lcmSteps,
  };
}

// -------------------------------------------------------------
// Fractions
// -------------------------------------------------------------

export function simplifyFraction(f: Fraction): Fraction {
  if (f.denominator === 0) {
    throw new Error("Denominator cannot be zero.");
  }
  const sign = (f.numerator < 0 ? -1 : 1) * (f.denominator < 0 ? -1 : 1);
  const num = Math.abs(f.numerator);
  const den = Math.abs(f.denominator);
  const gcd = computeGcd(num, den) || 1;
  return {
    numerator: sign * (num / gcd),
    denominator: den / gcd,
  };
}

export function toMixedFraction(f: Fraction): string {
  const { numerator, denominator } = simplifyFraction(f);
  if (denominator === 1) return `${numerator}`;
  const whole = Math.trunc(numerator / denominator);
  const rem = Math.abs(numerator % denominator);
  if (whole === 0) return `${numerator}/${denominator}`;
  if (rem === 0) return `${whole}`;
  return `${whole} ${rem}/${denominator}`;
}

export function calculateFractions(
  f1: Fraction,
  op: "+" | "-" | "×" | "÷",
  f2: Fraction,
): FractionStep {
  if (f1.denominator === 0 || f2.denominator === 0) {
    throw new Error("Denominator cannot be zero.");
  }

  const steps: string[] = [];
  let rawNumerator = 0;
  let rawDenominator = 1;

  if (op === "+" || op === "-") {
    const commonDen = computeLcm(f1.denominator, f2.denominator);
    const scale1 = commonDen / f1.denominator;
    const scale2 = commonDen / f2.denominator;
    const adjustedNum1 = f1.numerator * scale1;
    const adjustedNum2 = f2.numerator * scale2;

    steps.push(`Find common denominator of ${f1.denominator} and ${f2.denominator}: ${commonDen}`);
    steps.push(
      `Scale first fraction: (${f1.numerator} × ${scale1}) / ${commonDen} = ${adjustedNum1}/${commonDen}`,
    );
    steps.push(
      `Scale second fraction: (${f2.numerator} × ${scale2}) / ${commonDen} = ${adjustedNum2}/${commonDen}`,
    );

    if (op === "+") {
      rawNumerator = adjustedNum1 + adjustedNum2;
      steps.push(`Add numerators: ${adjustedNum1} + ${adjustedNum2} = ${rawNumerator}`);
    } else {
      rawNumerator = adjustedNum1 - adjustedNum2;
      steps.push(`Subtract numerators: ${adjustedNum1} - ${adjustedNum2} = ${rawNumerator}`);
    }
    rawDenominator = commonDen;
  } else if (op === "×") {
    rawNumerator = f1.numerator * f2.numerator;
    rawDenominator = f1.denominator * f2.denominator;
    steps.push(`Multiply numerators: ${f1.numerator} × ${f2.numerator} = ${rawNumerator}`);
    steps.push(`Multiply denominators: ${f1.denominator} × ${f2.denominator} = ${rawDenominator}`);
  } else if (op === "÷") {
    if (f2.numerator === 0) {
      throw new Error("Cannot divide by zero fraction.");
    }
    rawNumerator = f1.numerator * f2.denominator;
    rawDenominator = f1.denominator * f2.numerator;
    steps.push(`Invert divisor: ${f2.denominator}/${f2.numerator}`);
    steps.push(
      `Multiply: (${f1.numerator} × ${f2.denominator}) / (${f1.denominator} × ${f2.numerator}) = ${rawNumerator}/${rawDenominator}`,
    );
  }

  const simplified = simplifyFraction({ numerator: rawNumerator, denominator: rawDenominator });
  steps.push(`Simplify by dividing by GCD: ${simplified.numerator}/${simplified.denominator}`);

  const decimal = simplified.numerator / simplified.denominator;
  const mixed = toMixedFraction(simplified);

  return {
    operation: op,
    expression: `${f1.numerator}/${f1.denominator} ${op} ${f2.numerator}/${f2.denominator}`,
    result: simplified,
    mixed: mixed !== `${simplified.numerator}/${simplified.denominator}` ? mixed : undefined,
    decimal,
    steps,
  };
}

// -------------------------------------------------------------
// Ratios
// -------------------------------------------------------------

export function calculateRatio(
  antecedent: number,
  consequent: number,
  divideTotal?: number,
): RatioResult {
  if (consequent === 0) {
    throw new Error("Consequent cannot be zero.");
  }
  const gcd = computeGcd(antecedent, consequent) || 1;
  const simplified: [number, number] = [antecedent / gcd, consequent / gcd];
  const decimal = antecedent / consequent;
  const ratioString = `${simplified[0]} : ${simplified[1]}`;

  let dividedParts: number[] | undefined;
  if (typeof divideTotal === "number" && divideTotal > 0) {
    const totalParts = simplified[0] + simplified[1];
    const part1 = (divideTotal * simplified[0]) / totalParts;
    const part2 = (divideTotal * simplified[1]) / totalParts;
    dividedParts = [part1, part2];
  }

  return {
    simplified,
    ratioString,
    decimal,
    dividedParts,
  };
}

// -------------------------------------------------------------
// Primes & Prime Factorization
// -------------------------------------------------------------

export function calculatePrimeFactorization(n: number): PrimeFactorizationResult {
  const num = Math.round(Math.abs(n));
  if (num < 2) {
    return {
      n: num,
      isPrime: false,
      factors: [],
      primePowers: [],
      steps: [`${num} is neither prime nor composite.`],
    };
  }

  let rem = num;
  const factors: number[] = [];
  const steps: string[] = [`Factorize ${num}:`];

  // Check 2
  while (rem % 2 === 0) {
    factors.push(2);
    rem = rem / 2;
    steps.push(`Divided by 2: remaining ${rem}`);
  }

  // Check odd divisors
  let divisor = 3;
  while (divisor * divisor <= rem) {
    if (rem % divisor === 0) {
      factors.push(divisor);
      rem = rem / divisor;
      steps.push(`Divided by ${divisor}: remaining ${rem}`);
    } else {
      divisor += 2;
    }
  }

  if (rem > 1) {
    factors.push(rem);
    steps.push(`Last prime factor is ${rem}`);
  }

  const isPrime = factors.length === 1 && factors[0] === num;

  // Group into powers
  const powerMap = new Map<number, number>();
  for (const factor of factors) {
    powerMap.set(factor, (powerMap.get(factor) || 0) + 1);
  }
  const primePowers = Array.from(powerMap.entries()).map(([prime, power]) => ({
    prime,
    power,
  }));

  return {
    n: num,
    isPrime,
    factors,
    primePowers,
    steps,
  };
}

// -------------------------------------------------------------
// Algebra: Linear & Quadratic
// -------------------------------------------------------------

export function solveLinearEquation(a: number, b: number, c: number): LinearEquationResult {
  // ax + b = c  =>  ax = c - b  =>  x = (c - b) / a
  const steps: string[] = [
    `Original equation: ${a}x + (${b}) = ${c}`,
    `Subtract ${b} from both sides: ${a}x = ${c - b}`,
  ];

  if (a === 0) {
    if (b === c) {
      steps.push(`0 = 0 is always true: Infinite solutions.`);
      return {
        equation: `${a}x + ${b} = ${c}`,
        x: null,
        infiniteSolutions: true,
        noSolution: false,
        steps,
      };
    }
    steps.push(`0 = ${c - b} is impossible: No solution.`);
    return {
      equation: `${a}x + ${b} = ${c}`,
      x: null,
      infiniteSolutions: false,
      noSolution: true,
      steps,
    };
  }

  const x = (c - b) / a;
  steps.push(`Divide both sides by ${a}: x = ${c - b} / ${a} = ${x}`);

  return {
    equation: `${a}x + ${b} = ${c}`,
    x,
    infiniteSolutions: false,
    noSolution: false,
    steps,
  };
}

export function solveQuadraticEquation(a: number, b: number, c: number): QuadraticEquationResult {
  if (a === 0) {
    throw new Error("Coefficient 'a' cannot be zero in a quadratic equation.");
  }

  // ax^2 + bx + c = 0
  const discriminant = b * b - 4 * a * c;
  const vertex = { x: -b / (2 * a), y: c - (b * b) / (4 * a) };
  const steps: string[] = [
    `Equation: ${a}x² + (${b})x + (${c}) = 0`,
    `Calculate discriminant Δ = b² - 4ac: (${b})² - 4(${a})(${c}) = ${discriminant}`,
    `Parabola vertex: (${vertex.x.toFixed(3)}, ${vertex.y.toFixed(3)})`,
  ];

  if (Math.abs(discriminant) < 1e-12) {
    const root = -b / (2 * a);
    steps.push(`Δ = 0: One real repeated root.`);
    steps.push(`x = -b / (2a) = ${root}`);
    return {
      equation: `${a}x² + ${b}x + ${c} = 0`,
      discriminant: 0,
      rootType: "real-repeated",
      roots: [{ real: root, imag: 0 }],
      vertex,
      steps,
    };
  }

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    const r1 = (-b + sqrtD) / (2 * a);
    const r2 = (-b - sqrtD) / (2 * a);
    steps.push(`Δ > 0: Two distinct real roots.`);
    steps.push(`x₁ = (-(${b}) + √${discriminant}) / (2 × ${a}) = ${r1.toFixed(4)}`);
    steps.push(`x₂ = (-(${b}) - √${discriminant}) / (2 × ${a}) = ${r2.toFixed(4)}`);
    return {
      equation: `${a}x² + ${b}x + ${c} = 0`,
      discriminant,
      rootType: "real-distinct",
      roots: [
        { real: r1, imag: 0 },
        { real: r2, imag: 0 },
      ],
      vertex,
      steps,
    };
  }

  // Complex roots
  const realPart = -b / (2 * a);
  const imagPart = Math.sqrt(-discriminant) / (2 * a);
  steps.push(`Δ < 0: Complex conjugate roots.`);
  steps.push(`x = ${realPart.toFixed(4)} ± ${Math.abs(imagPart).toFixed(4)}i`);

  return {
    equation: `${a}x² + ${b}x + ${c} = 0`,
    discriminant,
    rootType: "complex",
    roots: [
      { real: realPart, imag: imagPart },
      { real: realPart, imag: -imagPart },
    ],
    vertex,
    steps,
  };
}
