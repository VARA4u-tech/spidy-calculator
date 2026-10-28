import { useState } from "react";
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
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
  copied: boolean;
  copyResult: () => Promise<void>;
  toggleAngle: () => void;
  onCloseSci: () => void;
  sciKeys: Key[];
  basicKeys: Key[];
  pressed: string | null;
  cls: Record<string, string>;
}

export function MobileSciCalculator({
  state,
  setState,
  history,
  setHistory,
  showHistory,
  setShowHistory,
  muted,
  setMuted,
  copied,
  copyResult,
  toggleAngle,
  onCloseSci,
  sciKeys,
  basicKeys,
  pressed,
  cls,
}: MobileSciCalculatorProps) {
  // Mobile orientation: horizontal (landscape) by default as requested, with toggle to upright
  const [isRotated, setIsRotated] = useState(true);

  return (
    <div
      className={
        isRotated
          ? "sci-mobile-wrapper-rotated"
          : "sci-mobile-wrapper-upright"
      }
    >
      <section
        aria-label="Mobile Scientific Calculator"
        className={
          isRotated
            ? "relative w-full h-full flex flex-col justify-between overflow-hidden"
            : "sci-mobile-panel panel relative rounded-xl border-3 border-ink bg-paper p-1.5 shadow-[6px_6px_0_0_var(--ink)] flex flex-col justify-between overflow-hidden"
        }
      >
        {/* Decorative Comic Badge */}
        <span
          aria-hidden
          className="font-comic halftone-red absolute -top-3 -right-2 z-20 grid h-7 w-7 rotate-12 place-items-center text-[9px] text-primary-foreground [clip-path:polygon(50%_0,61%_30%,95%_20%,72%_48%,100%_75%,65%_70%,50%_100%,38%_70%,4%_78%,28%_50%,6%_18%,40%_30%)] animate-wobble pointer-events-none"
        >
          SCI
        </span>

        {/* Top Navigation & Control Bar */}
        <header className="flex items-center justify-between gap-1 pb-1 mb-0.5 border-b border-ink/30 shrink-0 select-none">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Link
              to="/"
              className="comic-btn btn-blue py-0.5 px-1.5 text-[10px] inline-flex items-center gap-0.5"
              aria-label="Back to Home"
            >
              <span aria-hidden>◀</span>
              <span>HOME</span>
            </Link>
            <span className="font-comic text-[11px] text-hero-blue tracking-wide hidden min-[340px]:inline">
              SPIDY <span className="text-hero-red">SCI-TECH</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Case Files Toggle */}
            <button
              type="button"
              aria-expanded={showHistory}
              onClick={() => {
                sfxToggle();
                setShowHistory((v) => !v);
              }}
              className="comic-btn btn-blue py-0.5 px-1.5 text-[10px] inline-flex items-center gap-1"
            >
              <span>{showHistory ? "CLOSE" : "LOG"}</span>
              <span className="halftone-red rounded border border-ink px-1 text-[9px] font-mono text-paper">
                {history.length}
              </span>
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              onClick={() => {
                sfxToggle();
                setMuted(!muted);
              }}
              className="comic-btn btn-blue py-0.5 px-1 text-[10px] inline-flex items-center"
              title={muted ? "Sound off" : "Sound on"}
            >
              <span>{muted ? "🔇" : "🔊"}</span>
            </button>

            {/* Horizontal / Upright Orientation Toggle */}
            <button
              type="button"
              onClick={() => {
                sfxToggle();
                setIsRotated((v) => !v);
              }}
              className="comic-btn btn-blue py-0.5 px-1.5 text-[10px] font-bold"
              title={isRotated ? "Switch to upright view" : "Turn horizontally"}
            >
              <span>{isRotated ? "📱 UPRIGHT" : "📐 HORIZ"}</span>
            </button>

            {/* Switch back to basic calculator */}
            <button
              type="button"
              onClick={onCloseSci}
              className="comic-btn btn-red py-0.5 px-2 text-[10px] font-bold"
              title="Switch back to basic calculator"
            >
              123 BASIC
            </button>
          </div>
        </header>

        {/* Compact Display Bezel */}
        <div className="rounded-lg border-2 border-ink bg-ink p-1 sm:p-1.5 shadow-[inset_0_0_0_2px_var(--hero-blue)] shrink-0 mb-1 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 border-b border-paper/15 pb-0.5 mb-0.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={copyResult}
                aria-label="Copy result"
                className={`inline-flex items-center gap-0.5 rounded border border-ink px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                  copied
                    ? "bg-mustard text-ink"
                    : "bg-hero-blue text-paper hover:brightness-110"
                }`}
              >
                <span aria-hidden>{copied ? "✓" : "📋"}</span>
                <span>{copied ? "COPIED" : "COPY"}</span>
              </button>

              <button
                type="button"
                onClick={toggleAngle}
                className="rounded border border-paper/30 bg-ink px-1.5 py-0.5 font-mono text-[9px] font-bold text-mustard hover:border-mustard"
                title={`Angle Mode: ${state.angleMode.toUpperCase()}`}
              >
                {state.angleMode.toUpperCase()}
              </button>

              <span className="font-comic text-[9px] text-paper/60 uppercase ml-1 hidden min-[360px]:inline">
                ⚡ SCIENTIFIC
              </span>
            </div>

            <p className="min-h-4 max-w-[200px] truncate text-right font-mono text-[10px] text-mustard">
              {state.expression || "\u00a0"}
            </p>
          </div>

          <output
            key={state.display}
            aria-live="polite"
            onClick={copyResult}
            title="Click to copy result"
            className="font-comic block cursor-pointer truncate text-right text-paper text-2xl min-[360px]:text-3xl animate-pop leading-tight select-all py-0.5"
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

        {/* Keypad Grid: 9 Columns x 5 Rows (Fills all remaining height) */}
        <div className="flex-1 min-h-0 flex gap-1">
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
                  <span className="select-none leading-none truncate">{k.label}</span>
                </button>
              );
            })}
          </div>

          {/* Comic Divider */}
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

        {/* Case Files Overlay Modal */}
        {showHistory && (
          <div className="absolute inset-1.5 sm:inset-2 z-50 rounded-xl border-3 border-ink bg-paper p-2 shadow-[6px_6px_0_0_var(--ink)] flex flex-col animate-pop">
            <div className="flex items-center justify-between border-b-2 border-ink pb-1 mb-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-comic text-base text-hero-blue">Case Files History</h2>
                <span className="halftone-red rounded border border-ink px-1 text-[10px] font-mono text-paper">
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
                  className="comic-btn btn-red px-2 py-0.5 text-[10px] disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfxToggle();
                    setShowHistory(false);
                  }}
                  className="comic-btn btn-equals px-2 py-0.5 text-[10px] font-bold"
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
                      className="w-full rounded border border-ink bg-paper px-2 py-1 text-right font-mono hover:bg-paper-dark text-xs transition-colors flex items-center justify-between"
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
