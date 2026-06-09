"use client"

import Image from "next/image"
import Link from "next/link"
import { Css3dScene } from "@/components/hero/css-3d-scene"
import Navbar from "@/components/navbar"
import FooterSection from "@/components/sections/footer-section"

const PROJECTS = [
  { id: "p1", src: "/1.png", alt: "Project 01" },
  { id: "p2", src: "/2.png", alt: "Project 02" },
  { id: "p3", src: "/3.png", alt: "Project 03" },
  { id: "p4", src: "/4.png", alt: "Project 04" },
  { id: "p5", src: "/5.png", alt: "Project 05" },
  { id: "p6", src: "/6.png", alt: "Project 06" },
  { id: "p7", src: "/7.png", alt: "Project 07" },
  { id: "p8", src: "/8.png", alt: "Project 08" },
  { id: "p9", src: "/9.png", alt: "Project 09" },
  { id: "p10", src: "/10.png", alt: "Project 10" },
  { id: "p11", src: "/11.png", alt: "Project 11" },
  { id: "p12", src: "/12.png", alt: "Project 12" },
  { id: "p13", src: "/13.png", alt: "Project 13" },
  { id: "p14", src: "/14.png", alt: "Project 14" },
] as const

export default function Page() {
  return (
    <>
      <section className="hero-3d-section">
        <Css3dScene />
      </section>

      <div className="container">
        {/* Subtitle Section */}
        <section className="hero-subtitle-section">
          <div className="hero-subtitle-wrapper">
            <p className="hero-subtitle">
              Tomato Design is a creative studio focused on youthful brand expression. We refuse template-driven design, crafting bespoke growth formulas for every brand through deep insight and forward-looking creativity.
            </p>
            <p className="hero-subtitle-cn">
              Tomato Design是一家专注于品牌年轻化表达的创意设计工作室。我们拒绝模板化设计，坚持为每个品牌定制&quot;生长公式&quot;，用深度洞察与前瞻创意赋能视觉，让设计成为连接品牌与用户的情感纽带。
            </p>
          </div>
        </section>
      </div>

      <Navbar />

      {/* Portfolio Section — flat 4-column grid of 14 works */}
      <section className="portfolio-section" id="projects">
        <div className="portfolio-wrapper">
          <div className="portfolio-grid">
            {PROJECTS.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="project-card" id={p.id}>
                <Image src={p.src} alt={p.alt} className="project-image" width={400} height={400} sizes="25vw" loading="lazy" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <FooterSection />
      </div>
    </>
  )
}
