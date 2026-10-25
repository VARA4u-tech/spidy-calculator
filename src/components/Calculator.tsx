import { useCallback, useEffect, useState } from "react";
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

type Key = { label: string; aria: string; kind: "digit" | "blue" | "red" | "equals"; action: () => void; wide?: boolean; id: string };

export function Calculator() {
  const [state, setState] = useState<C.CalcState>(C.initialState);
  const [history, setHistory] = useState<C.HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    loadSoundPref();
    setMuted(isMuted());
  }, []);

  const apply = (fn: (s: C.CalcState) => C.CalcState) => setState((s) => fn(s));
  const doEquals = useCallback(() => {
    const { state: next, entry } = C.equals(state);
    setState(next);
    if (entry) setHistory((h) => [entry, ...h].slice(0, 20));
    if (next.error && !state.error) sfxError();
    else if (entry) sfxEquals();
  }, [state]);

  const op = (o: C.Operator) => () => {
    sfxOperator();
    apply((s) => C.chooseOperator(s, o));
  };
  const dig = (d: string) => () => {
    sfxKey();
    apply((s) => C.inputDigit(s, d));
  };

  const keys: Key[] = [
    { id: "AC", label: "AC", aria: "Clear all", kind: "red", action: () => { sfxClear(); setState(C.clearAll()); } },
    { id: "BS", label: "⌫", aria: "Backspace", kind: "blue", action: () => { sfxBackspace(); apply(C.backspace); } },
    { id: "%", label: "%", aria: "Percent", kind: "blue", action: () => { sfxToggle(); apply(C.percent); } },
    { id: "÷", label: "÷", aria: "Divide", kind: "red", action: op("÷") },
    ...["7", "8", "9"].map((d) => ({ id: d, label: d, aria: d, kind: "digit" as const, action: dig(d) })),
    { id: "×", label: "×", aria: "Multiply", kind: "red", action: op("×") },
    ...["4", "5", "6"].map((d) => ({ id: d, label: d, aria: d, kind: "digit" as const, action: dig(d) })),
    { id: "-", label: "−", aria: "Subtract", kind: "red", action: op("-") },
    ...["1", "2", "3"].map((d) => ({ id: d, label: d, aria: d, kind: "digit" as const, action: dig(d) })),
    { id: "+", label: "+", aria: "Add", kind: "red", action: op("+") },
    { id: "±", label: "±", aria: "Toggle sign", kind: "blue", action: () => { sfxToggle(); apply(C.toggleSign); } },
    { id: "0", label: "0", aria: "0", kind: "digit", action: dig("0") },
    { id: ".", label: ".", aria: "Decimal point", kind: "digit", action: () => { sfxKey(); apply(C.inputDecimal); } },
    { id: "=", label: "=", aria: "Equals", kind: "equals", action: doEquals },
  ];

  useEffect(() => {
    const map: Record<string, string> = { "*": "×", x: "×", "/": "÷", Enter: "=", "=": "=", Backspace: "BS", Escape: "AC", Delete: "AC", ",": "." };
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const id = map[e.key] ?? e.key;
      const k = keys.find((k) => k.id === id);
      if (!k) return;
      e.preventDefault();
      k.action();
      setPressed(id);
      window.setTimeout(() => setPressed((p) => (p === id ? null : p)), 120);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const cls = { digit: "btn-digit", blue: "btn-blue", red: "btn-red", equals: "btn-equals" };
  const len = state.display.length;
  const size = len > 13 ? "text-2xl min-[420px]:text-3xl sm:text-4xl" : len > 9 ? "text-3xl min-[420px]:text-4xl sm:text-5xl" : "text-4xl min-[420px]:text-5xl sm:text-6xl";

  return (
    <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:justify-center">
      <section aria-label="Calculator" className="panel relative mx-auto w-full max-w-md rounded-xl p-4 sm:p-6">
        <span aria-hidden className="font-comic halftone-red absolute -top-4 -right-3 z-10 grid h-12 w-12 rotate-12 place-items-center text-base text-primary-foreground sm:-top-6 sm:-right-5 sm:h-16 sm:w-16 sm:text-lg [clip-path:polygon(50%_0,61%_30%,95%_20%,72%_48%,100%_75%,65%_70%,50%_100%,38%_70%,4%_78%,28%_50%,6%_18%,40%_30%)] animate-wobble">
          POW
        </span>
        <div className="mb-5 rounded-lg border-4 border-ink bg-ink p-4 text-right shadow-[inset_0_0_0_3px_var(--hero-blue)]">
          <p className="min-h-6 truncate font-mono text-sm text-mustard" aria-label="Expression">{state.expression || "\u00a0"}</p>
          <output key={state.display} aria-live="polite" className={`font-comic block truncate text-paper animate-pop ${size}`}>
            {state.display}
          </output>
          {state.error && (
            <p role="alert" className="font-comic mt-2 inline-block animate-shake rounded border-2 border-paper bg-hero-red px-3 py-1 text-lg text-paper">
              ZAP! {state.error}
            </p>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          {keys.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-label={k.aria}
              data-pressed={pressed === k.id}
              onClick={k.action}
              className={`comic-btn ${cls[k.kind]} ${/^[0-9.]$|AC/.test(k.id) ? "" : "btn-symbol"} h-14 text-2xl min-[420px]:text-3xl sm:h-16 sm:text-4xl`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-2">
          <button type="button" aria-expanded={showHistory} aria-controls="history"
            onClick={() => { sfxToggle(); setShowHistory((v) => !v); }}
            className="comic-btn btn-blue px-4 py-1.5 text-lg">
            {showHistory ? "Hide history" : "Show history"} ({history.length})
          </button>
          <button type="button" aria-label={muted ? "Turn sound effects on" : "Turn sound effects off"}
            aria-pressed={!muted} onClick={() => { const next = toggleMuted(); setMuted(next); if (!next) sfxToggle(); }}
            className="comic-btn btn-blue px-3 py-1.5 text-lg" title={muted ? "Sound off" : "Sound on"}>
            {muted ? "🔇 SFX OFF" : "🔊 SFX ON"}
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-xs text-muted-foreground hidden sm:block">Keyboard ready</p>
      </section>

      <aside id="history" hidden={!showHistory} className="panel mx-auto w-full max-w-md -rotate-1 rounded-xl p-5 lg:mt-8">
        <div className="mb-3 flex items-center justify-between border-b-4 border-ink pb-2">
          <h2 className="font-comic text-3xl text-hero-blue">Case Files</h2>
          <button type="button" disabled={!history.length} onClick={() => setHistory([])}
            className="comic-btn btn-red px-3 py-1 text-base disabled:opacity-50">Clear</button>
        </div>
        {history.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">No calculations yet. Go save the day!</p>
        ) : (
          <ul className="max-h-96 space-y-2 overflow-auto">
            {history.map((h, i) => (
              <li key={i}>
                <button type="button" onClick={() => setState({ ...C.initialState, display: h.result, waiting: true })}
                  className="w-full rounded border-2 border-ink bg-paper px-3 py-2 text-right font-mono hover:bg-paper-dark focus-visible:outline-4 focus-visible:outline-hero-blue">
                  <span className="block text-xs text-muted-foreground">{h.expression} =</span>
                  <span className="text-lg font-bold">{h.result}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
