import { useState } from "react";
import { m as motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { Starburst } from "@/components/comic";
import { sfxToggle } from "@/lib/sounds";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  badge?: string;
}

export const FAQS: FAQItem[] = [
  {
    id: "free-and-ads",
    question: "Is Spidy Calculator truly 100% free with zero ads?",
    answer:
      "Yes, completely! There are zero banner ads, zero video popups, zero tracking trackers, and no paywalls. Spidy Calculator is built as an open-source, community-first math laboratory where you can solve problems with zero distractions.",
    badge: "100% FREE",
  },
  {
    id: "offline-pwa",
    question: "Does it work offline without an active internet connection?",
    answer:
      "Absolutely. Spidy Calculator is a Progressive Web App (PWA) with full service worker caching. Once visited in your browser, the entire app shell, sound effects, and math engines are cached locally. You can use it anywhere — on a flight, on the subway, or during network outages.",
    badge: "OFFLINE READY",
  },
  {
    id: "suites-and-powers",
    question: "What calculation modes and suites are available?",
    answer:
      "Spidy Calculator packs 7 specialized calculation powers into one platform: (1) Scientific Keypad with trigonometry, factorials, and powers; (2) 5-in-1 Percentage Suite; (3) 6-dimension Unit Converter (length, mass, temperature, speed, area, volume); (4) Maths & Fractions solver; (5) Interactive Soroban Abacus with 'Type to Animate' bead movement; (6) Darts 501/301 Match Scorer with checkout paths; and (7) Everyday Utilities including patio materials and international ring sizing.",
    badge: "7 SUITES",
  },
  {
    id: "privacy-and-storage",
    question: "Is my calculation history stored privately? Does it send data to servers?",
    answer:
      "Your privacy is absolute. All math calculations, state machines, and Case Files history are executed and stored strictly on your local device via standard browser storage. No calculation inputs, history, or telemetry data are ever transmitted to any remote server or third party.",
    badge: "100% PRIVATE",
  },
  {
    id: "install-instructions",
    question: "How do I install Spidy Calculator on my phone or computer?",
    answer:
      "On Chrome or Edge (Desktop and Android), click the 'Install App' icon in the address bar or browser menu. On iPhone and iPad (Safari), tap the Share icon (square with arrow up) and select 'Add to Home Screen'. The app will launch in standalone fullscreen mode just like a native app.",
    badge: "PWA APP",
  },
  {
    id: "keyboard-shortcuts",
    question: "Can I use keyboard shortcuts on desktop?",
    answer:
      "Yes! The calculator features comprehensive desktop keyboard support. Type numbers 0-9, operators (+, -, *, /), Enter or = for equals, Backspace to delete, Escape or 'c' to clear, and press '?' at any time to open the complete visual keyboard shortcut modal.",
    badge: "SHORTCUTS",
  },
  {
    id: "open-source-github",
    question: "Is the project open source? How can I contribute or star it?",
    answer:
      "Yes, Spidy Calculator is fully open-source under the MIT license! You can visit our GitHub repository (github.com/VARA4u-tech/spidy-calculator) to Star ⭐ the project, Fork 🍴 the codebase to create your own custom calculator engines, or report suggestions and improvements.",
    badge: "OPEN SOURCE",
  },
];

export function FAQSection() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "free-and-ads": true,
  });
  const reduce = useReducedMotion();

  const toggleFAQ = (id: string) => {
    sfxToggle();
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="relative mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:py-20">
      {/* Halftone corner badge */}
      <div className="relative mx-auto max-w-3xl text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mustard px-4 py-1 text-xs font-mono font-bold tracking-widest text-ink shadow-[2px_2px_0_var(--ink)] mb-3">
          <HelpCircle className="h-3.5 w-3.5 text-hero-red" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
          <span className="text-hero-red">★</span>
        </div>

        <h2 className="font-comic print-shadow-text text-4xl text-paper sm:text-5xl lg:text-6xl">
          GOT QUESTIONS? <span className="text-mustard">WE'VE GOT ANSWERS!</span>
        </h2>

        <p className="mt-3 font-mono text-sm leading-relaxed text-paper/85 sm:text-base max-w-2xl mx-auto">
          Everything you need to know about Spidy Calculator’s 7 power suites, offline PWA
          capabilities, privacy guarantees, and open-source multiverse.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {FAQS.map((faq, index) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border-3 border-ink transition-all duration-150 ${
                isOpen
                  ? "bg-paper shadow-[5px_5px_0_var(--ink)]"
                  : "bg-paper/95 shadow-[3px_3px_0_var(--ink)] hover:bg-paper hover:shadow-[4px_4px_0_var(--ink)]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 text-left cursor-pointer focus-visible:outline-3 focus-visible:outline-hero-blue rounded-2xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-comic flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-mustard text-xs sm:text-sm font-bold text-ink shadow-[1px_1px_0_var(--ink)]">
                    Q{index + 1}
                  </span>
                  <span className="font-comic text-lg sm:text-xl text-ink font-bold leading-tight">
                    {faq.question}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {faq.badge && (
                    <span className="hidden sm:inline-block rounded border border-ink/40 bg-mustard/30 px-2 py-0.5 font-mono text-[10px] font-bold text-ink/80 uppercase">
                      {faq.badge}
                    </span>
                  )}
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-paper-dark transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-mustard" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4 text-ink" />
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${faq.id}`}
                    initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t-2 border-ink/15 px-4 pb-5 pt-3 sm:px-5 sm:pb-5">
                      <p className="font-mono text-sm leading-relaxed text-ink/85 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Comic encouragement badge at bottom of FAQ */}
      <div className="mt-8 flex items-center justify-center gap-2 text-center">
        <Starburst label="POW" className="h-6 w-6 text-[8px]" />
        <span className="font-mono text-xs font-bold tracking-wider text-paper/80 uppercase">
          Still have questions? Check the Case Files or inspect the code on GitHub!
        </span>
        <Sparkles className="h-4 w-4 text-mustard" />
      </div>
    </section>
  );
}
