import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Starburst, Web } from "@/components/comic";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Spidy Calculator" },
      {
        name: "description",
        content:
          "Terms and conditions for using Spidy Calculator: a free, retro comic-book calculator web app.",
      },
      { property: "og:title", content: "Terms & Conditions — Spidy Calculator" },
      {
        property: "og:description",
        content: "Terms of service for using Spidy Calculator. Fair use, non-commercial homage.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="relative min-h-screen bg-navy text-paper overflow-x-hidden">
      {/* Decorative corner spider webs */}
      <Web className="pointer-events-none absolute -top-4 -left-4 h-32 w-32 text-paper/15 sm:top-0 sm:left-0 sm:h-56 sm:w-56" />
      <Web className="pointer-events-none absolute top-72 -right-4 h-32 w-32 rotate-90 text-paper/10 sm:h-56 sm:w-56" />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:py-14">
        {/* Top Hero Banner */}
        <header className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mustard px-3.5 py-1 text-xs font-mono font-bold text-ink shadow-[2px_2px_0_var(--ink)] mb-3">
            <span>📜 CODE OF CONDUCT</span>
            <span>·</span>
            <span>ISSUE #1</span>
          </div>

          <h1 className="font-comic print-shadow-text text-4xl sm:text-6xl text-paper leading-tight">
            TERMS & <span className="text-mustard">CONDITIONS</span>
          </h1>

          <p className="mt-2 font-mono text-xs sm:text-sm text-paper/80 max-w-lg mx-auto">
            With great computing power comes great responsibility! Please review the terms governing
            your use of Spidy Calculator.
          </p>

          <p className="mt-1 font-mono text-[11px] text-paper/50">Last Updated: October 29, 2026</p>
        </header>

        {/* Content Panels */}
        <div className="space-y-6 sm:space-y-8">
          {/* Section 1: Acceptance */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">01</span>
              <h2 className="font-comic text-2xl text-hero-blue">Acceptance of Terms</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              By accessing or using <strong>Spidy Calculator</strong> (the "Application"), you agree
              to be bound by these Terms &amp; Conditions. If you do not agree with any part of
              these terms, you should discontinue using the Application.
            </p>
          </section>

          {/* Section 2: License & Fair Use */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">02</span>
              <h2 className="font-comic text-2xl text-hero-blue">
                Free License &amp; Permitted Use
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              Spidy Calculator is provided free of charge for personal, educational, and
              non-commercial use. You are granted a non-exclusive, non-transferable, revocable
              license to access and use the calculator for mathematical and calculation purposes.
            </p>
          </section>

          {/* Section 3: Computational Accuracy */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">03</span>
              <h2 className="font-comic text-2xl text-hero-blue">
                Mathematical Accuracy &amp; "As-Is" Warranty
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              While our calculation engine is tested rigorously to provide fast and accurate
              standard arithmetic and scientific functions, Spidy Calculator is provided on an{" "}
              <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties
              of any kind.
            </p>
            <p className="mt-2 font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              Spidy Calculator should not be used as the sole calculation tool for mission-critical
              life-safety, aerospace engineering, critical financial auditing, or medical dosage
              purposes without independent verification.
            </p>
          </section>

          {/* Section 4: Homage & Intellectual Property */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">04</span>
              <h2 className="font-comic text-2xl text-hero-blue">
                Homage &amp; Non-Commercial Disclaimer
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              Spidy Calculator is an open fan-inspired artistic homage celebrating classic vintage
              comic books and retro pop-art print aesthetics. Spider-Man, Marvel, and associated
              comic book characters and trademarks are the intellectual property of Marvel
              Characters, Inc. / The Walt Disney Company. This project is independent, educational,
              non-commercial, and not affiliated with, authorized, or sponsored by Marvel or Disney.
            </p>
          </section>

          {/* Section 5: Acceptable Use */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">05</span>
              <h2 className="font-comic text-2xl text-hero-blue">Acceptable Use</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              You agree not to use the Application in any manner that could disable, overburden,
              damage, or impair our infrastructure, or interfere with any other party's use and
              enjoyment of the service. Automated scraping, malicious attacks, or attempts to
              reverse engineer the backend service are prohibited.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">06</span>
              <h2 className="font-comic text-2xl text-hero-blue">Limitation of Liability</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              In no event shall the authors, creators, or contributors of Spidy Calculator be liable
              for any direct, indirect, incidental, special, consequential, or punitive damages
              arising out of or in connection with your use or inability to use the Application.
            </p>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link to="/calculator" className="comic-btn btn-red px-6 py-2.5 text-base sm:text-xl">
            ⚡ THWIP! OPEN CALCULATOR
          </Link>
          <Link to="/" className="comic-btn btn-blue px-5 py-2.5 text-base sm:text-lg">
            ◀ BACK TO HOME
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
