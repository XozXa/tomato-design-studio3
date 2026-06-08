import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import ScrollToTop from "@/components/scroll-to-top"
import "./globals.css"

export const metadata: Metadata = {
  title: "TOMATODESIGN",
  description:
    "An independent creative studio rooted in Chengdu. We navigate the intersection of deep insight and forward-looking creativity, refusing template-driven design to cultivate bespoke growth formulas for every brand. We believe design should be not only good-looking, but taste right — making it an emotional bond between brand and user.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/tomato (1).svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload the LCP font; Noto Sans SC (17.7 MB) is intentionally NOT
            preloaded — its unicode-range gates it to CJK glyphs. */}
        <link
          rel="preload"
          as="font"
          type="font/ttf"
          href="/fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <div className="grid-overlay"></div>
        <ScrollToTop />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
