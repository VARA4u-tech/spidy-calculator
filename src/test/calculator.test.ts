import { describe, it, expect } from "vitest";
import * as C from "@/lib/calculator";

const run = (keys: string[]) => {
  let s = C.initialState;
  for (const k of keys) {
    if (/^\d$/.test(k)) s = C.inputDigit(s, k);
    else if (k === ".") s = C.inputDecimal(s);
    else if (k === "=") s = C.equals(s).state;
    else if (k === "%") s = C.percent(s);
    else if (k === "±") s = C.toggleSign(s);
    else if (k === "⌫") s = C.backspace(s);
    else s = C.chooseOperator(s, k as C.Operator);
  }
  return s;
};

describe("calculator", () => {
  it("adds decimals precisely", () =>
    expect(run(["0", ".", "1", "+", "0", ".", "2", "="]).display).toBe("0.3"));
  it("chains left to right", () => expect(run(["2", "+", "3", "×", "4", "="]).display).toBe("20"));
  it("divides by zero shows error", () => {
    const s = run(["5", "÷", "0", "="]);
    expect(s.error).toBeTruthy();
    expect(run(["5", "÷", "0", "=", "7"]).display).toBe("7");
  });
  it("percent of stored for +", () =>
    expect(run(["2", "0", "0", "+", "1", "0", "%", "="]).display).toBe("220"));
  it("sign toggle and backspace", () => {
    expect(run(["9", "±", "-", "1", "="]).display).toBe("-10");
    expect(run(["1", "2", "3", "⌫"]).display).toBe("12");
  });
  it("subtract and multiply", () =>
    expect(run(["7", "-", "1", "0", "×", "2", "="]).display).toBe("-6"));
});
