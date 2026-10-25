import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import { Starburst, Web } from "@/components/comic";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Web-Slinger Calculator — Thwip! Let's do the math" },
      { name: "description", content: "A retro comic-book calculator with history, keyboard support and punchy 3D buttons." },
      { property: "og:title", content: "Web-Slinger Calculator" },
      { property: "og:description", content: "Your friendly neighborhood calculator in vintage comic style." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  return (
    <main className="relative flex min-h-screen min-h-[100dvh] flex-col justify-start overflow-x-hidden p-2 pt-[max(env(safe-area-inset-top),0.5rem)] pb-[max(env(safe-area-inset-bottom),0.5rem)] sm:p-3 md:p-4 lg:h-screen lg:justify-center lg:overflow-hidden">
      <Web className="pointer-events-none absolute top-0 left-0 h-32 w-32 text-paper/20 sm:h-48 sm:w-48 hidden sm:block will-change-transform" />
      <Web className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 rotate-180 text-paper/15 sm:h-48 sm:w-48 hidden sm:block will-change-transform" />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
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
              THWIP! <span className="text-mustard">LET'S DO THE MATH.</span>
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest text-paper/70">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <Starburst className="animate-wobble absolute -inset-1 opacity-90" />
              <img src="/logo.png" alt="Spider logo" className="relative z-10 h-4.5 w-4.5 object-contain" />
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