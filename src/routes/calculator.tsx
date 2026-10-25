import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import { Web } from "@/components/comic";

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
    <main className="relative min-h-screen overflow-hidden px-3 py-6 sm:px-4 sm:py-12" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <Web className="pointer-events-none absolute top-0 left-0 h-48 w-48 text-paper/25 sm:h-72 sm:w-72" />
      <Web className="pointer-events-none absolute right-0 bottom-0 h-48 w-48 rotate-180 text-paper/20 sm:h-72 sm:w-72" />
      <div className="relative mx-auto mb-8 max-w-3xl text-center">
        <h1 className="font-comic print-shadow-text mt-4 text-3xl leading-none text-paper min-[420px]:text-4xl sm:text-5xl">
          THWIP! <span className="text-mustard">LET'S DO</span> THE MATH.
        </h1>
        <p className="mt-3 inline-block bg-hero-blue px-3 py-1 font-mono text-xs tracking-widest text-paper sm:text-sm">
          YOUR FRIENDLY NEIGHBORHOOD CALCULATOR
        </p>
      </div>
      <div className="relative flex justify-center">
        <Calculator />
      </div>
    </main>
  );
}
