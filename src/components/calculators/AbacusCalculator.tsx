import { useState } from "react";
import {
  createInitialAbacus,
  toggleUpperBead,
  setLowerBeads,
  setAbacusValue,
  resetAbacus,
  calculateRodValue,
  type SorobanAbacusState,
} from "@/lib/abacus";
import { playClickSound } from "@/lib/sounds";
import { RotateCcw, Plus, Minus, Hash, Dices, HelpCircle, Sparkles, Keyboard } from "lucide-react";
import { Starburst } from "@/components/comic";

const PLACE_VALUE_LABELS = [
  { short: "1M", full: "1,000,000", hasDot: false },
  { short: "100K", full: "100,000", hasDot: false },
  { short: "10K", full: "10,000", hasDot: false },
  { short: "1K", full: "1,000", hasDot: true }, // Unit dot on 1,000 rod
  { short: "100", full: "100", hasDot: false },
  { short: "10", full: "10", hasDot: false },
  { short: "1", full: "1", hasDot: true }, // Unit dot on units rod
];

export function AbacusCalculator() {
  const [abacus, setAbacus] = useState<SorobanAbacusState>(() => createInitialAbacus(7));
  const [typedValue, setTypedValue] = useState<string>("");
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const handleUpperClick = (rodIndex: number) => {
    playClickSound();
    setAbacus((prev) => {
      const next = toggleUpperBead(prev, rodIndex);
      setTypedValue(next.totalValue > 0 ? next.totalValue.toLocaleString("en-US") : "");
      return next;
    });
  };

  const handleLowerClick = (rodIndex: number, bIdx: number) => {
    playClickSound();
    setAbacus((prev) => {
      const rod = prev.rods[rodIndex];
      if (!rod) return prev;
      const targetCount = bIdx + 1;
      // If clicking already active topmost bead, drop it by 1; otherwise activate up to targetCount
      const nextCount = rod.lowerBeadsUp === targetCount ? targetCount - 1 : targetCount;
      const next = setLowerBeads(prev, rodIndex, nextCount);
      setTypedValue(next.totalValue > 0 ? next.totalValue.toLocaleString("en-US") : "");
      return next;
    });
  };

  const handleReset = () => {
    playClickSound();
    setAbacus(resetAbacus(abacus));
    setTypedValue("");
  };

  const handleTypeToAnimate = (inputStr: string) => {
    // If input cleared
    if (!inputStr.trim()) {
      setTypedValue("");
      playClickSound();
      setAbacus(resetAbacus(abacus));
      return;
    }

    // Strip non-digits
    const cleanDigits = inputStr.replace(/[^0-9]/g, "");
    if (!cleanDigits) {
      setTypedValue("");
      setAbacus(resetAbacus(abacus));
      return;
    }

    const num = parseInt(cleanDigits, 10);
    const maxVal = Math.pow(10, abacus.rodsCount) - 1; // 9,999,999
    const clamped = Math.min(num, maxVal);

    playClickSound();
    setTypedValue(clamped.toLocaleString("en-US"));
    setAbacus((prev) => setAbacusValue(prev, clamped));
  };

  const handleStep = (delta: number) => {
    playClickSound();
    setAbacus((prev) => {
      const target = Math.max(0, Math.min(9999999, prev.totalValue + delta));
      const next = setAbacusValue(prev, target);
      setTypedValue(next.totalValue > 0 ? next.totalValue.toLocaleString("en-US") : "");
      return next;
    });
  };

  const handleExampleClick = (val: number) => {
    playClickSound();
    setTypedValue(val.toLocaleString("en-US"));
    setAbacus((prev) => setAbacusValue(prev, val));
  };

  const handleRandomChallenge = () => {
    playClickSound();
    const randoms = [7, 24, 69, 108, 365, 1492, 2026, 8888, 142857, 500000, 1234567, 9876543];
    const pick = randoms[Math.floor(Math.random() * randoms.length)] ?? 2026;
    setTypedValue(pick.toLocaleString("en-US"));
    setAbacus((prev) => setAbacusValue(prev, pick));
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* ── TOP SCOREBOARD BANNER ── */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-mustard p-4 sm:p-6 shadow-[6px_6px_0_0_var(--ink)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
            <Sparkles className="h-3.5 w-3.5 text-hero-red" />
            <span>SOROBAN RUNNING TOTAL</span>
          </div>
          <div className="font-comic text-4xl min-[400px]:text-5xl sm:text-6xl font-black text-ink leading-tight tracking-wide">
            {abacus.totalValue.toLocaleString("en-US")}
          </div>
        </div>

        {/* Quick Stepper Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="comic-btn btn-white flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm font-comic font-bold"
            title="Add 1"
          >
            <Plus className="h-3.5 w-3.5" /> 1
          </button>
          <button
            type="button"
            onClick={() => handleStep(10)}
            className="comic-btn btn-white flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm font-comic font-bold"
            title="Add 10"
          >
            <Plus className="h-3.5 w-3.5" /> 10
          </button>
          <button
            type="button"
            onClick={() => handleStep(100)}
            className="comic-btn btn-white flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm font-comic font-bold"
            title="Add 100"
          >
            <Plus className="h-3.5 w-3.5" /> 100
          </button>
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={abacus.totalValue <= 0}
            className="comic-btn btn-white flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm font-comic font-bold disabled:opacity-40"
            title="Subtract 1"
          >
            <Minus className="h-3.5 w-3.5" /> 1
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="comic-btn btn-red flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-comic font-bold"
            title="Reset to 0"
          >
            <RotateCcw className="h-3.5 w-3.5" /> RESET
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE TYPE-TO-ANIMATE CONSOLE (EDUCATIONAL REAL-TIME SYNC) ── */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-4 sm:p-5 shadow-[6px_6px_0_0_var(--ink)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-ink/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-ink bg-mustard text-xs font-black shadow-[1px_1px_0_var(--ink)]">
              ⌨️
            </span>
            <span className="font-comic text-xs sm:text-sm font-bold uppercase tracking-wider text-ink">
              TYPE TO ANIMATE BEADS
            </span>
            <span className="hidden sm:inline-flex rounded-full border border-ink bg-hero-red/10 px-2 py-0.5 text-[9px] font-mono font-bold text-hero-red uppercase">
              LIVE SOROBAN SYNC
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-ink/70">
            <span>Range:</span>
            <span className="font-bold text-ink">0 – 9,999,999</span>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Type any integer (e.g. 12,345)..."
              value={typedValue}
              onChange={(e) => handleTypeToAnimate(e.target.value)}
              className="w-full rounded-xl border-3 border-ink bg-parchment pl-4 pr-10 py-3 font-mono text-lg sm:text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:ring-2 focus:ring-mustard transition-shadow"
            />
            {typedValue ? (
              <button
                type="button"
                onClick={() => handleTypeToAnimate("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-ink bg-paper text-ink flex items-center justify-center hover:bg-hero-red hover:text-paper font-bold text-xs cursor-pointer transition-colors shadow-sm"
                title="Clear input"
              >
                ✕
              </button>
            ) : (
              <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink/40 pointer-events-none" />
            )}
          </div>

          {/* Quick Challenge / Example Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase font-bold text-ink/60 hidden md:inline">
              Examples:
            </span>
            {[
              { label: "7", val: 7 },
              { label: "12,345", val: 12345 },
              { label: "2,026", val: 2026 },
              { label: "88,888", val: 88888 },
            ].map((ex) => (
              <button
                key={ex.val}
                type="button"
                onClick={() => handleExampleClick(ex.val)}
                className="rounded-lg border-2 border-ink bg-paper hover:bg-mustard px-2.5 py-1.5 font-mono text-xs font-bold text-ink transition-colors cursor-pointer shadow-[1px_1px_0_var(--ink)] active:translate-y-0.5"
                title={`Animate beads to ${ex.label}`}
              >
                {ex.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleRandomChallenge}
              className="comic-btn btn-blue flex items-center gap-1 px-3 py-1.5 text-xs font-comic font-bold cursor-pointer"
              title="Generate a random number challenge"
            >
              <Dices className="h-3.5 w-3.5" />
              <span>RANDOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── THE VIRTUAL SOROBAN BOARD ── */}
      <div className="relative rounded-3xl border-4 sm:border-6 border-ink bg-paper p-3 sm:p-6 shadow-[8px_8px_0_0_var(--ink)] text-ink select-none overflow-hidden">
        {/* Board Header Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-3 border-ink pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex h-7 w-7 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-1 text-mustard" />
              <span className="relative z-10 font-comic text-xs font-black text-ink">算</span>
            </div>
            <div>
              <h3 className="font-comic text-base sm:text-xl font-bold text-ink tracking-wide leading-none">
                TRADITIONAL 7-ROD JAPANESE SOROBAN (そろばん)
              </h3>
              <p className="font-mono text-[10px] sm:text-xs text-ink/75 font-semibold tracking-wider mt-0.5">
                HEAVEN (UPPER BEAD) = 5 · EARTH (LOWER BEADS) = 1 EACH
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGuide((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg border-2 border-ink bg-mustard/30 px-2.5 py-1 font-comic text-xs font-bold text-ink hover:bg-mustard transition-colors cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{showGuide ? "HIDE RULES" : "HOW TO READ"}</span>
            </button>
            <span className="hidden sm:inline-block font-mono text-[10px] font-bold bg-ink text-paper px-2 py-0.5 rounded">
              7 DECADES (1M)
            </span>
          </div>
        </div>

        {/* Soroban Frame Container */}
        <div className="relative rounded-2xl border-4 border-ink bg-amber-950/15 p-2 sm:p-5 shadow-inner">
          <div className="overflow-x-auto pb-1 scrollbar-none">
            <div className="min-w-[320px] max-w-full mx-auto">
              {/* Place Value Badges */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-2">
                {PLACE_VALUE_LABELS.map((pv, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span
                      className="font-mono text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded border-2 border-ink bg-paper text-ink shadow-[1px_1px_0_var(--ink)] whitespace-nowrap"
                      title={pv.full}
                    >
                      {pv.short}
                    </span>
                  </div>
                ))}
              </div>

              {/* Soroban Racks & Continuous Reckoning Beam */}
              <div className="relative rounded-xl border-3 border-ink bg-white/90 shadow-[3px_3px_0_var(--ink)] overflow-hidden">
                {/* ── UPPER DECK (HEAVEN / 5s) ── */}
                <div className="relative grid grid-cols-7 gap-1.5 sm:gap-3 h-20 sm:h-24 px-1 sm:px-2 pt-2 bg-amber-50/60">
                  {abacus.rods.map((rod) => {
                    const isDown = rod.upperBeadDown;
                    return (
                      <div
                        key={rod.index}
                        className="relative flex justify-center items-start h-full"
                      >
                        {/* Metallic Vertical Rod Wire */}
                        <div className="absolute top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-r from-ink/70 via-ink/40 to-ink/70 rounded-full z-0" />

                        {/* Upper Bead (Value = 5) */}
                        <button
                          type="button"
                          onClick={() => handleUpperClick(rod.index)}
                          aria-label={`Rod ${rod.index} upper bead (value 5, currently ${isDown ? "active" : "inactive"})`}
                          className={`relative z-10 w-full max-w-[48px] h-8 sm:h-9 rounded-md border-2 border-ink font-comic text-xs font-bold transition-transform duration-200 ease-out cursor-pointer ${
                            isDown
                              ? "bg-hero-red text-paper shadow-[0_3px_0_0_var(--ink)] ring-2 ring-mustard translate-y-8 sm:translate-y-11" // active down at beam
                              : "bg-hero-blue text-paper/90 shadow-[0_2px_0_0_var(--ink)] hover:brightness-110 translate-y-0" // inactive up at frame
                          }`}
                          style={{
                            clipPath:
                              "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                          }}
                          title={`Upper bead: ${isDown ? "Active (+5)" : "Inactive (0)"}`}
                        >
                          <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-0.5 bg-white/35" />
                          <span className="relative z-10 flex items-center justify-center h-full drop-shadow-[1px_1px_0_rgba(0,0,0,0.6)]">
                            5
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* ── RECKONING BEAM (BEAD CONTACT LINE WITH UNIT DOTS) ── */}
                <div className="relative z-20 h-4 sm:h-5 bg-ink shadow-md flex items-center justify-around px-1 sm:px-2 border-y-2 border-ink">
                  {PLACE_VALUE_LABELS.map((pv, idx) => (
                    <div key={idx} className="flex justify-center w-full">
                      {pv.hasDot ? (
                        <div
                          className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-paper border border-ink/40 shadow-sm"
                          title={`Unit Reckoning Dot (${pv.short})`}
                        />
                      ) : (
                        <div className="h-1 w-1 rounded-full bg-paper/20" />
                      )}
                    </div>
                  ))}
                </div>

                {/* ── LOWER DECK (EARTH / 1s) ── */}
                <div className="relative grid grid-cols-7 gap-1.5 sm:gap-3 h-36 sm:h-44 px-1 sm:px-2 pb-2 bg-amber-50/40">
                  {abacus.rods.map((rod) => {
                    const activeCount = rod.lowerBeadsUp; // 0..4

                    return (
                      <div
                        key={rod.index}
                        className="relative flex flex-col justify-end items-center h-full gap-1"
                      >
                        {/* Metallic Vertical Rod Wire */}
                        <div className="absolute top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-r from-ink/70 via-ink/40 to-ink/70 rounded-full z-0" />

                        {/* 4 Lower Beads: bead 0 (topmost), 1, 2, 3 (bottommost) */}
                        {[0, 1, 2, 3].map((bIdx) => {
                          const isUp = bIdx < activeCount;
                          return (
                            <button
                              key={bIdx}
                              type="button"
                              onClick={() => handleLowerClick(rod.index, bIdx)}
                              aria-label={`Rod ${rod.index} lower bead ${bIdx + 1} (${isUp ? "active" : "inactive"})`}
                              className={`relative z-10 w-full max-w-[48px] h-6 sm:h-7.5 rounded-md border-2 border-ink font-comic text-xs font-bold transition-transform duration-200 ease-out cursor-pointer ${
                                isUp
                                  ? "bg-mustard text-ink shadow-[0_3px_0_0_var(--ink)] ring-1.5 ring-ink -translate-y-8 sm:-translate-y-11" // active up against beam
                                  : "bg-amber-600 text-paper shadow-[0_2px_0_0_var(--ink)] hover:brightness-110 translate-y-0" // inactive down
                              }`}
                              style={{
                                clipPath:
                                  "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                              }}
                              title={`Lower bead ${bIdx + 1}: ${isUp ? "Active (+1)" : "Inactive (0)"}`}
                            >
                              <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-0.5 bg-white/30" />
                              <span className="relative z-10 flex items-center justify-center h-full">
                                1
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Digit Subtotal Tiles Below Rods */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mt-3">
                {abacus.rods.map((rod) => {
                  const rodVal = calculateRodValue(rod);
                  const isPositive = rodVal > 0;
                  return (
                    <div key={rod.index} className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl border-3 border-ink font-comic text-base sm:text-xl font-black shadow-[2px_2px_0_0_var(--ink)] transition-colors ${
                          isPositive ? "bg-mustard text-ink scale-105" : "bg-paper text-ink/40"
                        }`}
                      >
                        {rodVal}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── EXPANDABLE QUICK HOW-TO GUIDE ── */}
        {showGuide && (
          <div className="mt-4 rounded-2xl border-3 border-ink bg-mustard/20 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <h4 className="font-comic text-sm sm:text-base font-bold text-ink uppercase tracking-wide">
                HOW TO READ &amp; COUNT ON A JAPANESE SOROBAN
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-ink/85 leading-relaxed">
              <div className="rounded-xl border-2 border-ink bg-paper p-3 space-y-1">
                <span className="font-bold text-hero-red uppercase block">1. Reckoning Beam</span>
                <p>
                  Only beads pushed <strong>against the center black beam</strong> are counted.
                  Beads resting against the outer wooden borders are ZERO.
                </p>
              </div>
              <div className="rounded-xl border-2 border-ink bg-paper p-3 space-y-1">
                <span className="font-bold text-hero-blue uppercase block">
                  2. Upper Deck (Heaven)
                </span>
                <p>
                  Each upper bead is worth <strong>5</strong>. Pull it DOWN to touch the beam to add
                  5. Push it back UP to clear.
                </p>
              </div>
              <div className="rounded-xl border-2 border-ink bg-paper p-3 space-y-1">
                <span className="font-bold text-amber-700 uppercase block">
                  3. Lower Deck (Earth)
                </span>
                <p>
                  Each lower bead is worth <strong>1</strong>. Push beads UP to touch the beam (1 to
                  4). Pull down to clear.
                </p>
              </div>
            </div>
            <p className="text-[11px] font-mono text-ink/70">
              ★ Example: For number 7, pull the upper bead DOWN (+5) and push 2 lower beads UP (+2)
              = 7!
            </p>
          </div>
        )}
      </div>

      {/* ── EDUCATIONAL SOROBAN MENTAL MATH TIPS ── */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-4 sm:p-5 shadow-[6px_6px_0_0_var(--ink)] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🧮</span>
          <h4 className="font-comic text-xs sm:text-sm font-bold uppercase tracking-wider text-ink">
            SOROBAN MENTAL MATH (ANZAN) PRO-TIPS
          </h4>
        </div>
        <p className="font-mono text-xs text-ink/80 leading-relaxed">
          As you type digits in the console above, notice how the bi-quinary system works: digits 1
          to 4 move only Earth beads up; digit 5 pulls Heaven down and clears Earth; and digits 6 to
          9 combine both (5 + 1..4)!
        </p>
      </div>
    </div>
  );
}

export default AbacusCalculator;
