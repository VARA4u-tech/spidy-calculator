import { useCallback, useEffect, useRef, useState } from "react";
import * as C from "@/lib/calculator";
import {
  loadSoundPref,
  isMuted,
  toggleMuted,
  sfxKey,
  sfxBackspace,
  sfxOperator,
  sfxClear,
  sfxToggle,
  sfxEquals,
  sfxError,
} from "@/lib/sounds";

const HISTORY_STORAGE_KEY = "webslinger-calc-history";

function loadInitialHistory(): C.HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.slice(0, 20);
    }
  } catch {
    // Storage access unavailable
  }
  return [];
}

type Key = {
  id: string;
  label: string;
  aria: string;
  kind: "digit" | "blue" | "red" | "equals" | "sci";
  action: () => void;
  wide?: boolean;
};

export function Calculator() {
  const [state, setState] = useState<C.CalcState>(C.initialState);
  const [history, setHistory] = useState<C.HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const [mobileTab, setMobileTab] = useState<"basic" | "sci">("basic");

  useEffect(() => {
    loadSoundPref();
    setMuted(isMuted());
    setHistory(loadInitialHistory());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage quota or permission error
    }
  }, [history]);

  const apply = (fn: (s: C.CalcState) => C.CalcState) => setState((s) => fn(s));

  const doEquals = useCallback(() => {
    const { state: next, entry } = C.equals(state);
    setState(next);
    if (entry) setHistory((h) => [entry, ...h].slice(0, 20));
    if (next.error && !state.error) sfxError();
    else if (entry) sfxEquals();
  }, [state]);

  const copyResult = useCallback(async () => {
    if (state.error || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(state.display);
      sfxToggle();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard write failed
    }
  }, [state.display, state.error]);

  const op = (o: C.Operator) => () => {
    sfxOperator();
    apply((s) => C.chooseOperator(s, o));
  };

  const dig = (d: string) => () => {
    sfxKey();
    apply((s) => C.inputDigit(s, d));
  };

  const sci = (fn: C.ScientificFunc) => () => {
    sfxOperator();
    apply((s) => C.applyScientific(s, fn));
  };

  const constant = (name: "pi" | "e") => () => {
    sfxKey();
    apply((s) => C.inputConstant(s, name));
  };

  const toggleAngle = () => {
    sfxToggle();
    apply((s) => C.toggleAngleMode(s));
  };

  // Basic Keypad Keys
  const basicKeys: Key[] = [
    { id: "AC", label: "AC", aria: "Clear all", kind: "red", action: () => { sfxClear(); setState(C.clearAll(state)); } },
    { id: "BS", label: "⌫", aria: "Backspace", kind: "blue", action: () => { sfxBackspace(); apply(C.backspace); } },
    { id: "%", label: "%", aria: "Percent", kind: "blue", action: () => { sfxToggle(); apply(C.percent); } },
    { id: "÷", label: "÷", aria: "Divide", kind: "red", action: op("÷") },
    ...["7", "8", "9"].map((d) => ({ id: d, label: d, aria: d, kind: "digit" as const, action: dig(d) })),
    { id: "×", label: "×", aria: "Multiply", kind: "red", action: op("×") },
    ...["4", "5", "6"].map((d) => ({ id: d, label: d, aria: d, kind: "digit" as const, action: dig(d) })),
    { id: "-", label: "−", aria: "Subtract", kind: "red", action: op("-") },
    ...["1", "2", "3"].map((d) => ({ id: d, label: d, aria: d, kind: "digit" as const, action: dig(d) })),
    { id: "+", label: "+", aria: "Add", kind: "red", action: op("+") },
    {
      id: "sci_mode",
      label: isScientific ? "123 BASIC" : "⚡ SCI-MODE",
      aria: isScientific ? "Switch to basic mode" : "Switch to scientific mode",
      kind: "sci",
      action: () => {
        sfxToggle();
        setIsScientific((v) => !v);
      },
    },
    { id: "0", label: "0", aria: "0", kind: "digit", action: dig("0") },
    { id: ".", label: ".", aria: "Decimal point", kind: "digit", action: () => { sfxKey(); apply(C.inputDecimal); } },
    { id: "=", label: "=", aria: "Equals", kind: "equals", action: doEquals },
  ];

  // Scientific Keypad Keys (5 rows x 5 columns)
  const sciKeys: Key[] = [
    // Row 1: Primary Trig & Constants
    { id: "sin", label: "sin", aria: "Sine", kind: "blue", action: sci("sin") },
    { id: "cos", label: "cos", aria: "Cosine", kind: "blue", action: sci("cos") },
    { id: "tan", label: "tan", aria: "Tangent", kind: "blue", action: sci("tan") },
    { id: "pi", label: "π", aria: "Pi constant", kind: "digit", action: constant("pi") },
    { id: "e", label: "e", aria: "Euler's constant", kind: "digit", action: constant("e") },

    // Row 2: Inverse Trig & Powers/Roots
    { id: "asin", label: "sin⁻¹", aria: "Inverse sine", kind: "blue", action: sci("asin") },
    { id: "acos", label: "cos⁻¹", aria: "Inverse cosine", kind: "blue", action: sci("acos") },
    { id: "atan", label: "tan⁻¹", aria: "Inverse tangent", kind: "blue", action: sci("atan") },
    { id: "pow", label: "xʸ", aria: "Power (x^y)", kind: "red", action: op("^") },
    { id: "sqrt", label: "√x", aria: "Square root", kind: "blue", action: sci("sqrt") },

    // Row 3: Hyperbolic Trig & Powers
    { id: "sinh", label: "sinh", aria: "Hyperbolic sine", kind: "blue", action: sci("sinh") },
    { id: "cosh", label: "cosh", aria: "Hyperbolic cosine", kind: "blue", action: sci("cosh") },
    { id: "tanh", label: "tanh", aria: "Hyperbolic tangent", kind: "blue", action: sci("tanh") },
    { id: "sqr", label: "x²", aria: "Square (x squared)", kind: "blue", action: sci("sqr") },
    { id: "cube", label: "x³", aria: "Cube (x cubed)", kind: "blue", action: sci("cube") },

    // Row 4: Logarithms & Exponential
    { id: "log", label: "log", aria: "Common logarithm (base 10)", kind: "blue", action: sci("log") },
    { id: "ln", label: "ln", aria: "Natural logarithm", kind: "blue", action: sci("ln") },
    { id: "pow10", label: "10ˣ", aria: "10 to power x", kind: "blue", action: sci("pow10") },
    { id: "exp", label: "eˣ", aria: "e to power x", kind: "blue", action: sci("exp") },
    { id: "cbrt", label: "∛x", aria: "Cube root", kind: "blue", action: sci("cbrt") },

    // Row 5: Factorial, Reciprocal, Absolute Value, Mode
    { id: "fact", label: "n!", aria: "Factorial", kind: "blue", action: sci("fact") },
    { id: "recip", label: "1/x", aria: "Reciprocal", kind: "blue", action: sci("recip") },
    { id: "abs", label: "|x|", aria: "Absolute value", kind: "blue", action: sci("abs") },
    { id: "pm", label: "±", aria: "Toggle sign", kind: "blue", action: () => { sfxToggle(); apply(C.toggleSign); } },
  ];

  const allKeys = [...basicKeys, ...sciKeys];
  const keysRef = useRef(allKeys);
  keysRef.current = allKeys;
  const copyRef = useRef(copyResult);
  copyRef.current = copyResult;

  useEffect(() => {
    const map: Record<string, string> = {
      "*": "×",
      x: "×",
      "/": "÷",
      Enter: "=",
      "=": "=",
      Backspace: "BS",
      Escape: "AC",
      Delete: "AC",
      ",": ".",
      "^": "pow",
      "!": "fact",
      p: "pi",
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c" && !window.getSelection()?.toString()) {
        e.preventDefault();
        copyRef.current();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const id = map[e.key] ?? e.key;
      const k = keysRef.current.find((item) => item.id === id);
      if (!k) return;
      e.preventDefault();
      k.action();
      setPressed(id);
      window.setTimeout(() => setPressed((p) => (p === id ? null : p)), 120);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cls: Record<Key["kind"], string> = {
    digit: "btn-digit",
    blue: "btn-blue",
    red: "btn-red",
    equals: "btn-equals",
    sci: "btn-sci",
  };
  const len = state.display.length;
  const size = len > 13 ? "text-2xl sm:text-3xl" : len > 9 ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl";

  return (
    <div className={`grid w-full gap-4 md:gap-6 ${isScientific ? "max-w-5xl lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]" : "max-w-4xl lg:grid-cols-[minmax(0,26.5rem)_1fr]"} lg:items-start lg:justify-center`}>
      <section
        aria-label="Calculator"
        className={`panel relative mx-auto w-full rounded-xl p-3 sm:p-4.5 transition-all duration-200 ${
          isScientific ? "max-w-3xl" : "max-w-[26.5rem]"
        }`}
      >
        <span
          aria-hidden
          className="font-comic halftone-red absolute -top-3.5 -right-2.5 z-10 grid h-11 w-11 rotate-12 place-items-center text-xs text-primary-foreground sm:-top-4 sm:-right-3 sm:h-14 sm:w-14 sm:text-base [clip-path:polygon(50%_0,61%_30%,95%_20%,72%_48%,100%_75%,65%_70%,50%_100%,38%_70%,4%_78%,28%_50%,6%_18%,40%_30%)] animate-wobble"
        >
          {isScientific ? "SCI" : "POW"}
        </span>

        {/* Display Bezel */}
        <div className="mb-3 rounded-lg border-3 border-ink bg-ink p-2.5 sm:p-3.5 shadow-[inset_0_0_0_3px_var(--hero-blue)]">
          <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-paper/15 pb-1.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={copyResult}
                aria-label="Copy current calculation result"
                className={`inline-flex items-center gap-1 rounded border-2 border-ink px-2 py-0.5 font-mono text-[10px] sm:text-xs font-bold tracking-wider transition-all duration-150 active:scale-95 ${
                  copied
                    ? "bg-mustard text-ink shadow-[2px_2px_0_var(--ink)]"
                    : "bg-hero-blue text-paper shadow-[2px_2px_0_var(--ink)] hover:brightness-110"
                }`}
                title="Copy result (Ctrl+C)"
              >
                <span aria-hidden>{copied ? "✓" : "📋"}</span>
                <span>{copied ? "COPIED!" : "COPY"}</span>
              </button>

              <button
                type="button"
                onClick={toggleAngle}
                className="rounded border border-paper/30 bg-ink px-1.5 py-0.5 font-mono text-[10px] font-bold text-mustard hover:border-mustard"
                title={`Switch to ${state.angleMode === "deg" ? "Radians (RAD)" : "Degrees (DEG)"}`}
              >
                {state.angleMode.toUpperCase()}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-comic text-[11px] sm:text-xs tracking-wider text-mustard bg-navy/80 px-2 py-0.5 rounded border border-ink">
                {isScientific ? "MODE: SCI-TECH" : "MODE: BASIC"}
              </span>

              <p className="min-h-5 max-w-[14rem] truncate text-right font-mono text-xs text-mustard sm:text-sm" aria-label="Expression">
                {state.expression || "\u00a0"}
              </p>
            </div>
          </div>

          <output
            key={state.display}
            aria-live="polite"
            onClick={copyResult}
            title="Click to copy result"
            className={`font-comic block cursor-pointer truncate text-right text-paper transition-opacity hover:opacity-95 active:opacity-80 animate-pop ${size}`}
          >
            {state.display}
          </output>

          {state.error && (
            <div className="text-right">
              <p role="alert" className="font-comic mt-1 inline-block animate-shake rounded border-2 border-paper bg-hero-red px-2 py-0.5 text-xs text-paper">
                ZAP! {state.error}
              </p>
            </div>
          )}
        </div>

        {/* Mobile Tab Switcher when Scientific mode is active */}
        {isScientific && (
          <div className="mb-2.5 flex gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileTab("basic")}
              className={`flex-1 rounded border-2 border-ink py-1 font-comic text-sm ${
                mobileTab === "basic" ? "bg-mustard text-ink font-bold shadow-[2px_2px_0_var(--ink)]" : "bg-paper text-ink"
              }`}
            >
              123 NUMBERS
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("sci")}
              className={`flex-1 rounded border-2 border-ink py-1 font-comic text-sm ${
                mobileTab === "sci" ? "bg-mustard text-ink font-bold shadow-[2px_2px_0_var(--ink)]" : "bg-paper text-ink"
              }`}
            >
              ƒ(x) SCI-MATH
            </button>
          </div>
        )}

        {/* Keypad Container */}
        {isScientific ? (
          <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-3 sm:gap-3.5">
            {/* Scientific Deck (5 columns x 5 rows) */}
            <div className={`grid grid-cols-5 gap-1.5 sm:gap-2 ${mobileTab === "sci" ? "block" : "hidden md:grid"}`}>
              {sciKeys.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  aria-label={k.aria}
                  data-pressed={pressed === k.id}
                  onClick={k.action}
                  className={`comic-btn ${cls[k.kind]} btn-symbol h-11 text-sm min-[400px]:text-base sm:h-12 sm:text-base`}
                >
                  {k.label}
                </button>
              ))}
            </div>

            {/* Standard Number Deck (4 columns x 5 rows) */}
            <div className={`grid grid-cols-4 gap-1.5 sm:gap-2 ${mobileTab === "basic" ? "block" : "hidden md:grid"}`}>
              {basicKeys.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  aria-label={k.aria}
                  data-pressed={pressed === k.id}
                  onClick={k.action}
                  className={`comic-btn ${cls[k.kind]} ${
                    k.id === "sci_mode"
                      ? "text-[11px] min-[400px]:text-xs sm:text-sm font-comic font-black tracking-wider text-ink"
                      : /^[0-9.]$|AC/.test(k.id)
                      ? "text-lg min-[400px]:text-xl sm:text-2xl"
                      : "btn-symbol text-lg min-[400px]:text-xl sm:text-2xl"
                  } h-11 min-[400px]:h-12 sm:h-12 flex items-center justify-center`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Standard 4-Column Keypad */
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {basicKeys.map((k) => (
              <button
                key={k.id}
                type="button"
                aria-label={k.aria}
                data-pressed={pressed === k.id}
                onClick={k.action}
                className={`comic-btn ${cls[k.kind]} ${
                  k.id === "sci_mode"
                    ? "text-xs min-[400px]:text-sm sm:text-base font-comic font-black tracking-wider text-ink"
                    : /^[0-9.]$|AC/.test(k.id)
                    ? "text-xl min-[400px]:text-2xl sm:text-3xl"
                    : "btn-symbol text-xl min-[400px]:text-2xl sm:text-3xl"
                } h-12 min-[400px]:h-13 sm:h-13.5 flex items-center justify-center`}
              >
                {k.label}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Utility Actions: Balanced 2-Column Grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            type="button"
            aria-expanded={showHistory}
            aria-controls="history"
            onClick={() => { sfxToggle(); setShowHistory((v) => !v); }}
            className="comic-btn btn-blue flex items-center justify-center gap-1.5 py-2 text-xs min-[400px]:text-sm sm:text-base"
          >
            <span>{showHistory ? "HIDE LOG" : "CASE FILES"}</span>
            <span className="halftone-red rounded border border-ink px-1.5 py-0.5 text-[10px] sm:text-xs font-mono text-paper">
              {history.length}
            </span>
          </button>

          <button
            type="button"
            aria-label={muted ? "Turn sound effects on" : "Turn sound effects off"}
            aria-pressed={!muted}
            onClick={() => { const next = toggleMuted(); setMuted(next); if (!next) sfxToggle(); }}
            className="comic-btn btn-blue flex items-center justify-center gap-1.5 py-2 text-xs min-[400px]:text-sm sm:text-base"
            title={muted ? "Sound off" : "Sound on"}
          >
            <span>{muted ? "🔇" : "🔊"}</span>
            <span>{muted ? "SFX OFF" : "SFX ON"}</span>
          </button>
        </div>

        <p className="mt-2 text-center font-mono text-[10px] sm:text-[11px] text-ink/70">
          ⌨️ Keyboard ready · Enter for =, Esc for AC, ^ for power, ! for n!, Ctrl+C to copy
        </p>
      </section>

      {/* Case Files Panel */}
      <aside
        id="history"
        hidden={!showHistory}
        className="panel mx-auto flex w-full max-w-[26.5rem] flex-col -rotate-1 rounded-xl p-3.5 sm:p-4 lg:mt-0 max-h-[480px]"
      >
        <div className="mb-2.5 flex items-center justify-between border-b-2 border-ink pb-2">
          <h2 className="font-comic text-2xl text-hero-blue">Case Files</h2>
          <button
            type="button"
            disabled={!history.length}
            onClick={() => { sfxToggle(); setHistory([]); }}
            className="comic-btn btn-red px-2.5 py-0.5 text-xs sm:text-sm disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {history.length === 0 ? (
          <p className="font-mono text-xs sm:text-sm text-muted-foreground py-6 text-center">
            No calculations yet. Go save the day!
          </p>
        ) : (
          <ul className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            {history.map((h, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => { sfxKey(); setState({ ...C.initialState, angleMode: state.angleMode, display: h.result, waiting: true }); }}
                  className="w-full rounded border-2 border-ink bg-paper px-2.5 py-1.5 text-right font-mono hover:bg-paper-dark focus-visible:outline-2 focus-visible:outline-hero-blue transition-colors"
                >
                  <span className="block text-[10px] sm:text-xs text-muted-foreground">{h.expression} =</span>
                  <span className="text-base sm:text-lg font-bold">{h.result}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
