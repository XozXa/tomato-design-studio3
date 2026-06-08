"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

const callbacks = new Map<Element, () => void>()
let sharedObserver: IntersectionObserver | null = null

const ensureObserver = (): IntersectionObserver => {
  if (sharedObserver) return sharedObserver
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          callbacks.get(entry.target)?.()
          sharedObserver!.unobserve(entry.target)
          callbacks.delete(entry.target)
        }
      }
    },
    { rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
  )
  return sharedObserver
}

export function FadeIn({
  children,
  className = "",
  variant = "default",
}: {
  children: ReactNode
  className?: string
  variant?: "default" | "hero"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = ensureObserver()
    callbacks.set(el, () => setVisible(true))
    observer.observe(el)
    return () => {
      observer.unobserve(el)
      callbacks.delete(el)
    }
  }, [])

  const variantClass = variant === "hero" ? "fade-in--hero" : ""
  return (
    <div
      ref={ref}
      className={`fade-in ${variantClass} ${visible ? "fade-in--visible" : ""} ${className}`}
    >
      {children}
    </div>
  )
}
