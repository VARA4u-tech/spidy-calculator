import { useState } from "react";
import { BMICalculator } from "./BMICalculator";
import { RingSizeCalculator } from "./RingSizeCalculator";
import { PatioCalculator } from "./PatioCalculator";
import { playClickSound } from "@/lib/sounds";
import { Activity, CircleDot, Compass } from "lucide-react";

export function EverydayCalculators() {
  const [subTab, setSubTab] = useState<"bmi" | "ring" | "patio">("bmi");

  return (
    <div className="space-y-6">
      {/* Sub-tab selection */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b-4 border-ink pb-3">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setSubTab("bmi");
          }}
          className={`flex items-center gap-1.5 rounded-xl border-3 border-ink px-4 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
            subTab === "bmi"
              ? "bg-emerald-600 text-paper shadow-[3px_3px_0_0_var(--ink)] -translate-y-0.5"
              : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>BMI HEALTH GAUGE</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setSubTab("ring");
          }}
          className={`flex items-center gap-1.5 rounded-xl border-3 border-ink px-4 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
            subTab === "ring"
              ? "bg-mustard text-ink shadow-[3px_3px_0_0_var(--ink)] -translate-y-0.5"
              : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30"
          }`}
        >
          <CircleDot className="h-4 w-4" />
          <span>RING SIZE CONVERTER</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setSubTab("patio");
          }}
          className={`flex items-center gap-1.5 rounded-xl border-3 border-ink px-4 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
            subTab === "patio"
              ? "bg-purple-700 text-paper shadow-[3px_3px_0_0_var(--ink)] -translate-y-0.5"
              : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30"
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>PATIO &amp; PAVERS ESTIMATOR</span>
        </button>
      </div>

      {/* Sub-view rendering */}
      {subTab === "bmi" && <BMICalculator />}
      {subTab === "ring" && <RingSizeCalculator />}
      {subTab === "patio" && <PatioCalculator />}
    </div>
  );
}
