import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  m as motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionConfig,
} from "framer-motion";
import { Web, Starburst } from "@/components/comic";
import { Footer } from "@/components/Footer";
import { getAbsoluteSiteUrl, getCanonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Free Online Calculator | Spidy Calculator" },
      {
        name: "description",
        content:
          "Use a free online math calculator for arithmetic, percentages, and scientific functions. No download or account needed; works on desktop and mobile.",
      },
      { property: "og:title", content: "Free Online Calculator | Spidy Calculator" },
      {
        property: "og:description",
        content:
          "A free online calculator for everyday arithmetic and scientific functions, with keyboard support and private on-device history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Spidy Calculator",
          description: "A free online calculator for everyday arithmetic and scientific functions.",
          ...(getAbsoluteSiteUrl("/") ? { url: getAbsoluteSiteUrl("/") } : {}),
        },
      },
    ],
    links: [{ rel: "canonical", href: getCanonicalUrl("/") }],
  }),
  component: Home,
});

const POWERS = [
  {
    badge: "POW",
    title: "Rapid-Fire Results",
    text: "Tap a key or type — the answer snaps back before the web dissolves.",
  },
  {
    badge: "ZAP",
    title: "Case File History",
    text: "Every solved mystery is logged. Tap a case to reuse its result instantly.",
  },
  {
    badge: "BAM",
    title: "Keyboard Combat",
    text: "Full keyboard control: digits, operators, Enter for equals, Esc to clear.",
  },
  {
    badge: "WHAM",
    title: "Foolproof Logic",
    text: "No eval tricks, no divide-by-zero zaps — math that never lies to a hero.",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "INPUT THE MISSION",
    text: "Type or tap the digits of your next big problem. Long numbers? Bring them on — 16 digits of precision.",
  },
  {
    n: "02",
    title: "PICK YOUR POWER",
    text: "Add, subtract, multiply or divide. Percent and sign-flip are in the utility belt too.",
  },
  {
    n: "03",
    title: "THWIP! THE ANSWER",
    text: "Hit equals and the result lands in the panel — and in your case-file history for later.",
  },
] as const;

const MARQUEE = [
  "SPIDY CALCULATOR",
  "THWIP!",
  "NO ADS",
  "KEYBOARD READY",
  "CASE FILE HISTORY",
  "DIVIDE-BY-ZERO PROOF",
  "PAPER-CUT PRECISION",
  "100% HAND-DRAWN VIBES",
] as const;

const STATS = [
  { k: "PRECISION", v: "16 DIGITS" },
  { k: "CASE FILES", v: "20 SAVED" },
  { k: "ADS SERVED", v: "NONE EVER" },
] as const;

