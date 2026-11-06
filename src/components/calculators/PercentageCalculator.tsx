import { useState } from "react";
import {
  calcPercentOf,
  calcWhatPercent,
  calcPercentChange,
  calcDiscount,
  calcPercentDifference,
} from "@/lib/percentage";
import { playClickSound } from "@/lib/sounds";
import { Percent, Sparkles, ArrowRight, Tag, TrendingUp } from "lucide-react";

export function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState<
    "percentOf" | "whatPercent" | "change" | "discount" | "diff"
  >("percentOf");

  // State for Mode 1: What is P% of X?
  const [m1Percent, setM1Percent] = useState<string>("20");
  const [m1Total, setM1Total] = useState<string>("150");

  // State for Mode 2: X is what % of Y?
  const [m2Part, setM2Part] = useState<string>("45");
  const [m2Total, setM2Total] = useState<string>("180");

  // State for Mode 3: Change from X to Y
  const [m3Initial, setM3Initial] = useState<string>("80");
  const [m3Final, setM3Final] = useState<string>("120");

  // State for Mode 4: Discount & Sale
  const [m4Price, setM4Price] = useState<string>("120");
  const [m4Discount, setM4Discount] = useState<string>("25");

  // State for Mode 5: Difference between X and Y
  const [m5A, setM5A] = useState<string>("100");
  const [m5B, setM5B] = useState<string>("140");

  const switchTab = (tab: typeof activeTab) => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Comic Mode Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b-4 border-ink pb-4">
        {[
          { id: "percentOf", label: "P% OF X", icon: Percent },
          { id: "whatPercent", label: "X IS WHAT % OF Y", icon: Sparkles },
          { id: "change", label: "% INCREASE / DECREASE", icon: TrendingUp },
          { id: "discount", label: "DISCOUNT & SALE", icon: Tag },
          { id: "diff", label: "% DIFFERENCE", icon: ArrowRight },
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
                  ? "bg-hero-red text-paper shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
                  : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30 hover:-translate-y-0.5"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode 1: What is P% of X? */}
      {activeTab === "percentOf" &&
        (() => {
          const p = parseFloat(m1Percent) || 0;
          const tot = parseFloat(m1Total) || 0;
          const res = calcPercentOf(p, tot);
          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">WHAT IS P% OF TOTAL?</h2>
                <p className="font-body text-xs text-ink/70">
                  Calculates the exact portion given a percentage rate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Percentage (P %)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      value={m1Percent}
                      onChange={(e) => setM1Percent(e.target.value)}
                      className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-comic font-bold text-ink">
                      %
                    </span>
                  </div>
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Total Amount (X)
                  </span>
                  <input
                    type="number"
                    value={m1Total}
                    onChange={(e) => setM1Total(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                  />
                </label>
              </div>

              {/* Quick Percent Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[5, 10, 15, 20, 25, 50, 75].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setM1Percent(preset.toString());
                    }}
                    className="rounded-lg border-2 border-ink bg-parchment px-2.5 py-1 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard"
                  >
                    {preset}%
                  </button>
                ))}
              </div>

              {/* Result Display */}
              <div className="rounded-xl border-4 border-ink bg-mustard p-5 shadow-[4px_4px_0_0_var(--ink)]">
                <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
                  CALCULATED RESULT
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-comic text-4xl sm:text-5xl font-black text-ink">
                    {res.formatted}
                  </span>
                  <span className="font-comic text-sm font-bold text-hero-blue">
                    ({res.formula})
                  </span>
                </div>
                <p className="mt-3 font-body text-sm font-bold text-ink border-t-2 border-ink/20 pt-2">
                  {res.explanation}
                </p>
              </div>
            </div>
          );
        })()}

      {/* Mode 2: X is what % of Y? */}
      {activeTab === "whatPercent" &&
        (() => {
          const part = parseFloat(m2Part) || 0;
          const tot = parseFloat(m2Total) || 0;
          const res = calcWhatPercent(part, tot);
          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">X IS WHAT PERCENT OF Y?</h2>
                <p className="font-body text-xs text-ink/70">
                  Calculates the ratio and percentage proportion of a part to a whole.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Part Value (X)
                  </span>
                  <input
                    type="number"
                    value={m2Part}
                    onChange={(e) => setM2Part(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Total Value (Y)
                  </span>
                  <input
                    type="number"
                    value={m2Total}
                    onChange={(e) => setM2Total(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                  />
                </label>
              </div>

              <div className="rounded-xl border-4 border-ink bg-hero-blue p-5 text-paper shadow-[4px_4px_0_0_var(--ink)]">
                <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                  PERCENTAGE SHARE
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-comic text-4xl sm:text-5xl font-black">
                    {res.formatted}
                  </span>
                  <span className="font-mono text-sm font-bold text-mustard">({res.formula})</span>
                </div>
                <p className="mt-3 font-body text-sm font-bold text-paper border-t-2 border-paper/20 pt-2">
                  {res.explanation}
                </p>
              </div>
            </div>
          );
        })()}

      {/* Mode 3: Percentage Increase / Decrease */}
      {activeTab === "change" &&
        (() => {
          const init = parseFloat(m3Initial) || 0;
          const fin = parseFloat(m3Final) || 0;
          const res = calcPercentChange(init, fin);
          const isInc = fin >= init;
          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">
                  PERCENTAGE INCREASE OR DECREASE
                </h2>
                <p className="font-body text-xs text-ink/70">
                  Calculates growth rate or reduction from starting value to ending value.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Starting Value (Initial)
                  </span>
                  <input
                    type="number"
                    value={m3Initial}
                    onChange={(e) => setM3Initial(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Ending Value (Final)
                  </span>
                  <input
                    type="number"
                    value={m3Final}
                    onChange={(e) => setM3Final(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                  />
                </label>
              </div>

              <div
                className={`rounded-xl border-4 border-ink p-5 shadow-[4px_4px_0_0_var(--ink)] ${
                  isInc ? "bg-emerald-600 text-paper" : "bg-hero-red text-paper"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-comic text-xs font-bold uppercase tracking-wider">
                    {isInc ? "GROWTH RATE" : "REDUCTION RATE"}
                  </span>
                  <span className="rounded-md border-2 border-ink bg-paper px-2 py-0.5 font-comic text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_0_var(--ink)]">
                    {isInc ? "INCREASE (+)" : "DECREASE (-)"}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-comic text-4xl sm:text-5xl font-black">
                    {res.formatted}
                  </span>
                  <span className="font-mono text-xs text-paper/80">({res.formula})</span>
                </div>
                <p className="mt-3 font-body text-sm font-bold border-t-2 border-paper/20 pt-2">
                  {res.explanation}
                </p>
              </div>
            </div>
          );
        })()}

      {/* Mode 4: Discount & Sale */}
      {activeTab === "discount" &&
        (() => {
          const price = parseFloat(m4Price) || 0;
          const disc = parseFloat(m4Discount) || 0;
          const res = calcDiscount(price, disc);
          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">
                  DISCOUNT & SALE PRICE CALCULATOR
                </h2>
                <p className="font-body text-xs text-ink/70">
                  Calculates sale price, dollar savings, and effective discount.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Original Retail Price ($)
                  </span>
                  <input
                    type="number"
                    value={m4Price}
                    onChange={(e) => setM4Price(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">
                    Discount Rate (%)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      value={m4Discount}
                      onChange={(e) => setM4Discount(e.target.value)}
                      className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-comic font-bold text-ink">
                      %
                    </span>
                  </div>
                </label>
              </div>

              {/* Common Discount Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[10, 15, 20, 25, 30, 40, 50, 70].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setM4Discount(preset.toString());
                    }}
                    className="rounded-lg border-2 border-ink bg-parchment px-2.5 py-1 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard"
                  >
                    {preset}% OFF
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border-4 border-ink bg-emerald-600 p-5 text-paper shadow-[4px_4px_0_0_var(--ink)]">
                  <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                    FINAL SALE PRICE
                  </span>
                  <div className="mt-1 font-comic text-4xl sm:text-5xl font-black">
                    ${res.formattedFinalPrice}
                  </div>
                  <p className="mt-2 text-xs font-mono text-paper/90">Amount you pay at checkout</p>
                </div>

                <div className="rounded-xl border-4 border-ink bg-mustard p-5 text-ink shadow-[4px_4px_0_0_var(--ink)]">
                  <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
                    TOTAL SAVINGS
                  </span>
                  <div className="mt-1 font-comic text-4xl sm:text-5xl font-black">
                    ${res.formattedSavings}
                  </div>
                  <p className="mt-2 text-xs font-mono text-ink/80">
                    You save {m4Discount}% off retail
                  </p>
                </div>
              </div>

              <p className="font-body text-xs text-ink/70 border-t-2 border-dashed border-ink/20 pt-3">
                {res.explanation}
              </p>
            </div>
          );
        })()}

      {/* Mode 5: Percentage Difference */}
      {activeTab === "diff" &&
        (() => {
          const a = parseFloat(m5A) || 0;
          const b = parseFloat(m5B) || 0;
          const res = calcPercentDifference(a, b);
          return (
            <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
              <div className="border-b-2 border-dashed border-ink/20 pb-3">
                <h2 className="font-comic text-2xl text-ink font-bold">
                  PERCENTAGE DIFFERENCE BETWEEN TWO VALUES
                </h2>
                <p className="font-body text-xs text-ink/70">
                  Calculates relative variance relative to the average of both values.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">Value A</span>
                  <input
                    type="number"
                    value={m5A}
                    onChange={(e) => setM5A(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink">Value B</span>
                  <input
                    type="number"
                    value={m5B}
                    onChange={(e) => setM5B(e.target.value)}
                    className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-lg font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
                  />
                </label>
              </div>

              <div className="rounded-xl border-4 border-ink bg-purple-700 p-5 text-paper shadow-[4px_4px_0_0_var(--ink)]">
                <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                  RELATIVE DIFFERENCE
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="font-comic text-4xl sm:text-5xl font-black">
                    {res.formatted}
                  </span>
                  <span className="font-mono text-xs text-paper/80">({res.formula})</span>
                </div>
                <p className="mt-3 font-body text-sm font-bold border-t-2 border-paper/20 pt-2">
                  {res.explanation}
                </p>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
