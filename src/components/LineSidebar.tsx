"use client";

import {
  SpiderWebRail,
  type SpiderWebRailProps,
  type WebRailItem,
  type WebRailSubItem,
  type WebRailItemInput,
} from "./SpiderWebRail";

export type LineSidebarItem = WebRailItem;
export type LineSidebarSubItem = WebRailSubItem;
export type LineSidebarItemInput = WebRailItemInput;
export type LineSidebarProps = SpiderWebRailProps & {
  accentColor?: string | undefined;
  textColor?: string | undefined;
  markerColor?: string | undefined;
  proximityRadius?: number | undefined;
  maxShift?: number | undefined;
  falloff?: string | undefined;
  markerLength?: number | undefined;
  markerGap?: number | undefined;
  tickScale?: number | undefined;
  scaleTick?: boolean | undefined;
  itemGap?: number | undefined;
  fontSize?: number | undefined;
  smoothing?: number | undefined;
  side?: "right" | "left" | undefined;
};

export function LineSidebar(props: LineSidebarProps) {
  return <SpiderWebRail {...props} />;
}

export default LineSidebar;
