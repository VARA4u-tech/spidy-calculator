import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { Starburst, Web } from "@/components/comic";
import { sfxClick } from "@/lib/sounds";

export function Footer() {
  const reduce = useReducedMotion();

  const scrollToTop = () => {
    sfxClick();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="relative mt-20 w-full overflow-hidden border-t-4 border-ink bg-[#be2629] text-paper select-none">
      {/* Decorative comic halftone pattern over red background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#000000 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* Decorative corner spider webs (visible across mobile, tablets, and desktop) */}
      <Web className="pointer-events-none absolute -top-4 -left-4 h-24 w-24 text-ink/25 min-[400px]:h-32 min-[400px]:w-32 sm:-top-10 sm:-left-10 sm:h-64 sm:w-64 will-change-transform transform-gpu" />
      <Web className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 rotate-180 text-ink/25 min-[400px]:h-36 min-[400px]:w-36 sm:-bottom-10 sm:-right-10 sm:h-72 sm:w-72 will-change-transform transform-gpu" />

      {/* Top comic issue strip — responsive on all mobile screens */}
      <div className="relative z-10 border-b-4 border-ink bg-hero-red py-1.5 sm:py-2 px-3 sm:px-4 shadow-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-1 opacity-90" />
              <img
                src="/logo.png"
                alt="Spider mask"
                className="relative z-10 h-4 w-4 sm:h-4.5 sm:w-4.5 object-contain"
              />
            </div>
            <p className="truncate font-mono text-[10px] min-[390px]:text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-[0.22em] text-paper uppercase">
              <span className="sm:hidden">SPIDER-MAN · BRAND NEW DAY</span>
              <span className="hidden sm:inline">
                SPIDER-MAN: BRAND NEW DAY · COMPLETE ARCHIVE POSTER
              </span>
            </p>
          </div>

          <span className="shrink-0 font-mono text-[9px] sm:text-xs font-bold tracking-widest text-paper/90 bg-ink/35 px-2 py-0.5 rounded border border-ink/40">
            ISSUE #1
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MAIN SHOWCASE: Complete Uncropped 3:4 Poster + Comic Wings          */}
      {/* 100% of the image is shown crystal-clear without any blur           */}
      {/* =================================================================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Comic Wing (Desktop Widescreen) */}
        <aside className="hidden lg:flex flex-col gap-6 shrink-0 w-60">
          {/* Vintage Comic Corner Box */}
          <div className="border-4 border-ink bg-paper text-ink p-4 rounded-xl shadow-[6px_6px_0_0_#0f172a] -rotate-2">
            <div className="flex items-center justify-between border-b-2 border-ink pb-2">
              <span className="font-comic text-xl text-hero-red">MARVEL</span>
              <span className="font-mono text-xs font-bold bg-mustard px-2 py-0.5 rounded border border-ink">
                75¢
              </span>
            </div>
            <div className="my-3 flex items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <Starburst className="animate-wobble absolute -inset-2 opacity-95" />
                <img
                  src="/logo.png"
                  alt="Spider logo"
                  className="relative z-10 h-12 w-12 object-contain drop-shadow-[2px_2px_0_rgba(15,23,42,0.9)]"
                />
              </div>
            </div>
            <p className="font-comic text-center text-sm tracking-wide text-ink">
              SPIDY-CAL <span className="text-hero-red">CALCULATOR</span>
            </p>
            <div className="mt-2 pt-2 border-t border-ink/20 text-center font-mono text-[10px] text-ink/70">
              ISSUE #1 · COLLECTOR EDITION
            </div>
          </div>

          {/* Comics Code Homage Stamp */}
          <div className="border-3 border-ink bg-paper/95 p-3 rounded-lg shadow-[4px_4px_0_0_#0f172a] rotate-1 text-center font-mono text-[11px] text-ink">
            <div className="border border-ink p-1.5 rounded">
              <p className="font-bold text-hero-red tracking-wider">APPROVED BY THE</p>
              <p className="font-comic text-base leading-tight">COMICS CODE</p>
              <p className="font-bold text-[9px] tracking-widest text-ink/60">★ AUTHORITY ★</p>
            </div>
          </div>
        </aside>

        {/* Center: The Complete Uncropped Poster (100% Crisp & Clear) */}
        <div className="relative mx-auto w-full max-w-[460px] sm:max-w-[540px] md:max-w-[600px] aspect-[3/4] rounded-2xl overflow-hidden border-4 border-ink shadow-[10px_10px_0_0_#0f172a] sm:shadow-[14px_14px_0_0_#0f172a] bg-[#be2629]">
          <img
            src="/footer-image.jpg"
            alt="Spider-Man: Brand New Day - Comic art featuring Spider-Man in action"
            className="h-full w-full object-cover object-top select-none pointer-events-none"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        {/* Right Comic Wing (Desktop Widescreen) */}
        <aside className="hidden lg:flex flex-col gap-6 shrink-0 w-60">
          {/* Action Speech Box */}
          <div className="border-4 border-ink bg-navy text-paper p-4 rounded-xl shadow-[6px_6px_0_0_#0f172a] rotate-2">
            <div className="flex items-center gap-2">
              <span className="font-comic text-lg text-mustard">MEANWHILE...</span>
            </div>
            <h4 className="mt-1 font-comic text-2xl text-paper leading-tight">
              SPIDER-SENSE <span className="text-hero-red">TINGLING!</span>
            </h4>
            <p className="mt-2 font-mono text-xs text-paper/80 leading-relaxed">
              Every math hero needs quick reflexes. Tap below to launch your calculator!
            </p>
            <Link
              to="/calculator"
              className="comic-btn btn-equals mt-4 block text-center py-2.5 text-base sm:text-lg"
            >
              OPEN CALC ⚡
            </Link>
          </div>

          {/* Fast Scroll to Top Card */}
          <div className="border-3 border-ink bg-paper text-ink p-3 rounded-lg shadow-[4px_4px_0_0_#0f172a] -rotate-1 text-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="comic-btn btn-blue w-full py-2 text-sm flex items-center justify-center gap-1.5"
            >
              <span>▲</span>
              <span>SWING TO TOP</span>
            </button>
          </div>
        </aside>
      </div>

      {/* =================================================================== */}
      {/* BOTTOM FOOTER BAR: Clean navigation & credits below the artwork */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full border-t-4 border-ink bg-ink/95 px-3 sm:px-4 py-4 sm:py-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6">
          {/* Brand Logo with moving Starburst background */}
          <div className="flex items-center gap-3 sm:gap-4 text-left">
            <Link to="/" className="group block shrink-0" aria-label="SPIDY Calculator home">
              <div className="relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center">
                <Starburst className="animate-wobble absolute -inset-2 opacity-95 transition-transform duration-200 group-hover:scale-115" />
                <img
                  src="/logo.png"
                  alt="Spidy Calculator Logo"
                  className="relative z-10 h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-[2px_2px_0_rgba(15,23,42,0.95)]"
                />
              </div>
            </Link>
            <div className="min-w-0">
              <h3 className="font-comic text-xl sm:text-2xl md:text-3xl text-paper tracking-wide leading-tight">
                MEANWHILE... <span className="text-mustard">SPIDER-SENSE TINGLING!</span>
              </h3>
              <p className="mt-0.5 font-mono text-[11px] sm:text-xs text-paper/70 truncate">
                Spidy Calculator · Friendly neighborhood superpower.
              </p>
            </div>
          </div>

          {/* Quick links & Back to Top */}
          <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t border-paper/10 sm:border-t-0">
            <div className="flex items-center gap-2.5 sm:gap-3 font-comic text-base sm:text-lg">
              <Link
                to="/"
                className="text-paper hover:text-mustard transition-colors tracking-wider"
              >
                HOME
              </Link>
              <span className="text-paper/40">·</span>
              <Link
                to="/calculator"
                className="text-mustard hover:text-mustard/80 transition-colors tracking-wider"
              >
                CALCULATOR ⚡
              </Link>
              <span className="text-paper/40 hidden lg:inline">·</span>
              <Link
                to="/privacy"
                className="text-paper hover:text-mustard transition-colors tracking-wider hidden lg:inline"
              >
                PRIVACY
              </Link>
              <span className="text-paper/40 hidden lg:inline">·</span>
              <Link
                to="/terms"
                className="text-paper hover:text-mustard transition-colors tracking-wider hidden lg:inline"
              >
                TERMS
              </Link>
            </div>
            <button
              type="button"
              onClick={scrollToTop}
              className="comic-btn btn-blue px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base flex items-center gap-1.5 shrink-0"
              aria-label="Back to top"
            >
              <span>▲</span>
              <span>BACK TO TOP</span>
            </button>
          </div>
        </div>

        {/* Legal & Credits with Privacy Policy & Terms Links */}
        <div className="mx-auto max-w-6xl mt-4 pt-3 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center font-mono text-[11px] sm:text-xs">
          <div className="flex flex-wrap items-center justify-center gap-3 text-paper/85">
            <Link
              to="/privacy"
              className="hover:text-mustard hover:underline transition-colors font-bold tracking-wider"
            >
              PRIVACY POLICY
            </Link>
            <span className="text-paper/30">|</span>
            <Link
              to="/terms"
              className="hover:text-mustard hover:underline transition-colors font-bold tracking-wider"
            >
              TERMS &amp; CONDITIONS
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-paper/50 text-[10px] sm:text-[11px]">
            <p>© 2026 Spidy Calculator · Zero ads · Zero tracking</p>
            <span className="hidden sm:inline text-paper/30">·</span>
            <p className="text-[9px] sm:text-[10px] text-paper/40">Classic vintage comic homage</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
