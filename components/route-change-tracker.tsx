"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { trackPageview } from "@/lib/analytics"

export default function RouteChangeTracker() {
  const pathname = usePathname()
  useEffect(() => {
    trackPageview(pathname)
  }, [pathname])
  return null
}
