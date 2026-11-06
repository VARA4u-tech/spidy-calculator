import { useState } from "react";
import { calculatePatioMaterials, type PatioShape } from "@/lib/everyday";
import { playClickSound } from "@/lib/sounds";
import { Compass, Square, Circle, LayoutGrid, DollarSign } from "lucide-react";

export function PatioCalculator() {
  const [shape, setShape] = useState<PatioShape>("rectangle");

  // Rectangle
  const [rectLength, setRectLength] = useState<string>("15");
  const [rectWidth, setRectWidth] = useState<string>("12");

  // Circle
  const [circleDiameter, setCircleDiameter] = useState<string>("14");

  // L-Shape
  const [lMainLen, setLMainLen] = useState<string>("16");
  const [lMainWid, setLMainWid] = useState<string>("10");
  const [lWingLen, setLWingLen] = useState<string>("8");
  const [lWingWid, setLWingWid] = useState<string>("6");

  // Paver specs
  const [paverLenIn, setPaverLenIn] = useState<string>("12");
  const [paverWidIn, setPaverWidIn] = useState<string>("12");
  const [costPerPaver, setCostPerPaver] = useState<string>("3.50");
  const [wastagePct, setWastagePct] = useState<number>(10);

  // Material costs
  const [gravelPriceTon, setGravelPriceTon] = useState<string>("45");
  const [sandPriceTon, setSandPriceTon] = useState<string>("50");

  const switchShape = (newShape: PatioShape) => {
    playClickSound();
    setShape(newShape);
  };

  const dims = {
    shape,
    lengthFt: parseFloat(rectLength) || 0,
    widthFt: parseFloat(rectWidth) || 0,
    diameterFt: parseFloat(circleDiameter) || 0,
    mainLengthFt: parseFloat(lMainLen) || 0,
    mainWidthFt: parseFloat(lMainWid) || 0,
    wingLengthFt: parseFloat(lWingLen) || 0,
    wingWidthFt: parseFloat(lWingWid) || 0,
  };

  const paverSpec = {
    lengthInches: parseFloat(paverLenIn) || 12,
    widthInches: parseFloat(paverWidIn) || 12,
    costPerPaver: parseFloat(costPerPaver) || 0,
  };

  const materialResults = calculatePatioMaterials(dims, paverSpec, wastagePct, 4, 1, {
    gravelCostPerTon: parseFloat(gravelPriceTon) || 0,
    sandCostPerTon: parseFloat(sandPriceTon) || 0,
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Shape Selector */}
      <div className="flex flex-wrap gap-2 border-b-4 border-ink pb-4">
        {[
          { id: "rectangle" as const, label: "RECTANGULAR PATIO", icon: Square },
          { id: "circle" as const, label: "CIRCULAR PATIO", icon: Circle },
          { id: "l-shape" as const, label: "L-SHAPED PATIO", icon: LayoutGrid },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = shape === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchShape(tab.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl border-3 border-ink px-4 py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
                isActive
                  ? "bg-purple-700 text-paper shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
                  : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Parameters Panel */}
      <div className="comic-panel rounded-2xl border-4 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--ink)] space-y-6">
        <div className="border-b-2 border-dashed border-ink/20 pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-comic text-2xl text-ink font-bold">PATIO & PAVERS ESTIMATOR</h2>
            <p className="font-body text-xs text-ink/70">
              Calculate total pavers, cutting wastage, 4" gravel sub-base, and 1" sand bedding
              layer.
            </p>
          </div>
          <Compass className="h-6 w-6 text-purple-700" />
        </div>

        {/* Dimension inputs based on shape */}
        {shape === "rectangle" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">
                Patio Length (Feet)
              </span>
              <input
                type="number"
                value={rectLength}
                onChange={(e) => setRectLength(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">
                Patio Width (Feet)
              </span>
              <input
                type="number"
                value={rectWidth}
                onChange={(e) => setRectWidth(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
              />
            </label>
          </div>
        )}

        {shape === "circle" && (
          <div className="max-w-md">
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold uppercase text-ink">
                Circle Diameter (Feet)
              </span>
              <input
                type="number"
                value={circleDiameter}
                onChange={(e) => setCircleDiameter(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment px-4 py-3 font-mono text-xl font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]"
              />
            </label>
          </div>
        )}

        {shape === "l-shape" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold text-ink">
                Main Section Length (ft)
              </span>
              <input
                type="number"
                value={lMainLen}
                onChange={(e) => setLMainLen(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono font-bold text-ink"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold text-ink">Main Section Width (ft)</span>
              <input
                type="number"
                value={lMainWid}
                onChange={(e) => setLMainWid(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono font-bold text-ink"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold text-ink">
                Wing Section Length (ft)
              </span>
              <input
                type="number"
                value={lWingLen}
                onChange={(e) => setLWingLen(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono font-bold text-ink"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold text-ink">Wing Section Width (ft)</span>
              <input
                type="number"
                value={lWingWid}
                onChange={(e) => setLWingWid(e.target.value)}
                className="w-full rounded-xl border-3 border-ink bg-parchment p-2.5 font-mono font-bold text-ink"
              />
            </label>
          </div>
        )}

        {/* Paver Dimensions & Wastage Presets */}
        <div className="border-t-2 border-dashed border-ink/20 pt-4 space-y-4">
          <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink">
            PAVER SPECIFICATIONS & CUTTING WASTAGE
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold text-ink">Paver Length (Inches)</span>
              <input
                type="number"
                value={paverLenIn}
                onChange={(e) => setPaverLenIn(e.target.value)}
                className="w-full rounded-xl border-2 border-ink bg-parchment p-2.5 font-mono font-bold text-ink"
              />
            </label>

            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold text-ink">Paver Width (Inches)</span>
              <input
                type="number"
                value={paverWidIn}
                onChange={(e) => setPaverWidIn(e.target.value)}
                className="w-full rounded-xl border-2 border-ink bg-parchment p-2.5 font-mono font-bold text-ink"
              />
            </label>

            <label className="block space-y-1">
              <span className="font-comic text-xs font-bold text-ink">
                Unit Price ($ per paver)
              </span>
              <input
                type="number"
                step="0.05"
                value={costPerPaver}
                onChange={(e) => setCostPerPaver(e.target.value)}
                className="w-full rounded-xl border-2 border-ink bg-parchment p-2.5 font-mono font-bold text-ink"
              />
            </label>
          </div>

          {/* Quick Paver Sizes */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-ink/70">Standard Sizes:</span>
            {[
              { l: 12, w: 12, label: '12" × 12" Square' },
              { l: 8, w: 4, label: '4" × 8" Brick' },
              { l: 16, w: 16, label: '16" × 16" Large' },
              { l: 9, w: 6, label: '6" × 9" Cobble' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  playClickSound();
                  setPaverLenIn(p.l.toString());
                  setPaverWidIn(p.w.toString());
                }}
                className="rounded-lg border-2 border-ink bg-parchment px-2.5 py-1 font-mono text-xs font-bold text-ink hover:bg-mustard"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Wastage Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-ink/70">Wastage / Cuts Allowance:</span>
            {[5, 10, 15, 20].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => {
                  playClickSound();
                  setWastagePct(pct);
                }}
                className={`rounded-lg border-2 border-ink px-3 py-1 font-mono text-xs font-bold ${
                  wastagePct === pct
                    ? "bg-mustard text-ink shadow-[2px_2px_0_0_var(--ink)]"
                    : "bg-paper text-ink"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS CARDS */}
        <div className="space-y-4 border-t-2 border-dashed border-ink/20 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Area */}
            <div className="rounded-xl border-4 border-ink bg-hero-blue p-5 text-paper shadow-[4px_4px_0_0_var(--ink)]">
              <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                TOTAL PATIO AREA
              </span>
              <div className="mt-1 font-comic text-4xl sm:text-5xl font-black">
                {materialResults.totalAreaSqFt}
              </div>
              <p className="mt-1 font-mono text-xs text-mustard">
                Sq Feet ({materialResults.totalAreaSqM} m²)
              </p>
            </div>

            {/* Total Pavers */}
            <div className="rounded-xl border-4 border-ink bg-mustard p-5 text-ink shadow-[4px_4px_0_0_var(--ink)]">
              <span className="font-comic text-xs font-bold uppercase tracking-wider text-ink/80">
                TOTAL PAVERS (WITH {wastagePct}% WASTAGE)
              </span>
              <div className="mt-1 font-comic text-4xl sm:text-5xl font-black">
                {materialResults.totalPaversWithWastage}
              </div>
              <p className="mt-1 font-mono text-xs text-ink/70">
                Base pavers: {materialResults.rawPaversNeeded}
              </p>
            </div>

            {/* Total Estimated Cost */}
            <div className="rounded-xl border-4 border-ink bg-emerald-600 p-5 text-paper shadow-[4px_4px_0_0_var(--ink)]">
              <span className="font-comic text-xs font-bold uppercase tracking-wider text-paper/80">
                ESTIMATED TOTAL COST
              </span>
              <div className="mt-1 font-comic text-4xl sm:text-5xl font-black">
                ${materialResults.estimatedGrandTotal}
              </div>
              <p className="mt-1 font-mono text-xs text-paper/90">
                Pavers: ${materialResults.paverCostTotal}
              </p>
            </div>
          </div>

          {/* Sub-Base Gravel and Bedding Sand Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border-3 border-ink bg-parchment p-4 space-y-1">
              <div className="font-comic text-xs font-bold text-ink uppercase">
                COMPACTED GRAVEL SUB-BASE (4" DEPTH)
              </div>
              <div className="font-comic text-2xl font-bold text-ink">
                {materialResults.gravelCubicYards} cu yds (~{materialResults.gravelTons} tons)
              </div>
              <div className="font-mono text-xs text-ink/70">
                Volume: {materialResults.gravelCubicFeet} cubic feet
              </div>
            </div>

            <div className="rounded-xl border-3 border-ink bg-parchment p-4 space-y-1">
              <div className="font-comic text-xs font-bold text-ink uppercase">
                COARSE BEDDING SAND LAYER (1" DEPTH)
              </div>
              <div className="font-comic text-2xl font-bold text-ink">
                {materialResults.sandCubicYards} cu yds (~{materialResults.sandTons} tons)
              </div>
              <div className="font-mono text-xs text-ink/70">
                Volume: {materialResults.sandCubicFeet} cubic feet
              </div>
            </div>
          </div>

          {/* Step Breakdown */}
          <div className="rounded-xl border-2 border-ink bg-paper p-4">
            <span className="font-comic text-xs font-bold text-ink uppercase">
              CALCULATION AUDIT LOG:
            </span>
            <ul className="mt-2 list-disc list-inside font-mono text-xs text-ink/80 space-y-1">
              {materialResults.steps.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
