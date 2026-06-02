"use client"

import { useCallback, useEffect } from "react"
import Image from "next/image"
import { GooeyMarquee } from "@/components/ui/gooey-marquee"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"

export default function Page() {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault()
        const id = target.getAttribute("href")?.slice(1)
        const element = document.getElementById(id || "")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }

    document.addEventListener("click", handleNavClick)

    return () => {
      document.removeEventListener("click", handleNavClick)
    }
  }, [])

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

      <div className="container">
        {/* Hero Section */}
        <header className="hero-header">
          <GooeyMarquee text="TOMATO DESIGN " className="hero-title" />
        </header>

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

      {/* Portfolio Section — wider than .container so 12 tiles can spread out */}
      <section className="portfolio-section" id="projects">
        <div className="portfolio-wrapper">
          <Floating sensitivity={-0.5} className="floating-portfolio">
            <div className="portfolio-center">
              <h2 className="portfolio-title">selected works.</h2>
              <a href="#contact" className="portfolio-cta">GO</a>
            </div>

            <FloatingElement depth={1} className="project-wrapper">
                <a href="#zoonique" className="project-card" id="zoonique">
                  <Image src="/Zoonique｜宠物行业.png" alt="Zoonique" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={2} className="project-wrapper">
                <a href="#aevum" className="project-card" id="aevum">
                  <Image src="/aevum｜家具行业png.png" alt="Aevum" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={1.5} className="project-wrapper">
                <a href="#edens" className="project-card" id="edens">
                  <Image src="/eden's ｜餐饮行业(西餐).png" alt="Eden's" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={2} className="project-wrapper">
                <a href="#groovy" className="project-card" id="groovy">
                  <Image src="/GROOVY｜家具行业.png" alt="Groovy" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={1} className="project-wrapper">
                <a href="#meow-cafe" className="project-card" id="meow-cafe">
                  <Image src="/Meow cafe｜咖啡行业.png" alt="Meow Cafe" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={1.5} className="project-wrapper">
                <a href="#ohbake" className="project-card" id="ohbake">
                  <Image src="/ohbake｜烘焙行业.png" alt="Ohbake" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={1.5} className="project-wrapper">
                <a href="#pawprint" className="project-card" id="pawprint">
                  <Image src="/pawprint｜宠物行业.png" alt="Pawprint" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={1} className="project-wrapper">
                <a href="#pureo" className="project-card" id="pureo">
                  <Image src="/pureo｜果蔬行业.png" alt="Pureo" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={2} className="project-wrapper">
                <a href="#scoopie" className="project-card" id="scoopie">
                  <Image src="/scoopie｜饮品行业.png" alt="Scoopie" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={1} className="project-wrapper">
                <a href="#tact-ease" className="project-card" id="tact-ease">
                  <Image src="/tact ease｜服饰行业.png" alt="Tact Ease" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={1.5} className="project-wrapper">
                <a href="#the-bite" className="project-card" id="the-bite">
                  <Image src="/the bite｜餐饮行业.png" alt="The Bite" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>

              <FloatingElement depth={1} className="project-wrapper">
                <a href="#yamyap" className="project-card" id="yamyap">
                  <Image src="/Yamyap｜烘焙行业.png" alt="Yamyap" className="project-image" width={240} height={300} unoptimized />
                </a>
              </FloatingElement>
          </Floating>
        </div>
      </section>

      <div className="container">

        {/* Services Section */}
        <section id="services" style={{ margin: "80px 0", padding: "60px 0", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "5px", textTransform: "uppercase", marginBottom: "50px", fontFamily: "var(--font-syne)" }}>
              Services
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px", alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px", fontFamily: "var(--font-syne)" }}>BRAND DESIGN</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.6, opacity: 0.7, flex: 1, display: "flex", alignItems: "flex-end" }}>Visual Identity, Logo Design, and Brand Guidelines.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px", fontFamily: "var(--font-syne)" }}>PACKAGING DESIGN</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.6, opacity: 0.7, flex: 1, display: "flex", alignItems: "flex-end" }}>Product Packaging and Unboxing Experience.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px", fontFamily: "var(--font-syne)" }}>IP DESIGN</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.6, opacity: 0.7, flex: 1, display: "flex", alignItems: "flex-end", paddingTop: "36px" }}>Character Design and IP Ecosystems.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "10px", fontFamily: "var(--font-syne)" }}>EVENT VISUALS</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.6, opacity: 0.7, flex: 1, display: "flex", alignItems: "flex-end" }}>Exhibitions, Posters, and Spatial Visuals.</p>
              </div>
            </div>

            {/* Process Section */}
            <div style={{ marginTop: "80px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "5px", textTransform: "uppercase", marginBottom: "50px", fontFamily: "var(--font-syne)" }}>
                Process
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
                <div>
                  <h3 className="project-title" data-text="01" style={{ fontSize: "48px", marginBottom: "20px" }} onMouseEnter={handleDistortEnter} onMouseLeave={handleDistortLeave}>01</h3>
                  <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-syne)", marginBottom: "10px" }}>Consultation</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, opacity: 0.7 }}>Initial Communication · Define Design Goals · Confirm Quote & Timeline · Sign Contract · Pay Deposit</p>
                </div>
                <div>
                  <h3 className="project-title" data-text="02" style={{ fontSize: "48px", marginBottom: "20px" }} onMouseEnter={handleDistortEnter} onMouseLeave={handleDistortLeave}>02</h3>
                  <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-syne)", marginBottom: "10px" }}>Project Kickoff</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, opacity: 0.7 }}>Deep Dive into Requirements · Market Research · Style Positioning · Visual Direction Discussion · Confirm Direction</p>
                </div>
                <div>
                  <h3 className="project-title" data-text="03" style={{ fontSize: "48px", marginBottom: "20px" }} onMouseEnter={handleDistortEnter} onMouseLeave={handleDistortLeave}>03</h3>
                  <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-syne)", marginBottom: "10px" }}>Execution</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, opacity: 0.7 }}>Design Creation · Proposal Presentation · Feedback & Refinement · Deliver Files · Follow-up Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tomato Design Section */}
        <section id="atelier" style={{ margin: "120px 0", padding: "80px 0", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <div style={{ marginTop: "40px", maxWidth: "800px" }}>
            <h2 style={{ fontSize: "48px", fontWeight: 800, marginBottom: "20px", fontFamily: "var(--font-syne)" }}>
              CORE TEAM
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 2, opacity: 0.8, marginBottom: "30px" }}>
              CC<br />
              Studio Manager<br />
              Master of Fine Arts graduate, former team lead at a renowned design firm with 7 years of hands-on design experience. Specialized in illustration for years, excelling at combining illustration art with commercial design, creating warm and thoughtful design.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 2, opacity: 0.8 }}>
              Leo<br />
              Design Partner<br />
              Former team lead at a listed company, deeply engaged in consumer technology. Skilled at shaping brand warmth, with the ability to transform rational product logic into emotional brand language.
            </p>
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
                  <a href="https://www.xiaohongshu.com/user/profile/673f253d000000001c019c4d?xsec_token=ABoKjHX7oOVNorNGxELAgmp6zBimewLEGoqez11GXrKKA%3D&xsec_source=pc_search" target="_blank" rel="noopener noreferrer" className="project-title" data-text="RED" onMouseEnter={handleDistortEnter} onMouseLeave={handleDistortLeave}>RED</a>
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
                  <a href="https://www.xiaohongshu.com/user/profile/673f253d000000001c019c4d?xsec_token=ABoKjHX7oOVNorNGxELAgmp6zBimewLEGoqez11GXrKKA%3D&xsec_source=pc_search" target="_blank" rel="noopener noreferrer" className="project-title" data-text="Tomato Design" onMouseEnter={handleDistortEnter} onMouseLeave={handleDistortLeave}>Tomato Design</a>
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