function Home() {
  const reduce = useReducedMotion();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const webY1 = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const webY2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        window.setTimeout(() => {
          el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        }, 150);
      }
    }
  }, [reduce]);

  useEffect(() => {
    let disposed = false;
    let revertAnimations: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, scrollTriggerModule]) => {
        if (disposed) return;

        const gsap = gsapModule.default;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.to(marqueeRef.current, { xPercent: -50, ease: "none", duration: 24, repeat: -1 });

          const panels = gsap.utils.toArray<HTMLElement>(".step-panel");
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top top",
              end: "+=180%",
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
            },
          });
          panels.forEach((p, i) => {
            if (i === 0) return;
            tl.fromTo(
              p,
              { autoAlpha: 0, y: 60, rotate: i % 2 ? 3 : -3 },
              { autoAlpha: 1, y: 0, rotate: 0, duration: 1 },
              i,
            );
          });

          gsap.utils.toArray<HTMLElement>(".parallax-blob").forEach((b, i) => {
            gsap.to(b, {
              yPercent: i % 2 ? 24 : -24,
              ease: "none",
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });
        });
        mm.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set(".step-panel", { autoAlpha: 1, y: 0, rotate: 0 });
        });
        revertAnimations = () => mm.revert();
      })
      .catch((error: unknown) => {
        console.error("Failed to load homepage scroll animations.", error);
      });

    return () => {
      disposed = true;
      revertAnimations?.();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative overflow-x-clip">
        {/* Comic progress bar (Framer Motion scroll effect) */}
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-50 h-1.5 origin-left bg-mustard will-change-transform transform-gpu"
          style={{ scaleX: scrollYProgress }}
        />

        <motion.span
          aria-hidden
          style={{ y: webY1 }}
          className="pointer-events-none fixed -top-4 -left-4 z-0 will-change-transform transform-gpu"
        >
          <Web className="h-32 w-32 text-paper/20 min-[400px]:h-44 min-[400px]:w-44 sm:h-80 sm:w-80" />
        </motion.span>
        <motion.span
          aria-hidden
          style={{ y: webY2 }}
          className="pointer-events-none fixed -right-4 -bottom-4 z-0 will-change-transform transform-gpu"
        >
          <Web className="h-32 w-32 rotate-180 text-paper/15 min-[400px]:h-44 min-[400px]:w-44 sm:h-80 sm:w-80" />
        </motion.span>

        {/* Hero */}
        <section className="relative flex min-h-[85vh] sm:min-h-screen flex-col items-center justify-start pt-20 pb-16 sm:justify-center sm:pt-24 sm:pb-24 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.5 }}
            className="font-comic mb-6 inline-block border-4 border-ink bg-mustard px-4 py-1 text-base sm:text-lg text-ink shadow-[4px_4px_0_var(--ink)]"
          >
            Issue #1 · Spidy Calculator
          </motion.div>

          <h1 className="font-comic print-shadow-text max-w-4xl text-5xl leading-[0.95] text-paper min-[420px]:text-6xl sm:text-8xl">
            {"SPIDY".split(" ").map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, y: 40, rotate: 4 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 260, damping: 16 }}
                className="mr-[0.35em] inline-block"
              >
                {w}
              </motion.span>
            ))}
            <span className="block text-mustard">
              {"CALCULATOR.".split(" ").map((w, i) => (
                <motion.span
                  key={w}
                  initial={{ opacity: 0, y: 40, rotate: -4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    delay: 0.35 + i * 0.12,
                    type: "spring",
                    stiffness: 260,
                    damping: 16,
                  }}
                  className="mr-[0.35em] inline-block"
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-5 max-w-xl font-mono text-sm sm:text-base text-paper/80"
          >
            A retro comic-book calculator with punchy 3D buttons, a history case-file and full
            keyboard control. Your friendly neighborhood math sidekick.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/calculator" className="comic-btn btn-equals px-6 py-3.5 text-xl sm:text-2xl">
              OPEN THE CALCULATOR
            </Link>
            <a href="#powers" className="comic-btn btn-blue px-6 py-3.5 text-xl sm:text-2xl">
              SEE THE POWERS
            </a>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ delay: 0.95, type: "spring", stiffness: 200, damping: 10 }}
          >
            <Starburst
              label="POW"
              className="animate-wobble absolute top-20 right-[10%] h-16 w-16 text-lg sm:top-28 sm:h-24 sm:w-24 sm:text-2xl hidden min-[480px]:grid"
            />
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: 30 }}
            animate={{ scale: 1, rotate: -10 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 10 }}
          >
            <Starburst
              label="ZAP"
              className="animate-wobble absolute bottom-24 left-[8%] h-14 w-14 text-base sm:bottom-32 sm:h-20 sm:w-20 sm:text-xl hidden min-[480px]:grid"
            />
          </motion.div>

          <motion.a
            href="#powers"
            aria-label="Scroll to features"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="font-comic absolute bottom-6 text-mustard text-xl"
          >
            ▼ SCROLL
          </motion.a>
        </section>

        {/* GSAP infinite ticker */}
        <div className="relative overflow-hidden select-none border-y-4 border-ink bg-hero-red py-2.5 sm:py-3 text-paper shadow-[inset_0_0_0_3px_var(--ink)]">
          <div
            ref={marqueeRef}
            className="flex w-max items-center gap-6 sm:gap-8 whitespace-nowrap will-change-transform transform-gpu"
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-6 sm:gap-8" aria-hidden={copy === 1}>
                {MARQUEE.map((t) => (
                  <span key={t} className="font-comic text-lg sm:text-2xl">
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
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <motion.article
                  {...(reduce
                    ? {}
                    : {
                        animate: {
                          y: [0, -10, 0],
                          rotate: i % 2 ? [0.8, 2.2, 0.8] : [-0.8, -2.2, -0.8],
                        },
                      })}
                  transition={{
                    duration: 3.8 + (i % 2) * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.45,
                  }}
                  whileHover={{
                    y: -14,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  className="panel relative h-full rounded-xl p-6 sm:p-8 cursor-default will-change-transform transform-gpu shadow-[8px_8px_0_0_#0f172a]"
                >
                  <Starburst
                    label={p.badge}
                    className="absolute -top-4 -right-3 h-12 w-12 -rotate-12 text-sm shadow-md"
                  />
                  <h3 className="font-comic mb-2 text-2xl text-hero-blue sm:text-3xl">{p.title}</h3>
                  <p className="font-mono text-sm text-ink/80">{p.text}</p>
                </motion.article>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pinned, scrubbed how-it-works (GSAP ScrollTrigger) */}
        <section id="how-it-works" ref={stepsRef} className="relative scroll-mt-20">
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
                  <span className="font-comic halftone-red grid h-16 w-16 place-items-center rounded-full border-4 border-ink text-2xl text-paper">
                    {s.n}
                  </span>
                  <h3 className="font-comic text-3xl text-hero-red sm:text-4xl">{s.title}</h3>
                  <p className="max-w-md font-mono text-sm text-ink/80 sm:text-base">{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stats band with GSAP parallax blobs */}
        <section
          ref={statsRef}
          className="relative overflow-hidden border-y-4 border-ink bg-hero-blue py-16 text-paper"
        >
          <span
            aria-hidden
            className="parallax-blob halftone-red absolute -top-8 left-8 h-24 w-24 rotate-12 opacity-60"
          />
          <span
            aria-hidden
            className="parallax-blob halftone-red absolute -bottom-10 right-16 h-32 w-32 -rotate-6 opacity-50"
          />
          <div className="relative mx-auto grid max-w-4xl gap-8 px-4 text-center sm:grid-cols-3">
            {STATS.map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <p className="font-comic text-3xl text-mustard sm:text-4xl">{s.v}</p>
                <p className="mt-1 font-mono text-xs tracking-widest text-paper/80">{s.k}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="calculator-guide"
          className="relative mx-auto max-w-5xl scroll-mt-10 px-4 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-comic print-shadow-text text-4xl text-paper sm:text-6xl">
              A FREE ONLINE <span className="text-mustard">MATH CALCULATOR</span>
            </h2>
            <p className="mt-4 font-mono text-sm leading-relaxed text-paper/80 sm:text-base">
              Solve everyday arithmetic in your browser with a free calculator that needs no
              download or account. Enter calculations with the keypad or keyboard, then reopen
              recent results from your private case-file history.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="panel rounded-xl p-5 sm:p-6">
              <h3 className="font-comic text-2xl text-hero-blue sm:text-3xl">
                Standard calculator operations
              </h3>
              <p className="mt-2 font-mono text-sm leading-relaxed text-ink/80">
                Add, subtract, multiply, and divide decimal numbers; chain operations; clear or
                correct an entry; change its sign; or calculate a percentage. For example, enter{" "}
                <code className="rounded bg-paper-dark px-1">200 + 10%</code> to find 10% of 200
                added to 200, giving 220.
              </p>
            </article>
            <article className="panel rounded-xl p-5 sm:p-6">
              <h3 className="font-comic text-2xl text-hero-blue sm:text-3xl">
                Scientific calculator mode
              </h3>
              <p className="mt-2 font-mono text-sm leading-relaxed text-ink/80">
                Switch to Scientific Mode for trigonometry, inverse and hyperbolic functions,
                logarithms, powers, roots, factorials, constants π and e, reciprocals, and absolute
                values. Choose degrees or radians for angle-based calculations.
              </p>
            </article>
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <h2 className="font-comic print-shadow-text text-center text-4xl text-paper sm:text-5xl">
              CALCULATOR <span className="text-mustard">FAQ</span>
            </h2>
            <div className="mt-6 space-y-3">
              <details className="panel rounded-lg p-4">
                <summary className="cursor-pointer font-comic text-xl text-hero-blue">
                  Is this calculator free, and do I need to download anything?
                </summary>
                <p className="mt-2 font-mono text-sm leading-relaxed text-ink/80">
                  Yes. Spidy Calculator is free to use in a modern web browser. There is no
                  installation, account, or sign-up; calculations run on your device.
                </p>
              </details>
              <details className="panel rounded-lg p-4">
                <summary className="cursor-pointer font-comic text-xl text-hero-blue">
                  Which scientific functions are available?
                </summary>
                <p className="mt-2 font-mono text-sm leading-relaxed text-ink/80">
                  Scientific Mode includes sine, cosine, tangent and their inverses, hyperbolic
                  functions, base-10 and natural logarithms, powers, square and cube roots,
                  factorial, reciprocal, absolute value, π, and e. Trigonometric angles can use
                  degrees or radians.
                </p>
              </details>
              <details className="panel rounded-lg p-4">
                <summary className="cursor-pointer font-comic text-xl text-hero-blue">
                  Can I use the calculator with a keyboard?
                </summary>
                <p className="mt-2 font-mono text-sm leading-relaxed text-ink/80">
                  Yes. Type digits and arithmetic operators, press Enter or = for the result, use
                  Backspace to edit, and press Escape to clear. The visible keypad also supports
                  touch and mouse input.
                </p>
              </details>
              <details className="panel rounded-lg p-4">
                <summary className="cursor-pointer font-comic text-xl text-hero-blue">
                  Where is my calculation history stored?
                </summary>
                <p className="mt-2 font-mono text-sm leading-relaxed text-ink/80">
                  Recent results are stored in your browser on this device. They are not sent to a
                  calculator server, and you can clear the history from the calculator.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative mx-auto max-w-3xl px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="panel -rotate-1 rounded-xl p-8 sm:p-12"
          >
            <h2 className="font-comic print-shadow-text text-4xl text-ink sm:text-6xl">
              READY TO SWING <span className="text-hero-red">INTO ACTION?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md font-mono text-sm text-ink/80">
              Spidy Calculator is warmed up and waiting. Zero ads, zero sign-ups — pure math.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/calculator" className="comic-btn btn-red px-6 py-3 text-xl sm:text-2xl">
                THWIP! OPEN CALCULATOR
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Comic Footer with Progressive Blur Poster */}
        <Footer />
      </main>
    </MotionConfig>
  );
}
