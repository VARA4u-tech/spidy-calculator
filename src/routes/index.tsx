import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, MotionConfig } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Web, Starburst } from "@/components/comic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Web-Slinger Calculator — Home | Math with super strength" },
      { name: "description", content: "Meet your friendly neighborhood calculator: retro comic style, rapid-fire results, keyboard combat and a case-file history log." },
      { property: "og:title", content: "Web-Slinger Calculator" },
      { property: "og:description", content: "Math with super strength — a retro comic-book calculator with keyboard support and history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const POWERS = [
  { badge: "POW", title: "Rapid-Fire Results", text: "Tap a key or type — the answer snaps back before the web dissolves." },
  { badge: "ZAP", title: "Case File History", text: "Every solved mystery is logged. Tap a case to reuse its result instantly." },
  { badge: "BAM", title: "Keyboard Combat", text: "Full keyboard control: digits, operators, Enter for equals, Esc to clear." },
  { badge: "WHAM", title: "Foolproof Logic", text: "No eval tricks, no divide-by-zero zaps — math that never lies to a hero." },
] as const;

const STEPS = [
  { n: "01", title: "INPUT THE MISSION", text: "Type or tap the digits of your next big problem. Long numbers? Bring them on — 16 digits of precision." },
  { n: "02", title: "PICK YOUR POWER", text: "Add, subtract, multiply or divide. Percent and sign-flip are in the utility belt too." },
  { n: "03", title: "THWIP! THE ANSWER", text: "Hit equals and the result lands in the panel — and in your case-file history for later." },
] as const;

const MARQUEE = ["THWIP!", "NO ADS", "KEYBOARD READY", "CASE FILE HISTORY", "DIVIDE-BY-ZERO PROOF", "PAPER-CUT PRECISION", "100% HAND-DRAWN VIBES"] as const;

const STATS = [
  { k: "PRECISION", v: "16 DIGITS" },
  { k: "CASE FILES", v: "20 SAVED" },
  { k: "ADS SERVED", v: "NONE EVER" },
] as const;

