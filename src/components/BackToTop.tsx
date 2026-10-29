import { useState, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useReducedMotion } from "framer-motion";
import { sfxClick } from "@/lib/sounds";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setVisible(latest > 350);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    sfxClick();
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.2 }}
          aria-label="Back to top"
          title="Scroll back to top"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 rounded-full border-3 border-ink bg-hero-blue px-3.5 py-2 font-comic text-xs sm:text-sm font-bold text-paper shadow-[3px_3px_0_var(--ink)] hover:brightness-110 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--ink)] focus-visible:outline-4 focus-visible:outline-mustard cursor-pointer select-none"
        >
          <span aria-hidden className="text-xs">▲</span>
          <span className="tracking-wider">TOP</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

