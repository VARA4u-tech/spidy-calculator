import { useState } from "react";
import {
  calculateFractions,
  calculateRatio,
  calculateLcmGcd,
  calculatePrimeFactorization,
  solveLinearEquation,
  solveQuadraticEquation,
} from "@/lib/maths-advanced";
import { playClickSound } from "@/lib/sounds";
import { Divide, Ratio, Hash, ShieldCheck, Variable } from "lucide-react";

export function MathsCalculator() {
  const [activeTab, setActiveTab] = useState<
    "fractions" | "ratios" | "lcmgcd" | "primes" | "algebra"
  >("fractions");

  // Fractions state
  const [f1Num, setF1Num] = useState<string>("3");
  const [f1Den, setF1Den] = useState<string>("4");
  const [fractionOp, setFractionOp] = useState<"+" | "-" | "×" | "÷">("+");
  const [f2Num, setF2Num] = useState<string>("2");
  const [f2Den, setF2Den] = useState<string>("5");

  // Ratios state
  const [ratioA, setRatioA] = useState<string>("24");
  const [ratioB, setRatioB] = useState<string>("36");
  const [ratioTotal, setRatioTotal] = useState<string>("150");

  // LCM/GCD state
  const [numA, setNumA] = useState<string>("24");
  const [numB, setNumB] = useState<string>("36");
  const [numC, setNumC] = useState<string>("60");

  // Primes state
  const [primeInput, setPrimeInput] = useState<string>("168");

  // Algebra state
  const [algebraMode, setAlgebraMode] = useState<"linear" | "quadratic">("quadratic");
  const [linA, setLinA] = useState<string>("3");
  const [linB, setLinB] = useState<string>("7");
  const [linC, setLinC] = useState<string>("22");

  const [quadA, setQuadA] = useState<string>("1");
  const [quadB, setQuadB] = useState<string>("-5");
  const [quadC, setQuadC] = useState<string>("6");

  const switchTab = (tab: typeof activeTab) => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2 border-b-4 border-ink pb-4">
        {[
          { id: "fractions", label: "FRACTIONS", icon: Divide },
          { id: "ratios", label: "RATIOS", icon: Ratio },
          { id: "lcmgcd", label: "LCM & GCD", icon: Hash },
          { id: "primes", label: "PRIMES & FACTORS", icon: ShieldCheck },
          { id: "algebra", label: "ALGEBRA UTILITIES", icon: Variable },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-1.5 rounded-xl border-3 border-ink px-3.5 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
                isActive
                  ? "bg-purple-700 text-paper shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
                  : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30 hover:-translate-y-0.5"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. FRACTIONS */}
      {activeTab === "fractions" &&
        (() => {
          let fracResult: ReturnType<typeof calculateFractions> | null = null;
          let fracError = "";
          try {
            const n1 = parseInt(f1Num, 10) || 0;
            const d1 = parseInt(f1Den, 10) || 1;
            const n2 = parseInt(f2Num, 10) || 0;
            const d2 = parseInt(f2Den, 10) || 1;
            fracResult = calculateFractions({ numerator: n1, denominator: d1 }, fractionOp, {
              numerator: n2,
              denominator: d2,
            });
          } catch (e: unknown) {
            fracError = e instanceof Error ? e.message : "Calculation error";
          }

          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">FRACTIONS ARITHMETIC</h2>
                <p className="font-body text-xs text-ink/70">
                  Add, subtract, multiply, or divide fractions with mixed representations.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4">
                {/* Fraction 1 */}
                <div className="flex flex-col items-center gap-1 w-24">
                  <input
                    type="number"
                    value={f1Num}
                    onChange={(e) => setF1Num(e.target.value)}
                    className="w-full text-center rounded-lg border-2 border-ink bg-parchment py-1.5 font-mono text-lg font-bold"
                  />
                  <div className="w-full h-1 bg-ink rounded-full" />
                  <input
                    type="number"
                    value={f1Den}
                    onChange={(e) => setF1Den(e.target.value)}
                    className="w-full text-center rounded-lg border-2 border-ink bg-parchment py-1.5 font-mono text-lg font-bold"
                  />
                </div>

                {/* Operator */}
                <div className="flex gap-1.5">
                  {(["+", "-", "×", "÷"] as const).map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setFractionOp(op);
                      }}
                      className={`h-11 w-11 rounded-xl border-3 border-ink font-comic text-xl font-black shadow-[2px_2px_0_0_var(--ink)] transition-all ${
                        fractionOp === op
                          ? "bg-hero-red text-paper -translate-y-0.5"
                          : "bg-paper text-ink hover:bg-mustard"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>

                {/* Fraction 2 */}
                <div className="flex flex-col items-center gap-1 w-24">
                  <input
                    type="number"
                    value={f2Num}
                    onChange={(e) => setF2Num(e.target.value)}
                    className="w-full text-center rounded-lg border-2 border-ink bg-parchment py-1.5 font-mono text-lg font-bold"
                  />
                  <div className="w-full h-1 bg-ink rounded-full" />
                  <input
                    type="number"
                    value={f2Den}
                    onChange={(e) => setF2Den(e.target.value)}
                    className="w-full text-center rounded-lg border-2 border-ink bg-parchment py-1.5 font-mono text-lg font-bold"
                  />
                </div>
              </div>

              {fracError ? (
                <div className="rounded-xl border-3 border-hero-red bg-hero-red/10 p-4 font-comic font-bold text-hero-red">
                  ⚠️ {fracError}
                </div>
              ) : fracResult ? (
                <div className="rounded-xl border-4 border-ink bg-mustard p-5 shadow-[4px_4px_0_0_var(--ink)] space-y-3">
                  <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
                    SIMPLIFIED RESULT
                  </span>
                  <div className="flex flex-wrap items-baseline gap-4">
                    <span className="font-comic text-4xl sm:text-5xl font-black text-ink">
                      {fracResult.result.numerator} / {fracResult.result.denominator}
                    </span>
                    {fracResult.mixed && (
                      <span className="rounded-lg border-2 border-ink bg-paper px-3 py-1 font-comic text-lg font-bold text-hero-blue shadow-[2px_2px_0_0_var(--ink)]">
                        Mixed: {fracResult.mixed}
                      </span>
                    )}
                    <span className="font-mono text-sm font-bold text-ink/70">
                      ≈ {fracResult.decimal.toFixed(4)}
                    </span>
                  </div>

                  <div className="border-t-2 border-ink/20 pt-3">
                    <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/70">
                      STEP-BY-STEP SOLUTION:
                    </span>
                    <ul className="mt-1 list-disc list-inside font-mono text-xs text-ink/90 space-y-0.5">
                      {fracResult.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })()}

      {/* 2. RATIOS */}
      {activeTab === "ratios" &&
        (() => {
          const a = parseFloat(ratioA) || 1;
          const b = parseFloat(ratioB) || 1;
          const tot = parseFloat(ratioTotal) || 0;
          let res = null;
          let err = "";
          try {
            res = calculateRatio(a, b, tot);
          } catch (e: unknown) {
            err = e instanceof Error ? e.message : "Error";
          }

          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">RATIOS & PROPORTIONS</h2>
                <p className="font-body text-xs text-ink/70">
                  Simplify ratios and split totals proportionally.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Antecedent (A)
                  </span>
                  <input
                    type="number"
                    value={ratioA}
                    onChange={(e) => setRatioA(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Consequent (B)
                  </span>
                  <input
                    type="number"
                    value={ratioB}
                    onChange={(e) => setRatioB(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Divide Total Sum
                  </span>
                  <input
                    type="number"
                    value={ratioTotal}
                    onChange={(e) => setRatioTotal(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
                  />
                </label>
              </div>

              {err ? (
                <div className="text-hero-red font-comic font-bold">⚠️ {err}</div>
              ) : res ? (
                <div className="space-y-4">
                  <div className="rounded-xl border-4 border-ink bg-hero-blue p-5 text-paper shadow-[4px_4px_0_0_var(--ink)]">
                    <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                      SIMPLIFIED RATIO
                    </span>
                    <div className="mt-1 font-comic text-4xl sm:text-5xl font-black">
                      {res.ratioString}
                    </div>
                    <p className="mt-1 font-mono text-xs text-mustard">
                      Decimal Ratio: {res.decimal.toFixed(4)}
                    </p>
                  </div>

                  {res.dividedParts && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border-3 border-ink bg-parchment p-4">
                        <span className="font-comic text-xs font-bold text-ink/70">SHARE A</span>
                        <div className="font-comic text-2xl font-bold text-ink mt-0.5">
                          {res.dividedParts[0]?.toFixed(2)}
                        </div>
                      </div>
                      <div className="rounded-xl border-3 border-ink bg-parchment p-4">
                        <span className="font-comic text-xs font-bold text-ink/70">SHARE B</span>
                        <div className="font-comic text-2xl font-bold text-ink mt-0.5">
                          {res.dividedParts[1]?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })()}

      {/* 3. LCM & GCD */}
      {activeTab === "lcmgcd" &&
        (() => {
          const nums = [parseFloat(numA) || 0, parseFloat(numB) || 0, parseFloat(numC) || 0].filter(
            (n) => n > 0,
          );
          const res = calculateLcmGcd(nums);

          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">LCM & GCD CALCULATOR</h2>
                <p className="font-body text-xs text-ink/70">
                  Greatest Common Divisor (GCD) & Least Common Multiple (LCM) for up to 3 numbers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">Number 1</span>
                  <input
                    type="number"
                    value={numA}
                    onChange={(e) => setNumA(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">Number 2</span>
                  <input
                    type="number"
                    value={numB}
                    onChange={(e) => setNumB(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Number 3 (Optional)
                  </span>
                  <input
                    type="number"
                    value={numC}
                    onChange={(e) => setNumC(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border-4 border-ink bg-emerald-600 p-5 text-paper shadow-[4px_4px_0_0_var(--ink)]">
                  <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                    GREATEST COMMON DIVISOR (GCD)
                  </span>
                  <div className="mt-1 font-comic text-5xl font-black">{res.gcd}</div>
                  <ul className="mt-3 text-xs font-mono border-t border-paper/20 pt-2 space-y-0.5">
                    {res.gcdSteps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border-4 border-ink bg-mustard p-5 text-ink shadow-[4px_4px_0_0_var(--ink)]">
                  <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
                    LEAST COMMON MULTIPLE (LCM)
                  </span>
                  <div className="mt-1 font-comic text-5xl font-black">{res.lcm}</div>
                  <ul className="mt-3 text-xs font-mono border-t border-ink/20 pt-2 space-y-0.5">
                    {res.lcmSteps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}

      {/* 4. PRIMES */}
      {activeTab === "primes" &&
        (() => {
          const val = parseInt(primeInput, 10) || 0;
          const res = calculatePrimeFactorization(val);

          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">
                  PRIME CHECKER & FACTORIZATION
                </h2>
                <p className="font-body text-xs text-ink/70">
                  Test primality and extract canonical prime factor powers.
                </p>
              </div>

              <label className="block max-w-sm space-y-1">
                <span className="font-comic text-xs font-bold uppercase text-ink">
                  Enter Integer
                </span>
                <input
                  type="number"
                  value={primeInput}
                  onChange={(e) => setPrimeInput(e.target.value)}
                  className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
                />
              </label>

              <div
                className={`rounded-xl border-4 border-ink p-5 shadow-[4px_4px_0_0_var(--ink)] ${
                  res.isPrime ? "bg-emerald-600 text-paper" : "bg-hero-red text-paper"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                    PRIMALITY STATUS
                  </span>
                  <span className="rounded-md border-2 border-ink bg-paper px-2.5 py-0.5 font-comic text-xs font-bold uppercase text-ink shadow-[2px_2px_0_0_var(--ink)]">
                    {res.isPrime ? "PRIME NUMBER" : "COMPOSITE"}
                  </span>
                </div>
                <div className="mt-2 font-comic text-3xl sm:text-4xl font-black">
                  {res.isPrime ? `${val} is a prime number!` : `${val} is composite`}
                </div>

                {!res.isPrime && res.primePowers.length > 0 && (
                  <div className="mt-4 border-t-2 border-paper/20 pt-3">
                    <span className="font-comic text-xs font-bold uppercase text-paper/90">
                      PRIME FACTORIZATION:
                    </span>
                    <div className="mt-1 font-mono text-2xl font-bold text-mustard">
                      {res.primePowers
                        .map((p) => (p.power > 1 ? `${p.prime}^${p.power}` : `${p.prime}`))
                        .join(" × ")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      {/* 5. ALGEBRA */}
      {activeTab === "algebra" && (
        <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
          <div className="border-b-2 border-dashed border-ink/20 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-comic text-2xl text-ink font-bold">ALGEBRA EQUATION SOLVER</h2>
              <p className="font-body text-xs text-ink/70">
                Linear and quadratic polynomial root finding with discriminant analysis.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setAlgebraMode("linear");
                }}
                className={`rounded-lg border-2 border-ink px-3 py-1 font-comic text-xs font-bold ${
                  algebraMode === "linear"
                    ? "bg-mustard text-ink shadow-[2px_2px_0_0_var(--ink)]"
                    : "bg-paper text-ink"
                }`}
              >
                LINEAR (ax + b = c)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setAlgebraMode("quadratic");
                }}
                className={`rounded-lg border-2 border-ink px-3 py-1 font-comic text-xs font-bold ${
                  algebraMode === "quadratic"
                    ? "bg-mustard text-ink shadow-[2px_2px_0_0_var(--ink)]"
                    : "bg-paper text-ink"
                }`}
              >
                QUADRATIC (ax² + bx + c = 0)
              </button>
            </div>
          </div>

          {algebraMode === "linear"
            ? (() => {
                const a = parseFloat(linA) || 0;
                const b = parseFloat(linB) || 0;
                const c = parseFloat(linC) || 0;
                const res = solveLinearEquation(a, b, c);

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <label className="block space-y-1">
                        <span className="font-comic text-xs font-bold text-ink">Coefficient a</span>
                        <input
                          type="number"
                          value={linA}
                          onChange={(e) => setLinA(e.target.value)}
                          className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono text-center font-bold"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="font-comic text-xs font-bold text-ink">Constant b</span>
                        <input
                          type="number"
                          value={linB}
                          onChange={(e) => setLinB(e.target.value)}
                          className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono text-center font-bold"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="font-comic text-xs font-bold text-ink">Equals c</span>
                        <input
                          type="number"
                          value={linC}
                          onChange={(e) => setLinC(e.target.value)}
                          className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono text-center font-bold"
                        />
                      </label>
                    </div>

                    <div className="rounded-xl border-4 border-ink bg-mustard p-5 shadow-[4px_4px_0_0_var(--ink)]">
                      <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
                        SOLUTION FOR X
                      </span>
                      <div className="mt-1 font-comic text-4xl sm:text-5xl font-black text-ink">
                        {res.x !== null
                          ? `x = ${res.x}`
                          : res.infiniteSolutions
                            ? "Infinite Solutions"
                            : "No Solution"}
                      </div>
                      <ul className="mt-3 text-xs font-mono border-t border-ink/20 pt-2 space-y-0.5 text-ink">
                        {res.steps.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()
            : (() => {
                const a = parseFloat(quadA) || 1;
                const b = parseFloat(quadB) || 0;
                const c = parseFloat(quadC) || 0;
                let res = null;
                let err = "";
                try {
                  res = solveQuadraticEquation(a, b, c);
                } catch (e: unknown) {
                  err = e instanceof Error ? e.message : "Error";
                }

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <label className="block space-y-1">
                        <span className="font-comic text-xs font-bold text-ink">Coefficient a</span>
                        <input
                          type="number"
                          value={quadA}
                          onChange={(e) => setQuadA(e.target.value)}
                          className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono text-center font-bold"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="font-comic text-xs font-bold text-ink">Coefficient b</span>
                        <input
                          type="number"
                          value={quadB}
                          onChange={(e) => setQuadB(e.target.value)}
                          className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono text-center font-bold"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="font-comic text-xs font-bold text-ink">Constant c</span>
                        <input
                          type="number"
                          value={quadC}
                          onChange={(e) => setQuadC(e.target.value)}
                          className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono text-center font-bold"
                        />
                      </label>
                    </div>

                    {err ? (
                      <div className="text-hero-red font-comic font-bold">⚠️ {err}</div>
                    ) : res ? (
                      <div className="rounded-xl border-4 border-ink bg-hero-blue p-5 text-paper shadow-[4px_4px_0_0_var(--ink)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                            ROOTS & DISCRIMINANT
                          </span>
                          <span className="rounded-md border-2 border-ink bg-mustard px-2 py-0.5 font-comic text-[10px] font-bold text-ink uppercase">
                            Δ = {res.discriminant} ({res.rootType})
                          </span>
                        </div>

                        <div className="font-comic text-3xl sm:text-4xl font-black">
                          {res.rootType === "complex"
                            ? `x = ${res.roots[0]?.real.toFixed(3) ?? "0"} ± ${Math.abs(res.roots[0]?.imag ?? 0).toFixed(3)}i`
                            : res.roots
                                .map((r, i) => `x${i + 1} = ${r.real.toFixed(3)}`)
                                .join(" , ")}
                        </div>

                        <div className="font-mono text-xs text-mustard">
                          Parabola Vertex: ({res.vertex.x.toFixed(3)}, {res.vertex.y.toFixed(3)})
                        </div>

                        <ul className="text-xs font-mono border-t border-paper/20 pt-2 space-y-0.5 text-paper/90">
                          {res.steps.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                );
              })()}
        </div>
      )}
    </div>
  );
}
