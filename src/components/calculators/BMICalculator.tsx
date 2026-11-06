import { useState } from "react";
import { calculateBmiMetric, calculateBmiImperial, BMI_CATEGORIES } from "@/lib/everyday";
import { playClickSound } from "@/lib/sounds";
import { Activity, AlertCircle, Heart } from "lucide-react";

export function BMICalculator() {
  const [unitMode, setUnitMode] = useState<"metric" | "imperial">("metric");

  // Metric fields
  const [heightCm, setHeightCm] = useState<string>("175");
  const [weightKg, setWeightKg] = useState<string>("70");

  // Imperial fields
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("9");
  const [weightLbs, setWeightLbs] = useState<string>("154");

  const switchMode = (mode: "metric" | "imperial") => {
    playClickSound();
    setUnitMode(mode);
  };

  let result = null;
  let errorMsg = "";

  try {
    if (unitMode === "metric") {
      const h = parseFloat(heightCm) || 0;
      const w = parseFloat(weightKg) || 0;
      result = calculateBmiMetric(h, w);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const lbs = parseFloat(weightLbs) || 0;
      result = calculateBmiImperial(ft, inch, lbs);
    }
  } catch (e: unknown) {
    errorMsg = e instanceof Error ? e.message : "Invalid input";
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Unit Selector Tabs */}
      <div className="flex gap-2 border-b-4 border-ink pb-4">
        <button
          type="button"
          onClick={() => switchMode("metric")}
          className={`rounded-xl border-3 border-ink px-4 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
            unitMode === "metric"
              ? "bg-hero-blue text-paper shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
              : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30"
          }`}
        >
          METRIC (CM / KG)
        </button>
        <button
          type="button"
          onClick={() => switchMode("imperial")}
          className={`rounded-xl border-3 border-ink px-4 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
            unitMode === "imperial"
              ? "bg-hero-blue text-paper shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
              : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30"
          }`}
        >
          IMPERIAL (FEET, INCHES / LBS)
        </button>
      </div>

      {/* Inputs Card */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
        <div className="border-b-2 border-dashed border-ink/20 pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-comic text-2xl text-ink font-bold">BODY MASS INDEX (BMI)</h2>
            <p className="font-body text-xs text-ink/70">
              WHO standardized health classification & optimal weight targets.
            </p>
          </div>
          <Activity className="h-6 w-6 text-hero-blue" />
        </div>

        {unitMode === "metric" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">Height (cm)</span>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">Weight (kg)</span>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">Height (Feet)</span>
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">
                Height (Inches)
              </span>
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">
                Weight (Pounds / lbs)
              </span>
              <input
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
              />
            </label>
          </div>
        )}

        {/* Results Section */}
        {errorMsg ? (
          <div className="rounded-xl border-3 border-hero-red bg-hero-red/10 p-4 font-comic font-bold text-hero-red">
            ⚠️ {errorMsg}
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Visual Gauge Bar */}
            <div className="space-y-2">
              <div className="flex justify-between font-comic text-xs font-bold text-ink">
                <span>Underweight (&lt;18.5)</span>
                <span>Normal (18.5-24.9)</span>
                <span>Overweight (25-29.9)</span>
                <span>Obese (≥30)</span>
              </div>

              {/* Progress Track */}
              <div className="relative h-6 w-full rounded-full border-3 border-ink bg-gradient-to-r from-hero-blue via-emerald-500 via-mustard to-hero-red shadow-[2px_2px_0_0_var(--ink)] overflow-hidden">
                {/* Needle Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-ink shadow-md -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${result.gaugePercent}%` }}
                />
              </div>
            </div>

            {/* BMI Number Card */}
            <div className="rounded-xl border-4 border-ink bg-paper p-5 shadow-[4px_4px_0_0_var(--ink)] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/70">
                  CALCULATED BMI SCORE
                </span>
                <div className="mt-1 font-comic text-5xl sm:text-6xl font-black text-ink">
                  {result.bmi}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span
                  className={`rounded-xl border-3 border-ink px-4 py-2 font-comic text-sm font-bold uppercase shadow-[3px_3px_0_0_var(--ink)] ${result.category.badgeColor}`}
                >
                  {result.category.label}
                </span>
                <span className="mt-1 font-comic text-xs font-bold text-ink/80">
                  {result.category.comicBadge}
                </span>
              </div>
            </div>

            {/* Healthy Range & Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border-3 border-ink bg-emerald-600/15 p-4 space-y-1">
                <div className="flex items-center gap-1.5 font-comic text-xs font-bold text-emerald-800 uppercase">
                  <Heart className="h-4 w-4" /> HEALTHY WEIGHT TARGET RANGE
                </div>
                <div className="font-comic text-xl font-bold text-ink">
                  {result.healthyWeightRange.minKg} – {result.healthyWeightRange.maxKg} kg
                </div>
                <div className="font-mono text-xs text-ink/70">
                  ({result.healthyWeightRange.minLbs} – {result.healthyWeightRange.maxLbs} lbs)
                </div>
              </div>

              <div className="rounded-xl border-3 border-ink bg-parchment p-4 space-y-1">
                <div className="font-comic text-xs font-bold text-ink/80 uppercase">
                  CLINICAL CATEGORY NOTE
                </div>
                <p className="font-body text-xs leading-relaxed text-ink/90">
                  {result.category.description}
                </p>
              </div>
            </div>

            {/* Medical Disclaimer Callout */}
            <div className="rounded-xl border-2 border-ink bg-mustard/20 p-4 flex gap-3 text-ink/80">
              <AlertCircle className="h-5 w-5 shrink-0 text-hero-red mt-0.5" />
              <p className="font-body text-xs leading-relaxed">{result.disclaimer}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
