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

export type NavLinkItem = {
  id: string;
  label: string;
  to: string;
  hash?: string;
  badge: string;
  isSpecial?: boolean;
};

const NAV_LINKS: NavLinkItem[] = [
  { id: "home", to: "/", label: "HOME", badge: "POW" },
  { id: "powers", to: "/", hash: "powers", label: "POWERS", badge: "BAM" },
  { id: "how-it-works", to: "/", hash: "how-it-works", label: "HOW IT WORKS", badge: "WHAM" },
  { id: "calculator", to: "/calculator", label: "CALCULATOR", badge: "ZAP", isSpecial: true },
  { id: "terms", to: "/terms", label: "TERMS", badge: "DOC" },
  { id: "privacy", to: "/privacy", label: "PRIVACY", badge: "SAFE" },
];

/** Comic-masthead navbar: sticky ink bar, collapsing issue strip, comic-tab links. */
export function Navbar() {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const hash = location.hash;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 36));

  // Close the mobile menu whenever the route changes and reset scroll state.
  useEffect(() => {
    setMenuOpen(false);
    if (typeof window !== "undefined") {
      setScrolled(window.scrollY > 36);
    }
  }, [pathname, hash]);

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

  const isLinkActive = (item: NavLinkItem) => {
    if (item.hash) {
      return pathname === "/" && hash === item.hash;
    }
    if (item.to === "/") {
      return pathname === "/" && (!hash || hash === "");
    }
    return pathname.startsWith(item.to);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavLinkItem
  ) => {
    sfxToggle();
    if (item.hash) {
      if (pathname === "/") {
        e.preventDefault();
        const el = document.getElementById(item.hash);
        if (el) {
          el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
          window.history.pushState(null, "", `/#${item.hash}`);
        }
        setMenuOpen(false);
      } else {
        setMenuOpen(false);
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Masthead strip — auto-scrolling ticker, collapses as you scroll */}
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
          {/* Logo with continuously moving Starburst background */}
          <Link to="/" className="group flex items-center gap-2 sm:gap-3 shrink-0" aria-label="Spidy Calculator home">
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

          {/* Desktop comic-tab links */}
          <div className="hidden items-center gap-1.5 md:flex lg:gap-2.5 shrink-0">
            {NAV_LINKS.map((l) => {
              const active = isLinkActive(l);
              const linkContent = (
                <>
                  <span
                    aria-hidden
                    className="font-comic absolute -top-3.5 left-1/2 -translate-x-1/2 scale-75 text-[10px] text-hero-red opacity-0 transition-all duration-150 group-hover:-translate-y-1 group-hover:scale-100 group-hover:opacity-100"
                  >
                    {active ? "★" : "!"}
                  </span>
                  <span>{l.label}</span>
                  {l.isSpecial && <span aria-hidden className="text-xs">⚡</span>}
                </>
              );

              const className = `group relative inline-flex items-center gap-1 rounded-lg border-2 border-ink px-2.5 py-1 text-xs md:text-sm lg:px-3.5 lg:py-1.5 lg:text-base font-comic tracking-wide shadow-[3px_3px_0_var(--navy)] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-mustard select-none cursor-pointer ${
                l.isSpecial
                  ? active
                    ? "bg-mustard text-ink -rotate-1 font-bold"
                    : "bg-hero-red text-paper hover:brightness-110 rotate-1 font-bold"
                  : active
                    ? "-rotate-1 bg-mustard text-ink font-bold"
                    : "rotate-1 bg-paper text-ink"
              }`;

              if (l.hash) {
                return (
                  <a
                    key={l.id}
                    href={`/#${l.hash}`}
                    onClick={(e) => handleNavClick(e, l)}
                    aria-current={active ? "page" : undefined}
                    className={className}
                  >
                    {linkContent}
                  </a>
                );
              }

              return (
                <Link
                  key={l.id}
                  to={l.to}
                  onClick={() => {
                    sfxToggle();
                    setMenuOpen(false);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={className}
                >
                  {linkContent}
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
            className="comic-btn btn-blue grid h-10 w-10 sm:h-11 sm:w-11 place-items-center md:hidden shrink-0"
          >
            <span aria-hidden className="flex flex-col gap-1">
              <span
                className={`block h-1 w-5 sm:w-6 rounded bg-paper transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-1 w-5 sm:w-6 rounded bg-paper transition-opacity ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-1 w-5 sm:w-6 rounded bg-paper transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
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
              className="panel absolute inset-x-3 top-[calc(100%+8px)] z-50 rounded-xl p-3 sm:p-4 md:hidden max-h-[calc(100vh-80px)] overflow-y-auto shadow-[8px_8px_0_0_var(--ink)]"
            >
              <ul className="space-y-2">
                {NAV_LINKS.map((l) => {
                  const active = isLinkActive(l);
                  const mobileContent = (
                    <>
                      <span className="flex items-center gap-1.5">
                        {l.label}
                        {l.isSpecial && <span>⚡</span>}
                      </span>
                      <Starburst label={l.badge} className="h-7 w-7 text-[9px]" />
                    </>
                  );

                  const className = `flex items-center justify-between rounded-lg border-2 border-ink px-3.5 py-2 font-comic text-lg tracking-wide transition-transform focus-visible:outline-4 focus-visible:outline-mustard active:scale-[0.98] cursor-pointer ${
                    l.isSpecial
                      ? active
                        ? "bg-mustard text-ink font-bold shadow-[2px_2px_0_var(--ink)]"
                        : "bg-hero-red text-paper font-bold shadow-[2px_2px_0_var(--ink)]"
                      : active
                        ? "bg-mustard text-ink font-bold shadow-[2px_2px_0_var(--ink)]"
                        : "bg-paper text-ink shadow-[2px_2px_0_var(--ink)]"
                  }`;

                  if (l.hash) {
                    return (
                      <li key={l.id}>
                        <a
                          href={`/#${l.hash}`}
                          onClick={(e) => handleNavClick(e, l)}
                          aria-current={active ? "page" : undefined}
                          className={className}
                        >
                          {mobileContent}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={l.id}>
                      <Link
                        to={l.to}
                        onClick={() => {
                          sfxToggle();
                          setMenuOpen(false);
                        }}
                        aria-current={active ? "page" : undefined}
                        className={className}
                      >
                        {mobileContent}
                      </Link>
                    </li>
                  );
                })}
              </ul>
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
