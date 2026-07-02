"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

export default function ServiceViewTracker() {
  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".feature-card"),
    )
    if (cards.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const name =
            e.target.querySelector(".bilingual-en")?.textContent?.trim() ??
            "unknown"
          trackEvent("Service", "view", name)
          io.unobserve(e.target)
        }
      },
      { threshold: 0.4 },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  return null
}
