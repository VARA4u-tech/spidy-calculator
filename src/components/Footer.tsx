import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { Web } from "@/components/comic";
import { sfxClick, sfxToggle } from "@/lib/sounds";

export function Footer() {
  const reduce = useReducedMotion();
  const [forceClear, setForceClear] = useState(false);

  const scrollToTop = () => {
    sfxClick();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="relative mt-20 w-full overflow-hidden border-t-4 border-ink bg-[#be2629] text-paper min-h-[580px] sm:min-h-[720px] md:min-h-[860px] flex flex-col justify-between select-none">
      {/* ============================================================== */}
      {/* FULL-SECTION EXPANDED IMAGE WITH PROGRESSIVE DEPTH BLUR        */}
      {/* Top half is softly blurred; Bottom half is 100% razor sharp!  */}
      {/* ============================================================== */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* 1. Base Image - Expands edge-to-edge across the entire section, 100% sharp */}
        <img
          src="/footer-image.jpg"
          alt="Spider-Man: Brand New Day - Comic art"
          className="h-full w-full object-cover object-top sm:object-center select-none"
          loading="lazy"
          draggable={false}
        />

        {/* 2. Top-Half Progressive Blur Overlay (first half blurred, second half clear) */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-500 ${
            forceClear ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Layer A: Hardware-accelerated blurred image with vertical alpha gradient mask */}
          <img
            src="/footer-image.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top sm:object-center select-none blur-[12px] sm:blur-[18px] md:blur-[22px] scale-[1.03]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0) 54%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.4) 42%, rgba(0,0,0,0) 54%)",
            }}
            draggable={false}
          />

          {/* Layer B: Optical backdrop-filter for smooth diffusion */}
          <div
            className="absolute inset-0 backdrop-blur-[8px] sm:backdrop-blur-[12px]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 24%, rgba(0,0,0,0) 48%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 24%, rgba(0,0,0,0) 48%)",
            }}
          />
        </div>

        {/* Top atmospheric fade from site background */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-ink via-ink/65 to-transparent pointer-events-none"
        />

        {/* Bottom atmospheric shadow for footer readability */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-ink via-ink/75 to-transparent pointer-events-none"
        />

        {/* Decorative corner webs */}
        <Web className="absolute -top-8 -left-8 h-44 w-44 text-paper/20 sm:h-64 sm:w-64" />
        <Web className="absolute -bottom-8 -right-8 h-48 w-48 rotate-180 text-paper/20 sm:h-72 sm:w-72" />
      </div>

      {/* ============================================================== */}
      {/* SECTION TOP HEADER & CONTROLS (Over the blurred top region)   */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full">
        {/* Comic Masthead Strip */}
        <div className="border-b-4 border-ink bg-hero-red/90 backdrop-blur-sm py-2 px-4 flex flex-wrap items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Spider mask"
              className="h-5 w-5 sm:h-6 sm:w-6 object-contain drop-shadow-[1px_1px_0_rgba(15,23,42,0.8)]"
            />
            <p className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.22em] text-paper uppercase">
              SPIDER-MAN: BRAND NEW DAY · ISSUE #1 ARCHIVE FOOTER
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sfxToggle();
              setForceClear((v) => !v);
            }}
            className="inline-flex items-center gap-1.5 rounded bg-mustard px-2.5 py-1 text-[11px] font-bold text-ink uppercase tracking-wider border-2 border-ink shadow-[2px_2px_0_0_#0f172a] hover:bg-mustard/90 active:translate-y-0.5 transition-transform"
            title="Toggle focus"
          >
            <span>{forceClear ? "↺ RESTORE BLUR" : "👁 FOCUS ALL"}</span>
          </button>
        </div>

        {/* Visual blur indicators */}
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:pt-6 flex justify-between items-start pointer-events-none">
          <span className="rounded border-2 border-ink bg-mustard/95 px-3 py-1 font-comic text-xs tracking-wider text-ink shadow-[3px_3px_0_0_#0f172a]">
            TOP: SOFT BLUR FOCUS
          </span>
          <span className="hidden sm:inline-block rounded border-2 border-ink bg-navy/90 backdrop-blur-sm px-3 py-1 font-mono text-[11px] text-paper/80 shadow-[3px_3px_0_0_#0f172a]">
            SCROLL TO SHARPEN ↓
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION CENTER: Unobstructed view of Spider-Man & Comic Art    */}
      {/* ============================================================== */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-4 pb-6 sm:pb-8 pointer-events-none">
        <div className="mx-auto max-w-6xl w-full flex justify-end">
          <span className="rounded border-2 border-ink bg-paper px-3 py-1.5 font-comic text-xs sm:text-sm tracking-wider text-hero-red shadow-[4px_4px_0_0_#0f172a]">
            BOTTOM: 100% SHARP THWIP!
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION BOTTOM: Navigation, Back-to-Top, and Comic Credits     */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full border-t-4 border-ink bg-ink/90 backdrop-blur-md px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand Logo & Narrative stamp */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
            <Link to="/" className="group block shrink-0" aria-label="Web-Slinger Calculator home">
              <img
                src="/logo.png"
                alt="Web-Slinger Calculator Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6 drop-shadow-[2px_2px_0_rgba(15,23,42,0.9)]"
              />
            </Link>
            <div>
              <h3 className="font-comic text-2xl sm:text-3xl text-paper tracking-wide">
                MEANWHILE... <span className="text-mustard">SPIDER-SENSE TINGLING!</span>
              </h3>
              <p className="mt-1 font-mono text-xs text-paper/70">
                Web-Slinger Calculator · Math with friendly neighborhood superpower.
              </p>
            </div>
          </div>

          {/* Quick links & Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="font-comic text-lg text-paper hover:text-mustard transition-colors tracking-wider px-2 py-1"
            >
              HOME
            </Link>
            <span className="text-paper/40">·</span>
            <Link
              to="/calculator"
              className="font-comic text-lg text-mustard hover:text-mustard/80 transition-colors tracking-wider px-2 py-1"
            >
              CALCULATOR ⚡
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="comic-btn btn-blue px-4 py-2 text-sm sm:text-base flex items-center gap-1.5"
              aria-label="Back to top"
            >
              <span>▲</span>
              <span>BACK TO TOP</span>
            </button>
          </div>
        </div>

        {/* Legal & Credits */}
        <div className="mx-auto max-w-6xl mt-6 pt-4 border-t border-paper/15 text-center sm:flex sm:items-center sm:justify-between font-mono text-[11px] text-paper/50">
          <p>© 2026 Web-Slinger Calculator · Zero ads · Zero tracking</p>
          <p className="mt-2 sm:mt-0 text-[10px] text-paper/40">
            Spider-Man homage · Classic vintage comic aesthetic
          </p>
        </div>
      </div>
    </footer>
  );
}
