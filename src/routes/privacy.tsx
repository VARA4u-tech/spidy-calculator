import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Starburst, Web } from "@/components/comic";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Spidy Calculator" },
      {
        name: "description",
        content:
          "Spidy Calculator Privacy Policy: zero ads, zero trackers, 100% private client-side calculations.",
      },
      { property: "og:title", content: "Privacy Policy — Spidy Calculator" },
      {
        property: "og:description",
        content: "Zero data collection. 100% private calculations in your browser.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            <span>🛡️ CONFIDENTIAL DOSSIER</span>
            <span>·</span>
            <span>ISSUE #1</span>
          </div>

          <h1 className="font-comic print-shadow-text text-4xl sm:text-6xl text-paper leading-tight">
            PRIVACY <span className="text-mustard">POLICY</span>
          </h1>

          <p className="mt-2 font-mono text-xs sm:text-sm text-paper/80 max-w-lg mx-auto">
            Your secret identity is safe with us. We collect zero personal data, run zero trackers,
            and respect your privacy 100%.
          </p>

          <p className="mt-1 font-mono text-[11px] text-paper/50">
            Effective Date: October 29, 2026
          </p>
        </header>

        {/* Content Panels */}
        <div className="space-y-6 sm:space-y-8">
          {/* Section 1: The Golden Rule */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">01</span>
              <h2 className="font-comic text-2xl text-hero-blue">Zero Personal Data Collection</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              Spidy Calculator was built with a simple superhero principle:{" "}
              <strong>your calculations belong only to you</strong>. We do not require you to create
              an account, log in, provide an email address, or enter any personal identity details.
              You can use all standard and scientific features without ever revealing who you are.
            </p>
          </section>

          {/* Section 2: Pure Client-Side Computation */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">02</span>
              <h2 className="font-comic text-2xl text-hero-blue">100% Client-Side Calculations</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              Every single equation, button tap, and calculation happens strictly inside your
              device’s web browser. Nothing you type—whether calculating lunch bills, trigonometry,
              or physics homework—is ever transmitted over the internet or saved to our servers. If
              you unplug your internet connection, the calculator continues to work seamlessly!
            </p>
          </section>

          {/* Section 3: Local Storage & Case Files History */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">03</span>
              <h2 className="font-comic text-2xl text-hero-blue">Browser Local Storage</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              For your convenience, Spidy Calculator remembers two items in your browser's local
              storage (<code>localStorage</code>):
            </p>
            <ul className="mt-2 space-y-1.5 font-mono text-xs sm:text-sm text-ink/90 list-disc list-inside">
              <li>
                <strong>Case Files History:</strong> Your recent calculation history (up to 20
                entries) is saved on your device so you can view past results. You can wipe this
                entire log anytime by tapping the <strong>"Clear"</strong> button in Case Files.
              </li>
              <li>
                <strong>Sound Effects Preference:</strong> Whether you prefer comic SFX sound
                effects enabled or muted.
              </li>
            </ul>
            <p className="mt-2.5 font-mono text-xs text-ink/70">
              This data stays exclusively on your device and is never uploaded, synced, or shared.
            </p>
          </section>

          {/* Section 4: Zero Cookies & Zero Third-Party Trackers */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">04</span>
              <h2 className="font-comic text-2xl text-hero-blue">
                No Ads, No Trackers, No Cookies
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              We do not use tracking cookies, analytics pixels, advertising SDKs, or third-party
              marketing scripts. We do not sell, rent, or monetize user data. Spidy Calculator is
              free, ad-free, and tracker-free.
            </p>
          </section>

          {/* Section 5: Children's Privacy */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">05</span>
              <h2 className="font-comic text-2xl text-hero-blue">Children's Privacy Protection</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              Because we collect no personal data whatsoever, Spidy Calculator is safe for students,
              kids, and users of all ages, fully compliant with COPPA and global child privacy
              regulations.
            </p>
          </section>

          {/* Section 6: Contact & Updates */}
          <section className="panel rounded-xl p-5 sm:p-7 bg-paper text-ink shadow-[6px_6px_0_0_var(--ink)] border-3 border-ink">
            <div className="flex items-center gap-2 border-b-2 border-ink pb-2 mb-3">
              <span className="font-comic text-2xl text-hero-red">06</span>
              <h2 className="font-comic text-2xl text-hero-blue">Questions & Policy Updates</h2>
            </div>
            <p className="font-mono text-xs sm:text-sm leading-relaxed text-ink/90">
              If we ever update this policy, revisions will be published right here on this page
              with an updated effective date. If you have questions about privacy, feel free to
              visit our project repository.
            </p>
          </section>
        </div>

        {/* Back to actions */}
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
