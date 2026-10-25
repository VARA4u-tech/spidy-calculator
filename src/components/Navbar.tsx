import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Starburst, Web } from "@/components/comic";
import { sfxToggle } from "@/lib/sounds";

const LINKS = [
  { to: "/", label: "HOME", badge: "POW", match: (p: string) => p === "/" },
  { to: "/calculator", label: "CALCULATOR", badge: "ZAP", match: (p: string) => p.startsWith("/calculator") },
] as const;

/** Comic-masthead navbar: sticky ink bar, collapsing issue strip, comic-tab links. */
export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 36));

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on Escape for keyboard heroes.
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

  return (
    <header className="sticky top-0 z-40">
      {/* Masthead strip — collapses as you scroll */}
      <motion.div
        aria-hidden
        animate={scrolled ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.25 }}
        className="overflow-hidden border-b-4 border-ink bg-hero-red"
      >
        <p className="py-1 text-center font-mono text-[10px] tracking-[0.25em] text-paper sm:text-xs">
          ISSUE #1 · YOUR FRIENDLY NEIGHBORHOOD CALCULATOR · EST. 2026
        </p>
      </motion.div>

      {/* Main ink bar */}
      <nav aria-label="Main" className="relative border-b-4 border-ink bg-ink shadow-[0_6px_0_var(--navy)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5" aria-label="Web-Slinger Calculator home">
            <Starburst label="WS" className="h-10 w-10 rotate-[-8deg] text-sm transition-transform duration-200 group-hover:rotate-[10deg]" />
            <span className="font-comic text-2xl tracking-wide text-paper sm:text-3xl">
              WEB-SLINGER <span className="text-mustard">CALC.</span>
            </span>
          </Link>

          {/* Desktop comic-tab links */}
          <div className="hidden items-center gap-3 md:flex">
            {LINKS.map((l) => {
              const active = l.match(pathname);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  aria-current={active ? "page" : undefined}
                  className={`group relative inline-block rounded-lg border-2 border-ink px-4 py-1.5 font-comic text-lg tracking-wide shadow-[3px_3px_0_var(--navy)] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-mustard ${
                    active ? "-rotate-1 bg-mustard text-ink" : "rotate-1 bg-paper text-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className="font-comic absolute -top-4 left-1/2 -translate-x-1/2 scale-75 text-xs text-hero-red opacity-0 transition-all duration-150 group-hover:-translate-y-1 group-hover:scale-100 group-hover:opacity-100"
                  >
                    {active ? "★" : "!"}
                  </span>
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="comic-btn btn-blue grid h-11 w-11 place-items-center md:hidden"
          >
            <span aria-hidden className="flex flex-col gap-1">
              <span className={`block h-1 w-6 rounded bg-paper transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-1 w-6 rounded bg-paper transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-1 w-6 rounded bg-paper transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        {/* Mobile dropdown panel */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: -14, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, rotate: 2 }}
              transition={{ duration: 0.22 }}
              className="panel absolute inset-x-3 top-[calc(100%+8px)] z-50 rounded-xl p-4 md:hidden"
            >
              <ul className="space-y-3">
                {LINKS.map((l) => {
                  const active = l.match(pathname);
                  return (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between rounded-lg border-2 border-ink px-4 py-2.5 font-comic text-xl tracking-wide transition-transform focus-visible:outline-4 focus-visible:outline-mustard active:scale-[0.98] ${
                          active ? "bg-mustard text-ink" : "bg-paper text-ink"
                        }`}
                      >
                        {l.label}
                        <Starburst label={l.badge} className="h-8 w-8 text-[10px]" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest text-ink/60">
                <Web className="h-4 w-4 text-ink/40" /> SWING SAFELY — NO ADS, NO SIGN-UPS
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
