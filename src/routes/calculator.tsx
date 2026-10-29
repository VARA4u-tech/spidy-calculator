import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import { Starburst, Web } from "@/components/comic";
import { hasAcceptedTerms } from "@/lib/terms";
import { getAbsoluteSiteUrl, getCanonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Free Online Scientific Calculator | Spidy Calculator" },
      {
        name: "description",
        content:
          "Use a free online calculator for arithmetic, percentages, trigonometry, logarithms, powers, and roots. Switch between basic and scientific modes—no download required.",
      },
      { property: "og:title", content: "Free Online Scientific Calculator | Spidy Calculator" },
      {
        property: "og:description",
        content:
          "A free online math calculator with basic and scientific modes, keyboard support, and on-device history.",
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
          browserRequirements: "Requires a modern web browser with JavaScript enabled.",
          isAccessibleForFree: true,
          featureList: [
            "Basic arithmetic and chained calculations",
            "Percentages, decimals, sign toggle, and backspace",
            "Scientific trigonometric, logarithmic, power, and root functions",
            "Degree and radian angle modes",
            "Keyboard input and local calculation history",
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
  // Start with null to prevent flash during SSR / hydration
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check acceptance in browser storage on mount (handles direct URL & page refresh)
    if (!hasAcceptedTerms()) {
      setIsAuthorized(false);
      navigate({ to: "/terms", replace: true });
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  // Loading guard screen during clearance check (guarantees zero flash of calculator)
  if (!isAuthorized) {
    return (
      <main className="relative flex min-h-[100dvh] items-center justify-center bg-navy p-4 text-paper overflow-x-hidden">
        <Web className="pointer-events-none absolute -top-1 -left-1 h-20 w-20 text-paper/20 sm:top-0 sm:left-0 sm:h-48 sm:w-48" />
        <Web className="pointer-events-none absolute -right-1 -bottom-1 h-20 w-20 rotate-180 text-paper/15 sm:right-0 sm:bottom-0 sm:h-48 sm:w-48" />

        <div className="relative z-10 w-full max-w-md px-2 sm:px-4">
          <div className="panel relative rounded-2xl p-6 sm:p-8 text-center text-ink border-4 border-ink shadow-[8px_8px_0_0_var(--ink)] bg-paper">
            {/* Starburst Spider Logo */}
            <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-2 opacity-95 text-mustard" />
              <img
                src="/logo.png"
                alt="Spidy Calculator emblem"
                className="relative z-10 h-10 w-10 object-contain drop-shadow-[2px_2px_0_rgba(15,23,42,0.95)]"
              />
            </div>

            {/* Comic clearance badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-mustard px-3 py-0.5 text-xs font-mono font-bold text-ink shadow-[2px_2px_0_var(--ink)] mb-2">
              <span>⚠️ CLEARANCE REQUIRED</span>
            </div>

            <h2 className="font-comic text-2xl sm:text-3xl text-ink leading-tight">
              SECURITY CLEARANCE CHECK...
            </h2>

            <p className="mt-2 font-mono text-xs sm:text-sm text-ink/80 leading-relaxed">
              Access to Spidy Calculator requires explicit acceptance of our Terms &amp; Conditions.
            </p>

            {/* Action Buttons: Direct redirect to Terms & Conditions */}
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

            <p className="mt-4 font-mono text-[11px] text-ink/50 animate-pulse">
              This free online calculator includes standard and scientific modes. Review and accept
              the Terms &amp; Conditions to use the keypad.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-start overflow-x-clip p-2 pt-[max(env(safe-area-inset-top),0.5rem)] pb-[max(env(safe-area-inset-bottom),0.5rem)] sm:p-3 md:p-4 lg:h-screen lg:justify-center lg:overflow-hidden">
      <Web className="pointer-events-none absolute -top-1 -left-1 h-20 w-20 text-paper/20 min-[400px]:h-28 min-[400px]:w-28 sm:top-0 sm:left-0 sm:h-48 sm:w-48 will-change-transform transform-gpu" />
      <Web className="pointer-events-none absolute -right-1 -bottom-1 h-20 w-20 rotate-180 text-paper/15 min-[400px]:h-28 min-[400px]:w-28 sm:right-0 sm:bottom-0 sm:h-48 sm:w-48 will-change-transform transform-gpu" />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
        {/* Compact comic top header: back link + punchy headline */}
        <header className="relative mb-2 sm:mb-3 flex items-center justify-between gap-3 px-1">
          <Link
            to="/"
            className="comic-btn btn-blue inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm md:text-base"
            aria-label="Back to Home"
          >
            <span aria-hidden>◀</span>
            <span>BACK TO HOME</span>
          </Link>

          <div className="text-center">
            <h1 className="font-comic print-shadow-text text-lg sm:text-2xl md:text-3xl leading-tight text-paper">
              SPIDY CALCULATOR · <span className="text-mustard">THWIP!</span>
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest text-paper/70">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-1 opacity-90" />
              <img
                src="/logo.png"
                alt="Spidy Calculator emblem"
                className="relative z-10 h-4.5 w-4.5 object-contain"
              />
            </div>
            <span>ISSUE #1</span>
          </div>
        </header>

        {/* Calculator & Case Files */}
        <div className="relative flex justify-center">
          <Calculator />
        </div>
      </div>
    </main>
  );
}
