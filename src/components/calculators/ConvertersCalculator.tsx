import { useState } from "react";
import { convertUnits, CATEGORY_MAP, type UnitCategory } from "@/lib/conversions";
import { playClickSound } from "@/lib/sounds";
import { Ruler, Scale, Box, Thermometer, Gauge, Clock, ArrowLeftRight } from "lucide-react";

interface ConvertersCalculatorProps {
  initialTab?: UnitCategory;
}

const TABS: { id: UnitCategory; label: string; icon: typeof Ruler }[] = [
  { id: "length", label: "LENGTH", icon: Ruler },
  { id: "weight", label: "WEIGHT", icon: Scale },
  { id: "volume", label: "VOLUME", icon: Box },
  { id: "temperature", label: "TEMPERATURE", icon: Thermometer },
  { id: "speed", label: "SPEED", icon: Gauge },
  { id: "time", label: "TIME", icon: Clock },
];

export function ConvertersCalculator({ initialTab = "length" }: ConvertersCalculatorProps) {
  const [activeTab, setActiveTab] = useState<UnitCategory>(initialTab);
  const [inputValue, setInputValue] = useState<string>("10");

  const categoryConfig = CATEGORY_MAP[activeTab];
  const units = categoryConfig.units;

  const [fromUnit, setFromUnit] = useState<string>(units[0]?.id ?? "");
  const [toUnit, setToUnit] = useState<string>(units[1]?.id ?? units[0]?.id ?? "");

  const handleTabChange = (tab: UnitCategory) => {
    playClickSound();
    setActiveTab(tab);
    const newUnits = CATEGORY_MAP[tab].units;
    setFromUnit(newUnits[0]?.id ?? "");
    setToUnit(newUnits[1]?.id ?? newUnits[0]?.id ?? "");
  };

  const handleSwap = () => {
    playClickSound();
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const numVal = parseFloat(inputValue);
  const conversionResult = convertUnits(activeTab, isNaN(numVal) ? 0 : numVal, fromUnit, toUnit);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Category Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b-4 border-ink pb-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl border-3 border-ink px-3.5 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
                isActive
                  ? "bg-hero-blue text-paper shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
                  : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30 hover:-translate-y-0.5"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Converter Card */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
        <div className="border-b-2 border-dashed border-ink/20 pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-comic text-2xl text-ink font-bold uppercase">
              {categoryConfig.title}
            </h2>
            <p className="font-body text-xs text-ink/70">
              Bi-directional conversion with exact formulas and cross-unit matrix.
            </p>
          </div>
          <span className="rounded-md border-2 border-ink bg-mustard px-2 py-0.5 font-comic text-[11px] font-bold uppercase text-ink shadow-[2px_2px_0_0_var(--ink)]">
            {units.length} UNITS
          </span>
        </div>

        {/* Input & Unit Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* FROM */}
          <div className="space-y-2">
            <label className="font-comic text-xs font-bold uppercase text-ink">
              From Value & Unit
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:bg-white"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full rounded-xl border-3 border-ink bg-paper px-3 py-2.5 font-comic text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div className="flex justify-center pt-2 md:pt-6">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap from and to units"
              title="Swap units"
              className="group flex h-12 w-12 items-center justify-center rounded-2xl border-3 border-ink bg-mustard shadow-[3px_3px_0_0_var(--ink)] transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeftRight className="h-5 w-5 text-ink transition-transform group-hover:rotate-180" />
            </button>
          </div>

          {/* TO */}
          <div className="space-y-2">
            <label className="font-comic text-xs font-bold uppercase text-ink">
              To Converted Unit
            </label>
            <div className="w-full rounded-xl border-3 border-ink bg-mustard/30 px-4 py-3 font-mono text-xl font-black text-ink shadow-[3px_3px_0_0_var(--ink)]">
              {conversionResult.formatted}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full rounded-xl border-3 border-ink bg-paper px-3 py-2.5 font-comic text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Highlight Result Banner */}
        <div className="rounded-xl border-4 border-ink bg-hero-blue p-5 text-paper shadow-[4px_4px_0_0_var(--ink)]">
          <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
            FORMULA & STEP BREAKDOWN
          </span>
          <div className="mt-1 font-comic text-2xl sm:text-3xl font-black">
            {conversionResult.fullStep}
          </div>
          <div className="mt-2 font-mono text-xs text-mustard border-t border-paper/20 pt-2">
            Mathematical Formula: <span className="underline">{conversionResult.formula}</span>
          </div>
        </div>

        {/* All-Units Quick Reference Matrix */}
        <div className="border-t-2 border-dashed border-ink/20 pt-4">
          <h3 className="font-comic text-sm font-bold uppercase tracking-wider text-ink mb-3">
            EQUIVALENTS MATRIX ACROSS ALL {categoryConfig.title.toUpperCase()}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {units.map((u) => {
              const res = convertUnits(activeTab, isNaN(numVal) ? 0 : numVal, fromUnit, u.id);
              const isSelected = u.id === toUnit;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setToUnit(u.id);
                  }}
                  className={`text-left rounded-xl border-2 border-ink p-2.5 transition-all ${
                    isSelected
                      ? "bg-mustard font-bold shadow-[3px_3px_0_0_var(--ink)] -translate-y-0.5"
                      : "bg-parchment hover:bg-mustard/30 shadow-[2px_2px_0_0_var(--ink)]"
                  }`}
                >
                  <div className="font-mono text-xs text-ink/70 uppercase">
                    {u.symbol} · {u.label}
                  </div>
                  <div className="font-mono text-sm font-black text-ink mt-0.5 truncate">
                    {res.formatted}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
