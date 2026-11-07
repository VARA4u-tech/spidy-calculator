import { useState } from "react";
import {
  RING_SIZE_CHART,
  findClosestRingSizeByDiameter,
  findClosestRingSizeByCircumference,
  type RingSizeRow,
} from "@/lib/everyday";
import { playClickSound } from "@/lib/sounds";
import { CircleDot, Ruler, Check } from "lucide-react";

export function RingSizeCalculator() {
  const [inputMode, setInputMode] = useState<"diameter" | "circumference" | "us">("diameter");
  const [diameterVal, setDiameterVal] = useState<string>("17.3"); // Size 7 default
  const [circumferenceVal, setCircumferenceVal] = useState<string>("54.4");
  const [selectedRow, setSelectedRow] = useState<RingSizeRow>(
    () => RING_SIZE_CHART[8] ?? (RING_SIZE_CHART[0] as RingSizeRow),
  ); // US 7

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
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 border-b-4 border-ink pb-4">
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
              className={`inline-flex items-center gap-1.5 rounded-xl border-3 border-ink px-4 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
                isActive
                  ? "bg-mustard text-ink shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
                  : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Measurement Converter Panel */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
        <div className="border-b-2 border-dashed border-ink/20 pb-3">
          <h2 className="font-comic text-2xl text-ink font-bold">INTERNATIONAL RING SIZING</h2>
          <p className="font-body text-xs text-ink/70">
            Convert millimeter measurements to US/Canada, UK/Australia, Europe/ISO, and Japan
            standards.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-md">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border-3 border-ink bg-hero-red p-4 text-paper shadow-[3px_3px_0_0_var(--ink)] text-center">
            <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
              US & CANADA
            </span>
            <div className="mt-1 font-comic text-3xl sm:text-4xl font-black">{selectedRow.us}</div>
          </div>

          <div className="rounded-xl border-3 border-ink bg-hero-blue p-4 text-paper shadow-[3px_3px_0_0_var(--ink)] text-center">
            <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
              UK & AUSTRALIA
            </span>
            <div className="mt-1 font-comic text-3xl sm:text-4xl font-black">{selectedRow.uk}</div>
          </div>

          <div className="rounded-xl border-3 border-ink bg-emerald-600 p-4 text-paper shadow-[3px_3px_0_0_var(--ink)] text-center">
            <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
              EUROPE / ISO
            </span>
            <div className="mt-1 font-comic text-3xl sm:text-4xl font-black">{selectedRow.eu}</div>
          </div>

          <div className="rounded-xl border-3 border-ink bg-mustard p-4 text-ink shadow-[3px_3px_0_0_var(--ink)] text-center">
            <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
              JAPAN
            </span>
            <div className="mt-1 font-comic text-3xl sm:text-4xl font-black">{selectedRow.jp}</div>
          </div>
        </div>

        {/* Interactive Calibrated Circle Preview */}
        <div className="rounded-xl border-3 border-ink bg-parchment p-5 flex flex-col items-center justify-center space-y-3">
          <span className="font-comic text-xs font-bold uppercase text-ink/75">
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-comic text-sm font-bold uppercase tracking-wider text-ink">
              COMPLETE INTERNATIONAL RING SIZES MATRIX
            </h3>
            <span className="font-mono text-xs font-bold text-ink/70">
              TAP ANY ROW TO LOAD SIZE
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto rounded-xl border-3 border-ink bg-paper shadow-[3px_3px_0_0_var(--ink)] no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left font-mono text-xs text-ink">
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
