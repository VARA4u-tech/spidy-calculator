"use client";

import { useRef, useState, useEffect, useCallback, type KeyboardEvent } from "react";
import { Sparkles } from "lucide-react";
import { Starburst, Web } from "@/components/comic";
import { sfxClick } from "@/lib/sounds";

export interface WebRailSubItem {
  id: string;
  label: string;
  badge?: string | undefined;
}

export interface WebRailItem {
  id: string;
  label: string;
  shortLabel?: string | undefined;
  badge?: string | undefined;
  icon?: React.ComponentType<{ className?: string }> | undefined;
  subcategories?: WebRailSubItem[] | undefined;
}

export type WebRailItemInput = string | WebRailItem;

export interface SpiderWebRailProps {
  items: WebRailItemInput[];
  activeIndex?: number | null | undefined;
  defaultActive?: number | null | undefined;
  activeSubId?: string | null | undefined;
  onItemClick?: ((index: number, item: WebRailItemInput) => void) | undefined;
  onSubItemClick?: ((parentIndex: number, subItem: WebRailSubItem) => void) | undefined;
  className?: string | undefined;
  showIndex?: boolean | undefined;
  showMarker?: boolean | undefined;
}

export function SpiderWebRail({
  items,
  activeIndex,
  defaultActive = 0,
  activeSubId = null,
  onItemClick,
  onSubItemClick,
  className = "",
  showIndex = true,
}: SpiderWebRailProps) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [internalActiveIndex, setInternalActiveIndex] = useState<number>(
    activeIndex !== undefined && activeIndex !== null ? activeIndex : (defaultActive ?? 0),
  );

  useEffect(() => {
    if (activeIndex !== undefined && activeIndex !== null) {
      setInternalActiveIndex(activeIndex);
    }
  }, [activeIndex]);

  const currentActiveIndex =
    activeIndex !== undefined && activeIndex !== null ? activeIndex : internalActiveIndex;

  const handleCategoryClick = useCallback(
    (index: number, item: WebRailItemInput) => {
      sfxClick();
      setInternalActiveIndex(index);
      onItemClick?.(index, item);
    },
    [onItemClick],
  );

  const handleSubCategoryClick = useCallback(
    (parentIndex: number, subItem: WebRailSubItem) => {
      sfxClick();
      setInternalActiveIndex(parentIndex);
      onSubItemClick?.(parentIndex, subItem);
    },
    [onSubItemClick],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLLIElement>, index: number, item: WebRailItemInput) => {
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

  return (
    <nav
      aria-label="Spider-Rail Category Navigation"
      className={`relative flex flex-col items-center select-none w-20 xl:w-22 rounded-3xl border-4 border-ink bg-ink/95 backdrop-blur-md p-2.5 shadow-[6px_6px_0_0_var(--ink)] text-paper overflow-visible ${className}`}
    >
      {/* Decorative Spider Web Watermark */}
      <Web className="pointer-events-none absolute -top-3 -right-3 h-20 w-20 text-paper/[0.08] rotate-90" />

      {/* Spider-Rail Top Hero Emblem */}
      <div className="relative z-10 flex flex-col items-center pb-2 mb-1 border-b-2 border-paper/15 w-full">
        <div className="relative flex h-8 w-8 items-center justify-center">
          <Starburst className="animate-wobble absolute -inset-1 opacity-95 text-mustard" />
          <img
            src="/logo.png"
            alt="Spidy logo"
            className="relative z-10 h-5 w-5 object-contain drop-shadow-[1px_1px_0_var(--ink)]"
          />
        </div>
        <span className="font-mono text-[8px] font-bold text-mustard uppercase tracking-widest mt-1">
          WEB-RAIL
        </span>
        <div className="mt-1 h-0.5 w-10 rounded-full bg-gradient-to-r from-hero-red via-mustard to-hero-blue" />
      </div>

      {/* 3D Circular Hero Badges List */}
      <ul className="m-0 flex list-none flex-col items-center gap-2.5 py-1 w-full">
        {items.map((rawItem, index) => {
          const isObject = typeof rawItem !== "string";
          const label = isObject ? rawItem.label : rawItem;
          const badge = isObject ? rawItem.badge : undefined;
          const Icon = isObject ? rawItem.icon : undefined;
          const subcategories = isObject ? rawItem.subcategories : undefined;
          const isCategoryActive = currentActiveIndex === index;
          const indexStr = String(index + 1).padStart(2, "0");

          return (
            <li
              key={`${label}-${index}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="button"
              tabIndex={0}
              aria-label={`${label} (Category #${indexStr})`}
              aria-current={isCategoryActive ? "true" : undefined}
              onClick={() => handleCategoryClick(index, rawItem)}
              onKeyDown={(e) => handleKeyDown(e, index, rawItem)}
              className="relative group/rail-item flex items-center justify-center w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-mustard rounded-2xl"
            >
              {/* Circular 3D Hero Badge Display */}
              <div
                className={`relative flex h-12 w-12 sm:h-12.5 sm:w-12.5 items-center justify-center rounded-2xl border-3 border-ink transition-all duration-150 ${
                  isCategoryActive
                    ? "bg-mustard text-ink ring-3 ring-mustard ring-offset-2 ring-offset-ink shadow-[0_0_18px_rgba(246,190,60,0.7),3px_3px_0_0_var(--ink)] -translate-y-0.5 scale-105"
                    : "bg-paper/10 text-paper/80 group-hover/rail-item:bg-mustard group-hover/rail-item:text-ink group-hover/rail-item:border-ink group-hover/rail-item:shadow-[3px_3px_0_0_var(--ink)] group-hover/rail-item:-translate-y-0.5"
                }`}
              >
                {Icon ? (
                  <Icon className="h-5 w-5 transition-transform group-hover/rail-item:scale-110" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}

                {/* Micro Zero-Padded Index Pill */}
                {showIndex && (
                  <span
                    className={`absolute -bottom-1 -right-1 font-mono text-[8px] font-black px-1 py-0.2 rounded border border-ink shadow-[1px_1px_0_0_var(--ink)] leading-tight ${
                      isCategoryActive
                        ? "bg-ink text-mustard border-mustard"
                        : "bg-paper text-ink group-hover/rail-item:bg-ink group-hover/rail-item:text-paper"
                    }`}
                  >
                    {indexStr}
                  </span>
                )}

                {/* Glowing Active Spider Indicator Dot (pointing towards calculator) */}
                {isCategoryActive && (
                  <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5 items-center justify-center">
                    <span className="absolute h-full w-full rounded-full bg-mustard animate-ping opacity-75" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-mustard border border-ink" />
                  </span>
                )}
              </div>

              {/* High-Impact Comic Dialogue Tooltip (Pops out to the left towards the calculator) */}
              <div
                role="tooltip"
                className={`absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-50 flex items-center transition-all duration-150 transform ${
                  isCategoryActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 group-hover/rail-item:opacity-100 group-focus-within/rail-item:opacity-100 translate-x-2 group-hover/rail-item:translate-x-0 pointer-events-none group-hover/rail-item:pointer-events-auto"
                }`}
              >
                <div className="relative rounded-xl border-3 border-ink bg-paper p-2.5 shadow-[5px_5px_0_0_var(--ink)] text-ink min-w-[170px] max-w-[230px]">
                  {/* Comic Speech Bubble Pointer Tip */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[8px] border-l-ink" />
                  <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-paper" />

                  {/* Tooltip Header Row */}
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="font-mono text-[9px] font-bold text-ink/60 uppercase">
                      #{indexStr}
                    </span>
                    {badge && (
                      <span className="font-mono text-[8px] font-bold px-1.5 py-0.2 rounded border border-ink bg-mustard text-ink shadow-[1px_1px_0_var(--ink)]">
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Category Title */}
                  <div className="font-comic font-black text-sm text-ink tracking-wide leading-tight">
                    {label}
                  </div>

                  {/* Subcategories Micro Pills */}
                  {subcategories && subcategories.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-ink/15 space-y-1">
                      <span className="font-mono text-[8.5px] font-bold text-ink/60 uppercase tracking-wider block">
                        MODES:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {subcategories.map((sub) => {
                          const isSubActive = activeSubId === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubCategoryClick(index, sub);
                              }}
                              className={`font-comic text-[10.5px] font-bold px-2 py-0.5 rounded-lg border-2 border-ink transition-all cursor-pointer ${
                                isSubActive
                                  ? "bg-hero-red text-paper font-black shadow-[2px_2px_0_var(--ink)] -translate-y-0.5"
                                  : "bg-paper text-ink hover:bg-mustard hover:text-ink shadow-[1px_1px_0_var(--ink)] active:translate-y-0"
                              }`}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Spider-Rail Radar Footer */}
      <div className="relative z-10 flex flex-col items-center pt-2 mt-1 border-t border-paper/15 w-full">
        <span className="flex items-center gap-1 font-mono text-[8px] text-paper/60 uppercase tracking-widest">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>RADAR</span>
        </span>
        <span className="font-comic font-black text-xs text-mustard tracking-wider">THWIP!</span>
      </div>
    </nav>
  );
}

export default SpiderWebRail;
