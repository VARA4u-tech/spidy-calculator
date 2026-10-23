import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Web({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <line key={a} x1="0" y1="0" x2={100 * Math.cos((a * Math.PI) / 360)} y2={100 * Math.sin((a * Math.PI) / 360)} />
      ))}
      {[25, 50, 75, 100].map((r) => (
        <path key={r} d={`M ${r} 0 Q ${r * 0.8} ${r * 0.35} ${r * 0.7} ${r * 0.7} Q ${r * 0.35} ${r * 0.8} 0 ${r}`} />
      ))}
    </svg>
  );
}

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden px-3 py-8 sm:px-4 sm:py-14" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <Web className="pointer-events-none absolute top-0 left-0 h-48 w-48 text-paper/25 sm:h-72 sm:w-72" />
      <Web className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 rotate-180 text-paper/20 sm:h-72 sm:w-72" />
      <header className="relative mx-auto mb-10 max-w-3xl text-center">
        <p className="font-comic mx-auto mb-3 inline-block -rotate-2 border-4 border-ink bg-mustard px-4 py-1 text-lg text-ink shadow-[4px_4px_0_var(--ink)]">
          Issue #1 · Web-Slinger Calculator
        </p>
        <h1 className="font-comic print-shadow-text text-4xl leading-none text-paper min-[420px]:text-5xl sm:text-7xl">
          THWIP! <span className="text-mustard">LET'S DO</span> THE MATH.
        </h1>
        <p className="mt-4 inline-block bg-hero-blue px-3 py-1 font-mono text-xs tracking-widest text-paper sm:text-sm">
          YOUR FRIENDLY NEIGHBORHOOD CALCULATOR
        </p>
      </header>
      <div className="relative flex justify-center">
        <Calculator />
      </div>
    </main>
  );
}
