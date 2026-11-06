import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import {
  PercentageCalculator,
  type PercentageMode,
} from "@/components/calculators/PercentageCalculator";
import { ConvertersCalculator } from "@/components/calculators/ConvertersCalculator";
import { MathsCalculator, type MathsTabMode } from "@/components/calculators/MathsCalculator";
import { AbacusCalculator } from "@/components/calculators/AbacusCalculator";
import { DartsCalculator } from "@/components/calculators/DartsCalculator";
import {
  EverydayCalculators,
  type EverydayTabMode,
} from "@/components/calculators/EverydayCalculators";
import {
  LineSidebar,
  type LineSidebarItem,
  type LineSidebarSubItem,
  type LineSidebarItemInput,
} from "@/components/LineSidebar";
import { Starburst, Web } from "@/components/comic";
import { hasAcceptedTerms } from "@/lib/terms";
import { getAbsoluteSiteUrl, getCanonicalUrl } from "@/lib/seo";
import { sfxClick } from "@/lib/sounds";
import type { UnitCategory } from "@/lib/conversions";
import { Sparkles } from "lucide-react";

interface CalculatorSearch {
  category?: string | undefined;
  mode?: string | undefined;
}

export type SuiteCategory =
  "core" | "percentage" | "converters" | "maths" | "abacus" | "darts" | "everyday";

export const CALCULATOR_CATEGORIES: LineSidebarItem[] = [
  {
    id: "core",
    label: "Basic & Scientific",
    shortLabel: "Keypad",
    badge: "123/Sci",
    subcategories: [
      { id: "basic", label: "Basic Arithmetic", badge: "123" },
      { id: "sci", label: "Scientific Trig & Log", badge: "Sci" },
    ],
  },
  {
    id: "percentage",
    label: "Percentage Calculator",
    shortLabel: "Percent",
    badge: "5 Tools",
    subcategories: [
      { id: "percentOf", label: "P% of Total", badge: "% Of" },
      { id: "whatPercent", label: "Part as % of Total", badge: "Ratio" },
      { id: "change", label: "% Increase / Decrease", badge: "Delta" },
      { id: "discount", label: "Discount & Sale Price", badge: "Sale" },
      { id: "diff", label: "Percentage Difference", badge: "Diff" },
    ],
  },
  {
    id: "converters",
    label: "Unit Converters",
    shortLabel: "Converter",
    badge: "6 Types",
    subcategories: [
      { id: "length", label: "Length & Distance", badge: "m/ft" },
      { id: "weight", label: "Weight & Mass", badge: "kg/lb" },
      { id: "volume", label: "Volume & Liquid", badge: "L/gal" },
      { id: "temperature", label: "Temperature Scale", badge: "°C/°F" },
      { id: "speed", label: "Speed & Velocity", badge: "km/mph" },
      { id: "time", label: "Time & Duration", badge: "s/hr" },
    ],
  },
  {
    id: "maths",
    label: "Maths & Fractions",
    shortLabel: "Maths",
    badge: "Algebra",
    subcategories: [
      { id: "fractions", label: "Fractions (+ - × ÷)", badge: "A/B" },
      { id: "ratios", label: "Ratios & Dividers", badge: "A:B" },
      { id: "lcmgcd", label: "LCM & GCD Euclidean", badge: "GCD" },
      { id: "primes", label: "Primes & Factorization", badge: "Primes" },
      { id: "algebra", label: "Algebra: Linear & Quad", badge: "x²+bx" },
    ],
  },
  {
    id: "abacus",
    label: "Soroban Abacus",
    shortLabel: "Abacus",
    badge: "Tactile",
    subcategories: [
      { id: "tactile", label: "7-Rod Counting Frame", badge: "Frame" },
      { id: "guide", label: "Abacus Guide & Bead Math", badge: "Rules" },
    ],
  },
  {
    id: "darts",
    label: "Darts Scorer",
    shortLabel: "Darts",
    badge: "501/301",
    subcategories: [
      { id: "501", label: "501 Championship", badge: "501" },
      { id: "301", label: "301 Quick Game", badge: "301" },
    ],
  },
  {
    id: "everyday",
    label: "Everyday Estimators",
    shortLabel: "Everyday",
    badge: "3 Gauges",
    subcategories: [
      { id: "bmi", label: "BMI Health Gauge", badge: "BMI" },
      { id: "ring", label: "Ring Size Converter", badge: "Ring" },
      { id: "patio", label: "Patio Slab Estimator", badge: "Patio" },
    ],
  },
];

