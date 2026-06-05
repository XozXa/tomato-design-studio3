"use client"

import { useCallback } from "react"
import Image from "next/image"
import { Css3dScene } from "@/components/hero/css-3d-scene"

const XHS_URL =
  "https://www.xiaohongshu.com/user/profile/673f253d000000001c019c4d?xsec_token=ABoKjHX7oOVNorNGxELAgmp6zBimewLEGoqez11GXrKKA%3D&xsec_source=pc_search"

const PROJECTS = [
  { id: "zoonique", src: "/Zoonique｜宠物行业.png", alt: "Zoonique" },
  { id: "aevum", src: "/aevum｜家具行业png.png", alt: "Aevum" },
  { id: "edens", src: "/eden's ｜餐饮行业(西餐).png", alt: "Eden's" },
  { id: "groovy", src: "/GROOVY｜家具行业.png", alt: "Groovy" },
  { id: "meow-cafe", src: "/Meow cafe｜咖啡行业.png", alt: "Meow Cafe" },
  { id: "ohbake", src: "/ohbake｜烘焙行业.png", alt: "Ohbake" },
  { id: "pawprint", src: "/pawprint｜宠物行业.png", alt: "Pawprint" },
  { id: "pureo", src: "/pureo｜果蔬行业.png", alt: "Pureo" },
  { id: "scoopie", src: "/scoopie｜饮品行业.png", alt: "Scoopie" },
  { id: "tact-ease", src: "/tact ease｜服饰行业.png", alt: "Tact Ease" },
  { id: "the-bite", src: "/the bite｜餐饮行业.png", alt: "The Bite" },
  { id: "yamyap", src: "/Yamyap｜烘焙行业.png", alt: "Yamyap" },
] as const

export default function Page() {
  const handleDistortEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) =>
      e.currentTarget.classList.add("distort-active"),
    []
  )
  const handleDistortLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) =>
      e.currentTarget.classList.remove("distort-active"),
    []
  )

  return (
    <>
      <div className="grid-overlay"></div>

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
              Tomato Design是一家专注于品牌年轻化表达的创意设计工作室。我们拒绝模板化设计，坚持为每个品牌定制"生长公式"，用深度洞察与前瞻创意赋能视觉，让设计成为连接品牌与用户的情感纽带。
            </p>
          </div>
        </section>
      </div>

      {/* Portfolio Section — flat 3-column grid of 12 works */}
      <section className="portfolio-section" id="projects">
        <div className="portfolio-wrapper">
          <div className="portfolio-grid">
            {PROJECTS.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="project-card" id={p.id}>
                <Image src={p.src} alt={p.alt} className="project-image" width={400} height={500} sizes="33vw" loading="lazy" unoptimized />
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container">

        {/* Services Section */}
        <section id="services" className="section-block">
          <div className="section-header">
            <h2 className="section-title">Services tailored to the full lifecycle of a brand.</h2>
            <p className="section-intro">
              From the first sketch to the final shelf, we cover the visual surface area a young brand needs to launch, grow, and stay distinct.
            </p>
          </div>
          <div className="feature-grid feature-grid-4">
            <div className="feature-card">
              <span className="feature-number">01</span>
              <h3 className="feature-name">Brand Design</h3>
              <p className="feature-desc">Visual Identity, Logo Design, and Brand Guidelines.</p>
            </div>
            <div className="feature-card">
              <span className="feature-number">02</span>
              <h3 className="feature-name">Packaging Design</h3>
              <p className="feature-desc">Product Packaging and Unboxing Experience.</p>
            </div>
            <div className="feature-card">
              <span className="feature-number">03</span>
              <h3 className="feature-name">IP Design</h3>
              <p className="feature-desc">Character Design and IP Ecosystems.</p>
            </div>
            <div className="feature-card">
              <span className="feature-number">04</span>
              <h3 className="feature-name">Event Visuals</h3>
              <p className="feature-desc">Exhibitions, Posters, and Spatial Visuals.</p>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="section-block">
          <div className="section-header">
            <h2 className="section-title">A clear, three-step path from brief to delivery.</h2>
            <p className="section-intro">
              We keep the process lean and transparent — every step has a defined output, so the brand always knows where the project stands.
            </p>
          </div>
          <div className="feature-grid feature-grid-3">
            <div className="feature-card">
              <span className="feature-number">01</span>
              <h3 className="feature-name">Consultation</h3>
              <p className="feature-desc">Initial Communication · Define Design Goals · Confirm Quote & Timeline · Sign Contract · Pay Deposit</p>
            </div>
            <div className="feature-card">
              <span className="feature-number">02</span>
              <h3 className="feature-name">Project Kickoff</h3>
              <p className="feature-desc">Deep Dive into Requirements · Market Research · Style Positioning · Visual Direction Discussion · Confirm Direction</p>
            </div>
            <div className="feature-card">
              <span className="feature-number">03</span>
              <h3 className="feature-name">Execution</h3>
              <p className="feature-desc">Design Creation · Proposal Presentation · Feedback & Refinement · Deliver Files · Follow-up Support</p>
            </div>
          </div>
        </section>

        {/* Tomato Design Section */}
        <section id="atelier" className="section-block">
          <div className="section-header">
            <h2 className="section-title">Core Team. The hands behind every project.</h2>
            <p className="section-intro">
              A small, senior pair — one illustrator-leaning, one product-leaning. Two perspectives, one studio voice.
            </p>
          </div>
          <div className="feature-grid feature-grid-2">
            <div className="feature-card">
              <span className="feature-number">CC</span>
              <h3 className="feature-name">Studio Manager</h3>
              <p className="feature-desc">Master of Fine Arts graduate, former team lead at a renowned design firm with 7 years of hands-on design experience. Specialized in illustration for years, excelling at combining illustration art with commercial design, creating warm and thoughtful design.</p>
            </div>
            <div className="feature-card">
              <span className="feature-number">Leo</span>
              <h3 className="feature-name">Design Partner</h3>
              <p className="feature-desc">Former team lead at a listed company, deeply engaged in consumer technology. Skilled at shaping brand warmth, with the ability to transform rational product logic into emotional brand language.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="footer">
          <div className="footer-grid">
            <div>
              <div className="footer-cta">
                LET&apos;S CREATE SOMETHING BOLD TOGETHER
              </div>
            </div>
            <div>
              <ul className="social-list">
                <li>
                  <a href="#">EMAIL</a>
                </li>
                <li>
                  <a href="#">WECHAT</a>
                </li>
                <li>
                  <a href={XHS_URL} target="_blank" rel="noopener noreferrer" className="project-title" data-text="RED" onMouseEnter={handleDistortEnter} onMouseLeave={handleDistortLeave}>RED</a>
                </li>
                <li>
                  <a href="#">LOCATION</a>
                </li>
              </ul>
            </div>
            <div className="social-list text-right">
              <ul>
                <li>tomatodesign2025@163.com</li>
                <li>Tomato9467</li>
                <li>
                  <a href={XHS_URL} target="_blank" rel="noopener noreferrer" className="project-title" data-text="Tomato Design" onMouseEnter={handleDistortEnter} onMouseLeave={handleDistortLeave}>Tomato Design</a>
                </li>
                <li>Chengdu, China</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>

      {/* Background Accents */}
      <div className="bg-accents"></div>
    </>
  )
}