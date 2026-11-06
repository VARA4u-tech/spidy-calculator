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
import { RotateCcw, Plus, Minus, Hash } from "lucide-react";

export function AbacusCalculator() {
  const [abacus, setAbacus] = useState<SorobanAbacusState>(() => createInitialAbacus(7));
  const [directInput, setDirectInput] = useState<string>("");

  const handleUpperClick = (rodIndex: number) => {
    playClickSound();
    setAbacus((prev) => toggleUpperBead(prev, rodIndex));
  };

  const handleLowerClick = (rodIndex: number, beadIndex: number) => {
    // beadIndex is 0..3 (bottom to top, or active count)
    playClickSound();
    setAbacus((prev) => {
      const rod = prev.rods[rodIndex];
      if (!rod) return prev;
      const currentActive = rod.lowerBeadsUp;
      // If clicking bead 1 and 1 is already active, toggling or setting to that bead level
      const targetCount = beadIndex + 1;
      const nextCount = currentActive === targetCount ? targetCount - 1 : targetCount;
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

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Total Counter Banner */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-mustard p-6 shadow-[6px_6px_0_0_var(--ink)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/75">
            SOROBAN RUNNING TOTAL
          </span>
          <div className="font-comic text-5xl sm:text-6xl font-black text-ink leading-tight">
            {abacus.totalValue.toLocaleString("en-US")}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="flex items-center gap-1 rounded-xl border-3 border-ink bg-paper px-3 py-2 font-comic text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] hover:bg-white active:translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> 1
          </button>
          <button
            type="button"
            onClick={() => handleStep(10)}
            className="flex items-center gap-1 rounded-xl border-3 border-ink bg-paper px-3 py-2 font-comic text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] hover:bg-white active:translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> 10
          </button>
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={abacus.totalValue <= 0}
            className="flex items-center gap-1 rounded-xl border-3 border-ink bg-paper px-3 py-2 font-comic text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] hover:bg-white active:translate-y-0.5 disabled:opacity-50"
          >
            <Minus className="h-4 w-4" /> 1
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border-3 border-ink bg-hero-red px-4 py-2 font-comic text-sm font-bold text-paper shadow-[3px_3px_0_0_var(--ink)] hover:bg-hero-red/90 active:translate-y-0.5"
          >
            <RotateCcw className="h-4 w-4" /> RESET
          </button>
        </div>
      </div>

      {/* Virtual Abacus Board Frame */}
      <div className="relative rounded-3xl border-6 border-ink bg-parchment p-4 sm:p-6 shadow-[10px_10px_0_0_var(--ink)] select-none">
        {/* Frame Label */}
        <div className="mb-4 flex items-center justify-between border-b-3 border-ink pb-2">
          <span className="font-comic text-sm sm:text-base font-bold text-ink uppercase tracking-wider">
            TRADITIONAL 7-ROD JAPANESE SOROBAN (そろばん)
          </span>
          <span className="font-mono text-xs text-ink/70">UPPER BEAD = 5 · LOWER BEADS = 1</span>
        </div>

        {/* The Abacus Grid */}
        <div className="relative rounded-2xl border-4 border-ink bg-amber-900/10 p-3 sm:p-5">
          {/* Rods Container */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {abacus.rods.map((rod) => {
              const rodVal = calculateRodValue(rod);
              return (
                <div key={rod.index} className="flex flex-col items-center">
                  {/* Place Value Header */}
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-ink/70 mb-2">
                    {rod.placeValue >= 1000 ? `${rod.placeValue / 1000}k` : rod.placeValue}
                  </span>

                  {/* Rod Column */}
                  <div className="relative flex flex-col items-center w-full h-[320px] sm:h-[360px] rounded-xl border-2 border-ink bg-white/70 shadow-[2px_2px_0_0_var(--ink)] overflow-hidden">
                    {/* Metallic wire through the center */}
                    <div className="absolute top-0 bottom-0 w-1.5 bg-ink/40 z-0 left-1/2 -translate-x-1/2" />

                    {/* UPPER DECK (Value = 5) */}
                    <div className="relative z-10 flex flex-col justify-end w-full h-[90px] sm:h-[105px] p-1 border-b-6 border-ink bg-amber-100/50">
                      <button
                        type="button"
                        onClick={() => handleUpperClick(rod.index)}
                        aria-label={`Toggle upper bead on rod ${rod.index} (value 5)`}
                        className={`w-full h-9 sm:h-11 rounded-lg border-2 border-ink shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-150 ${
                          rod.upperBeadDown
                            ? "bg-hero-red translate-y-0 shadow-[1px_1px_0_0_var(--ink)]" // active down at beam
                            : "bg-hero-blue -translate-y-8 sm:-translate-y-11" // inactive up at frame
                        }`}
                        title="Click to toggle (value 5)"
                      >
                        <div className="h-full flex items-center justify-center font-comic text-xs font-bold text-paper">
                          5
                        </div>
                      </button>
                    </div>

                    {/* RECKONING BEAM (BEAD CONTACT LINE) */}
                    <div className="w-full h-1 bg-ink shadow-sm" />

                    {/* LOWER DECK (4 beads, Value = 1 each) */}
                    <div className="relative z-10 flex flex-col-reverse justify-start w-full flex-1 p-1 gap-1">
                      {[0, 1, 2, 3].map((bIdx) => {
                        const isActive = bIdx < rod.lowerBeadsUp;
                        return (
                          <button
                            key={bIdx}
                            type="button"
                            onClick={() => handleLowerClick(rod.index, bIdx)}
                            aria-label={`Rod ${rod.index} lower bead ${bIdx + 1}`}
                            className={`w-full h-8 sm:h-10 rounded-lg border-2 border-ink shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-150 ${
                              isActive
                                ? "bg-mustard -translate-y-6 sm:-translate-y-8" // active up at beam
                                : "bg-amber-600 translate-y-0" // inactive down
                            }`}
                            title={`Lower bead ${bIdx + 1} (value 1)`}
                          >
                            <div className="h-full flex items-center justify-center font-comic text-xs font-bold text-ink">
                              1
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Digit Subtotal Below Rod */}
                  <div className="mt-3 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-paper font-comic text-sm font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]">
                    {rodVal}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Direct Set & Practice Tools */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-4">
        <h3 className="font-comic text-lg font-bold text-ink">DIRECT VALUE & SYNC TOOL</h3>
        <form onSubmit={handleSyncNumber} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="number"
              min="0"
              max="9999999"
              placeholder="Enter number (0 - 9,999,999)"
              value={directInput}
              onChange={(e) => setDirectInput(e.target.value)}
              className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-2.5 font-mono text-base font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] outline-none"
            />
            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          </div>
          <button
            type="submit"
            className="rounded-xl border-3 border-ink bg-mustard px-5 py-2.5 font-comic text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] hover:bg-mustard/90 active:translate-y-0.5"
          >
            SET BEADS ON ABACUS
          </button>
        </form>
      </div>
    </div>
  );
}
