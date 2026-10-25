import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { Starburst, Web } from "@/components/comic";
import { sfxClick, sfxToggle } from "@/lib/sounds";

export function Footer() {
  const reduce = useReducedMotion();
  const [forceClear, setForceClear] = useState(false);

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

      {/* Decorative corner spider webs */}
      <Web className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 text-ink/25 sm:h-64 sm:w-64" />
      <Web className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rotate-180 text-ink/25 sm:h-72 sm:w-72" />

      {/* Top comic issue strip */}
      <div className="relative z-10 border-b-4 border-ink bg-hero-red py-2 px-4 shadow-md">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-1 opacity-90" />
              <img
                src="/logo.png"
                alt="Spider mask"
                className="relative z-10 h-4.5 w-4.5 object-contain"
              />
            </div>
            <p className="font-mono text-[11px] sm:text-xs font-bold tracking-[0.22em] text-paper uppercase">
              SPIDER-MAN: BRAND NEW DAY · COMPLETE ARCHIVE POSTER
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
      </div>

      {/* =================================================================== */}
      {/* MAIN SHOWCASE: Centered Uncropped 3:4 Poster + Comic Wings          */}
      {/* 100% of the image is shown from top "Brand New Day" to bottom "THWIP" */}
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
              WEB-SLINGER <span className="text-hero-red">CALCULATOR</span>
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

        {/* Center: The Complete Uncropped Poster (Natural 3:4 Aspect Ratio) */}
        <div className="relative mx-auto w-full max-w-[460px] sm:max-w-[540px] md:max-w-[600px] aspect-[3/4] rounded-2xl overflow-hidden border-4 border-ink shadow-[10px_10px_0_0_#0f172a] sm:shadow-[14px_14px_0_0_#0f172a] bg-[#be2629]">
          {/* 1. Base Image - 100% UNTOUCHED, UN-CROPPED, FULLY VISIBLE */}
          <img
            src="/footer-image.jpg"
            alt="Spider-Man: Brand New Day - Comic art featuring Spider-Man in action"
            className="h-full w-full object-cover object-top select-none pointer-events-none"
            loading="lazy"
            draggable={false}
          />

          {/* 2. Top-Half Progressive Blur Overlay (first half blurred, second half clear) */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
              forceClear ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Blurred image layer with gradient alpha mask */}
            <img
              src="/footer-image.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top select-none blur-[10px] sm:blur-[14px] scale-[1.03]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.3) 42%, rgba(0,0,0,0) 54%)",
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.3) 42%, rgba(0,0,0,0) 54%)",
              }}
              draggable={false}
            />

            {/* Secondary smooth optical blur */}
            <div
              className="absolute inset-0 backdrop-blur-[6px]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 24%, rgba(0,0,0,0) 48%)",
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 24%, rgba(0,0,0,0) 48%)",
              }}
            />

            {/* Subtle top vignette */}
            <div
              className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink/30 to-transparent"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Visual Indicators for Progressive Depth */}
          <div className="pointer-events-none absolute top-3 left-3 rounded border-2 border-ink bg-mustard/95 px-2.5 py-1 font-comic text-[11px] sm:text-xs tracking-wider text-ink shadow-[2px_2px_0_0_#0f172a]">
            TOP: SOFT BLUR FOCUS
          </div>

          <div className="pointer-events-none absolute bottom-3 right-3 rounded border-2 border-ink bg-paper px-3 py-1 font-comic text-xs sm:text-sm tracking-wider text-hero-red shadow-[3px_3px_0_0_#0f172a]">
            BOTTOM: 100% SHARP THWIP!
          </div>
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
      {/* BOTTOM FOOTER BAR: Clean navigation & credits below the artwork     */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full border-t-4 border-ink bg-ink/95 px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand Logo with moving Starburst background */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <Link to="/" className="group block shrink-0" aria-label="Web-Slinger Calculator home">
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center">
                <Starburst
                  className="animate-wobble absolute -inset-2.5 h-auto w-auto opacity-95 transition-transform duration-200 group-hover:scale-115"
                />
                <img
                  src="/logo.png"
                  alt="Web-Slinger Calculator Logo"
                  className="relative z-10 h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-[2px_2px_0_rgba(15,23,42,0.95)]"
                />
              </div>
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
