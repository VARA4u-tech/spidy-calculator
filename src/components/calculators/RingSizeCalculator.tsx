import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type PointerEvent,
  type TouchEvent,
  type KeyboardEvent,
} from "react";
import {
  RING_SIZE_CHART,
  convertRingSizeByDiameter,
  convertRingSizeByCircumference,
  formatRingSizeSummary,
  type RingSizeRow,
} from "@/lib/everyday";
import { playClickSound } from "@/lib/sounds";
import {
  CircleDot,
  Ruler,
  Check,
  Copy,
  ChevronUp,
  ChevronDown,
  GripHorizontal,
} from "lucide-react";

const PREVIEW_SCALE_PX_PER_MM = 4.2;
const PREVIEW_MIN_PX = 28;
const PREVIEW_MAX_PX = 210;

export function RingSizeCalculator() {
  const [inputMode, setInputMode] = useState<"diameter" | "circumference">("diameter");
  const [diameterVal, setDiameterVal] = useState<string>("17.3"); // Size 7 default
  const [circumferenceVal, setCircumferenceVal] = useState<string>("54.4");
  const [selectedRow, setSelectedRow] = useState<RingSizeRow>(
    () => RING_SIZE_CHART[8] ?? (RING_SIZE_CHART[0] as RingSizeRow),
  ); // US 7
  const [copied, setCopied] = useState<boolean>(false);

  // Swipe sidebar state
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [swipeDirection, setSwipeDirection] = useState<"up" | "down" | null>(null);

  const activeMm = inputMode === "diameter" ? selectedRow.diameterMm : selectedRow.circumferenceMm;
  const activeMmRef = useRef<number>(activeMm);
  activeMmRef.current = activeMm;

  const inputModeRef = useRef<"diameter" | "circumference">(inputMode);
  inputModeRef.current = inputMode;

  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    startValue: number;
    lastAppliedValue: number;
  } | null>(null);

  const lastSoundTimeRef = useRef<number>(0);
  const holdTimeoutRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);
  const pointerButtonHandledRef = useRef<boolean>(false);
  const pointerResetTimerRef = useRef<number | null>(null);

  const clearHoldTimers = useCallback(() => {
    if (holdTimeoutRef.current !== null) {
      window.clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current !== null) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearHoldTimers();
      if (pointerResetTimerRef.current !== null) {
        window.clearTimeout(pointerResetTimerRef.current);
      }
    };
  }, [clearHoldTimers]);

  const applyAbsoluteMeasurement = useCallback((nextVal: number) => {
    const mode = inputModeRef.current;
    const minVal = mode === "diameter" ? 0.1 : 0.3;
    const safeVal = Math.max(minVal, Number(nextVal.toFixed(1)));
    activeMmRef.current = safeVal;

    if (mode === "diameter") {
      const match = convertRingSizeByDiameter(safeVal);
      setSelectedRow(match);
      setDiameterVal(safeVal.toString());
      setCircumferenceVal(match.circumferenceMm.toString());
    } else {
      const match = convertRingSizeByCircumference(safeVal);
      setSelectedRow(match);
      setCircumferenceVal(safeVal.toString());
      setDiameterVal(match.diameterMm.toString());
    }
  }, []);

  const stepMeasurement = useCallback(
    (delta: number) => {
      const nextVal = activeMmRef.current + delta;
      applyAbsoluteMeasurement(nextVal);
    },
    [applyAbsoluteMeasurement],
  );

  const startHoldAdjust = (direction: 1 | -1) => {
    clearHoldTimers();
    if (pointerResetTimerRef.current !== null) {
      window.clearTimeout(pointerResetTimerRef.current);
    }
    pointerButtonHandledRef.current = true;
    playClickSound();
    const baseStep = inputModeRef.current === "diameter" ? 0.1 : 0.2;
    stepMeasurement(direction * baseStep);

    let holdTicks = 0;
    holdTimeoutRef.current = window.setTimeout(() => {
      holdIntervalRef.current = window.setInterval(() => {
        holdTicks += 1;
        // Gently accelerate when holding for large unbounded sweeps
        const multiplier = holdTicks > 25 ? 5 : holdTicks > 10 ? 2 : 1;
        stepMeasurement(direction * baseStep * multiplier);
        const now = Date.now();
        if (now - lastSoundTimeRef.current >= 60) {
          lastSoundTimeRef.current = now;
          playClickSound();
        }
      }, 65);
    }, 320);
  };

  const stopHoldAdjust = () => {
    clearHoldTimers();
    if (pointerResetTimerRef.current !== null) {
      window.clearTimeout(pointerResetTimerRef.current);
    }
    pointerResetTimerRef.current = window.setTimeout(() => {
      pointerButtonHandledRef.current = false;
      pointerResetTimerRef.current = null;
    }, 100);
  };

  const handleButtonClickAdjust = (direction: 1 | -1) => {
    if (pointerButtonHandledRef.current) {
      pointerButtonHandledRef.current = false;
      return;
    }
    playClickSound();
    const baseStep = inputModeRef.current === "diameter" ? 0.1 : 0.2;
    stepMeasurement(direction * baseStep);
  };

  const handleSwipePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    const pointerId = typeof e.pointerId === "number" ? e.pointerId : 1;
    const clientY = typeof e.clientY === "number" && Number.isFinite(e.clientY) ? e.clientY : 0;
    try {
      e.currentTarget.setPointerCapture(pointerId);
    } catch {
      // Synthetic events in tests may not support pointer capture
    }
    const startValue = activeMmRef.current;
    dragRef.current = {
      pointerId,
      startY: clientY,
      startValue,
      lastAppliedValue: startValue,
    };
    setIsSwiping(true);
    setSwipeDirection(null);
  };

  const handleSwipePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const pointerId = typeof e.pointerId === "number" ? e.pointerId : 1;
    if (!drag || drag.pointerId !== pointerId) return;
    const clientY =
      typeof e.clientY === "number" && Number.isFinite(e.clientY) ? e.clientY : drag.startY;

    // Swiping UP (smaller clientY) increases ring size; swiping DOWN decreases it
    const deltaY = drag.startY - clientY;
    const pixelsPerTenth = inputModeRef.current === "diameter" ? 5 : 3;
    const steps = Math.round(deltaY / pixelsPerTenth);
    const minVal = inputModeRef.current === "diameter" ? 0.1 : 0.3;
    const nextVal = Math.max(minVal, Number((drag.startValue + steps * 0.1).toFixed(1)));

    if (nextVal !== drag.lastAppliedValue) {
      setSwipeDirection(nextVal > drag.lastAppliedValue ? "up" : "down");
      drag.lastAppliedValue = nextVal;
      applyAbsoluteMeasurement(nextVal);

      const now = Date.now();
      if (now - lastSoundTimeRef.current >= 45) {
        lastSoundTimeRef.current = now;
        playClickSound();
      }
    }
  };

  const handleSwipePointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const pointerId = typeof e.pointerId === "number" ? e.pointerId : 1;
    if (!drag || drag.pointerId !== pointerId) return;
    dragRef.current = null;
    setIsSwiping(false);
    setSwipeDirection(null);
    try {
      if (e.currentTarget.hasPointerCapture(pointerId)) {
        e.currentTarget.releasePointerCapture(pointerId);
      }
    } catch {
      // Safe fallback
    }
  };

  // Fallback touch handlers only when PointerEvent is unavailable (e.g. legacy WebViews)
  const handleSwipeTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && "PointerEvent" in window) return;
    const touch = e.touches[0];
    if (!touch) return;
    const startValue = activeMmRef.current;
    dragRef.current = {
      pointerId: touch.identifier ?? 1,
      startY: touch.clientY,
      startValue,
      lastAppliedValue: startValue,
    };
    setIsSwiping(true);
    setSwipeDirection(null);
  };

  const handleSwipeTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && "PointerEvent" in window) return;
    const drag = dragRef.current;
    const touch = e.touches[0];
    if (!drag || !touch) return;

    const deltaY = drag.startY - touch.clientY;
    const pixelsPerTenth = inputModeRef.current === "diameter" ? 5 : 3;
    const steps = Math.round(deltaY / pixelsPerTenth);
    const minVal = inputModeRef.current === "diameter" ? 0.1 : 0.3;
    const nextVal = Math.max(minVal, Number((drag.startValue + steps * 0.1).toFixed(1)));

    if (nextVal !== drag.lastAppliedValue) {
      setSwipeDirection(nextVal > drag.lastAppliedValue ? "up" : "down");
      drag.lastAppliedValue = nextVal;
      applyAbsoluteMeasurement(nextVal);
    }
  };

  const handleSwipeTouchEnd = () => {
    if (typeof window !== "undefined" && "PointerEvent" in window) return;
    dragRef.current = null;
    setIsSwiping(false);
    setSwipeDirection(null);
  };

  const handleSwipeKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 1.0 : 0.1;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      playClickSound();
      stepMeasurement(step);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      playClickSound();
      stepMeasurement(-step);
    } else if (e.key === "PageUp") {
      e.preventDefault();
      playClickSound();
      stepMeasurement(1.0);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      playClickSound();
      stepMeasurement(-1.0);
    }
  };

  const handleCopyConversion = async () => {
    playClickSound();
    const summary = formatRingSizeSummary(selectedRow);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = summary;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDiameterChange = (valStr: string) => {
    setDiameterVal(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const match = convertRingSizeByDiameter(num);
      setSelectedRow(match);
      setCircumferenceVal(match.circumferenceMm.toString());
    }
  };

  const handleCircumferenceChange = (valStr: string) => {
    setCircumferenceVal(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const match = convertRingSizeByCircumference(num);
      setSelectedRow(match);
      setDiameterVal(match.diameterMm.toString());
    }
  };

  const handleSelectRow = (row: RingSizeRow) => {
    playClickSound();
    setSelectedRow(row);
    setDiameterVal(row.diameterMm.toString());
    setCircumferenceVal(row.circumferenceMm.toString());
  };

  const rawCirclePx = Math.round(selectedRow.diameterMm * PREVIEW_SCALE_PX_PER_MM);
  const clampedCirclePx = Math.min(PREVIEW_MAX_PX, Math.max(PREVIEW_MIN_PX, rawCirclePx));
  const isPreviewClamped = rawCirclePx > PREVIEW_MAX_PX || rawCirclePx < PREVIEW_MIN_PX;

  const badgeSizeClass = (val: string | number) =>
    String(val).length > 4
      ? "text-xl sm:text-2xl font-black break-all"
      : "text-2xl sm:text-4xl font-black";

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl overflow-hidden space-y-4 sm:space-y-6">
      {/* Mode Selector */}
      <div className="grid grid-cols-1 gap-2 border-b-4 border-ink pb-4 sm:grid-cols-2">
        {[
          { id: "diameter", label: "BY DIAMETER (MM)", icon: CircleDot },
          { id: "circumference", label: "BY CIRCUMFERENCE (MM)", icon: Ruler },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = inputMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playClickSound();
                setInputMode(tab.id as "diameter" | "circumference");
              }}
              className={`inline-flex min-h-11 min-w-0 w-full items-center justify-center gap-1.5 rounded-xl border-3 border-ink px-3 py-2 text-center font-comic text-[11px] font-bold leading-tight tracking-wide transition-all min-[380px]:text-xs sm:px-4 sm:text-sm ${
                isActive
                  ? "bg-mustard text-ink shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
                  : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="min-w-0 whitespace-normal">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Measurement Converter Panel */}
      <div className="comic-panel w-full min-w-0 max-w-full overflow-hidden space-y-5 rounded-2xl border-4 border-ink bg-paper p-3 shadow-[4px_4px_0_0_var(--ink)] sm:space-y-6 sm:p-6 sm:shadow-[6px_6px_0_0_var(--ink)]">
        <div className="border-b-2 border-dashed border-ink/20 pb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-comic text-xl font-bold leading-tight text-ink sm:text-2xl">
              INTERNATIONAL RING SIZING
            </h2>
            <p className="font-body text-xs text-ink/70">
              Swipe UP/DOWN on the right ruler sidebar or enter any value — zero size limits.
            </p>
          </div>
          {selectedRow.isCustom && (
            <span className="inline-block self-start rounded-full border-2 border-ink bg-mustard px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink shadow-[1px_1px_0_var(--ink)]">
              UNLIMITED CUSTOM SIZE
            </span>
          )}
        </div>

        {/* Workspace Grid: Controls + Cards + Visualizer (Left) | Vertical Swipe Sidebar (Right) */}
        <div className="grid grid-cols-[minmax(0,1fr)_76px] min-[400px]:grid-cols-[minmax(0,1fr)_88px] sm:grid-cols-[minmax(0,1fr)_116px] gap-2.5 sm:gap-5 items-stretch">
          {/* LEFT WORKSPACE */}
          <div className="min-w-0 space-y-4 sm:space-y-5">
            {/* Unlimited Numeric Input */}
            <div className="w-full min-w-0">
              {inputMode === "diameter" ? (
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink flex items-center justify-between gap-2">
                    <span>Inside Diameter (mm)</span>
                    <span className="hidden min-[440px]:inline font-mono text-[10px] text-ink/60">
                      CIRC: {selectedRow.circumferenceMm} mm
                    </span>
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={diameterVal}
                      onChange={(e) => handleDiameterChange(e.target.value)}
                      className="w-full rounded-xl border-3 border-ink bg-parchment pl-3 pr-11 py-2.5 sm:pl-4 sm:pr-12 sm:py-3 font-mono text-lg sm:text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:ring-2 focus:ring-hero-blue"
                    />
                    <span className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 font-comic text-xs font-black text-ink select-none">
                      MM
                    </span>
                  </div>
                </label>
              ) : (
                <label className="block space-y-1">
                  <span className="font-comic text-xs font-bold uppercase text-ink flex items-center justify-between gap-2">
                    <span>Inside Circumference (mm)</span>
                    <span className="hidden min-[440px]:inline font-mono text-[10px] text-ink/60">
                      DIA: {selectedRow.diameterMm} mm
                    </span>
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.3"
                      value={circumferenceVal}
                      onChange={(e) => handleCircumferenceChange(e.target.value)}
                      className="w-full rounded-xl border-3 border-ink bg-parchment pl-3 pr-11 py-2.5 sm:pl-4 sm:pr-12 sm:py-3 font-mono text-lg sm:text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none focus:ring-2 focus:ring-hero-blue"
                    />
                    <span className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 font-comic text-xs font-black text-ink select-none">
                      MM
                    </span>
                  </div>
                </label>
              )}
            </div>

            {/* International Conversions Banner & 4 Standard Cards */}
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
                    ACTIVE CONVERSION STANDARDS
                  </span>
                  <p className="break-words font-mono text-[11px] text-ink/70">
                    US {selectedRow.us} | UK {selectedRow.uk} | EU {selectedRow.eu} | JP{" "}
                    {selectedRow.jp} | {selectedRow.diameterMm} mm
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyConversion}
                  className={`comic-btn ${
                    copied ? "btn-equals bg-emerald-600 text-paper" : "btn-yellow text-ink"
                  } inline-flex min-h-10 w-full items-center justify-center gap-1.5 px-3 py-1.5 font-comic text-xs font-bold tracking-wider shadow-[3px_3px_0_0_var(--ink)] cursor-pointer transition-all active:translate-y-0.5 sm:w-auto sm:text-sm`}
                  title="Copy complete multi-standard ring size to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>SIZE COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>COPY SUMMARY</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 sm:gap-2.5">
                <div className="min-w-0 rounded-xl border-3 border-ink bg-hero-red p-2 text-center text-paper shadow-[2px_2px_0_0_var(--ink)] sm:p-3 sm:shadow-[3px_3px_0_0_var(--ink)]">
                  <span className="block break-words font-comic text-[9px] font-bold uppercase leading-tight tracking-wide text-paper/80 sm:text-xs">
                    US & CANADA
                  </span>
                  <div className={`mt-1 font-comic leading-none ${badgeSizeClass(selectedRow.us)}`}>
                    {selectedRow.us}
                  </div>
                </div>

                <div className="min-w-0 rounded-xl border-3 border-ink bg-hero-blue p-2 text-center text-paper shadow-[2px_2px_0_0_var(--ink)] sm:p-3 sm:shadow-[3px_3px_0_0_var(--ink)]">
                  <span className="block break-words font-comic text-[9px] font-bold uppercase leading-tight tracking-wide text-paper/80 sm:text-xs">
                    UK & AUSTRALIA
                  </span>
                  <div className={`mt-1 font-comic leading-none ${badgeSizeClass(selectedRow.uk)}`}>
                    {selectedRow.uk}
                  </div>
                </div>

                <div className="min-w-0 rounded-xl border-3 border-ink bg-emerald-600 p-2 text-center text-paper shadow-[2px_2px_0_0_var(--ink)] sm:p-3 sm:shadow-[3px_3px_0_0_var(--ink)]">
                  <span className="block break-words font-comic text-[9px] font-bold uppercase leading-tight tracking-wide text-paper/80 sm:text-xs">
                    EUROPE / ISO
                  </span>
                  <div className={`mt-1 font-comic leading-none ${badgeSizeClass(selectedRow.eu)}`}>
                    {selectedRow.eu}
                  </div>
                </div>

                <div className="min-w-0 rounded-xl border-3 border-ink bg-mustard p-2 text-center text-ink shadow-[2px_2px_0_0_var(--ink)] sm:p-3 sm:shadow-[3px_3px_0_0_var(--ink)]">
                  <span className="block break-words font-comic text-[9px] font-bold uppercase leading-tight tracking-wide text-ink/80 sm:text-xs">
                    JAPAN
                  </span>
                  <div className={`mt-1 font-comic leading-none ${badgeSizeClass(selectedRow.jp)}`}>
                    {selectedRow.jp}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Calibrated Circle Preview */}
            <div className="flex flex-col items-center justify-center space-y-2.5 rounded-xl border-3 border-ink bg-parchment p-3 sm:p-4">
              <span className="text-center font-comic text-[10px] font-bold uppercase leading-snug text-ink/75 sm:text-xs">
                ON-SCREEN CIRCLE VISUALIZER (DIAMETER: {selectedRow.diameterMm} MM)
              </span>

              <div className="flex min-h-[110px] w-full items-center justify-center py-1">
                <div
                  className={`flex items-center justify-center rounded-full border-4 border-hero-red bg-paper shadow-[2px_2px_0_0_var(--ink)] ${
                    isSwiping
                      ? "transition-none"
                      : "transition-all duration-150 motion-reduce:transition-none"
                  }`}
                  style={{
                    width: `${clampedCirclePx}px`,
                    height: `${clampedCirclePx}px`,
                  }}
                >
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-ink px-1 text-center">
                    {selectedRow.diameterMm}mm
                  </span>
                </div>
              </div>

              {isPreviewClamped ? (
                <p className="rounded-full border border-ink/30 bg-mustard/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-ink text-center">
                  Preview scaled to fit box · True size: {selectedRow.diameterMm} mm
                </p>
              ) : (
                <p className="font-body text-[10px] sm:text-[11px] text-ink/60 text-center max-w-sm">
                  Place an existing ring over the circle or swipe the ruler bar up/down to adjust
                  smoothly.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: VERTICAL SWIPE RULER ADJUSTER */}
          <aside
            aria-label="Ring Size Vertical Swipe Sidebar"
            className="flex flex-col rounded-2xl border-3 border-ink bg-ink p-1 sm:p-1.5 shadow-[4px_4px_0_0_var(--ink)] select-none"
          >
            {/* Top + Button (Tap or Hold to Increase Size) */}
            <button
              type="button"
              onPointerDown={() => startHoldAdjust(1)}
              onPointerUp={stopHoldAdjust}
              onPointerLeave={stopHoldAdjust}
              onPointerCancel={stopHoldAdjust}
              onClick={() => handleButtonClickAdjust(1)}
              aria-label="Increase ring size"
              title="Tap or hold to increase ring size"
              className="flex flex-col items-center justify-center gap-0.5 rounded-t-xl border-2 border-ink bg-hero-red py-2 text-paper shadow-[0_2px_0_var(--ink)] hover:brightness-110 active:translate-y-0.5 cursor-pointer touch-none"
            >
              <ChevronUp className="h-4 w-4 stroke-[3]" />
              <span className="font-comic text-[10px] sm:text-xs font-black tracking-wider leading-none">
                + UP
              </span>
            </button>

            {/* Swipeable Infinite Ruler Track */}
            <div
              role="spinbutton"
              tabIndex={0}
              aria-label={
                inputMode === "diameter"
                  ? "Swipe vertically to adjust ring diameter in millimeters"
                  : "Swipe vertically to adjust ring circumference in millimeters"
              }
              aria-valuemin={inputMode === "diameter" ? 0.1 : 0.3}
              aria-valuenow={activeMm}
              aria-valuetext={`${activeMm} millimeters, US size ${selectedRow.us}`}
              onPointerDown={handleSwipePointerDown}
              onPointerMove={handleSwipePointerMove}
              onPointerUp={handleSwipePointerEnd}
              onPointerCancel={handleSwipePointerEnd}
              onTouchStart={handleSwipeTouchStart}
              onTouchMove={handleSwipeTouchMove}
              onTouchEnd={handleSwipeTouchEnd}
              onTouchCancel={handleSwipeTouchEnd}
              onKeyDown={handleSwipeKeyDown}
              data-testid="ring-swipe-sidebar"
              className={`relative my-1.5 flex-1 min-h-[220px] rounded-xl border-2 border-ink bg-parchment overflow-hidden flex flex-col items-center justify-between py-2.5 px-1 touch-none select-none cursor-ns-resize focus-visible:outline-3 focus-visible:outline-mustard ${
                isSwiping ? "ring-2 ring-mustard" : ""
              }`}
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(15, 23, 42, 0.22) 0px, rgba(15, 23, 42, 0.22) 1.5px, transparent 1.5px, transparent 10px), repeating-linear-gradient(to bottom, rgba(190, 38, 41, 0.35) 0px, rgba(190, 38, 41, 0.35) 2px, transparent 2px, transparent 50px)",
                backgroundSize: "18px 50px, 28px 50px",
                backgroundPosition: `left ${-(selectedRow.diameterMm * 28)}px, right ${-(selectedRow.diameterMm * 28)}px`,
                backgroundRepeat: "repeat-y",
              }}
            >
              {/* Top Swipe Up Indicator */}
              <div
                className={`z-10 rounded-full border border-ink px-1.5 py-0.5 text-center font-comic text-[9px] sm:text-[10px] font-black tracking-wide transition-colors ${
                  swipeDirection === "up"
                    ? "bg-hero-red text-paper scale-105"
                    : "bg-paper/90 text-ink/80"
                }`}
              >
                ▲ SWIPE UP
              </div>

              {/* Center Interactive Readout Handle */}
              <div
                className={`z-10 w-full rounded-lg border-2 border-ink bg-mustard px-1 py-2 text-center shadow-[2px_2px_0_var(--ink)] transition-transform motion-reduce:transition-none ${
                  isSwiping ? "scale-105 bg-yellow-300" : ""
                }`}
              >
                <GripHorizontal className="mx-auto h-3.5 w-3.5 text-ink/70" />
                <span className="mt-0.5 block font-mono text-xs sm:text-sm font-black text-ink leading-tight">
                  {activeMm}
                  <span className="text-[9px] font-bold">mm</span>
                </span>
                <span className="mt-0.5 inline-block rounded bg-ink px-1.5 py-0.5 font-comic text-[9px] sm:text-[10px] font-bold text-mustard">
                  US {selectedRow.us}
                </span>
              </div>

              {/* Bottom Swipe Down Indicator */}
              <div
                className={`z-10 rounded-full border border-ink px-1.5 py-0.5 text-center font-comic text-[9px] sm:text-[10px] font-black tracking-wide transition-colors ${
                  swipeDirection === "down"
                    ? "bg-hero-blue text-paper scale-105"
                    : "bg-paper/90 text-ink/80"
                }`}
              >
                ▼ SWIPE DN
              </div>
            </div>

            {/* Bottom - Button (Tap or Hold to Decrease Size) */}
            <button
              type="button"
              onPointerDown={() => startHoldAdjust(-1)}
              onPointerUp={stopHoldAdjust}
              onPointerLeave={stopHoldAdjust}
              onPointerCancel={stopHoldAdjust}
              onClick={() => handleButtonClickAdjust(-1)}
              aria-label="Decrease ring size"
              title="Tap or hold to decrease ring size"
              className="flex flex-col items-center justify-center gap-0.5 rounded-b-xl border-2 border-ink bg-hero-blue py-2 text-paper shadow-[0_2px_0_var(--ink)] hover:brightness-110 active:translate-y-0.5 cursor-pointer touch-none"
            >
              <span className="font-comic text-[10px] sm:text-xs font-black tracking-wider leading-none">
                - DOWN
              </span>
              <ChevronDown className="h-4 w-4 stroke-[3]" />
            </button>
          </aside>
        </div>

        {/* Full Size Comparison Table */}
        <div className="border-t-2 border-dashed border-ink/20 pt-4">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-comic text-sm font-bold uppercase leading-tight tracking-wider text-ink">
              COMPLETE INTERNATIONAL RING SIZES MATRIX
            </h3>
            <span className="font-mono text-[10px] font-bold text-ink/70 sm:text-xs">
              TAP ANY ROW TO LOAD REFERENCE SIZE
            </span>
          </div>

          <p className="mb-2 font-mono text-[10px] font-bold uppercase text-ink/60 sm:hidden">
            Swipe sideways to view every standard →
          </p>
          <div className="w-full min-w-0 max-w-full max-h-80 overflow-auto overscroll-contain rounded-xl border-3 border-ink bg-paper shadow-[3px_3px_0_0_var(--ink)] no-scrollbar">
            <table className="min-w-[720px] text-left font-mono text-xs text-ink sm:w-full">
              <thead className="sticky top-0 z-10 border-b-3 border-ink bg-mustard font-comic text-xs uppercase tracking-wider text-ink shadow-[0_2px_0_var(--ink)]">
                <tr>
                  <th className="p-3">US / CA</th>
                  <th className="p-3">UK / AU</th>
                  <th className="p-3">EU</th>
                  <th className="p-3">JP</th>
                  <th className="p-3">DIAMETER</th>
                  <th className="p-3">CIRCUMFERENCE</th>
                  <th className="p-3 text-right">SELECT</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/15 bg-paper text-ink">
                {RING_SIZE_CHART.map((row) => {
                  const isCur = !selectedRow.isCustom && row.us === selectedRow.us;
                  return (
                    <tr
                      key={row.us}
                      onClick={() => handleSelectRow(row)}
                      className={`cursor-pointer transition-colors ${
                        isCur
                          ? "bg-mustard/40 font-bold text-ink border-l-4 border-hero-red"
                          : "hover:bg-mustard/15 text-ink"
                      }`}
                    >
                      <td className="p-3 font-bold text-ink text-sm">{row.us}</td>
                      <td className="p-3 font-semibold text-ink">{row.uk}</td>
                      <td className="p-3 font-semibold text-ink">{row.eu}</td>
                      <td className="p-3 font-semibold text-ink">{row.jp}</td>
                      <td className="p-3 font-semibold text-ink">{row.diameterMm} mm</td>
                      <td className="p-3 font-semibold text-ink">{row.circumferenceMm} mm</td>
                      <td className="p-3 text-right">
                        {isCur ? (
                          <span className="inline-flex items-center gap-1 rounded bg-hero-red px-2 py-0.5 text-[10px] font-comic font-black text-paper uppercase shadow-[1px_1px_0_var(--ink)]">
                            <Check className="h-3 w-3 stroke-[3]" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="font-comic text-[11px] font-bold text-hero-blue hover:underline">
                            SELECT
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
