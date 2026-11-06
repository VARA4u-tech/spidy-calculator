"use client";

import { useRef, useState, useCallback, useEffect, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

export type FalloffType = "linear" | "smooth" | "sharp";

const FALLOFF_CURVES: Record<FalloffType, (p: number) => number> = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

export interface LineSidebarSubItem {
  id: string;
  label: string;
  badge?: string | undefined;
}

export interface LineSidebarItem {
  id: string;
  label: string;
  shortLabel?: string | undefined;
  badge?: string | undefined;
  subcategories?: LineSidebarSubItem[] | undefined;
}

export type LineSidebarItemInput = string | LineSidebarItem;

const DEFAULT_ITEMS: LineSidebarItemInput[] = [
  "Overview",
  "Components",
  "Animations",
  "Backgrounds",
  "Showcase",
  "Playground",
  "Templates",
  "Changelog",
  "Community",
  "Resources",
  "Documentation",
  "Support",
];

export interface LineSidebarProps {
  items?: LineSidebarItemInput[] | undefined;
  accentColor?: string | undefined;
  textColor?: string | undefined;
  markerColor?: string | undefined;
  showIndex?: boolean | undefined;
  showMarker?: boolean | undefined;
  proximityRadius?: number | undefined;
  maxShift?: number | undefined;
  falloff?: FalloffType | undefined;
  markerLength?: number | undefined;
  markerGap?: number | undefined;
  tickScale?: number | undefined;
  scaleTick?: boolean | undefined;
  itemGap?: number | undefined;
  fontSize?: number | undefined;
  smoothing?: number | undefined;
  defaultActive?: number | null | undefined;
  activeIndex?: number | null | undefined;
  activeSubId?: string | null | undefined;
  onItemClick?: ((index: number, item: LineSidebarItemInput) => void) | undefined;
  onSubItemClick?: ((parentIndex: number, subItem: LineSidebarSubItem) => void) | undefined;
  className?: string | undefined;
  side?: "right" | "left" | undefined;
}

export function LineSidebar({
  items = DEFAULT_ITEMS,
  accentColor = "#f6be3c",
  textColor = "#fdfbf7",
  markerColor = "rgba(253, 251, 247, 0.4)",
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 24,
  falloff = "smooth",
  markerLength = 50,
  markerGap = 6,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 16,
  fontSize = 1.05,
  smoothing = 100,
  defaultActive = 0,
  activeIndex: controlledActiveIndex,
  activeSubId = null,
  onItemClick,
  onSubItemClick,
  className = "",
  side = "right",
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const smoothingRef = useRef<number>(smoothing);

  const [internalActiveIndex, setInternalActiveIndex] = useState<number | null>(
    controlledActiveIndex !== undefined ? controlledActiveIndex : defaultActive,
  );
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    controlledActiveIndex !== undefined ? controlledActiveIndex : defaultActive,
  );

  const activeIndex =
    controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const activeRef = useRef<number | null>(activeIndex);
  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  // Sync expanded index with controlled active index when changed externally
  useEffect(() => {
    if (controlledActiveIndex !== undefined && controlledActiveIndex !== null) {
      setInternalActiveIndex(controlledActiveIndex);
      setExpandedIndex(controlledActiveIndex);
    }
  }, [controlledActiveIndex]);

  // Frame-rate independent exponential smoothing rAF loop from React Bits
  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const elements = itemRefs.current;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (!el) continue;
      const target = Math.max(targetsRef.current[i] ?? 0, activeRef.current === i ? 1 : 0);
      const cur = currentRef.current[i] ?? 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    // Check if user prefers reduced motion — skip animation loop if true
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const elements = itemRefs.current;
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el) continue;
        const target = Math.max(targetsRef.current[i] ?? 0, activeRef.current === i ? 1 : 0);
        currentRef.current[i] = target;
        el.style.setProperty("--effect", target.toFixed(4));
      }
      return;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      // Optimize for touch screens (e.g. Samsung Galaxy M11) - skip pointer hover calculations
      if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) {
        return;
      }

      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.smooth;
      const elements = itemRefs.current;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el) continue;
        const center = el.offsetTop + 18; // Target main item label header
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleCategoryClick = useCallback(
    (index: number, item: LineSidebarItemInput) => {
      setInternalActiveIndex(index);
      const isCurrentlyExpanded = expandedIndex === index;
      setExpandedIndex(isCurrentlyExpanded ? null : index);
      onItemClick?.(index, item);
    },
    [expandedIndex, onItemClick],
  );

  const handleSubCategoryClick = useCallback(
    (parentIndex: number, subItem: LineSidebarSubItem) => {
      setInternalActiveIndex(parentIndex);
      onSubItemClick?.(parentIndex, subItem);
    },
    [onSubItemClick],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLLIElement>, index: number, item: LineSidebarItemInput) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCategoryClick(index, item);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(items.length - 1, index + 1);
        itemRefs.current[next]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(0, index - 1);
        itemRefs.current[prev]?.focus();
      }
    },
    [handleCategoryClick, items.length],
  );

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
    },
    [],
  );

  // Marker and intermediate tick styling:
  // When side="right", the markers point from the left of the item (facing the calculator)
  const isRightSide = side === "right";

  const tickClass = showMarker
    ? `after:absolute after:left-[calc(-1*var(--marker-length)-var(--marker-gap))] after:top-[calc(100%+var(--item-gap)/2)] after:h-px after:opacity-40 after:content-[''] last:after:content-none after:[background-color:var(--marker-color)] after:[width:calc(var(--marker-length)*var(--tick-scale))] ${
        scaleTick
          ? "after:origin-left after:[transform:translateY(-50%)_scaleX(calc(0.7+var(--effect,0)*0.6))]"
          : "after:-translate-y-1/2"
      }`
    : "";

  return (
    <nav
      aria-label="Calculator Categories"
      className={`relative flex flex-col justify-start select-none ${
        showMarker ? "pl-[calc(var(--marker-length)+var(--marker-gap)+8px)]" : "pl-2"
      } ${className}`}
      style={{
        ["--accent-color" as string]: accentColor,
        ["--text-color" as string]: textColor,
        ["--marker-color" as string]: markerColor,
        ["--marker-length" as string]: `${markerLength}px`,
        ["--marker-gap" as string]: `${markerGap}px`,
        ["--tick-scale" as string]: tickScale,
        ["--max-shift" as string]: `${maxShift}px`,
        ["--item-gap" as string]: `${itemGap}px`,
        ["--font-size" as string]: `${fontSize}rem`,
        ["--smoothing" as string]: `${smoothing}ms`,
      }}
    >
      <ul
        ref={listRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="m-0 flex list-none flex-col py-2 [gap:var(--item-gap)]"
      >
        {items.map((item, index) => {
          const isObject = typeof item !== "string";
          const label = isObject ? item.label : item;
          const badge = isObject ? item.badge : undefined;
          const subcategories = isObject ? item.subcategories : undefined;
          const hasSubcategories = Boolean(subcategories && subcategories.length > 0);
          const isCategoryActive = activeIndex === index;
          const isExpanded = expandedIndex === index;

          return (
            <li
              key={`${label}-${index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="button"
              tabIndex={0}
              aria-current={isCategoryActive ? "true" : undefined}
              aria-expanded={hasSubcategories ? isExpanded : undefined}
              onClick={() => handleCategoryClick(index, item)}
              onKeyDown={(e) => handleKeyDown(e, index, item)}
              className={`group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-mustard rounded-lg transition-colors ${tickClass}`}
            >
              {/* Proximity Marker Line */}
              {showMarker && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[calc(-1*var(--marker-length)-var(--marker-gap))] top-[1.1rem] h-[2px] w-[length:var(--marker-length)] origin-left rounded-full [background-color:color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--marker-color))] [transform:translateY(-50%)_scaleX(calc(0.7+var(--effect,0)*0.5))] transition-transform"
                />
              )}

              {/* Main Category Row */}
              <div
                className="relative flex items-center justify-between gap-2 py-1 pr-2 transition-transform duration-75"
                style={{
                  transform: "translateX(calc(var(--effect, 0) * var(--max-shift)))",
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Zero-padded Index */}
                  {showIndex && (
                    <span className="font-mono text-[11px] font-bold tracking-wider text-paper/50 transition-colors [color:color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--text-color))]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}

                  {/* Category Title */}
                  <span
                    className={`font-comic tracking-wide leading-tight text-base sm:text-lg transition-colors ${
                      isCategoryActive ? "font-bold text-mustard" : "text-paper"
                    }`}
                    style={{
                      color: isCategoryActive
                        ? accentColor
                        : "color-mix(in srgb, var(--accent-color) calc(var(--effect, 0) * 100%), var(--text-color))",
                    }}
                  >
                    {label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Optional Badge */}
                  {badge && (
                    <span
                      className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-ink/40 uppercase tracking-wider ${
                        isCategoryActive
                          ? "bg-mustard text-ink shadow-[1px_1px_0_var(--ink)]"
                          : "bg-paper/10 text-paper/80"
                      }`}
                    >
                      {badge}
                    </span>
                  )}

                  {/* Expand Chevron for categories with subcategories */}
                  {hasSubcategories && (
                    <ChevronRight
                      className={`h-3.5 w-3.5 text-paper/60 transition-transform duration-200 ${
                        isExpanded ? "rotate-90 text-mustard" : "group-hover:translate-x-0.5"
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Expandable Subcategories Accordion */}
              <AnimatePresence initial={false}>
                {hasSubcategories && isExpanded && subcategories && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden pl-6 pt-1.5 pb-1 space-y-1 list-none border-l-2 border-mustard/30 ml-2 mt-1"
                  >
                    {subcategories.map((sub, subIdx) => {
                      const isSubActive = activeSubId === sub.id;
                      const isLast = subIdx === subcategories.length - 1;

                      return (
                        <li key={sub.id} className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubCategoryClick(index, sub);
                            }}
                            className={`w-full group/sub flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-left text-xs font-comic tracking-wide transition-all ${
                              isSubActive
                                ? "bg-mustard text-ink font-bold shadow-[2px_2px_0_var(--ink)] -translate-y-0.5"
                                : "text-paper/75 hover:text-paper hover:bg-paper/15 active:translate-y-0.5"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 min-w-0">
                              <span className="font-mono text-[10px] text-paper/40 group-hover/sub:text-mustard">
                                {isLast ? "└" : "├"}
                              </span>
                              <span className="truncate">{sub.label}</span>
                            </span>

                            {sub.badge && (
                              <span
                                className={`font-mono text-[8px] font-bold px-1 py-0.2 rounded shrink-0 ${
                                  isSubActive
                                    ? "bg-ink text-paper"
                                    : "bg-paper/15 text-paper/70 group-hover/sub:bg-paper/25"
                                }`}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default LineSidebar;
