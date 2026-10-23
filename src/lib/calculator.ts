// Pure calculator engine — no UI, no eval. Can be swapped for a REST client later.
export type Operator = "+" | "-" | "×" | "÷";

export interface CalcState {
  display: string;
  stored: number | null;
  operator: Operator | null;
  waiting: boolean;
  expression: string;
  error: string | null;
}

export interface HistoryEntry {
  expression: string;
  result: string;
}

export const initialState: CalcState = {
  display: "0",
  stored: null,
  operator: null,
  waiting: false,
  expression: "",
  error: null,
};

const MAX_DIGITS = 16;

export function format(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  const r = Number.parseFloat(n.toPrecision(12));
  if (Object.is(r, -0)) return "0";
  const abs = Math.abs(r);
  if (abs !== 0 && (abs >= 1e16 || abs < 1e-9)) return r.toExponential(6).replace(/\.?0+e/, "e");
  return String(r);
}

export class DivideByZeroError extends Error {
  constructor() {
    super("Can't divide by zero, hero!");
  }
}

export function compute(a: number, op: Operator, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷":
      if (b === 0) throw new DivideByZeroError();
      return a / b;
  }
}

const clearIfError = (s: CalcState): CalcState => (s.error ? initialState : s);

export function inputDigit(state: CalcState, d: string): CalcState {
  const s = clearIfError(state);
  if (s.waiting) return { ...s, display: d, waiting: false };
  if (s.display.replace(/[-.]/g, "").length >= MAX_DIGITS) return s;
  return { ...s, display: s.display === "0" ? d : s.display === "-0" ? "-" + d : s.display + d };
}

export function inputDecimal(state: CalcState): CalcState {
  const s = clearIfError(state);
  if (s.waiting) return { ...s, display: "0.", waiting: false };
  if (s.display.includes(".")) return s;
  return { ...s, display: s.display + "." };
}

export function toggleSign(state: CalcState): CalcState {
  const s = clearIfError(state);
  if (s.waiting) return { ...s, display: "-0", waiting: false };
  return { ...s, display: s.display.startsWith("-") ? s.display.slice(1) : "-" + s.display };
}

export function percent(state: CalcState): CalcState {
  const s = clearIfError(state);
  const cur = parseFloat(s.display);
  const v = s.stored !== null && (s.operator === "+" || s.operator === "-") ? (s.stored * cur) / 100 : cur / 100;
  return { ...s, display: format(v), waiting: false };
}

export function backspace(state: CalcState): CalcState {
  const s = clearIfError(state);
  if (s.waiting) return s;
  const next = s.display.slice(0, -1);
  return { ...s, display: next === "" || next === "-" ? "0" : next };
}

function fail(s: CalcState, msg: string): CalcState {
  return { ...initialState, display: "Error", error: msg, expression: s.expression };
}

export function chooseOperator(state: CalcState, op: Operator): CalcState {
  const s = clearIfError(state);
  const cur = parseFloat(s.display);
  if (s.operator && s.stored !== null && !s.waiting) {
    try {
      const r = compute(s.stored, s.operator, cur);
      const f = format(r);
      return { ...s, display: f, stored: parseFloat(f), operator: op, waiting: true, expression: `${f} ${op}` };
    } catch (e) {
      return fail(s, (e as Error).message);
    }
  }
  if (s.operator && s.waiting) return { ...s, operator: op, expression: `${format(s.stored ?? cur)} ${op}` };
  return { ...s, stored: cur, operator: op, waiting: true, expression: `${format(cur)} ${op}` };
}

export function equals(state: CalcState): { state: CalcState; entry?: HistoryEntry } {
  const s = state;
  if (s.error || !s.operator || s.stored === null) return { state: s };
  const cur = parseFloat(s.display);
  const expr = `${format(s.stored)} ${s.operator} ${format(cur)}`;
  try {
    const f = format(compute(s.stored, s.operator, cur));
    return {
      state: { ...initialState, display: f, waiting: true, expression: `${expr} =` },
      entry: { expression: expr, result: f },
    };
  } catch (e) {
    return { state: fail({ ...s, expression: `${expr} =` }, (e as Error).message) };
  }
}

export function clearAll(): CalcState {
  return initialState;
}
