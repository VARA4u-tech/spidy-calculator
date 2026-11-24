import { useState } from "react";
import {
  RING_SIZE_CHART,
  findClosestRingSizeByDiameter,
  findClosestRingSizeByCircumference,
  formatRingSizeSummary,
  type RingSizeRow,
} from "@/lib/everyday";
import { playClickSound } from "@/lib/sounds";
import { CircleDot, Ruler, Check, Copy } from "lucide-react";

export function RingSizeCalculator() {
  const [inputMode, setInputMode] = useState<"diameter" | "circumference" | "us">("diameter");
  const [diameterVal, setDiameterVal] = useState<string>("17.3"); // Size 7 default
  const [circumferenceVal, setCircumferenceVal] = useState<string>("54.4");
  const [selectedRow, setSelectedRow] = useState<RingSizeRow>(
    () => RING_SIZE_CHART[8] ?? (RING_SIZE_CHART[0] as RingSizeRow),
  ); // US 7
  const [copied, setCopied] = useState<boolean>(false);

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
      const match = findClosestRingSizeByDiameter(num);
      setSelectedRow(match);
      setCircumferenceVal(match.circumferenceMm.toString());
    }
  };

  const handleCircumferenceChange = (valStr: string) => {
    setCircumferenceVal(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const match = findClosestRingSizeByCircumference(num);
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
                setInputMode(tab.id as typeof inputMode);
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
        <div className="border-b-2 border-dashed border-ink/20 pb-3">
          <h2 className="font-comic text-xl font-bold leading-tight text-ink sm:text-2xl">
            INTERNATIONAL RING SIZING
          </h2>
          <p className="font-body text-xs text-ink/70">
            Convert millimeter measurements to US/Canada, UK/Australia, Europe/ISO, and Japan
            standards.
          </p>
        </div>

        {/* Input */}
        <div className="w-full min-w-0 max-w-md">
          {inputMode === "diameter" ? (
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">
                Inside Diameter (mm)
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="10"
                  max="30"
                  value={diameterVal}
                  onChange={(e) => handleDiameterChange(e.target.value)}
                  className="w-full rounded-xl border-3 border-ink bg-parchment pl-4 pr-12 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-comic text-xs font-black text-ink select-none">
                  MM
                </span>
              </div>
            </label>
          ) : (
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">
                Inside Circumference (mm)
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="90"
                  value={circumferenceVal}
                  onChange={(e) => handleCircumferenceChange(e.target.value)}
                  className="w-full rounded-xl border-3 border-ink bg-parchment pl-4 pr-12 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] outline-none"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-comic text-xs font-black text-ink select-none">
                  MM
                </span>
              </div>
            </label>
          )}
        </div>

        {/* International Conversions Banner */}
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              } inline-flex min-h-11 w-full items-center justify-center gap-2 px-3.5 py-1.5 font-comic text-xs font-bold tracking-wider shadow-[3px_3px_0_0_var(--ink)] cursor-pointer transition-all active:translate-y-0.5 sm:w-auto sm:text-sm`}
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
                  <span>COPY SIZE SUMMARY</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2 sm:grid-cols-4 sm:gap-3">
            <div className="min-w-0 rounded-xl border-3 border-ink bg-hero-red p-2.5 text-center text-paper shadow-[2px_2px_0_0_var(--ink)] sm:p-4 sm:shadow-[3px_3px_0_0_var(--ink)]">
              <span className="block break-words font-comic text-[10px] font-bold uppercase leading-tight tracking-wide text-paper/80 sm:text-xs sm:tracking-wider">
                US & CANADA
              </span>
              <div className="mt-1 font-comic text-3xl sm:text-4xl font-black">
                {selectedRow.us}
              </div>
            </div>

            <div className="min-w-0 rounded-xl border-3 border-ink bg-hero-blue p-2.5 text-center text-paper shadow-[2px_2px_0_0_var(--ink)] sm:p-4 sm:shadow-[3px_3px_0_0_var(--ink)]">
              <span className="block break-words font-comic text-[10px] font-bold uppercase leading-tight tracking-wide text-paper/80 sm:text-xs sm:tracking-wider">
                UK & AUSTRALIA
              </span>
              <div className="mt-1 font-comic text-3xl sm:text-4xl font-black">
                {selectedRow.uk}
              </div>
            </div>

            <div className="min-w-0 rounded-xl border-3 border-ink bg-emerald-600 p-2.5 text-center text-paper shadow-[2px_2px_0_0_var(--ink)] sm:p-4 sm:shadow-[3px_3px_0_0_var(--ink)]">
              <span className="block break-words font-comic text-[10px] font-bold uppercase leading-tight tracking-wide text-paper/80 sm:text-xs sm:tracking-wider">
                EUROPE / ISO
              </span>
              <div className="mt-1 font-comic text-3xl sm:text-4xl font-black">
                {selectedRow.eu}
              </div>
            </div>

            <div className="min-w-0 rounded-xl border-3 border-ink bg-mustard p-2.5 text-center text-ink shadow-[2px_2px_0_0_var(--ink)] sm:p-4 sm:shadow-[3px_3px_0_0_var(--ink)]">
              <span className="block break-words font-comic text-[10px] font-bold uppercase leading-tight tracking-wide text-ink/80 sm:text-xs sm:tracking-wider">
                JAPAN
              </span>
              <div className="mt-1 font-comic text-3xl sm:text-4xl font-black">
                {selectedRow.jp}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Calibrated Circle Preview */}
        <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border-3 border-ink bg-parchment p-3 sm:p-5">
          <span className="text-center font-comic text-[11px] font-bold uppercase leading-snug text-ink/75 sm:text-xs">
            ON-SCREEN CIRCLE VISUALIZER (DIAMETER: {selectedRow.diameterMm} MM)
          </span>

          {/* Circle scaled with CSS pixels (approx 1mm ~ 3.78px on standard 96dpi display) */}
          <div
            className="flex items-center justify-center rounded-full border-4 border-hero-red bg-paper shadow-[2px_2px_0_0_var(--ink)] transition-all duration-200"
            style={{
              width: `${Math.round(selectedRow.diameterMm * 4.2)}px`,
              height: `${Math.round(selectedRow.diameterMm * 4.2)}px`,
              minWidth: "60px",
              minHeight: "60px",
              maxWidth: "200px",
              maxHeight: "200px",
            }}
          >
            <span className="font-mono text-xs font-bold text-ink">{selectedRow.diameterMm}mm</span>
          </div>

          <p className="font-body text-[11px] text-ink/60 text-center max-w-sm">
            Place an existing well-fitting ring over the circle on your screen to verify that the
            inside edge matches.
          </p>
        </div>

        {/* Full Size Comparison Table */}
        <div className="border-t-2 border-dashed border-ink/20 pt-4">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-comic text-sm font-bold uppercase leading-tight tracking-wider text-ink">
              COMPLETE INTERNATIONAL RING SIZES MATRIX
            </h3>
            <span className="font-mono text-[10px] font-bold text-ink/70 sm:text-xs">
              TAP ANY ROW TO LOAD SIZE
            </span>
          </div>

          <p className="mb-2 font-mono text-[10px] font-bold uppercase text-ink/60 sm:hidden">
            Swipe sideways to view every standard →
          </p>
          <div className="w-full min-w-0 max-w-full max-h-80 overflow-auto overscroll-contain rounded-xl border-3 border-ink bg-paper shadow-[3px_3px_0_0_var(--ink)] [scrollbar-width:thin]">
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
                  const isCur = row.us === selectedRow.us;
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