export const Route = createFileRoute("/calculator")({
  validateSearch: (search: Record<string, unknown>): CalculatorSearch => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
    mode: typeof search["mode"] === "string" ? (search["mode"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Spidy Calculator — Multi-Category Retro Comic Math Platform" },
      {
        name: "description",
        content:
          "Unified retro comic calculator platform: switch seamlessly between basic arithmetic, scientific math, percentages, universal unit converters, fractions, Soroban abacus, darts scorer, and everyday estimators.",
      },
      { property: "og:title", content: "Spidy Calculator — Multi-Category Math Platform" },
      {
        property: "og:description",
        content:
          "A unified free online math platform with basic, scientific, unit conversion, fractions, abacus, and darts categories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Spidy Calculator",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires modern web browser with JavaScript enabled.",
          isAccessibleForFree: true,
          featureList: [
            "Basic arithmetic and scientific trigonometric functions",
            "5-in-1 percentage calculations and discount tooling",
            "Universal unit converters across length, weight, volume, temperature, speed, time",
            "Step-by-step fractions, ratios, LCM/GCD, and quadratic algebra",
            "Virtual 7-rod Japanese Soroban abacus with movable bi-quinary beads",
            "301 and 501 darts scorer with PDC checkout guidance and averages",
            "WHO BMI calculator, international ring size converter, and patio material estimator",
          ],
          ...(getAbsoluteSiteUrl("/calculator") ? { url: getAbsoluteSiteUrl("/calculator") } : {}),
        },
      },
    ],
    links: [{ rel: "canonical", href: getCanonicalUrl("/calculator") }],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const navigate = useNavigate({ from: "/calculator" });
  const search = Route.useSearch();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const initialCat = (
    CALCULATOR_CATEGORIES.some((t) => t.id === search["category"])
      ? (search["category"] as SuiteCategory)
      : "core"
  ) as SuiteCategory;

  const initialSubMode = typeof search["mode"] === "string" ? (search["mode"] as string) : null;

  const [activeCategory, setActiveCategory] = useState<SuiteCategory>(initialCat);
  const [activeSubMode, setActiveSubMode] = useState<string | null>(initialSubMode);

  const activeCategoryIndex = CALCULATOR_CATEGORIES.findIndex((c) => c.id === activeCategory);

  useEffect(() => {
    if (!hasAcceptedTerms()) {
      setIsAuthorized(false);
      navigate({ to: "/terms", replace: true });
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const handleSelectCategory = (catId: SuiteCategory) => {
    sfxClick();
    setActiveCategory(catId);
    const cat = CALCULATOR_CATEGORIES.find((c) => c.id === catId);
    const firstSub = cat?.subcategories?.[0]?.id ?? null;
    setActiveSubMode(firstSub);
    navigate({
      search: {
        category: catId,
        mode: firstSub ?? undefined,
      },
      replace: true,
    });
  };

  const handleCategorySelection = (index: number, _item: LineSidebarItemInput) => {
    sfxClick();
    const cat = CALCULATOR_CATEGORIES[index];
    if (!cat) return;
    setActiveCategory(cat.id as SuiteCategory);
    const firstSub = cat.subcategories?.[0]?.id ?? null;
    setActiveSubMode(firstSub);
    navigate({
      search: {
        category: cat.id,
        mode: firstSub ?? undefined,
      },
      replace: true,
    });
  };

  const handleSubCategorySelection = (parentIndex: number, subItem: LineSidebarSubItem) => {
    sfxClick();
    const cat = CALCULATOR_CATEGORIES[parentIndex];
    if (!cat) return;
    setActiveCategory(cat.id as SuiteCategory);
    setActiveSubMode(subItem.id);
    navigate({
      search: {
        category: cat.id,
        mode: subItem.id,
      },
      replace: true,
    });
  };

  // Loading guard screen during clearance check
  if (!isAuthorized) {
    return (
      <main className="relative flex min-h-[100dvh] items-center justify-center bg-navy p-4 text-paper overflow-x-hidden">
        <Web className="pointer-events-none absolute -top-1 -left-1 h-20 w-20 text-paper/20 sm:top-0 sm:left-0 sm:h-48 sm:w-48" />
        <Web className="pointer-events-none absolute -right-1 -bottom-1 h-20 w-20 rotate-180 text-paper/15 sm:right-0 sm:bottom-0 sm:h-48 sm:w-48" />

        <div className="relative z-10 w-full max-w-md px-2 sm:px-4">
          <div className="panel relative rounded-2xl p-6 sm:p-8 text-center text-ink border-4 border-ink shadow-[8px_8px_0_0_var(--ink)] bg-paper">
            <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-2 opacity-95 text-mustard" />
              <img
                src="/logo.png"
                alt="Spidy emblem"
                className="relative z-10 h-10 w-10 object-contain drop-shadow-[2px_2px_0_rgba(15,23,42,0.95)]"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-mustard px-3 py-0.5 text-xs font-mono font-bold text-ink shadow-[2px_2px_0_var(--ink)] mb-2">
              <span>⚠️ CLEARANCE REQUIRED</span>
            </div>

            <h2 className="font-comic text-2xl sm:text-3xl text-ink leading-tight">
              SECURITY CLEARANCE CHECK...
            </h2>

            <p className="mt-2 font-mono text-xs sm:text-sm text-ink/80 leading-relaxed">
              Access to Spidy Calculator requires explicit acceptance of our Terms &amp; Conditions.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                to="/terms"
                className="comic-btn btn-red w-full px-5 py-3 text-base sm:text-lg font-comic tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0_var(--ink)] cursor-pointer"
              >
                <span>📜</span>
                <span>GO TO TERMS &amp; CONDITIONS</span>
                <span aria-hidden>➔</span>
              </Link>

              <Link
                to="/"
                className="comic-btn btn-blue w-full px-4 py-2.5 text-xs sm:text-sm font-comic tracking-wider flex items-center justify-center gap-1.5 shadow-[3px_3px_0_var(--ink)]"
              >
                <span aria-hidden>◀</span>
                <span>BACK TO HOME</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-start overflow-x-clip p-2 pt-[max(env(safe-area-inset-top),0.5rem)] pb-[max(env(safe-area-inset-bottom),1rem)] sm:p-4 bg-navy text-paper">
      <Web className="pointer-events-none absolute -top-1 -left-1 h-24 w-24 text-paper/15 min-[400px]:h-32 min-[400px]:w-32 sm:top-0 sm:left-0 sm:h-56 sm:w-56 will-change-transform transform-gpu" />
      <Web className="pointer-events-none absolute -right-1 -bottom-1 h-24 w-24 rotate-180 text-paper/15 min-[400px]:h-32 min-[400px]:w-32 sm:right-0 sm:bottom-0 sm:h-56 sm:w-56 will-change-transform transform-gpu" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-3 sm:space-y-4">
        {/* Top Header Row — Balanced, single-row on mobile */}
        <header className="relative flex items-center justify-between gap-2 px-1 border-b-2 border-paper/15 pb-2">
          <Link
            to="/"
            onClick={() => sfxClick()}
            className="comic-btn btn-blue inline-flex items-center gap-1 px-2.5 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm shrink-0"
            aria-label="Back to Home"
          >
            <span aria-hidden>◀</span>
            <span className="hidden min-[360px]:inline">BACK TO HOME</span>
            <span className="min-[360px]:hidden">HOME</span>
          </Link>

          <div className="text-center min-w-0 flex-1 px-1">
            <h1 className="font-comic print-shadow-text text-sm min-[380px]:text-base sm:text-xl md:text-2xl leading-tight text-paper truncate">
              SPIDY CALCULATOR · <span className="text-mustard">THWIP!</span>
            </h1>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-widest text-paper/80 shrink-0">
            <div className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-1 opacity-90 text-mustard" />
              <img
                src="/logo.png"
                alt="Spidy emblem"
                className="relative z-10 h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 object-contain"
              />
            </div>
            <span className="hidden sm:inline">ISSUE #1</span>
          </div>
        </header>

        {/* Mobile & Tablet Category Navigation (< lg) */}
        <div className="lg:hidden space-y-1.5">
          {/* Main Categories Scrollable Strip */}
          <nav
            aria-label="Calculator Categories"
            className="flex items-center justify-start overflow-x-auto pb-1 gap-1.5 scrollbar-none select-none px-0.5"
          >
            {CALCULATOR_CATEGORIES.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectCategory(tab.id as SuiteCategory)}
                  className={`group flex items-center gap-1 shrink-0 rounded-xl border-2 sm:border-3 border-ink px-2.5 py-1.5 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
                    isActive
                      ? "bg-mustard text-ink shadow-[2px_2px_0_0_var(--ink)] -translate-y-0.5"
                      : "bg-paper text-ink shadow-[1px_1px_0_0_var(--ink)] hover:bg-mustard/40"
                  }`}
                >
                  <span className="whitespace-nowrap">{tab.shortLabel ?? tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded ${
                        isActive ? "bg-ink text-paper" : "bg-ink/10 text-ink/70"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ========================================================================= */}
        {/* MAIN WORKSPACE: CALCULATOR (LEFT/CENTER) + RIGHT-SIDE LINE SIDEBAR DOCK    */}
        {/* ========================================================================= */}
        <div className="relative flex flex-1 flex-col lg:flex-row gap-6 items-start justify-center w-full">
          {/* Active Calculator Workspace */}
          <section
            aria-label="Calculator Workspace"
            className="flex-1 w-full flex flex-col justify-center items-center min-w-0"
          >
            {activeCategory === "core" && (
              <div className="relative flex justify-center w-full">
                <Calculator scientificMode={activeSubMode === "sci"} />
              </div>
            )}

            {activeCategory === "percentage" && (
              <PercentageCalculator activeMode={activeSubMode as PercentageMode | undefined} />
            )}

            {activeCategory === "converters" && (
              <ConvertersCalculator activeMode={activeSubMode as UnitCategory | undefined} />
            )}

            {activeCategory === "maths" && (
              <MathsCalculator activeMode={activeSubMode as MathsTabMode | undefined} />
            )}

            {activeCategory === "abacus" && <AbacusCalculator />}

            {activeCategory === "darts" && (
              <DartsCalculator activeMode={activeSubMode === "301" ? "301" : "501"} />
            )}

            {activeCategory === "everyday" && (
              <EverydayCalculators activeMode={activeSubMode as EverydayTabMode | undefined} />
            )}
          </section>

          {/* Right-Side LineSidebar Navigation Deck (Desktop lg+) */}
          <aside
            aria-label="Right-Side Category Navigation"
            className="hidden lg:flex flex-col shrink-0 w-72 xl:w-80 sticky top-4 rounded-2xl border-4 border-ink bg-ink/95 backdrop-blur-md p-4 shadow-[6px_6px_0_0_var(--ink)] text-paper select-none"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b-2 border-paper/20 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <Starburst className="animate-wobble absolute -inset-1 opacity-95 text-mustard" />
                  <Sparkles className="relative z-10 h-3.5 w-3.5 text-ink" />
                </div>
                <div>
                  <h2 className="font-comic text-base text-paper tracking-wide leading-none">
                    CATEGORIES
                  </h2>
                  <p className="font-mono text-[9px] text-paper/60 uppercase tracking-widest mt-0.5">
                    LINE-SIDEBAR DECK
                  </p>
                </div>
              </div>
              <span className="font-mono text-[9px] font-bold text-mustard px-2 py-0.5 rounded border border-mustard/40 bg-mustard/15 uppercase">
                {CALCULATOR_CATEGORIES.length} SUITES
              </span>
            </div>

            {/* React Bits LineSidebar Component */}
            <div className="max-h-[calc(100vh-170px)] overflow-y-auto pr-1 scrollbar-none">
              <LineSidebar
                items={CALCULATOR_CATEGORIES}
                accentColor="#f6be3c"
                textColor="#fdfbf7"
                markerColor="rgba(253, 251, 247, 0.4)"
                showIndex
                showMarker
                proximityRadius={100}
                maxShift={24}
                falloff="smooth"
                markerLength={46}
                markerGap={4}
                tickScale={0.5}
                scaleTick
                itemGap={16}
                fontSize={1.05}
                smoothing={100}
                defaultActive={activeCategoryIndex >= 0 ? activeCategoryIndex : 0}
                activeIndex={activeCategoryIndex >= 0 ? activeCategoryIndex : 0}
                activeSubId={activeSubMode}
                onItemClick={handleCategorySelection}
                onSubItemClick={handleSubCategorySelection}
                side="right"
              />
            </div>

            {/* Panel Radar Footer */}
            <div className="mt-3 pt-2.5 border-t border-paper/15 flex items-center justify-between font-mono text-[9px] text-paper/60 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PROXIMITY RADAR</span>
              </span>
              <span className="text-mustard font-bold">THWIP!</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
