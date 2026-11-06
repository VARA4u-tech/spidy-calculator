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
import { RotateCcw, Plus, Minus, Hash, Dices, HelpCircle, Sparkles } from "lucide-react";
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
  const [directInput, setDirectInput] = useState<string>("");
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const handleUpperClick = (rodIndex: number) => {
    playClickSound();
    setAbacus((prev) => toggleUpperBead(prev, rodIndex));
  };

  const handleLowerClick = (rodIndex: number, bIdx: number) => {
    playClickSound();
    setAbacus((prev) => {
      const rod = prev.rods[rodIndex];
      if (!rod) return prev;
      const targetCount = bIdx + 1;
      // If clicking already active topmost bead, drop it by 1; otherwise activate up to targetCount
      const nextCount = rod.lowerBeadsUp === targetCount ? targetCount - 1 : targetCount;
      return setLowerBeads(prev, rodIndex, nextCount);
    });
  };

  const handleReset = () => {
    playClickSound();
    setAbacus(resetAbacus(abacus));
    setDirectInput("");
  };

  const handleSyncNumber = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(directInput, 10);
    if (!isNaN(val)) {
      playClickSound();
      setAbacus((prev) => setAbacusValue(prev, val));
    }
  };

  const handleStep = (delta: number) => {
    playClickSound();
    setAbacus((prev) => setAbacusValue(prev, Math.max(0, prev.totalValue + delta)));
  };

  const handleRandomChallenge = () => {
    playClickSound();
    const randoms = [7, 24, 69, 108, 365, 1492, 2026, 8888, 142857, 500000, 1234567, 9876543];
    const pick = randoms[Math.floor(Math.random() * randoms.length)] ?? 2026;
    setAbacus((prev) => setAbacusValue(prev, pick));
    setDirectInput(pick.toString());
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
                          className={`relative z-10 w-full max-w-[48px] h-8 sm:h-9 rounded-md border-2 border-ink font-comic text-xs font-bold transition-all duration-200 cursor-pointer ${
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
                              className={`relative z-10 w-full max-w-[48px] h-6 sm:h-7.5 rounded-md border-2 border-ink font-comic text-xs font-bold transition-all duration-200 cursor-pointer ${
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

      {/* ── DIRECT VALUE SYNC & PRACTICE TOOL ── */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-4 sm:p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-comic text-base sm:text-lg font-bold text-ink">
            DIRECT NUMBER SYNC &amp; CHALLENGE
          </h3>
          <span className="font-mono text-[10px] font-bold text-ink/60 uppercase">
            INSTANT BEAD CONVERTER
          </span>
        </div>

        <form onSubmit={handleSyncNumber} className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="number"
              min="0"
              max="9999999"
              placeholder="Type any number (0 - 9,999,999)..."
              value={directInput}
              onChange={(e) => setDirectInput(e.target.value)}
              className="w-full rounded-xl border-3 border-ink bg-white px-4 py-2.5 font-mono text-base font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] outline-none focus:ring-2 focus:ring-mustard"
            />
            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="comic-btn btn-yellow px-4 py-2.5 text-xs sm:text-sm font-comic font-bold"
          >
            SET ON ABACUS
          </button>

          <button
            type="button"
            onClick={handleRandomChallenge}
            className="comic-btn btn-blue flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-comic font-bold"
            title="Generate a random number challenge"
          >
            <Dices className="h-4 w-4" />
            <span>RANDOM NUMBER</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AbacusCalculator;
