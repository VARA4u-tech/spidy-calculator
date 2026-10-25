import { describe, it, expect } from "vitest";
import * as C from "./calculator";

describe("calculator pure engine", () => {
  describe("format", () => {
    it("formats standard numbers cleanly", () => {
      expect(C.format(42)).toBe("42");
      expect(C.format(3.14159)).toBe("3.14159");
      expect(C.format(0)).toBe("0");
    });

    it("normalizes -0 to 0", () => {
      expect(C.format(-0)).toBe("0");
    });

    it("handles non-finite values as Error", () => {
      expect(C.format(Infinity)).toBe("Error");
      expect(C.format(-Infinity)).toBe("Error");
      expect(C.format(NaN)).toBe("Error");
    });

    it("converts very large numbers to exponential notation", () => {
      const formatted = C.format(1e17);
      expect(formatted).toContain("e+17");
    });

    it("converts very small non-zero numbers to exponential notation", () => {
      const formatted = C.format(1e-10);
      expect(formatted).toContain("e-10");
    });
  });

  describe("compute", () => {
    it("adds two numbers", () => {
      expect(C.compute(12, "+", 8)).toBe(20);
      expect(C.compute(-5, "+", 10)).toBe(5);
    });

    it("subtracts two numbers", () => {
      expect(C.compute(20, "-", 7)).toBe(13);
      expect(C.compute(5, "-", 12)).toBe(-7);
    });

    it("multiplies two numbers", () => {
      expect(C.compute(6, "×", 7)).toBe(42);
      expect(C.compute(-3, "×", 4)).toBe(-12);
    });

    it("divides two numbers", () => {
      expect(C.compute(100, "÷", 4)).toBe(25);
      expect(C.compute(7, "÷", 2)).toBe(3.5);
    });

    it("throws DivideByZeroError when dividing by zero", () => {
      expect(() => C.compute(42, "÷", 0)).toThrow(C.DivideByZeroError);
      expect(() => C.compute(42, "÷", 0)).toThrow("Can't divide by zero, hero!");
    });
  });

  describe("inputDigit", () => {
    it("replaces initial '0' with the pressed digit", () => {
      let state = C.initialState;
      state = C.inputDigit(state, "5");
      expect(state.display).toBe("5");
    });

    it("appends digits consecutively", () => {
      let state = C.initialState;
      state = C.inputDigit(state, "1");
      state = C.inputDigit(state, "2");
      state = C.inputDigit(state, "3");
      expect(state.display).toBe("123");
    });

    it("replaces display if waiting for next operand", () => {
      let state = { ...C.initialState, display: "123", waiting: true };
      state = C.inputDigit(state, "7");
      expect(state.display).toBe("7");
      expect(state.waiting).toBe(false);
    });

    it("handles typing a digit after toggleSign on zero (-0)", () => {
      let state = C.toggleSign(C.initialState);
      expect(state.display).toBe("-0");
      state = C.inputDigit(state, "8");
      expect(state.display).toBe("-8");
    });

    it("respects MAX_DIGITS length limit", () => {
      let state = C.initialState;
      for (let i = 0; i < 20; i++) {
        state = C.inputDigit(state, "9");
      }
      expect(state.display.length).toBe(16);
    });

    it("clears error state when a digit is entered", () => {
      const errorState: C.CalcState = {
        ...C.initialState,
        display: "Error",
        error: "Some error",
      };
      const state = C.inputDigit(errorState, "4");
      expect(state.error).toBeNull();
      expect(state.display).toBe("4");
    });
  });

  describe("inputDecimal", () => {
    it("appends decimal point to display", () => {
      let state = C.inputDigit(C.initialState, "3");
      state = C.inputDecimal(state);
      expect(state.display).toBe("3.");
    });

    it("does not add multiple decimals to the same number", () => {
      let state = C.inputDigit(C.initialState, "3");
      state = C.inputDecimal(state);
      state = C.inputDecimal(state);
      expect(state.display).toBe("3.");
    });

    it("resets to '0.' when waiting for next operand", () => {
      const state: C.CalcState = { ...C.initialState, display: "99", waiting: true };
      const next = C.inputDecimal(state);
      expect(next.display).toBe("0.");
      expect(next.waiting).toBe(false);
    });
  });

  describe("toggleSign", () => {
    it("flips positive to negative", () => {
      let state = C.inputDigit(C.initialState, "5");
      state = C.toggleSign(state);
      expect(state.display).toBe("-5");
    });

    it("flips negative to positive", () => {
      let state = C.inputDigit(C.initialState, "5");
      state = C.toggleSign(state);
      state = C.toggleSign(state);
      expect(state.display).toBe("5");
    });

    it("turns '0' into '-0'", () => {
      const state = C.toggleSign(C.initialState);
      expect(state.display).toBe("-0");
    });

    it("sets '-0' when waiting for next operand", () => {
      const state: C.CalcState = { ...C.initialState, display: "20", waiting: true };
      const next = C.toggleSign(state);
      expect(next.display).toBe("-0");
      expect(next.waiting).toBe(false);
    });
  });

  describe("percent", () => {
    it("divides standalone number by 100", () => {
      let state = C.inputDigit(C.initialState, "5");
      state = C.inputDigit(state, "0");
      state = C.percent(state);
      expect(state.display).toBe("0.5");
    });

    it("calculates percentage relative to stored number for addition", () => {
      let state = C.inputDigit(C.initialState, "2");
      state = C.inputDigit(state, "0");
      state = C.inputDigit(state, "0"); // 200
      state = C.chooseOperator(state, "+");
      state = C.inputDigit(state, "1");
      state = C.inputDigit(state, "5"); // 15
      state = C.percent(state); // 15% of 200 = 30
      expect(state.display).toBe("30");
    });
  });

  describe("backspace", () => {
    it("removes the last character", () => {
      let state = C.inputDigit(C.initialState, "1");
      state = C.inputDigit(state, "2");
      state = C.inputDigit(state, "3");
      state = C.backspace(state);
      expect(state.display).toBe("12");
    });

    it("resets to '0' when backspacing single digit", () => {
      let state = C.inputDigit(C.initialState, "8");
      state = C.backspace(state);
      expect(state.display).toBe("0");
    });

    it("resets to '0' when backspacing negative single digit", () => {
      let state = C.inputDigit(C.initialState, "8");
      state = C.toggleSign(state); // -8
      state = C.backspace(state);
      expect(state.display).toBe("0");
    });

    it("does nothing when waiting for next operand", () => {
      const state: C.CalcState = { ...C.initialState, display: "123", waiting: true };
      const next = C.backspace(state);
      expect(next.display).toBe("123");
    });
  });

  describe("chooseOperator & chaining", () => {
    it("sets operator and stores current number", () => {
      let state = C.inputDigit(C.initialState, "9");
      state = C.chooseOperator(state, "+");
      expect(state.operator).toBe("+");
      expect(state.stored).toBe(9);
      expect(state.waiting).toBe(true);
      expect(state.expression).toBe("9 +");
    });

    it("updates operator if operator is changed before typing second number", () => {
      let state = C.inputDigit(C.initialState, "9");
      state = C.chooseOperator(state, "+");
      state = C.chooseOperator(state, "×");
      expect(state.operator).toBe("×");
      expect(state.expression).toBe("9 ×");
    });

    it("evaluates intermediate result when chaining operators", () => {
      let state = C.inputDigit(C.initialState, "1");
      state = C.inputDigit(state, "0"); // 10
      state = C.chooseOperator(state, "+");
      state = C.inputDigit(state, "5"); // 5
      state = C.chooseOperator(state, "×"); // 10 + 5 = 15, then ×
      expect(state.display).toBe("15");
      expect(state.stored).toBe(15);
      expect(state.operator).toBe("×");
      expect(state.expression).toBe("15 ×");
    });
  });

  describe("equals", () => {
    it("evaluates the full expression and produces a history entry", () => {
      let state = C.inputDigit(C.initialState, "8");
      state = C.chooseOperator(state, "×");
      state = C.inputDigit(state, "7");

      const { state: next, entry } = C.equals(state);
      expect(next.display).toBe("56");
      expect(next.expression).toBe("8 × 7 =");
      expect(entry).toEqual({
        expression: "8 × 7",
        result: "56",
      });
    });

    it("handles division by zero in equals by entering error state", () => {
      let state = C.inputDigit(C.initialState, "5");
      state = C.chooseOperator(state, "÷");
      state = C.inputDigit(state, "0");

      const { state: next, entry } = C.equals(state);
      expect(next.display).toBe("Error");
      expect(next.error).toBe("Can't divide by zero, hero!");
      expect(entry).toBeUndefined();
    });

    it("returns unchanged state if no operator or stored value is set", () => {
      const state = C.inputDigit(C.initialState, "9");
      const { state: next, entry } = C.equals(state);
      expect(next).toEqual(state);
      expect(entry).toBeUndefined();
    });
  });

  describe("clearAll", () => {
    it("resets state back to initialState", () => {
      let state = C.inputDigit(C.initialState, "7");
      state = C.chooseOperator(state, "+");
      state = C.clearAll();
      expect(state).toEqual(C.initialState);
    });
  });

  describe("scientific functions", () => {
    it("computes power operator (^)", () => {
      expect(C.compute(2, "^", 4)).toBe(16);
      expect(C.compute(5, "^", 0)).toBe(1);
    });

    it("evaluates sin, cos, tan in DEG mode", () => {
      const state30: C.CalcState = { ...C.initialState, display: "30", angleMode: "deg" };
      expect(C.applyScientific(state30, "sin").display).toBe("0.5");

      const state60: C.CalcState = { ...C.initialState, display: "60", angleMode: "deg" };
      expect(C.applyScientific(state60, "cos").display).toBe("0.5");

      const state45: C.CalcState = { ...C.initialState, display: "45", angleMode: "deg" };
      expect(C.applyScientific(state45, "tan").display).toBe("1");
    });

    it("evaluates sin in RAD mode", () => {
      const statePiOver2: C.CalcState = {
        ...C.initialState,
        display: String(Math.PI / 2),
        angleMode: "rad",
      };
      expect(C.applyScientific(statePiOver2, "sin").display).toBe("1");
    });

    it("handles tan(90°) as an error in DEG mode", () => {
      const state90: C.CalcState = { ...C.initialState, display: "90", angleMode: "deg" };
      const res = C.applyScientific(state90, "tan");
      expect(res.display).toBe("Error");
      expect(res.error).toContain("Undefined");
    });

    it("computes square root and cube root", () => {
      const state16: C.CalcState = { ...C.initialState, display: "16" };
      expect(C.applyScientific(state16, "sqrt").display).toBe("4");

      const state27: C.CalcState = { ...C.initialState, display: "27" };
      expect(C.applyScientific(state27, "cbrt").display).toBe("3");
    });

    it("errors on square root of negative numbers", () => {
      const stateNeg: C.CalcState = { ...C.initialState, display: "-4" };
      const res = C.applyScientific(stateNeg, "sqrt");
      expect(res.display).toBe("Error");
      expect(res.error).toBe("Cannot √ negative number");
    });

    it("computes logarithms (log10 and ln)", () => {
      const state100: C.CalcState = { ...C.initialState, display: "100" };
      expect(C.applyScientific(state100, "log").display).toBe("2");

      const stateE: C.CalcState = { ...C.initialState, display: String(Math.E) };
      expect(C.applyScientific(stateE, "ln").display).toBe("1");
    });

    it("computes factorial (n!)", () => {
      const state5: C.CalcState = { ...C.initialState, display: "5" };
      expect(C.applyScientific(state5, "fact").display).toBe("120");

      const state0: C.CalcState = { ...C.initialState, display: "0" };
      expect(C.applyScientific(state0, "fact").display).toBe("1");
    });

    it("inputs constants π and e", () => {
      const piState = C.inputConstant(C.initialState, "pi");
      expect(parseFloat(piState.display)).toBeCloseTo(Math.PI, 10);
      expect(piState.expression).toBe("π");

      const eState = C.inputConstant(C.initialState, "e");
      expect(parseFloat(eState.display)).toBeCloseTo(Math.E, 10);
      expect(eState.expression).toBe("e");
    });

    it("toggles angle mode between deg and rad", () => {
      let state = C.initialState;
      expect(state.angleMode).toBe("deg");
      state = C.toggleAngleMode(state);
      expect(state.angleMode).toBe("rad");
      state = C.toggleAngleMode(state);
      expect(state.angleMode).toBe("deg");
    });
  });
});
