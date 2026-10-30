import { useState, useEffect, useRef } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  MessageSquareText,
  User,
  Zap,
  Image as ImageIcon,
  Github,
  Globe,
  Mail,
  Linkedin,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Trash2,
  ArrowLeft,
  X,
  Sparkles,
  Send,
  BookOpen,
} from "lucide-react";
import { Starburst, Web } from "@/components/comic";
import {
  sfxClick,
  sfxToggle,
  toggleMuted,
  isMuted,
  loadSoundPref,
  SOUND_CHANGE_EVENT,
} from "@/lib/sounds";

type ActiveView = "menu" | "feedback" | "developer" | "quick-actions" | "preview";

interface FeedbackSubmission {
  message: string;
  category: string;
  timestamp: string;
}

const FEEDBACK_STORAGE_KEY = "spidy-feedback-log";

export function AboutDeveloper() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ActiveView>("menu");
  const [feedback, setFeedback] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("Suggestion");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(!isMuted());
  const [historyCleared, setHistoryCleared] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Initialize sound state & listen for cross-component sound changes
  useEffect(() => {
    loadSoundPref();
    setSoundEnabled(!isMuted());
    const onSoundChange = (e: Event) => {
      const ce = e as CustomEvent<{ muted: boolean }>;
      if (typeof ce.detail?.muted === "boolean") {
        setSoundEnabled(!ce.detail.muted);
      } else {
        setSoundEnabled(!isMuted());
      }
    };
    window.addEventListener(SOUND_CHANGE_EVENT, onSoundChange);
    return () => window.removeEventListener(SOUND_CHANGE_EVENT, onSoundChange);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        sfxToggle();
        setIsOpen(false);
        setView("menu");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape for keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view !== "menu") {
          sfxToggle();
          setView("menu");
        } else {
          sfxToggle();
          setIsOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, view]);

  // Listen for global custom event to open developer popover (e.g. from footer)
  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ view?: ActiveView }>;
      sfxClick();
      setIsOpen(true);
      if (customEvent.detail?.view) {
        setView(customEvent.detail.view);
      } else {
        setView("menu");
      }
    };
    window.addEventListener("spidy-open-developer", handleOpenEvent);
    return () => window.removeEventListener("spidy-open-developer", handleOpenEvent);
  }, []);

  // Focus textarea when entering feedback view
  useEffect(() => {
    if (view === "feedback" && textareaRef.current) {
      const timer = window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [view]);

  const handleToggleOpen = () => {
    sfxClick();
    if (isOpen) {
      setIsOpen(false);
      setView("menu");
    } else {
      setIsOpen(true);
      setView("menu");
    }
  };

  const handleSelectView = (nextView: ActiveView) => {
    sfxToggle();
    setView(nextView);
  };

  const handleBackToMenu = () => {
    sfxToggle();
    setView("menu");
    setFeedbackError("");
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      sfxToggle();
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  const handleToggleSound = () => {
    const next = toggleMuted();
    setSoundEnabled(!next);
    if (!next) sfxClick();
  };

  const handleClearHistory = () => {
    sfxToggle();
    try {
      window.localStorage.removeItem("spidy-calc-history");
      window.localStorage.removeItem("webslinger-calc-history");
      setHistoryCleared(true);
      window.setTimeout(() => setHistoryCleared(false), 2500);
    } catch {
      // storage unavailable
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setFeedbackError("Hold on, hero! Please enter your message first.");
      return;
    }

    setFeedbackError("");
    setIsSubmitting(true);
    sfxClick();

    // 1. Persist local backup in localStorage
    try {
      const existing = JSON.parse(
        window.localStorage.getItem(FEEDBACK_STORAGE_KEY) || "[]",
      ) as FeedbackSubmission[];
      const newEntry: FeedbackSubmission = {
        message: feedback.trim(),
        category: feedbackCategory,
        timestamp: new Date().toISOString(),
      };
      existing.unshift(newEntry);
      window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existing.slice(0, 15)));
    } catch {
      // Storage unavailable
    }

    // 2. Transmit directly to developer's email inbox
    try {
      await fetch("https://formsubmit.co/ajax/durgavaraprasadpappuri13@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `🕷️ Spidy Calculator Feedback [${feedbackCategory}]`,
          _template: "table",
          Category: feedbackCategory,
          FeedbackMessage: feedback.trim(),
          SubmittedAt: new Date().toLocaleString(),
          Application: "Spidy Calculator (spidy-calculator.lovable.app)",
        }),
      });
    } catch {
      // Graceful fallback if offline; local backup already stored
    } finally {
      setIsSubmitting(false);
      setFeedbackSubmitted(true);
      sfxToggle();
      window.setTimeout(() => {
        setFeedback("");
        setFeedbackSubmitted(false);
        setView("menu");
      }, 2600);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 select-none font-body"
    >
      {/* =================================================================== */}
      {/* FLOATING ACTION POPOVER PANEL                                       */}
      {/* =================================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="About the Developer Menu"
            className="panel absolute bottom-[calc(100%+12px)] left-0 w-[calc(100vw-2rem)] max-w-[360px] sm:max-w-[400px] rounded-2xl border-4 border-ink bg-paper p-3.5 sm:p-4.5 shadow-[8px_8px_0_0_var(--ink)] text-ink overflow-hidden"
          >
            {/* Top Comic Banner & Header */}
            <div className="flex items-center justify-between border-b-2 border-ink pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                {view !== "menu" ? (
                  <button
                    type="button"
                    onClick={handleBackToMenu}
                    className="comic-btn btn-blue grid h-7 w-7 place-items-center rounded-md border-2 border-ink text-xs cursor-pointer"
                    aria-label="Back to options"
                    title="Back to options"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="relative flex h-7 w-7 items-center justify-center">
                    <Starburst className="animate-wobble absolute -inset-1 opacity-95 text-mustard" />
                    <img
                      src="/logo.png"
                      alt="Spider Emblem"
                      className="relative z-10 h-5 w-5 object-contain"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-comic text-lg sm:text-xl text-ink leading-none tracking-wide">
                    {view === "menu" && "CREATOR'S DESK"}
                    {view === "feedback" && "MISSION FEEDBACK"}
                    {view === "developer" && "DEVELOPER DOSSIER"}
                    {view === "quick-actions" && "QUICK ACTIONS"}
                    {view === "preview" && "COMIC ART PREVIEW"}
                  </h3>
                  <p className="font-mono text-[9px] sm:text-[10px] text-ink/70 uppercase tracking-widest mt-0.5">
                    {view === "menu" && "ISSUE #1 · SPECIAL DISPATCH"}
                    {view === "feedback" && "SEND A MESSAGE TO THE CREATOR"}
                    {view === "developer" && "DURGA VARA PRASAD PAPPURI"}
                    {view === "quick-actions" && "SPIDY UTILITY SHORTCUTS"}
                    {view === "preview" && "BRAND NEW DAY ARCHIVE COVER"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sfxToggle();
                  setIsOpen(false);
                  setView("menu");
                }}
                className="grid h-7 w-7 place-items-center rounded-md border-2 border-ink bg-hero-red/15 hover:bg-hero-red hover:text-paper text-ink transition-colors cursor-pointer text-xs font-bold"
                aria-label="Close popover"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* =============================================================== */}
            {/* VIEW 1: MAIN ACTION MENU (4 STAGGERED CHOICES)                 */}
            {/* =============================================================== */}
            {view === "menu" && (
              <div className="space-y-2">
                {/* Action 1: Feedback Form */}
                <motion.button
                  type="button"
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 }}
                  onClick={() => handleSelectView("feedback")}
                  className="group w-full flex items-center justify-between rounded-xl border-2 border-ink bg-paper p-2.5 text-left shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5 hover:bg-mustard/30 active:translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-hero-red text-paper shadow-[2px_2px_0_var(--ink)]">
                      <MessageSquareText className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-comic text-base text-ink leading-tight">Feedback Form</p>
                      <p className="font-mono text-[11px] text-ink/70">
                        Share thoughts, bug reports, or ideas
                      </p>
                    </div>
                  </div>
                  <span className="font-comic text-xs text-hero-red bg-paper rounded border border-ink/40 px-1.5 py-0.5">
                    THWIP!
                  </span>
                </motion.button>

                {/* Action 2: Developer Details */}
                <motion.button
                  type="button"
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 }}
                  onClick={() => handleSelectView("developer")}
                  className="group w-full flex items-center justify-between rounded-xl border-2 border-ink bg-paper p-2.5 text-left shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5 hover:bg-mustard/30 active:translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-hero-blue text-paper shadow-[2px_2px_0_var(--ink)]">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-comic text-base text-ink leading-tight">
                        Developer Details
                      </p>
                      <p className="font-mono text-[11px] text-ink/70">
                        Portfolio, GitHub, LinkedIn &amp; Email
                      </p>
                    </div>
                  </div>
                  <span className="font-comic text-xs text-hero-blue bg-paper rounded border border-ink/40 px-1.5 py-0.5">
                    BIO
                  </span>
                </motion.button>

                {/* Action 3: Quick Actions */}
                <motion.button
                  type="button"
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 }}
                  onClick={() => handleSelectView("quick-actions")}
                  className="group w-full flex items-center justify-between rounded-xl border-2 border-ink bg-paper p-2.5 text-left shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5 hover:bg-mustard/30 active:translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-mustard text-ink shadow-[2px_2px_0_var(--ink)]">
                      <Zap className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-comic text-base text-ink leading-tight">Quick Actions</p>
                      <p className="font-mono text-[11px] text-ink/70">
                        Audio FX toggle, jump to calculator &amp; resets
                      </p>
                    </div>
                  </div>
                  <span className="font-comic text-xs text-ink bg-paper rounded border border-ink/40 px-1.5 py-0.5">
                    TOOLS
                  </span>
                </motion.button>

                {/* Action 4: Preview Image */}
                <motion.button
                  type="button"
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.16 }}
                  onClick={() => handleSelectView("preview")}
                  className="group w-full flex items-center justify-between rounded-xl border-2 border-ink bg-paper p-2.5 text-left shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5 hover:bg-mustard/30 active:translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink bg-emerald-600 text-paper shadow-[2px_2px_0_var(--ink)]">
                      <ImageIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-comic text-base text-ink leading-tight">
                        Comic Art Preview
                      </p>
                      <p className="font-mono text-[11px] text-ink/70">
                        Inspect the Brand New Day retro poster
                      </p>
                    </div>
                  </div>
                  <span className="font-comic text-xs text-emerald-700 bg-paper rounded border border-ink/40 px-1.5 py-0.5">
                    ART
                  </span>
                </motion.button>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 2: FEEDBACK FORM (WITH VALIDATION & SUCCESS STATE)         */}
            {/* =============================================================== */}
            {view === "feedback" && (
              <div className="space-y-3">
                {feedbackSubmitted ? (
                  <div className="rounded-xl border-2 border-emerald-500 bg-emerald-950/20 p-4 text-center">
                    <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full border-2 border-emerald-500 bg-emerald-500 text-paper shadow-[2px_2px_0_var(--ink)]">
                      <Check className="h-6 w-6 stroke-[3]" />
                    </div>
                    <h4 className="font-comic text-xl text-emerald-700 font-bold">
                      TRANSMISSION RECEIVED!
                    </h4>
                    <p className="mt-1 font-mono text-xs text-ink/80 leading-relaxed">
                      Thank you, hero! Your feedback has been dispatched straight to the developer's
                      email.
                    </p>
                    <span className="mt-3 inline-block font-mono text-[10px] text-ink/60 bg-paper px-2 py-0.5 rounded border border-ink/20">
                      Redirecting to menu...
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-3">
                    {/* Category Selector Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {["Suggestion", "Bug Report", "Praise", "Feature Idea"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            sfxClick();
                            setFeedbackCategory(cat);
                          }}
                          className={`rounded-full border border-ink px-2.5 py-0.5 font-mono text-[10px] font-bold transition-all ${
                            feedbackCategory === cat
                              ? "bg-mustard text-ink shadow-[1px_1px_0_var(--ink)] -translate-y-0.5"
                              : "bg-paper-dark/30 text-ink/70 hover:bg-paper-dark/60"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Textarea */}
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        rows={3}
                        value={feedback}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                          if (feedbackError) setFeedbackError("");
                        }}
                        placeholder="Share your feedback, report a math quirk, or suggest a new power..."
                        className="w-full resize-none rounded-xl border-2 border-ink bg-paper-dark/20 p-2.5 font-mono text-xs text-ink placeholder:text-ink/40 outline-none focus:border-mustard focus:ring-2 focus:ring-mustard/40 shadow-inner"
                        maxLength={500}
                      />
                      <span className="absolute bottom-2 right-2.5 font-mono text-[9px] text-ink/50">
                        {feedback.length}/500
                      </span>
                    </div>

                    {/* Validation Error Message */}
                    {feedbackError && (
                      <p
                        role="alert"
                        className="rounded border border-hero-red bg-hero-red/10 px-2 py-1 font-mono text-[11px] text-hero-red font-bold animate-shake"
                      >
                        ⚠️ {feedbackError}
                      </p>
                    )}

                    {/* Submit Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleBackToMenu}
                        className="font-mono text-xs text-ink/60 hover:text-ink underline cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="comic-btn btn-red inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-comic font-bold tracking-wider cursor-pointer shadow-[3px_3px_0_var(--ink)]"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="inline-block animate-spin">⚡</span>
                            <span>TRANSMITTING...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>SUBMIT FEEDBACK</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 3: DEVELOPER DETAILS (ACTUAL VERIFIED CONTACT LINKS)       */}
            {/* =============================================================== */}
            {view === "developer" && (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {/* Profile Summary Card */}
                <div className="rounded-xl border-2 border-ink bg-mustard/20 p-3 shadow-[2px_2px_0_var(--ink)] flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-mustard shadow-[2px_2px_0_var(--ink)]">
                    <span className="font-comic text-xl text-ink font-bold">VP</span>
                  </div>
                  <div>
                    <h4 className="font-comic text-lg text-ink leading-tight">
                      Durga Vara Prasad Pappuri
                    </h4>
                    <p className="font-mono text-[11px] font-bold text-hero-blue">
                      Full-Stack &amp; AI Engineer · @VARA4u-tech
                    </p>
                    <p className="font-mono text-[10px] text-ink/75 leading-tight mt-0.5">
                      Creator of Spidy Calculator, SafeTrip Pro &amp; AI-driven web apps.
                    </p>
                  </div>
                </div>

                {/* Clickable Destination Channels */}
                <div className="space-y-1.5">
                  {/* GitHub Profile */}
                  <a
                    href="https://github.com/VARA4u-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border-2 border-ink bg-paper p-2 text-xs font-mono transition-transform hover:-translate-y-0.5 hover:bg-mustard/30 shadow-[2px_2px_0_var(--ink)]"
                  >
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-ink" />
                      <div>
                        <span className="font-bold text-ink">GitHub</span>
                        <span className="text-[10px] text-ink/60 block">
                          github.com/VARA4u-tech
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-ink/50" />
                  </a>

                  {/* Personal Portfolio */}
                  <a
                    href="https://vara-s-portfolio.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border-2 border-ink bg-paper p-2 text-xs font-mono transition-transform hover:-translate-y-0.5 hover:bg-mustard/30 shadow-[2px_2px_0_var(--ink)]"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-hero-blue" />
                      <div>
                        <span className="font-bold text-ink">Live Portfolio</span>
                        <span className="text-[10px] text-ink/60 block">
                          vara-s-portfolio.vercel.app
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-ink/50" />
                  </a>

                  {/* Direct Email with One-Click Copy */}
                  <div className="flex items-center justify-between rounded-lg border-2 border-ink bg-paper p-2 text-xs font-mono shadow-[2px_2px_0_var(--ink)]">
                    <a
                      href="mailto:durgavaraprasadpappuri13@gmail.com"
                      className="flex items-center gap-2 hover:underline min-w-0 flex-1 pr-2"
                      title="Send email via mailto:"
                    >
                      <Mail className="h-4 w-4 text-hero-red shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-ink block">Direct Email</span>
                        <span className="text-[10px] text-ink/70 truncate block">
                          durgavaraprasadpappuri13@gmail.com
                        </span>
                      </div>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail("durgavaraprasadpappuri13@gmail.com")}
                      className="shrink-0 rounded border border-ink bg-paper-dark/30 hover:bg-mustard p-1.5 transition-colors cursor-pointer"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
                        <Check className="h-3.5 w-3.5 text-emerald-700 stroke-[3]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-ink/70" />
                      )}
                    </button>
                  </div>

                  {/* LinkedIn Network Profile */}
                  <a
                    href="https://www.linkedin.com/search/results/all/?keywords=Pappuri%20Durga%20Vara%20Prasad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border-2 border-ink bg-paper p-2 text-xs font-mono transition-transform hover:-translate-y-0.5 hover:bg-mustard/30 shadow-[2px_2px_0_var(--ink)]"
                  >
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-[#0077b5]" />
                      <div>
                        <span className="font-bold text-ink">LinkedIn Network</span>
                        <span className="text-[10px] text-ink/60 block">
                          Durga Vara Prasad Pappuri
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-ink/50" />
                  </a>

                  {/* Hashnode Articles */}
                  <a
                    href="https://hashnode.com/@DVP4U"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border-2 border-ink bg-paper p-2 text-xs font-mono transition-transform hover:-translate-y-0.5 hover:bg-mustard/30 shadow-[2px_2px_0_var(--ink)]"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-emerald-700" />
                      <div>
                        <span className="font-bold text-ink">Technical Articles</span>
                        <span className="text-[10px] text-ink/60 block">hashnode.com/@DVP4U</span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-ink/50" />
                  </a>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 4: QUICK ACTIONS (RELEVANT APP CONTROLS)                   */}
            {/* =============================================================== */}
            {view === "quick-actions" && (
              <div className="space-y-2">
                {/* 1. Launch Calculator */}
                <button
                  type="button"
                  onClick={() => {
                    sfxClick();
                    setIsOpen(false);
                    if (pathname !== "/calculator") {
                      navigate({ to: "/calculator" });
                    }
                  }}
                  className="w-full flex items-center justify-between rounded-xl border-2 border-ink bg-paper p-2.5 text-left shadow-[2px_2px_0_var(--ink)] hover:bg-mustard/30 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-hero-red text-paper shadow-[1px_1px_0_var(--ink)]">
                      <Zap className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-comic text-sm text-ink leading-tight">Launch Calculator</p>
                      <p className="font-mono text-[10px] text-ink/70">
                        {pathname === "/calculator"
                          ? "Already on calculator screen"
                          : "Jump straight into calculations"}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-hero-red">➔</span>
                </button>

                {/* 2. Toggle Sound Effects (SFX) */}
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className="w-full flex items-center justify-between rounded-xl border-2 border-ink bg-paper p-2.5 text-left shadow-[2px_2px_0_var(--ink)] hover:bg-mustard/30 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-hero-blue text-paper shadow-[1px_1px_0_var(--ink)]">
                      {soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <p className="font-comic text-sm text-ink leading-tight">
                        Sound Effects (SFX)
                      </p>
                      <p className="font-mono text-[10px] text-ink/70">
                        Status:{" "}
                        <strong className={soundEnabled ? "text-emerald-700" : "text-hero-red"}>
                          {soundEnabled ? "🔊 ENABLED" : "🔇 MUTED"}
                        </strong>
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold bg-paper-dark/30 px-2 py-0.5 rounded border border-ink/30">
                    TOGGLE
                  </span>
                </button>

                {/* 3. Clear Case Files History */}
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="w-full flex items-center justify-between rounded-xl border-2 border-ink bg-paper p-2.5 text-left shadow-[2px_2px_0_var(--ink)] hover:bg-hero-red/10 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-paper-dark text-ink shadow-[1px_1px_0_var(--ink)]">
                      <Trash2 className="h-4 w-4 text-hero-red" />
                    </span>
                    <div>
                      <p className="font-comic text-sm text-ink leading-tight">
                        Clear Case History
                      </p>
                      <p className="font-mono text-[10px] text-ink/70">
                        {historyCleared
                          ? "✓ History Cleared!"
                          : "Wipe saved calculations from local storage"}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-hero-red bg-hero-red/15 px-2 py-0.5 rounded border border-hero-red/30">
                    {historyCleared ? "DONE!" : "PURGE"}
                  </span>
                </button>

                {/* 4. Terms & Security Clearance */}
                <Link
                  to="/terms"
                  onClick={() => {
                    sfxClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between rounded-xl border-2 border-ink bg-paper p-2.5 text-left shadow-[2px_2px_0_var(--ink)] hover:bg-mustard/30 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink bg-mustard text-ink shadow-[1px_1px_0_var(--ink)]">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-comic text-sm text-ink leading-tight">
                        Terms &amp; Clearance
                      </p>
                      <p className="font-mono text-[10px] text-ink/70">
                        Review code of conduct &amp; permissions
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-hero-blue">VIEW ➔</span>
                </Link>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 5: PREVIEW IMAGE (CONTAINED COMIC ART LIGHTBOX)            */}
            {/* =============================================================== */}
            {view === "preview" && (
              <div className="space-y-2.5">
                <div className="relative aspect-[3/4] max-h-[260px] sm:max-h-[300px] w-full mx-auto overflow-hidden rounded-xl border-3 border-ink shadow-[4px_4px_0_var(--ink)] bg-[#be2629]">
                  <img
                    src="/footer-image.jpg"
                    alt="Spider-Man: Brand New Day retro comic archive cover"
                    className="h-full w-full object-cover object-top select-none pointer-events-none transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-ink/90 p-2 text-paper text-center border-t-2 border-ink">
                    <p className="font-comic text-xs tracking-wider text-mustard">
                      SPIDER-MAN: BRAND NEW DAY
                    </p>
                    <p className="font-mono text-[9px] text-paper/75">
                      Issue #1 Collector Edition · Homage Archive Poster
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleBackToMenu}
                    className="comic-btn btn-blue px-3 py-1 text-xs font-bold"
                  >
                    ◀ Back
                  </button>

                  <a
                    href="/footer-image.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="comic-btn btn-red px-3 py-1 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <span>Full Image</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Bottom Footer Note */}
            <div className="mt-3 pt-2 border-t border-ink/15 flex items-center justify-between text-[10px] font-mono text-ink/60">
              <span className="flex items-center gap-1">
                <Web className="h-3.5 w-3.5 text-ink/40" /> Handcrafted with React &amp; TypeScript
              </span>
              <span>v1.0.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* TRIGGER: PREMIUM CUSTOM-DESIGNED SPIDER FLOATING BUTTON             */}
      {/* =================================================================== */}
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleOpen}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="About the Developer"
          title="About the Developer — Click to open creator desk"
          className={`group relative flex items-center gap-2 sm:gap-2.5 rounded-full border-3 border-ink p-1 sm:p-1.5 pr-3 sm:pr-4 shadow-[4px_4px_0_var(--ink)] sm:shadow-[5px_5px_0_var(--ink)] transition-all duration-200 hover:-translate-y-1 active:translate-y-0.5 focus-visible:outline-4 focus-visible:outline-mustard cursor-pointer select-none ${
            isOpen
              ? "bg-mustard text-ink shadow-[2px_2px_0_var(--ink)] translate-y-0.5 ring-2 ring-mustard/60"
              : "bg-paper text-ink hover:bg-mustard/30"
          }`}
        >
          {/* Custom Spider Medallion Shield */}
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-ink bg-[#be2629] shadow-[2px_2px_0_var(--ink)] overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105">
            {/* Background Starburst / Halftone Aura */}
            <Starburst className="animate-wobble absolute -inset-2 opacity-85 text-mustard group-hover:scale-125 transition-transform duration-300" />

            {/* Interactive Spider Graphic Vector */}
            <div className="relative z-10 h-7 w-7 sm:h-9 sm:w-9 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <SpiderGraphic isOpen={isOpen} />
            </div>

            {/* Pulsating Spider-Sense Radar Beacon */}
            <span className="absolute top-1 right-1 flex h-2 w-2 sm:h-2.5 sm:w-2.5 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-paper opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-paper" />
            </span>
          </div>

          {/* Typography Label & Status Indicator */}
          <div className="flex flex-col text-left pr-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-comic text-xs sm:text-sm tracking-wide font-bold leading-tight text-ink">
                <span className="hidden sm:inline">ABOUT THE </span>DEVELOPER
              </span>
              <span
                aria-hidden
                className={`font-comic text-[11px] text-hero-red transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "group-hover:scale-125"
                }`}
              >
                {isOpen ? "▲" : "✦"}
              </span>
            </div>
            <span className="font-mono text-[9px] text-ink/75 tracking-widest uppercase font-semibold leading-none hidden sm:block">
              VP · CREATOR DESK
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

/**
 * Custom-designed comic Spider Vector Graphic
 * Features articulated legs, expressive spider lenses, chest emblem, and radiating spider-sense ripples.
 */
function SpiderGraphic({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full select-none pointer-events-none drop-shadow-[1px_2px_0_rgba(15,23,42,0.95)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Spider-sense radiating energy ring on hover/active */}
      <circle
        cx="50"
        cy="50"
        r="44"
        className={`stroke-mustard stroke-2 transition-all duration-300 ${
          isOpen ? "opacity-100 animate-spin" : "opacity-0 group-hover:opacity-100"
        }`}
        strokeDasharray="4 4"
        style={{ animationDuration: "10s" }}
      />

      {/* Spider Articulated Legs */}
      <g className="transition-transform duration-300 group-hover:scale-105 origin-center">
        {/* Left Legs */}
        {/* Leg L1 (Upper-Front) */}
        <path
          d="M 45 32 C 34 16, 22 10, 13 18 C 10 21, 13 26, 17 24 C 23 20, 33 24, 43 36"
          className="fill-ink stroke-ink stroke-[1.5]"
        />
        {/* Leg L2 (Upper-Mid) */}
        <path
          d="M 43 38 C 28 26, 14 24, 7 34 C 5 37, 9 40, 12 38 C 17 32, 27 34, 41 42"
          className="fill-ink stroke-ink stroke-[1.5]"
        />
        {/* Leg L3 (Lower-Mid) */}
        <path
          d="M 43 46 C 26 46, 12 54, 7 68 C 6 72, 11 73, 13 69 C 17 58, 27 54, 41 49"
          className="fill-ink stroke-ink stroke-[1.5]"
        />
        {/* Leg L4 (Rear) */}
        <path
          d="M 45 52 C 30 62, 20 74, 17 90 C 17 94, 21 94, 23 89 C 25 77, 33 68, 45 56"
          className="fill-ink stroke-ink stroke-[1.5]"
        />

        {/* Right Legs (Mirrored) */}
        {/* Leg R1 (Upper-Front) */}
        <path
          d="M 55 32 C 66 16, 78 10, 87 18 C 90 21, 87 26, 83 24 C 77 20, 67 24, 57 36"
          className="fill-ink stroke-ink stroke-[1.5]"
        />
        {/* Leg R2 (Upper-Mid) */}
        <path
          d="M 57 38 C 72 26, 86 24, 93 34 C 95 37, 91 40, 88 38 C 83 32, 73 34, 59 42"
          className="fill-ink stroke-ink stroke-[1.5]"
        />
        {/* Leg R3 (Lower-Mid) */}
        <path
          d="M 57 46 C 74 46, 88 54, 93 68 C 94 72, 89 73, 87 69 C 83 58, 73 54, 59 49"
          className="fill-ink stroke-ink stroke-[1.5]"
        />
        {/* Leg R4 (Rear) */}
        <path
          d="M 55 52 C 70 62, 80 74, 83 90 C 83 94, 79 94, 77 89 C 75 77, 67 68, 55 56"
          className="fill-ink stroke-ink stroke-[1.5]"
        />

        {/* Dynamic Dual-Tone Crimson Leg Highlights */}
        <path
          d="M 42 34 C 32 21, 23 15, 16 20 M 40 39 C 27 29, 15 29, 10 35 M 40 46 C 26 47, 15 56, 11 66 M 43 53 C 31 63, 22 74, 20 86"
          className="stroke-hero-red stroke-[1.5] stroke-linecap-round"
        />
        <path
          d="M 58 34 C 68 21, 77 15, 84 20 M 60 39 C 73 29, 85 29, 90 35 M 60 46 C 74 47, 85 56, 89 66 M 57 53 C 69 63, 78 74, 80 86"
          className="stroke-hero-red stroke-[1.5] stroke-linecap-round"
        />

        {/* Head */}
        <polygon
          points="46,24 50,18 54,24 53,30 47,30"
          className="fill-ink stroke-ink stroke-[2]"
        />

        {/* Expressive Spider Eyes (Glows on Hover / Open) */}
        <polygon
          points="47,23 49,26 47,27"
          className={`fill-paper transition-all duration-200 ${
            isOpen ? "drop-shadow-[0_0_3px_#fde047]" : "group-hover:drop-shadow-[0_0_2px_#fff]"
          }`}
        />
        <polygon
          points="53,23 51,26 53,27"
          className={`fill-paper transition-all duration-200 ${
            isOpen ? "drop-shadow-[0_0_3px_#fde047]" : "group-hover:drop-shadow-[0_0_2px_#fff]"
          }`}
        />

        {/* Cephalothorax (Mid Body) */}
        <path
          d="M 46 30 C 43 36, 43 43, 47 46 C 50 47, 50 47, 53 46 C 57 43, 57 36, 54 30 Z"
          className="fill-ink stroke-ink stroke-[1.5]"
        />

        {/* Abdomen (Lower Armor Body) */}
        <path
          d="M 47 46 C 43 54, 43 68, 50 82 C 57 68, 57 54, 53 46 Z"
          className="fill-ink stroke-ink stroke-[1.5]"
        />

        {/* Center Hourglass Insignia */}
        <path
          d="M 48 48 C 45 54, 45 64, 50 74 C 55 64, 55 54, 52 48 Z"
          className={`transition-colors duration-200 ${isOpen ? "fill-mustard" : "fill-hero-red"}`}
        />
        <circle
          cx="50"
          cy="38"
          r="2.5"
          className={`transition-colors duration-200 ${isOpen ? "fill-paper" : "fill-mustard"}`}
        />
      </g>
    </svg>
  );
}
