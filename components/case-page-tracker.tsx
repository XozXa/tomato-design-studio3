"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

export default function CasePageTracker({ projectId }: { projectId: string }) {
  const enterRef = useRef(0)

  useEffect(() => {
    enterRef.current = Date.now()
    trackEvent("CasePage", "enter", projectId)

    const fire = () => {
      const durationS = Math.round((Date.now() - enterRef.current) / 1000)
      if (durationS < 1) return
      trackEvent("CasePage", "leave", projectId, durationS)
    }

    const onVisibility = () => {
      if (document.visibilityState === "hidden") fire()
    }

    window.addEventListener("pagehide", fire)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("pagehide", fire)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [projectId])

  return null
}
