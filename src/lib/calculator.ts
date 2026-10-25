// Pure calculator engine — no UI, no eval. Can be swapped for a REST client later.
export type Operator = "+" | "-" | "×" | "÷" | "^";
export type AngleMode = "deg" | "rad";

export interface CalcState {
  display: string;
  stored: number | null;
  operator: Operator | null;
  waiting: boolean;
  expression: string;
  error: string | null;
  angleMode: AngleMode;
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
  angleMode: "deg",
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
    case "^": {
      const r = Math.pow(a, b);
      if (!Number.isFinite(r)) throw new Error("Result out of range");
      return r;
    }
  }
}

const clearIfError = (s: CalcState): CalcState => (s.error ? { ...initialState, angleMode: s.angleMode } : s);

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
  return { ...initialState, angleMode: s.angleMode, display: "Error", error: msg, expression: s.expression };
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
      state: { ...initialState, angleMode: s.angleMode, display: f, waiting: true, expression: `${expr} =` },
      entry: { expression: expr, result: f },
    };
  } catch (e) {
    return { state: fail({ ...s, expression: `${expr} =` }, (e as Error).message) };
  }
}

export function clearAll(state?: CalcState): CalcState {
  return { ...initialState, angleMode: state?.angleMode ?? "deg" };
}

export function toggleAngleMode(state: CalcState): CalcState {
  return {
    ...state,
    angleMode: state.angleMode === "deg" ? "rad" : "deg",
  };
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("n! requires non-negative integer");
  if (n > 170) throw new Error("Overflow (n > 170)");
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export type ScientificFunc =
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
  | "sinh"
  | "cosh"
  | "tanh"
  | "sqrt"
  | "cbrt"
  | "sqr"
  | "cube"
  | "recip"
  | "log"
  | "ln"
  | "exp"
  | "pow10"
  | "fact"
  | "abs";

export function applyScientific(state: CalcState, fn: ScientificFunc): CalcState {
  const s = clearIfError(state);
  const cur = parseFloat(s.display);
  try {
    let result: number;
    const isDeg = s.angleMode === "deg";
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    switch (fn) {
      case "sin": {
        const rad = isDeg ? toRad(cur) : cur;
        const v = Math.sin(rad);
        result = Math.abs(v) < 1e-15 ? 0 : v;
        break;
      }
      case "cos": {
        const rad = isDeg ? toRad(cur) : cur;
        const v = Math.cos(rad);
        result = Math.abs(v) < 1e-15 ? 0 : v;
        break;
      }
      case "tan": {
        if (isDeg && Math.abs((Math.abs(cur) % 180) - 90) < 1e-10) {
          throw new Error("Undefined (tan 90°)");
        }
        const rad = isDeg ? toRad(cur) : cur;
        const v = Math.tan(rad);
        result = Math.abs(v) < 1e-15 ? 0 : v;
        break;
      }
      case "asin": {
        if (cur < -1 || cur > 1) throw new Error("Input must be between -1 and 1");
        const rad = Math.asin(cur);
        result = isDeg ? toDeg(rad) : rad;
        break;
      }
      case "acos": {
        if (cur < -1 || cur > 1) throw new Error("Input must be between -1 and 1");
        const rad = Math.acos(cur);
        result = isDeg ? toDeg(rad) : rad;
        break;
      }
      case "atan": {
        const rad = Math.atan(cur);
        result = isDeg ? toDeg(rad) : rad;
        break;
      }
      case "sinh": result = Math.sinh(cur); break;
      case "cosh": result = Math.cosh(cur); break;
      case "tanh": result = Math.tanh(cur); break;
      case "sqrt": {
        if (cur < 0) throw new Error("Cannot √ negative number");
        result = Math.sqrt(cur);
        break;
      }
      case "cbrt": result = Math.cbrt(cur); break;
      case "sqr": result = cur * cur; break;
      case "cube": result = cur * cur * cur; break;
      case "recip": {
        if (cur === 0) throw new DivideByZeroError();
        result = 1 / cur;
        break;
      }
      case "log": {
        if (cur <= 0) throw new Error("Log requires positive number");
        result = Math.log10(cur);
        break;
      }
      case "ln": {
        if (cur <= 0) throw new Error("Ln requires positive number");
        result = Math.log(cur);
        break;
      }
      case "exp": result = Math.exp(cur); break;
      case "pow10": result = Math.pow(10, cur); break;
      case "fact": result = factorial(cur); break;
      case "abs": result = Math.abs(cur); break;
      default:
        return s;
    }

    if (!Number.isFinite(result)) throw new Error("Result out of range");
    const f = format(result);
    return {
      ...s,
      display: f,
      waiting: true,
      expression: `${fn}(${format(cur)})`,
    };
  } catch (e) {
    return fail(s, (e as Error).message);
  }
}

export function inputConstant(state: CalcState, name: "pi" | "e"): CalcState {
  const s = clearIfError(state);
  const val = name === "pi" ? Math.PI : Math.E;
  const f = format(val);
  return {
    ...s,
    display: f,
    waiting: true,
    expression: name === "pi" ? "π" : "e",
  };
}