function Home() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const webY1 = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const webY2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Infinite comic ticker
      gsap.to(marqueeRef.current, { xPercent: -50, ease: "none", duration: 22, repeat: -1 });
      // Pinned, scrubbed how-it-works sequence
      const panels = gsap.utils.toArray<HTMLElement>(".step-panel");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: stepsRef.current, start: "top top", end: "+=200%", scrub: 1, pin: true, anticipatePin: 1 },
      });
      panels.forEach((p, i) => {
        if (i === 0) return;
        tl.fromTo(p, { autoAlpha: 0, y: 70, rotate: i % 2 ? 4 : -4 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1 }, i);
      });
      // Parallax halftone blobs behind the stats band
      gsap.utils.toArray<HTMLElement>(".parallax-blob").forEach((b, i) => {
        gsap.to(b, { yPercent: i % 2 ? 28 : -28, ease: "none", scrollTrigger: { trigger: statsRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".step-panel", { autoAlpha: 1, y: 0, rotate: 0 });
    });
  });

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative overflow-x-clip">
        {/* Comic progress bar (Framer Motion scroll effect) */}
        <motion.div aria-hidden className="fixed inset-x-0 top-0 z-50 h-1.5 origin-left bg-mustard" style={{ scaleX: scrollYProgress }} />

        <motion.span aria-hidden style={{ y: webY1 }} className="pointer-events-none fixed top-10 left-0 z-0">
          <Web className="h-56 w-56 text-paper/20 sm:h-80 sm:w-80" />
        </motion.span>
        <motion.span aria-hidden style={{ y: webY2 }} className="pointer-events-none fixed right-0 bottom-0 z-0">
          <Web className="h-56 w-56 rotate-180 text-paper/15 sm:h-80 sm:w-80" />
        </motion.span>

        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: -16, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.5 }}
            className="font-comic mb-6 inline-block border-4 border-ink bg-mustard px-4 py-1 text-lg text-ink shadow-[4px_4px_0_var(--ink)]"
          >
            Issue #1 · Web-Slinger Calculator
          </motion.p>
          <h1 className="font-comic print-shadow-text max-w-4xl text-5xl leading-[0.95] text-paper min-[420px]:text-6xl sm:text-8xl">
            {"MATH WITH".split(" ").map((w, i) => (
              <motion.span key={w} initial={{ opacity: 0, y: 40, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 260, damping: 16 }} className="mr-[0.35em] inline-block">
                {w}
              </motion.span>
            ))}
            <span className="block text-mustard">
              {"SUPER STRENGTH.".split(" ").map((w, i) => (
                <motion.span key={w} initial={{ opacity: 0, y: 40, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.45 + i * 0.12, type: "spring", stiffness: 260, damping: 16 }} className="mr-[0.35em] inline-block">
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="mt-5 max-w-xl font-mono text-sm text-paper/80 sm:text-base">
            A retro comic-book calculator with punchy 3D buttons, a history case-file and full keyboard control. Your friendly neighborhood math sidekick.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.5 }} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/calculator" className="comic-btn btn-equals px-6 py-3 text-xl sm:text-2xl">
              OPEN THE CALCULATOR
            </Link>
            <a href="#powers" className="comic-btn btn-blue px-6 py-3 text-xl sm:text-2xl">
              SEE THE POWERS
            </a>
          </motion.div>
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 12 }} transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 10 }}>
            <Starburst label="POW" className="animate-wobble absolute top-24 right-[12%] h-16 w-16 text-lg sm:top-32 sm:h-24 sm:w-24 sm:text-2xl" />
          </motion.div>
          <motion.div initial={{ scale: 0, rotate: 30 }} animate={{ scale: 1, rotate: -10 }} transition={{ delay: 1.35, type: "spring", stiffness: 200, damping: 10 }}>
            <Starburst label="ZAP" className="animate-wobble absolute bottom-24 left-[10%] h-14 w-14 text-base sm:h-20 sm:w-20 sm:text-xl" />
          </motion.div>
          <motion.a href="#powers" aria-label="Scroll to features" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="font-comic absolute bottom-6 text-mustard text-xl">
            ▼ SCROLL
          </motion.a>
        </section>

        {/* GSAP infinite ticker */}
        <div className="relative border-y-4 border-ink bg-hero-red py-3 text-paper shadow-[inset_0_0_0_3px_var(--ink)]">
          <div ref={marqueeRef} className="flex w-max items-center gap-8 whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
                {MARQUEE.map((t) => (
                  <span key={t} className="font-comic text-xl sm:text-2xl">
                    {t} <span className="text-mustard">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Powers grid (Framer Motion scroll reveals) */}
        <section id="powers" className="relative mx-auto max-w-5xl scroll-mt-10 px-4 py-20">
          <h2 className="font-comic print-shadow-text mb-10 text-center text-4xl text-paper sm:text-6xl">
            THE HERO'S <span className="text-mustard">POWERS</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {POWERS.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 48, rotate: i % 2 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, rotate: 0 }}
                className="panel relative rounded-xl p-6 sm:p-8"
              >
                <Starburst label={p.badge} className="absolute -top-4 -right-3 h-12 w-12 -rotate-12 text-sm" />
                <h3 className="font-comic mb-2 text-2xl text-hero-blue sm:text-3xl">{p.title}</h3>
                <p className="font-mono text-sm text-ink/80">{p.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Pinned, scrubbed how-it-works (GSAP ScrollTrigger) */}
        <section ref={stepsRef} className="relative">
          <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
            <h2 className="font-comic print-shadow-text mb-8 text-4xl text-paper sm:text-6xl">
              HOW IT <span className="text-mustard">WORKS</span>
            </h2>
            <div className="relative h-[380px] w-full max-w-2xl sm:h-[340px]">
              {STEPS.map((s, i) => (
                <article
                  key={s.n}
                  className={`step-panel panel absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl p-8 text-center ${i === 0 ? "" : "opacity-0"}`}
                  style={i === 0 ? undefined : { visibility: "hidden" }}
                >
                  <span className="font-comic halftone-red grid h-16 w-16 place-items-center rounded-full border-4 border-ink text-2xl text-paper">{s.n}</span>
                  <h3 className="font-comic text-3xl text-hero-red sm:text-4xl">{s.title}</h3>
                  <p className="max-w-md font-mono text-sm text-ink/80 sm:text-base">{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stats band with GSAP parallax blobs */}
        <section ref={statsRef} className="relative overflow-hidden border-y-4 border-ink bg-hero-blue py-16 text-paper">
          <span aria-hidden className="parallax-blob halftone-red absolute -top-8 left-8 h-24 w-24 rotate-12 opacity-60" />
          <span aria-hidden className="parallax-blob halftone-red absolute -bottom-10 right-16 h-32 w-32 -rotate-6 opacity-50" />
          <div className="relative mx-auto grid max-w-4xl gap-8 px-4 text-center sm:grid-cols-3">
            {STATS.map((s, i) => (
              <motion.div key={s.k} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }}>
                <p className="font-comic text-3xl text-mustard sm:text-4xl">{s.v}</p>
                <p className="mt-1 font-mono text-xs tracking-widest text-paper/80">{s.k}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative mx-auto max-w-3xl px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5 }} className="panel -rotate-1 rounded-xl p-8 sm:p-12">
            <h2 className="font-comic print-shadow-text text-4xl text-ink sm:text-6xl">
              READY TO SWING <span className="text-hero-red">INTO ACTION?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md font-mono text-sm text-ink/80">The calculator is warmed up and waiting. Zero ads, zero sign-ups — just math.</p>
            <Link to="/calculator" className="comic-btn btn-red mt-8 inline-block px-6 py-3 text-xl sm:text-2xl">
              THWIP! DO THE MATH
            </Link>
          </motion.div>
          <p className="mt-10 font-mono text-xs text-paper/50">© 2026 Web-Slinger Calculator · A friendly neighborhood app</p>
        </section>
      </main>
    </MotionConfig>
  );
}
