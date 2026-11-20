"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Starburst } from "@/components/comic";
import { sfxClick, sfxToggle } from "@/lib/sounds";
import { X, Keyboard, Zap, Sparkles } from "lucide-react";

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  label: string;
  desc: string;
}

const SHORTCUT_GROUPS: {
  category: string;
  badge: string;
  badgeColor: string;
  shortcuts: ShortcutItem[];
}[] = [
  {
    category: "Basic Arithmetic & Digits",
    badge: "123",
    badgeColor: "bg-mustard text-ink",
    shortcuts: [
      { keys: ["0 - 9", "."], label: "Digits & Decimals", desc: "Type numbers directly" },
      {
        keys: ["+", "-", "*", "/"],
        label: "Operators (+ - × ÷)",
        desc: "Stage arithmetic operations",
      },
      { keys: ["Enter", "="], label: "Compute Equals", desc: "Execute calculation (THWIP!)" },
      { keys: ["Esc", "Del"], label: "Clear All (AC)", desc: "Reset display & memory" },
      { keys: ["Backspace"], label: "Delete Digit", desc: "Remove last typed character" },
      { keys: ["%"], label: "Percentage", desc: "Compute percent of stored operand" },
    ],
  },
  {
    category: "Scientific & Powers Deck",
    badge: "Sci-Tech",
    badgeColor: "bg-hero-blue text-paper",
    shortcuts: [
      { keys: ["^"], label: "Power Exponent", desc: "x raised to y exponent (x^y)" },
      { keys: ["!"], label: "Factorial", desc: "Compute n! of current number" },
      { keys: ["p"], label: "Pi (π)", desc: "Insert 3.141592653589793" },
      { keys: ["s", "c", "t"], label: "Trigonometry", desc: "Trig functions (sin, cos, tan)" },
      { keys: ["r"], label: "Square Root", desc: "Compute square root of display" },
      { keys: ["l"], label: "Logarithm", desc: "Compute log base 10" },
    ],
  },
  {
    category: "Pro Speed Controls",
    badge: "Combat",
    badgeColor: "bg-hero-red text-paper",
    shortcuts: [
      { keys: ["Ctrl", "C"], label: "Copy Result", desc: "Copy display value to clipboard" },
      { keys: ["?"], label: "Shortcuts Sheet", desc: "Toggle this cheat sheet modal" },
      { keys: ["Esc"], label: "Close Modal", desc: "Close popup dialog & resume math" },
    ],
  },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const reduce = useReducedMotion();

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        sfxToggle();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/80 backdrop-blur-sm overflow-y-auto"
        >
          {/* Backdrop Click Dismiss */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => {
              sfxToggle();
              onClose();
            }}
          />

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="panel relative w-full max-w-2xl rounded-2xl border-4 border-ink bg-paper p-5 sm:p-7 text-ink shadow-[8px_8px_0_0_#0f172a] my-auto"
          >
            {/* Pop-Art Starburst Badge */}
            <div className="absolute -top-4 -left-3 hidden sm:block">
              <Starburst label="BAM!" className="h-14 w-14 text-sm -rotate-12" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b-3 border-ink pb-4 sm:pl-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg border-2 border-ink bg-mustard text-ink shadow-[2px_2px_0_var(--ink)]">
                    <Keyboard className="h-4 w-4" />
                  </span>
                  <span className="font-comic text-xs font-bold uppercase tracking-wider text-hero-blue">
                    SPIDY KEYBOARD COMBAT
                  </span>
                </div>
                <h2
                  id="shortcuts-title"
                  className="font-comic text-2xl sm:text-3xl text-ink font-bold mt-1 leading-tight"
                >
                  KEYBOARD SHORTCUTS <span className="text-hero-red">CHEAT SHEET</span>
                </h2>
                <p className="font-mono text-xs text-ink/75 mt-0.5">
                  Press keys directly anywhere on the calculator for supersonic calculations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sfxClick();
                  onClose();
                }}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-3 border-ink bg-hero-red text-paper shadow-[3px_3px_0_var(--ink)] hover:brightness-110 active:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Close shortcuts modal"
              >
                <X className="h-5 w-5 stroke-[3]" />
              </button>
            </div>

            {/* Shortcut Groups Grid */}
            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {SHORTCUT_GROUPS.map((group) => (
                <div
                  key={group.category}
                  className="rounded-xl border-3 border-ink bg-parchment p-3.5 sm:p-4 shadow-[3px_3px_0_0_var(--ink)] space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b-2 border-ink/15 pb-1.5">
                    <span className="font-comic text-sm font-bold text-hero-blue uppercase tracking-wide">
                      {group.category}
                    </span>
                    <span
                      className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-ink shadow-[1px_1px_0_var(--ink)] ${group.badgeColor}`}
                    >
                      {group.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.shortcuts.map((sc) => (
                      <div
                        key={sc.label}
                        className="flex items-center justify-between gap-2 rounded-lg border-2 border-ink/20 bg-paper p-2 hover:border-ink transition-colors"
                      >
                        <div>
                          <p className="font-comic text-xs font-bold text-ink leading-tight">
                            {sc.label}
                          </p>
                          <p className="font-mono text-[10px] text-ink/65 leading-tight">
                            {sc.desc}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {sc.keys.map((k) => (
                            <kbd
                              key={k}
                              className="inline-flex min-w-[24px] items-center justify-center rounded-md border-2 border-ink bg-mustard/30 px-1.5 py-0.5 font-mono text-[11px] font-black text-ink shadow-[2px_2px_0_var(--ink)]"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer Callout */}
            <div className="mt-5 pt-3.5 border-t-3 border-ink flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 font-mono text-xs text-ink/75">
                <Sparkles className="h-4 w-4 text-mustard fill-mustard" />
                <span>
                  Tip: Press{" "}
                  <kbd className="font-mono font-bold bg-ink text-mustard px-1 rounded">?</kbd>{" "}
                  anytime to toggle this card!
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sfxClick();
                  onClose();
                }}
                className="comic-btn btn-equals px-5 py-2 text-sm sm:text-base font-bold flex items-center gap-1.5 shadow-[3px_3px_0_var(--ink)] cursor-pointer"
              >
                <span>⚡</span>
                <span>GOT IT, HERO! (ESC)</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
