import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import * as C from "@/lib/calculator";
import { sfxKey, sfxToggle } from "@/lib/sounds";

export type Key = {
  id: string;
  label: string;
  aria: string;
  kind: "digit" | "blue" | "red" | "equals" | "sci";
  action: () => void;
  wide?: boolean;
};

interface MobileSciCalculatorProps {
  state: C.CalcState;
  setState: React.Dispatch<React.SetStateAction<C.CalcState>>;
  history: C.HistoryEntry[];
  setHistory: React.Dispatch<React.SetStateAction<C.HistoryEntry[]>>;
  showHistory: boolean;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  muted: boolean;
  onToggleSound: () => void;
  copied: boolean;
  copyResult: () => Promise<void>;
  toggleAngle: () => void;
  onCloseSci: () => void;
  sciKeys: Key[];
  basicKeys: Key[];
  pressed: string | null;
  cls: Record<string, string>;
}

const ORIENTATION_PREF_KEY = "spidy-sci-mobile-orientation";

export function MobileSciCalculator({
  state,
  setState,
  history,
  setHistory,
  showHistory,
  setShowHistory,
  muted,
  onToggleSound,
  copied,
  copyResult,
  toggleAngle,
  onCloseSci,
  sciKeys,
  basicKeys,
  pressed,
  cls,
}: MobileSciCalculatorProps) {
  // Mobile orientation preference: defaults to upright (portrait), switchable to horizontal (landscape)
  const [isRotated, setIsRotated] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.sessionStorage.getItem(ORIENTATION_PREF_KEY);
      if (saved === "rotated") return true;
      if (saved === "upright") return false;
    }
    // Default to upright portrait mode for natural phone orientation
    return false;
  });

  const handleToggleOrientation = () => {
    sfxToggle();
    setIsRotated((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(ORIENTATION_PREF_KEY, next ? "rotated" : "upright");
      }
      return next;
    });
  };

  const len = state.display.length;
  const uprightDisplaySize =
    len > 14
      ? "text-xl min-[360px]:text-2xl"
      : len > 10
        ? "text-2xl min-[360px]:text-3xl"
        : "text-3xl min-[360px]:text-4xl";

  const rotatedDisplaySize =
    len > 12 ? "text-xl min-[360px]:text-2xl" : "text-2xl min-[360px]:text-3xl";

  return (
    <div className={isRotated ? "sci-mobile-wrapper-rotated" : "sci-mobile-wrapper-upright"}>
      <section
        aria-label="Mobile Scientific Calculator"
        className={
          isRotated
            ? "relative w-full h-full flex flex-col justify-between overflow-hidden"
            : "sci-mobile-panel panel relative rounded-2xl border-4 border-ink bg-paper p-2 sm:p-2.5 shadow-[6px_6px_0_0_var(--ink)] flex flex-col justify-between overflow-hidden"
        }
      >
        {/* Top Navigation & Control Header */}
        <header className="flex items-center justify-between gap-1.5 pb-2 mb-1.5 border-b-2 border-ink/20 shrink-0 select-none">
          {/* Left: Home Navigation */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="comic-header-btn btn-blue inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold"
              aria-label="Back to Home"
              title="Return to Home"
            >
              <span aria-hidden className="text-[10px]">
                ◀
              </span>
              <span>HOME</span>
            </Link>
          </div>

          {/* Right: Essential Tools & Mode Switchers */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Case Files History Toggle */}
            <button
              type="button"
              aria-expanded={showHistory}
              onClick={() => {
                sfxToggle();
                setShowHistory((v) => !v);
              }}
              className={`comic-header-btn ${
                showHistory ? "btn-equals" : "btn-blue"
              } inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-xs font-bold`}
              title={showHistory ? "Close Case Files log" : "Open Case Files calculation history"}
            >
              <span>{showHistory ? "CLOSE" : "LOG"}</span>
              <span className="bg-hero-red text-paper rounded border border-ink px-1 py-0.2 text-[9px] font-mono font-bold leading-none shadow-[1px_1px_0_var(--ink)]">
                {history.length}
              </span>
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className={`comic-header-btn ${
                muted ? "btn-blue opacity-85" : "btn-equals shadow-[2px_2px_0_var(--ink)]"
              } inline-flex items-center justify-center w-7 sm:w-8 px-1 py-0.5 text-xs font-bold cursor-pointer transition-transform active:scale-95`}
              title={
                muted
                  ? "Sound effects currently MUTED (tap to enable)"
                  : "Sound effects currently ON (tap to mute)"
              }
              aria-label={muted ? "Turn sound effects on" : "Turn sound effects off"}
              aria-pressed={!muted}
            >
              <span aria-hidden>{muted ? "🔇" : "🔊"}</span>
              <span className="sr-only">{muted ? "Sound Muted" : "Sound Active"}</span>
            </button>

            {/* Upright vs Horizontal View Toggle */}
            <button
              type="button"
              onClick={handleToggleOrientation}
              className={`comic-header-btn ${
                isRotated ? "btn-blue" : "btn-equals"
              } inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-xs font-bold`}
              title={
                isRotated
                  ? "Switch to upright portrait layout"
                  : "Turn to horizontal landscape layout"
              }
            >
              <span aria-hidden>{isRotated ? "📱" : "📐"}</span>
              <span className="hidden min-[360px]:inline">{isRotated ? "UPRIGHT" : "HORIZ"}</span>
            </button>

            {/* Switch back to basic calculator */}
            <button
              type="button"
              onClick={onCloseSci}
              className="comic-header-btn btn-red inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold"
              title="Switch back to basic calculator"
            >
              <span aria-hidden>123</span>
              <span className="hidden min-[400px]:inline">BASIC</span>
            </button>
          </div>
        </header>

        {/* Display Bezel */}
        <div
          className={`rounded-xl border-3 border-ink bg-ink p-1.5 sm:p-2 shadow-[inset_0_0_0_2px_var(--hero-blue)] shrink-0 ${
            isRotated ? "mb-1" : "mb-1.5"
          } flex flex-col justify-between`}
        >
          {/* Bezel Status Bar */}
          <div className="flex items-center justify-between gap-1 border-b border-paper/15 pb-0.5 mb-0.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={copyResult}
                aria-label="Copy current calculation result"
                className={`inline-flex items-center gap-0.5 rounded border border-ink px-1.5 py-0.5 font-mono text-[9px] font-bold transition-transform active:scale-95 ${
                  copied ? "bg-mustard text-ink" : "bg-hero-blue text-paper hover:brightness-110"
                }`}
              >
                <span aria-hidden>{copied ? "✓" : "📋"}</span>
                <span>{copied ? "COPIED" : "COPY"}</span>
              </button>

              <button
                type="button"
                onClick={toggleAngle}
                className="rounded border border-mustard/50 bg-ink px-1.5 py-0.5 font-mono text-[9px] font-bold text-mustard hover:border-mustard transition-colors"
                title={`Angle Mode: currently ${state.angleMode.toUpperCase()} (tap to toggle)`}
              >
                {state.angleMode.toUpperCase()}
              </button>

              <span className="font-comic text-[9px] text-paper/60 uppercase ml-1 hidden min-[360px]:inline">
                ⚡ SCIENTIFIC
              </span>
            </div>

            <p className="min-h-4 max-w-[210px] truncate text-right font-mono text-[10px] text-mustard tracking-wider">
              {state.expression || "\u00a0"}
            </p>
          </div>

          {/* Main Calculation Output */}
          <output
            key={state.display}
            aria-live="polite"
            onClick={copyResult}
            title="Click to copy result"
            className={`font-comic block cursor-pointer truncate text-right text-paper ${
              isRotated ? rotatedDisplaySize : uprightDisplaySize
            } animate-pop leading-tight select-all py-0.5`}
          >
            {state.display}
          </output>

          {state.error && (
            <p
              role="alert"
              className="text-right font-comic text-[10px] text-hero-red animate-shake truncate"
            >
              ZAP! {state.error}
            </p>
          )}
        </div>

        {/* Keypad Section: Adaptive Layout */}
        {isRotated ? (
          /* =================================================================== */
          /* ── HORIZONTAL (LANDSCAPE) VIEW: 9 Columns side-by-side ──           */
          /* =================================================================== */
          <div className="flex-1 min-h-0 flex gap-1 sci-keypad">
            {/* 5 Scientific Columns */}
            <div className="flex-[5] grid grid-cols-5 auto-rows-fr gap-0.5 min-h-0">
              {sciKeys.map((k) => {
                const isStaged =
                  state.waiting &&
                  ((k.id === "pow" && state.operator === "^") || state.operator === k.label);
                return (
                  <button
                    key={k.id}
                    type="button"
                    aria-label={k.aria}
                    title={k.aria}
                    data-pressed={pressed === k.id || isStaged}
                    onClick={k.action}
                    className={`comic-btn ${cls[k.kind]} btn-symbol h-full w-full min-h-0 flex items-center justify-center px-0 ${
                      isStaged ? "ring-2 ring-mustard brightness-110 !translate-y-[2px]" : ""
                    }`}
                  >
                    <span
                      className={`select-none leading-none whitespace-nowrap px-0.5 ${
                        k.label.length > 3
                          ? "text-[10px] min-[360px]:text-[11px] tracking-tighter"
                          : ""
                      }`}
                    >
                      {k.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Comic Vertical Divider */}
            <div className="w-1 bg-ink/30 rounded-full shrink-0 self-stretch my-0.5" />

            {/* 4 Basic Number Columns */}
            <div className="flex-[4] grid grid-cols-4 auto-rows-fr gap-0.5 min-h-0">
              {basicKeys.map((k) => {
                const isStaged =
                  state.waiting &&
                  (state.operator === k.id || (k.id === "pow" && state.operator === "^"));
                return (
                  <button
                    key={k.id}
                    type="button"
                    aria-label={k.aria}
                    title={k.aria}
                    data-pressed={pressed === k.id || isStaged}
                    onClick={k.action}
                    className={`comic-btn ${cls[k.kind]} h-full w-full min-h-0 flex items-center justify-center px-0 ${
                      isStaged ? "ring-2 ring-mustard brightness-110 !translate-y-[2px]" : ""
                    } ${
                      k.id === "sci_mode"
                        ? "font-comic tracking-wide leading-none"
                        : /^[0-9.]$|AC|C/.test(k.label)
                          ? ""
                          : "btn-symbol"
                    }`}
                  >
                    {k.id === "sci_mode" ? (
                      <span className="select-none leading-none font-comic font-bold">123</span>
                    ) : (
                      <span className="select-none leading-none">{k.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* ── UPRIGHT (PORTRAIT) VIEW: Stacked 5-Col Sci Deck + 4-Col Basic Deck ── */
          /* =================================================================== */
          <div className="flex-1 min-h-0 flex flex-col gap-1 sm:gap-1.5 justify-between">
            {/* Upper Scientific Deck (5 cols x 5 rows) */}
            <div className="sci-deck flex-[4.5] grid grid-cols-5 auto-rows-fr gap-1 min-h-0">
              {sciKeys.map((k) => {
                const isStaged =
                  state.waiting &&
                  ((k.id === "pow" && state.operator === "^") || state.operator === k.label);
                return (
                  <button
                    key={k.id}
                    type="button"
                    aria-label={k.aria}
                    title={k.aria}
                    data-pressed={pressed === k.id || isStaged}
                    onClick={k.action}
                    className={`comic-btn ${cls[k.kind]} btn-symbol h-full w-full min-h-0 flex items-center justify-center font-comic font-bold ${
                      isStaged
                        ? "ring-2 ring-mustard brightness-110 !translate-y-[2px] !shadow-[0_1px_0_0_var(--wall),0_1px_0_2px_var(--ink)]"
                        : ""
                    }`}
                  >
                    <span
                      className={`select-none leading-none whitespace-nowrap px-0.5 ${
                        k.label.length > 3
                          ? "text-[10px] min-[360px]:text-[11px] tracking-tighter"
                          : ""
                      }`}
                    >
                      {k.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tactile Comic Separator */}
            <div className="relative flex items-center justify-center my-0.5 shrink-0 select-none">
              <div className="w-full h-0.5 bg-ink/20 rounded-full" />
              <span className="absolute px-2 py-0.2 bg-paper text-[8px] min-[360px]:text-[9px] font-mono font-bold text-ink/60 uppercase tracking-widest border border-ink/25 rounded shadow-[1px_1px_0_var(--ink)]">
                ⚡ NUMERIC DECK
              </span>
            </div>

            {/* Lower Standard Number Deck (4 cols x 5 rows) */}
            <div className="basic-deck flex-[5.5] grid grid-cols-4 auto-rows-fr gap-1 sm:gap-1.5 min-h-0">
              {basicKeys.map((k) => {
                const isStaged =
                  state.waiting &&
                  (state.operator === k.id || (k.id === "pow" && state.operator === "^"));
                return (
                  <button
                    key={k.id}
                    type="button"
                    aria-label={k.aria}
                    title={k.aria}
                    data-pressed={pressed === k.id || isStaged}
                    onClick={k.action}
                    className={`comic-btn ${cls[k.kind]} h-full w-full min-h-0 flex items-center justify-center ${
                      isStaged
                        ? "ring-2 ring-mustard ring-offset-1 ring-offset-ink brightness-110 !translate-y-[2px] !shadow-[0_1px_0_0_var(--wall),0_1px_0_2px_var(--ink)]"
                        : ""
                    } ${
                      k.id === "sci_mode"
                        ? "font-comic tracking-wider leading-none text-sm min-[360px]:text-base"
                        : /^[0-9.]$|AC|C/.test(k.label)
                          ? "font-comic font-bold text-lg min-[360px]:text-xl"
                          : "btn-symbol font-comic font-bold text-lg min-[360px]:text-xl"
                    }`}
                  >
                    {k.id === "sci_mode" ? (
                      <span className="select-none leading-none font-comic font-bold tracking-wider">
                        123
                      </span>
                    ) : (
                      <span className="select-none leading-none">{k.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Case Files Overlay Modal */}
        {showHistory && (
          <div className="absolute inset-1.5 sm:inset-2 z-50 rounded-xl border-3 border-ink bg-paper p-2 shadow-[6px_6px_0_0_var(--ink)] flex flex-col animate-pop">
            <div className="flex items-center justify-between border-b-2 border-ink pb-1 mb-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-comic text-base text-hero-blue">Case Files History</h2>
                <span className="halftone-red rounded border border-ink px-1 text-[10px] font-mono text-paper font-bold">
                  {history.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={!history.length}
                  onClick={() => {
                    sfxToggle();
                    setHistory([]);
                  }}
                  className="comic-btn btn-red px-2 py-0.5 text-[10px] disabled:opacity-50 cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfxToggle();
                    setShowHistory(false);
                  }}
                  className="comic-btn btn-equals px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                >
                  ✕ CLOSE
                </button>
              </div>
            </div>
            {history.length === 0 ? (
              <p className="font-mono text-xs text-muted-foreground py-6 text-center">
                No calculations yet. Go save the day!
              </p>
            ) : (
              <ul className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-1">
                {history.map((h, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      title="Click to recall result"
                      onClick={() => {
                        sfxKey();
                        setState({
                          ...C.initialState,
                          angleMode: state.angleMode,
                          display: h.result,
                          waiting: true,
                        });
                        setShowHistory(false);
                      }}
                      className="w-full rounded border border-ink bg-paper px-2 py-1 text-right font-mono hover:bg-paper-dark text-xs transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-[10px] text-muted-foreground">{h.expression} =</span>
                      <span className="text-sm font-bold text-ink">{h.result}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
