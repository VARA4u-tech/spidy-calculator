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
import { sfxClick, sfxToggle, toggleMuted, isMuted, loadSoundPref } from "@/lib/sounds";

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

  // Initialize sound state
  useEffect(() => {
    loadSoundPref();
    setSoundEnabled(!isMuted());
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

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setFeedbackError("Hold on, hero! Please enter your message first.");
      return;
    }

    setFeedbackError("");
    setIsSubmitting(true);
    sfxClick();

    // Persist to localStorage
    try {
      const existing = JSON.parse(
        window.localStorage.getItem(FEEDBACK_STORAGE_KEY) || "[]"
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

    // Simulated network transmission feedback
    window.setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackSubmitted(true);
      sfxToggle();
      window.setTimeout(() => {
        setFeedback("");
        setFeedbackSubmitted(false);
        setView("menu");
      }, 2600);
    }, 900);
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
                    {view === "developer" && "PAPPURI DURGA VARA PRASAD"}
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
                      <p className="font-comic text-base text-ink leading-tight">Developer Details</p>
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
                      <p className="font-comic text-base text-ink leading-tight">Comic Art Preview</p>
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
                      Thank you, hero! Your feedback has been safely logged for the developer.
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
                      Pappuri Durga Vara Prasad
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
                        <span className="text-[10px] text-ink/60 block">github.com/VARA4u-tech</span>
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
                          Pappuri Durga Vara Prasad
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
                        {pathname === "/calculator" ? "Already on calculator screen" : "Jump straight into calculations"}
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
                      <p className="font-comic text-sm text-ink leading-tight">Sound Effects (SFX)</p>
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
                        {historyCleared ? "✓ History Cleared!" : "Wipe saved calculations from local storage"}
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
                      <p className="font-comic text-sm text-ink leading-tight">Terms &amp; Clearance</p>
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
      {/* TRIGGER: COMPACT FLOATING "ABOUT THE DEVELOPER" PILL BUTTON         */}
      {/* =================================================================== */}
      <button
        type="button"
        onClick={handleToggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="About the Developer & Quick Menu"
        className={`group relative inline-flex items-center gap-2 rounded-full border-3 border-ink px-3 py-2 sm:px-4 sm:py-2.5 font-comic text-xs sm:text-sm font-bold tracking-wide shadow-[4px_4px_0_var(--ink)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--ink)] focus-visible:outline-4 focus-visible:outline-mustard cursor-pointer select-none ${
          isOpen
            ? "bg-mustard text-ink shadow-[2px_2px_0_var(--ink)] translate-y-0.5"
            : "bg-paper text-ink hover:bg-mustard/40"
        }`}
      >
        {/* Pulsating online beacon dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hero-red opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-hero-red" />
        </span>

        {/* Developer Initials / Spider Badge */}
        <span className="grid h-5 w-5 place-items-center rounded-full border border-ink bg-hero-blue text-[10px] font-bold text-paper">
          VP
        </span>

        {/* Button Label */}
        <span>
          <span className="hidden sm:inline">About the </span>Developer
        </span>

        {/* Little indicator chevron / star */}
        <span
          aria-hidden
          className={`font-comic text-[10px] text-hero-red transition-transform duration-200 ${
            isOpen ? "rotate-180" : "group-hover:scale-125"
          }`}
        >
          {isOpen ? "▲" : "✦"}
        </span>
      </button>
    </div>
  );
}
