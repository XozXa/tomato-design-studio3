export type EventCategory =
  | "Portfolio"
  | "Contact"
  | "Nav"
  | "CasePage"
  | "Service"

const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 768px)").matches

export const trackEvent = (
  category: EventCategory,
  action: string,
  label?: string,
  value?: number,
) => {
  if (typeof window === "undefined") return
  const hmt = (window as unknown as { _hmt?: unknown[] })._hmt
  if (!Array.isArray(hmt)) return
  const device = isMobile() ? "mobile" : "desktop"
  const fullLabel = label ? `${label}|${device}` : device
  hmt.push(["_trackEvent", category, action, fullLabel, value])
}

export const trackPageview = (path: string) => {
  if (typeof window === "undefined") return
  const hmt = (window as unknown as { _hmt?: unknown[] })._hmt
  if (!Array.isArray(hmt)) return
  hmt.push(["_trackPageview", path])
}
