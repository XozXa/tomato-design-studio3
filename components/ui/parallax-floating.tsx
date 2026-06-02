"use client"

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react"
import { useAnimationFrame } from "motion/react"
import { cn } from "@/lib/utils"
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref"

interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void
  unregisterElement: (id: string) => void
}

const FloatingContext = createContext<FloatingContextType | null>(null)

interface FloatingProps {
  children: ReactNode
  className?: string
  sensitivity?: number
  easingFactor?: number
}

const Floating = ({
  children,
  className,
  sensitivity = 1,
  easingFactor = 0.05,
  ...props
}: FloatingProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsMap = useRef(
    new Map<
      string,
      {
        element: HTMLDivElement
        depth: number
        currentPosition: { x: number; y: number }
        converged: boolean
      }
    >()
  )
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const mousePositionRef = useMousePositionRef(containerRef)

  const registerElement = useCallback(
    (id: string, element: HTMLDivElement, depth: number) => {
      elementsMap.current.set(id, {
        element,
        depth,
        currentPosition: { x: 0, y: 0 },
        converged: false,
      })
    },
    []
  )

  const unregisterElement = useCallback((id: string) => {
    elementsMap.current.delete(id)
  }, [])

  useAnimationFrame(() => {
    if (!containerRef.current) return

    const mouseX = mousePositionRef.current.x
    const mouseY = mousePositionRef.current.y
    const mouseChanged =
      mouseX !== lastMouseRef.current.x || mouseY !== lastMouseRef.current.y
    lastMouseRef.current = { x: mouseX, y: mouseY }

    elementsMap.current.forEach((data) => {
      if (data.converged && !mouseChanged) return

      const strength = (data.depth * sensitivity) / 20
      const targetX = mouseX * strength
      const targetY = mouseY * strength
      const dx = targetX - data.currentPosition.x
      const dy = targetY - data.currentPosition.y

      data.currentPosition.x += dx * easingFactor
      data.currentPosition.y += dy * easingFactor

      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        data.converged = true
        return
      }
      data.converged = false

      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`
    })
  })

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div
        ref={containerRef}
        className={cn("relative w-full h-full", className)}
        {...props}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  )
}

export default Floating

interface FloatingElementProps {
  children: ReactNode
  className?: string
  depth?: number
}

export const FloatingElement = ({
  children,
  className,
  depth = 1,
}: FloatingElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const context = useContext(FloatingContext)

  useEffect(() => {
    if (!elementRef.current || !context) return
    context.registerElement(id, elementRef.current, depth)
    return () => context.unregisterElement(id)
  }, [depth, context, id])

  return (
    <div
      ref={elementRef}
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  )
}
