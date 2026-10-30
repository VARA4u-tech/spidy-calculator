import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  AnimatePresence,
  m as motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Starburst, Web } from "@/components/comic";
import { sfxToggle } from "@/lib/sounds";

export function Navbar() {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const hash = location.hash;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 36));

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
    if (typeof window !== "undefined") {
      setScrolled(window.scrollY > 36);
    }
  }, [pathname, hash]);

  // Close on Escape for keyboard navigation
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const toggleMenu = () => {
    sfxToggle();
    setMenuOpen((v) => !v);
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    sfxToggle();
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        window.history.pushState(null, "", `/#${sectionId}`);
      }
      setMenuOpen(false);
    } else {
      setMenuOpen(false);
    }
  };

  const isSectionActive = (sectionHash: string) => pathname === "/" && hash === sectionHash;

  return (
    <header className="sticky top-0 z-40">
      {/* Masthead strip — auto-scrolling ticker, collapses smoothly as you scroll */}
      <motion.div
        aria-hidden
        initial={false}
        animate={scrolled ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
        className="overflow-hidden border-b-4 border-ink bg-hero-red py-1"
      >
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] select-none will-change-transform transform-gpu">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-6 pr-6 font-mono text-[10px] sm:text-xs font-bold tracking-[0.25em] text-paper uppercase"
            >
              <span>★ ISSUE #1</span>
              <span>·</span>
              <span>SPIDY CALCULATOR</span>
              <span>·</span>
              <span>YOUR FRIENDLY NEIGHBORHOOD CALCULATOR</span>
              <span>·</span>
              <span>EST. 2026</span>
              <span>·</span>
              <span>ZERO ADS, ZERO TRACKING</span>
              <span>·</span>
              <span>THWIP! DO THE MATH</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main ink bar */}
      <nav
        aria-label="Main"
        className="relative border-b-4 border-ink bg-ink shadow-[0_6px_0_var(--navy)]"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-3 sm:px-6">
          {/* Brand Logo -> Universal Home Action */}
          <Link
            to="/"
            onClick={() => {
              sfxToggle();
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
              }
            }}
            className="group flex items-center gap-2 sm:gap-3 shrink-0"
            aria-label="Spidy Calculator Home"
          >
            <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-1.5 h-auto w-auto opacity-95 transition-transform duration-200 group-hover:scale-115" />
              <img
                src="/logo.png"
                alt="Spidy Calculator logo"
                className="relative z-10 h-7 w-7 sm:h-9 sm:w-9 object-contain drop-shadow-[2px_2px_0_rgba(15,23,42,0.95)] transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <span className="font-comic text-xl tracking-wide text-paper sm:text-2xl lg:text-3xl">
              SPIDY <span className="text-mustard">CALCULATOR</span>
            </span>
          </Link>

          {/* Desktop Navigation: Product Exploration + Standout Hero Primary CTA */}
          <div className="hidden items-center gap-3 md:flex lg:gap-4 shrink-0">
            {/* Feature Exploration Links */}
            <div className="flex items-center gap-2 lg:gap-2.5">
              <a
                href="/#powers"
                onClick={(e) => handleSectionClick(e, "powers")}
                aria-current={isSectionActive("powers") ? "page" : undefined}
                className={`group relative inline-flex items-center gap-1 rounded-lg border-2 border-ink px-3 py-1.5 text-xs font-comic tracking-wide lg:px-4 lg:py-1.5 lg:text-sm select-none cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-mustard ${
                  isSectionActive("powers")
                    ? "bg-mustard text-ink font-bold -rotate-1 shadow-[3px_3px_0_var(--navy)]"
                    : "bg-paper text-ink rotate-1 shadow-[3px_3px_0_var(--navy)] hover:bg-mustard/90"
                }`}
              >
                <span>POWERS</span>
              </a>

              <a
                href="/#how-it-works"
                onClick={(e) => handleSectionClick(e, "how-it-works")}
                aria-current={isSectionActive("how-it-works") ? "page" : undefined}
                className={`group relative inline-flex items-center gap-1 rounded-lg border-2 border-ink px-3 py-1.5 text-xs font-comic tracking-wide lg:px-4 lg:py-1.5 lg:text-sm select-none cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-mustard ${
                  isSectionActive("how-it-works")
                    ? "bg-mustard text-ink font-bold -rotate-1 shadow-[3px_3px_0_var(--navy)]"
                    : "bg-paper text-ink -rotate-1 shadow-[3px_3px_0_var(--navy)] hover:bg-mustard/90"
                }`}
              >
                <span>HOW IT WORKS</span>
              </a>
            </div>

            {/* Primary Action Hero Button */}
            <Link
              to="/calculator"
              onClick={() => sfxToggle()}
              className="comic-btn btn-red inline-flex items-center gap-1.5 px-4 py-1.5 text-sm lg:px-5 lg:py-2 lg:text-base font-comic font-bold tracking-wider shadow-[4px_4px_0_var(--ink)] cursor-pointer"
            >
              <span>⚡</span>
              <span>OPEN CALCULATOR</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="comic-btn btn-blue grid h-10 w-10 sm:h-11 sm:w-11 place-items-center md:hidden shrink-0 cursor-pointer"
          >
            <span aria-hidden className="flex flex-col gap-1">
              <span
                className={`block h-1 w-5 sm:w-6 rounded bg-paper transition-transform duration-150 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-1 w-5 sm:w-6 rounded bg-paper transition-opacity duration-150 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-1 w-5 sm:w-6 rounded bg-paper transition-transform duration-150 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        {/* Mobile dropdown panel: Hierarchically Organized */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: -14, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, rotate: 2 }}
              transition={{ duration: 0.22 }}
              className="panel absolute inset-x-3 top-[calc(100%+8px)] z-50 rounded-xl p-3 sm:p-4 md:hidden max-h-[calc(100vh-80px)] overflow-y-auto shadow-[8px_8px_0_0_var(--ink)]"
            >
              {/* Primary Action Hero Card */}
              <div className="mb-3">
                <Link
                  to="/calculator"
                  onClick={() => {
                    sfxToggle();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-between rounded-lg border-3 border-ink bg-hero-red text-paper px-4 py-3 font-comic text-xl font-bold tracking-wider shadow-[4px_4px_0_var(--ink)] hover:brightness-110 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>OPEN CALCULATOR</span>
                  </span>
                  <Starburst label="ZAP" className="h-8 w-8 text-[10px]" />
                </Link>
              </div>

              {/* Core Exploration Section */}
              <div className="space-y-1.5 border-t border-ink/15 pt-2.5">
                <p className="font-mono text-[10px] tracking-widest text-ink/60 uppercase font-bold px-1">
                  SECTIONS
                </p>
                <Link
                  to="/"
                  onClick={() => {
                    sfxToggle();
                    setMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-lg border-2 border-ink px-3.5 py-2 font-comic text-base tracking-wide transition-transform shadow-[2px_2px_0_var(--ink)] ${
                    pathname === "/" && !hash
                      ? "bg-mustard text-ink font-bold"
                      : "bg-paper text-ink hover:bg-mustard/40"
                  }`}
                >
                  <span>HOME</span>
                  <Starburst label="POW" className="h-6 w-6 text-[8px]" />
                </Link>

                <a
                  href="/#powers"
                  onClick={(e) => handleSectionClick(e, "powers")}
                  className={`flex items-center justify-between rounded-lg border-2 border-ink px-3.5 py-2 font-comic text-base tracking-wide transition-transform shadow-[2px_2px_0_var(--ink)] ${
                    isSectionActive("powers")
                      ? "bg-mustard text-ink font-bold"
                      : "bg-paper text-ink hover:bg-mustard/40"
                  }`}
                >
                  <span>POWERS</span>
                  <Starburst label="BAM" className="h-6 w-6 text-[8px]" />
                </a>

                <a
                  href="/#how-it-works"
                  onClick={(e) => handleSectionClick(e, "how-it-works")}
                  className={`flex items-center justify-between rounded-lg border-2 border-ink px-3.5 py-2 font-comic text-base tracking-wide transition-transform shadow-[2px_2px_0_var(--ink)] ${
                    isSectionActive("how-it-works")
                      ? "bg-mustard text-ink font-bold"
                      : "bg-paper text-ink hover:bg-mustard/40"
                  }`}
                >
                  <span>HOW IT WORKS</span>
                  <Starburst label="WHAM" className="h-6 w-6 text-[8px]" />
                </a>
              </div>

              {/* Legal & Trust Section */}
              <div className="space-y-1.5 border-t border-ink/15 pt-2.5 mt-2.5">
                <p className="font-mono text-[10px] tracking-widest text-ink/60 uppercase font-bold px-1">
                  TRUST &amp; POLICIES
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/terms"
                    onClick={() => {
                      sfxToggle();
                      setMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-1 rounded-lg border-2 border-ink px-2 py-1.5 font-comic text-xs tracking-wider shadow-[2px_2px_0_var(--ink)] ${
                      pathname === "/terms"
                        ? "bg-mustard text-ink font-bold"
                        : "bg-paper text-ink hover:bg-mustard/40"
                    }`}
                  >
                    <span>📜 TERMS</span>
                  </Link>

                  <Link
                    to="/privacy"
                    onClick={() => {
                      sfxToggle();
                      setMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-1 rounded-lg border-2 border-ink px-2 py-1.5 font-comic text-xs tracking-wider shadow-[2px_2px_0_var(--ink)] ${
                      pathname === "/privacy"
                        ? "bg-mustard text-ink font-bold"
                        : "bg-paper text-ink hover:bg-mustard/40"
                    }`}
                  >
                    <span>🛡️ PRIVACY</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      sfxToggle();
                      setMenuOpen(false);
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("spidy-open-developer"));
                      }
                    }}
                    className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border-2 border-ink px-2 py-1.5 font-comic text-xs tracking-wider shadow-[2px_2px_0_var(--ink)] bg-mustard/30 hover:bg-mustard text-ink font-bold cursor-pointer transition-colors"
                  >
                    <span>👨‍💻 ABOUT THE DEVELOPER</span>
                    <span className="text-hero-red">★</span>
                  </button>
                </div>
              </div>

              {/* Safety stamp */}
              <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest text-ink/60 border-t border-ink/15 pt-2">
                <Web className="h-4 w-4 text-ink/40" /> SWING SAFELY — NO ADS, NO SIGN-UPS
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
