import { describe, it, expect } from "vitest";
import {
  calcPercentOf,
  calcWhatPercent,
  calcPercentChange,
  calcDiscount,
  calcPercentDifference,
} from "../lib/percentage";
import { convertUnits } from "../lib/conversions";
import {
  computeGcd,
  computeLcm,
  calculateLcmGcd,
  calculateFractions,
  calculateRatio,
  calculatePrimeFactorization,
  solveLinearEquation,
  solveQuadraticEquation,
} from "../lib/maths-advanced";
import { createDartsGame, parseDart, playTurn, getCheckoutSuggestion } from "../lib/darts";
import {
  createInitialAbacus,
  toggleUpperBead,
  setLowerBeads,
  setAbacusValue,
  calculateAbacusTotal,
} from "../lib/abacus";
import {
  calculateBmiMetric,
  calculateBmiImperial,
  findClosestRingSizeByDiameter,
  calculatePatioMaterials,
} from "../lib/everyday";

describe("Spidy Calculator Suite Math Engines", () => {
  describe("Percentage Calculator", () => {
    it("calculates percent of number correctly", () => {
      const res = calcPercentOf(25, 200);
      expect(res.value).toBe(50);
      expect(res.explanation).toBeDefined();
    });

    it("calculates what percent is X of Y", () => {
      const res = calcWhatPercent(45, 180);
      expect(res.value).toBe(25);
    });

    it("calculates percentage change (increase and decrease)", () => {
      const inc = calcPercentChange(100, 150);
      expect(inc.value).toBe(50);

      const dec = calcPercentChange(200, 150);
      expect(dec.value).toBe(-25);
    });

    it("calculates discount with savings and final price", () => {
      const res = calcDiscount(80, 20);
      expect(res.savings).toBe(16);
      expect(res.finalPrice).toBe(64);
    });

    it("calculates percentage difference between two values", () => {
      const res = calcPercentDifference(10, 20);
      expect(Math.round(res.value)).toBe(67);
    });
  });

  describe("Unit Conversions", () => {
    it("converts length units accurately", () => {
      const res = convertUnits("length", 1, "m", "cm");
      expect(res.value).toBe(100);

      const milesToKm = convertUnits("length", 5, "mi", "km");
      expect(milesToKm.value).toBeCloseTo(8.04672, 3);
    });

    it("converts weight units accurately", () => {
      const res = convertUnits("weight", 1, "kg", "g");
      expect(res.value).toBe(1000);
    });

    it("converts temperature accurately with affine formula", () => {
      const f = convertUnits("temperature", 0, "c", "f");
      expect(f.value).toBe(32);

      const c = convertUnits("temperature", 212, "f", "c");
      expect(c.value).toBe(100);

      const k = convertUnits("temperature", 0, "c", "k");
      expect(k.value).toBe(273.15);
    });
  });

  describe("Advanced Mathematics", () => {
    it("computes GCD and LCM accurately", () => {
      expect(computeGcd(54, 24)).toBe(6);
      expect(computeLcm(12, 18)).toBe(36);

      const multi = calculateLcmGcd([12, 18, 24]);
      expect(multi.gcd).toBe(6);
      expect(multi.lcm).toBe(72);
    });

    it("performs fraction arithmetic and mixed fraction formatting", () => {
      const add = calculateFractions({ numerator: 1, denominator: 2 }, "+", {
        numerator: 1,
        denominator: 3,
      });
      expect(add.result).toEqual({ numerator: 5, denominator: 6 });

      const div = calculateFractions({ numerator: 3, denominator: 4 }, "÷", {
        numerator: 1,
        denominator: 2,
      });
      expect(div.result).toEqual({ numerator: 3, denominator: 2 });
      expect(div.mixed).toBe("1 1/2");
    });

    it("calculates and simplifies ratios", () => {
      const ratio = calculateRatio(15, 25, 100);
      expect(ratio.simplified).toEqual([3, 5]);
      expect(ratio.dividedParts).toEqual([37.5, 62.5]);
    });

    it("determines prime numbers and prime factorization", () => {
      const prime = calculatePrimeFactorization(17);
      expect(prime.isPrime).toBe(true);
      expect(prime.factors).toEqual([17]);

      const comp = calculatePrimeFactorization(60);
      expect(comp.isPrime).toBe(false);
      expect(comp.factors).toEqual([2, 2, 3, 5]);
      expect(comp.primePowers).toEqual([
        { prime: 2, power: 2 },
        { prime: 3, power: 1 },
        { prime: 5, power: 1 },
      ]);
    });

    it("solves linear equations", () => {
      // 2x + 4 = 12  =>  x = 4
      const res = solveLinearEquation(2, 4, 12);
      expect(res.x).toBe(4);
      expect(res.noSolution).toBe(false);
    });

    it("solves quadratic equations with real roots", () => {
      // x² - 5x + 6 = 0  =>  roots 3 and 2
      const res = solveQuadraticEquation(1, -5, 6);
      expect(res.rootType).toBe("real-distinct");
      expect(res.roots[0]!.real).toBe(3);
      expect(res.roots[1]!.real).toBe(2);
    });
  });

  describe("Darts Calculator", () => {
    it("creates game and tracks score deductions and averages", () => {
      const game = createDartsGame(501, ["Spidy", "Goblin"], 3);
      expect(game.players[0]!.scoreRemaining).toBe(501);

      // Spidy throws T20, T20, T20 (180!)
      const darts = [parseDart(3, 20), parseDart(3, 20), parseDart(3, 20)];
      const { nextState, turn } = playTurn(game, darts);

      expect(turn.turnScore).toBe(180);
      expect(turn.isBust).toBe(false);
      expect(nextState.players[0]!.scoreRemaining).toBe(321);
      expect(nextState.players[0]!.threeDartAvg).toBe(180);
      expect(nextState.activePlayerIndex).toBe(1); // turn switched to Goblin
    });

    it("handles bust rule for leaving 1 or going negative on double-out", () => {
      const game = createDartsGame(301, ["Spidy"]);
      game.players[0]!.scoreRemaining = 40; // needs D20

      // Throws T20 (60) => -20, BUST!
      const bustTurn = [parseDart(3, 20)];
      const { nextState, turn } = playTurn(game, bustTurn);

      expect(turn.isBust).toBe(true);
      expect(nextState.players[0]!.scoreRemaining).toBe(40); // reverted
    });

    it("provides checkout suggestions for PDC double finishes", () => {
      expect(getCheckoutSuggestion(170)).toEqual(["T20", "T20", "Bull"]);
      expect(getCheckoutSuggestion(40)).toEqual(["D20"]);
      expect(getCheckoutSuggestion(169)).toBeNull(); // Bogey score
    });
  });

  describe("Online Abacus (Soroban)", () => {
    it("models Japanese Soroban beads and place values correctly", () => {
      let abacus = createInitialAbacus(7);
      expect(abacus.totalValue).toBe(0);

      // On units rod (index 6): push upper bead (5)
      abacus = toggleUpperBead(abacus, 6);
      expect(abacus.totalValue).toBe(5);

      // Push 2 lower beads on units rod: 5 + 2 = 7
      abacus = setLowerBeads(abacus, 6, 2);
      expect(abacus.totalValue).toBe(7);

      // On tens rod (index 5): push 3 lower beads: 3 * 10 = 30 + 7 = 37
      abacus = setLowerBeads(abacus, 5, 3);
      expect(abacus.totalValue).toBe(37);

      // Test direct number setter
      abacus = setAbacusValue(abacus, 12345);
      expect(calculateAbacusTotal(abacus.rods)).toBe(12345);
    });
  });

  describe("Everyday Calculators", () => {
    it("computes metric and imperial BMI with WHO categories", () => {
      const metric = calculateBmiMetric(175, 70);
      expect(metric.bmi).toBe(22.9);
      expect(metric.category.key).toBe("normal");
      expect(metric.disclaimer).toBeDefined();

      const imperial = calculateBmiImperial(5, 9, 154);
      expect(imperial.bmi).toBeCloseTo(22.7, 0);
    });

    it("matches ring size diameters to international chart", () => {
      const match = findClosestRingSizeByDiameter(18.1);
      expect(match.us).toBe("8");
      expect(match.uk).toBe("P 1/2");
    });

    it("calculates patio and paver requirements, wastage and materials", () => {
      const dims = { shape: "rectangle" as const, lengthFt: 10, widthFt: 10 }; // 100 sq ft
      const paver = { lengthInches: 12, widthInches: 12, costPerPaver: 3.5 }; // 1 sq ft paver
      const result = calculatePatioMaterials(dims, paver, 10, 4, 1);

      expect(result.totalAreaSqFt).toBe(100);
      expect(result.rawPaversNeeded).toBe(100);
      expect(result.totalPaversWithWastage).toBe(110);
      expect(result.gravelCubicYards).toBeGreaterThan(0);
      expect(result.sandCubicYards).toBeGreaterThan(0);
      expect(result.paverCostTotal).toBe(385);
    });
  });
});
