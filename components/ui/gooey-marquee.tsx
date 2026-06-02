"use client"

import { cn } from "@/lib/utils"

interface GooeyMarqueeProps {
  text: string
  className?: string
  speed?: number
}

export function GooeyMarquee({ text, className = "", speed = 15 }: GooeyMarqueeProps) {
  // 两份完全相同的文字，中间紧密连接
  const doubledText = text + text

  return (
    <div className={cn("relative w-full flex items-center justify-center overflow-hidden", className)}>
      {/* Blur layer with gooey effect */}
      <div
        className="absolute inset-0 hidden dark:flex items-center overflow-hidden"
        style={{
          backgroundColor: "black",
          backgroundImage: `
            linear-gradient(to right, white, 1rem, transparent 50%),
            linear-gradient(to left, white, 1rem, transparent 50%)
          `,
          filter: "contrast(15)",
        }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{
            filter: "blur(0.03em)",
            animation: `marquee ${speed}s infinite linear`,
            willChange: "transform",
          }}
        >
          <p className="whitespace-nowrap">{doubledText}</p>
          <p className="whitespace-nowrap">{doubledText}</p>
        </div>
      </div>

      <div
        className="absolute dark:hidden inset-0 flex items-center overflow-hidden"
        style={{
          backgroundColor: "white",
          backgroundImage: `
            linear-gradient(to right, black,  1rem, transparent 50%),
            linear-gradient(to left, black,  1rem, transparent 50%)
          `,
          filter: "contrast(15)",
        }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{
            filter: "blur(0.03em)",
            animation: `marquee ${speed}s infinite linear`,
            willChange: "transform",
          }}
        >
          <p className="whitespace-nowrap">{doubledText}</p>
          <p className="whitespace-nowrap">{doubledText}</p>
        </div>
      </div>

      {/* Clear text layer on top */}
      <div className="absolute inset-0 flex items-center overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: `marquee ${speed}s infinite linear`,
            willChange: "transform",
          }}
        >
          <p className="whitespace-nowrap">{doubledText}</p>
          <p className="whitespace-nowrap">{doubledText}</p>
        </div>
      </div>
    </div>
  )
}