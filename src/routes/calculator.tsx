import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import { ConvertersCalculator } from "@/components/calculators/ConvertersCalculator";
import { MathsCalculator } from "@/components/calculators/MathsCalculator";
import { AbacusCalculator } from "@/components/calculators/AbacusCalculator";
import { DartsCalculator } from "@/components/calculators/DartsCalculator";
import { EverydayCalculators } from "@/components/calculators/EverydayCalculators";
import { Starburst, Web } from "@/components/comic";
import { hasAcceptedTerms } from "@/lib/terms";
import { getAbsoluteSiteUrl, getCanonicalUrl } from "@/lib/seo";
import { sfxClick } from "@/lib/sounds";
import {
  Calculator as CalcIcon,
  Percent,
  ArrowLeftRight,
  Layers,
  Grid,
  Target,
  Sparkles,
} from "lucide-react";

interface CalculatorSearch {
  category?: string | undefined;
  mode?: string | undefined;
}

export type SuiteCategory =
  "core" | "percentage" | "converters" | "maths" | "abacus" | "darts" | "everyday";

interface CategoryTab {
  id: SuiteCategory;
  label: string;
  shortLabel: string;
  icon: typeof CalcIcon;
  badge?: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    id: "core",
    label: "KEYPAD (BASIC & SCI)",
    shortLabel: "KEYPAD",
    icon: CalcIcon,
    badge: "CORE",
  },
  { id: "percentage", label: "PERCENTAGE", shortLabel: "PERCENT", icon: Percent, badge: "5 MODES" },
  {
    id: "converters",
    label: "UNIT CONVERTERS",
    shortLabel: "CONVERTER",
    icon: ArrowLeftRight,
    badge: "6 TYPES",
  },
  { id: "maths", label: "MATHS & FRACTIONS", shortLabel: "MATHS", icon: Layers, badge: "ALGEBRA" },
  { id: "abacus", label: "SOROBAN ABACUS", shortLabel: "ABACUS", icon: Grid, badge: "TACTILE" },
  { id: "darts", label: "DARTS SCORER", shortLabel: "DARTS", icon: Target, badge: "501/301" },
  {
    id: "everyday",
    label: "EVERYDAY ESTIMATORS",
    shortLabel: "EVERYDAY",
    icon: Sparkles,
    badge: "BMI/PATIO",
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
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const initialCat = (
    CATEGORY_TABS.some((t) => t.id === search.category) ? search.category : "core"
  ) as SuiteCategory;

  const [activeCategory, setActiveCategory] = useState<SuiteCategory>(initialCat);

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

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-4">
        {/* Top Header Row */}
        <header className="relative flex flex-wrap items-center justify-between gap-3 px-1 border-b-2 border-paper/15 pb-2">
          <Link
            to="/"
            onClick={() => sfxClick()}
            className="comic-btn btn-blue inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm"
            aria-label="Back to Home"
          >
            <span aria-hidden>◀</span>
            <span>BACK TO HOME</span>
          </Link>

          <div className="text-center">
            <h1 className="font-comic print-shadow-text text-base sm:text-xl md:text-2xl leading-tight text-paper">
              SPIDY CALCULATOR · <span className="text-mustard">THWIP!</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest text-paper/80">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-1 opacity-90" />
              <img
                src="/logo.png"
                alt="Spidy emblem"
                className="relative z-10 h-4.5 w-4.5 object-contain"
              />
            </div>
            <span className="hidden sm:inline">ISSUE #1</span>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* UNIFIED CALCULATOR CATEGORY SWITCHER BAR                                  */}
        {/* ========================================================================= */}
        <nav
          aria-label="Calculator Categories"
          className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 scrollbar-none select-none"
        >
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectCategory(tab.id)}
                className={`group flex items-center gap-1.5 shrink-0 rounded-xl border-3 border-ink px-3 py-1.5 sm:px-4 sm:py-2 font-comic text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  isActive
                    ? "bg-mustard text-ink shadow-[4px_4px_0_0_var(--ink)] -translate-y-0.5"
                    : "bg-paper text-ink shadow-[2px_2px_0_0_var(--ink)] hover:bg-mustard/40 hover:-translate-y-0.5 active:translate-y-0.5"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-ink" : "text-hero-red"}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 hidden lg:inline-block rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase ${
                      isActive ? "bg-ink text-paper" : "bg-ink/10 text-ink/80"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ========================================================================= */}
        {/* ACTIVE CALCULATOR WORKSPACE                                               */}
        {/* ========================================================================= */}
        <div className="relative flex-1 flex flex-col justify-center py-2">
          {activeCategory === "core" && (
            <div className="relative flex justify-center">
              <Calculator />
            </div>
          )}

          {activeCategory === "percentage" && <PercentageCalculator />}

          {activeCategory === "converters" && <ConvertersCalculator />}

          {activeCategory === "maths" && <MathsCalculator />}

          {activeCategory === "abacus" && <AbacusCalculator />}

          {activeCategory === "darts" && <DartsCalculator />}

          {activeCategory === "everyday" && <EverydayCalculators />}
        </div>
      </div>
    </main>
  );
}
