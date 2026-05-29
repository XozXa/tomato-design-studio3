import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Syne } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
})

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
    <html lang="en" className={`${spaceGrotesk.variable} ${syne.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
