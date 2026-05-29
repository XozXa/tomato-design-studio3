"use client"

import { useEffect } from "react"
import Image from "next/image"

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

    // Title distortion effect
    const titles = document.querySelectorAll(".project-title")
    const titleHandlers: { el: Element; enter: () => void; leave: () => void }[] = []

    titles.forEach((title) => {
      const handleEnter = () => title.classList.add("distort-active")
      const handleLeave = () => title.classList.remove("distort-active")
      title.addEventListener("mouseenter", handleEnter)
      title.addEventListener("mouseleave", handleLeave)
      titleHandlers.push({ el: title, enter: handleEnter, leave: handleLeave })
    })

    return () => {
      document.removeEventListener("click", handleNavClick)
      titleHandlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter)
        el.removeEventListener("mouseleave", leave)
      })
    }
  }, [])

  return (
    <>
      <div className="grid-overlay"></div>

      <nav>
        <div className="nav-logo">Insight &amp; Warmth</div>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#atelier">Tomato Design</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-copyright">©26</div>
      </nav>

      <div className="container">
        {/* Hero Section */}
        <header>
          <Image
                src="/tomato.png"
                alt="Tomato"
                className="geometric-accent-1"
                width={300}
                height={300}
                unoptimized
              />
          <h1 className="hero-title">
            <span>TOMATO</span>
            <span>DESIGN</span>
          </h1>
          <p className="hero-subtitle">
            An independent creative studio rooted in Chengdu. We navigate the intersection of deep insight and forward-looking creativity, refusing template-driven design to cultivate bespoke growth formulas for every brand. We believe design should be not only good-looking, but taste right — making it an emotional bond between brand and user.
          </p>
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: 0,
              width: "300px",
              height: "1px",
              background: "black",
            }}
          ></div>
        </header>

        {/* Portfolio Section */}
        <main className="portfolio-section" id="projects">
          <div className="section-label">Selected Works</div>

          <div className="diagonal-grid">
            {/* Project 1 */}
            <a href="#zoonique" className="project-card" id="zoonique">
              <div className="project-image-wrapper">
                <Image
                  src="/Zoonique｜宠物行业.png"
                  alt="Zoonique"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Pet Industry</span>
                <h2 className="project-title" data-text="ZOONIQUE">ZOONIQUE</h2>
              </div>
            </a>

            {/* Project 2 */}
            <a href="#aevum" className="project-card" id="aevum">
              <div className="project-image-wrapper">
                <Image
                  src="/aevum｜家具行业png.png"
                  alt="Aevum"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Furniture</span>
                <h2 className="project-title" data-text="AEVUM">AEVUM</h2>
              </div>
            </a>

            {/* Project 3 */}
            <a href="#edens" className="project-card" id="edens">
              <div className="project-image-wrapper">
                <Image
                  src="/eden's ｜餐饮行业(西餐).png"
                  alt="Eden's"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Fine Dining</span>
                <h2 className="project-title" data-text="EDEN&apos;S">EDEN&apos;S</h2>
              </div>
            </a>

            {/* Project 4 */}
            <a href="#groovy" className="project-card" id="groovy">
              <div className="project-image-wrapper">
                <Image
                  src="/GROOVY｜家具行业.png"
                  alt="Groovy"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Furniture / 2023</span>
                <h2 className="project-title" data-text="GROOVY">GROOVY</h2>
              </div>
            </a>

            {/* Project 5 */}
            <a href="#meow-cafe" className="project-card" id="meow-cafe">
              <div className="project-image-wrapper">
                <Image
                  src="/Meow cafe｜咖啡行业.png"
                  alt="Meow Cafe"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Cafe</span>
                <h2 className="project-title" data-text="MEOW CAFE">MEOW CAFE</h2>
              </div>
            </a>

            {/* Project 6 */}
            <a href="#ohbake" className="project-card" id="ohbake">
              <div className="project-image-wrapper">
                <Image
                  src="/ohbake｜烘焙行业.png"
                  alt="Ohbake"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Bakery</span>
                <h2 className="project-title" data-text="OHBAKE">OHBAKE</h2>
              </div>
            </a>

            {/* Project 7 */}
            <a href="#pawprint" className="project-card" id="pawprint">
              <div className="project-image-wrapper">
                <Image
                  src="/pawprint｜宠物行业.png"
                  alt="Pawprint"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Pet Industry / 2023</span>
                <h2 className="project-title" data-text="PAWPRINT">PAWPRINT</h2>
              </div>
            </a>

            {/* Project 8 */}
            <a href="#pureo" className="project-card" id="pureo">
              <div className="project-image-wrapper">
                <Image
                  src="/pureo｜果蔬行业.png"
                  alt="Pureo"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Fresh Produce</span>
                <h2 className="project-title" data-text="PUREO">PUREO</h2>
              </div>
            </a>

            {/* Project 9 */}
            <a href="#scoopie" className="project-card" id="scoopie">
              <div className="project-image-wrapper">
                <Image
                  src="/scoopie｜饮品行业.png"
                  alt="Scoopie"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Beverage</span>
                <h2 className="project-title" data-text="SCOOPIE">SCOOPIE</h2>
              </div>
            </a>

            {/* Project 10 */}
            <a href="#tact-ease" className="project-card" id="tact-ease">
              <div className="project-image-wrapper">
                <Image
                  src="/tact ease｜服饰行业.png"
                  alt="Tact Ease"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Fashion</span>
                <h2 className="project-title" data-text="TACT EASE">TACT EASE</h2>
              </div>
            </a>

            {/* Project 11 */}
            <a href="#the-bite" className="project-card" id="the-bite">
              <div className="project-image-wrapper">
                <Image
                  src="/the bite｜餐饮行业.png"
                  alt="The Bite"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Restaurant</span>
                <h2 className="project-title" data-text="THE BITE">THE BITE</h2>
              </div>
            </a>

            {/* Project 12 */}
            <a href="#yamyap" className="project-card" id="yamyap">
              <div className="project-image-wrapper">
                <Image
                  src="/Yamyap｜烘焙行业.png"
                  alt="Yamyap"
                  className="project-image"
                  width={1200}
                  height={450}
                  unoptimized
                />
              </div>
              <div className="project-info">
                <span className="project-category">Bakery / 2024</span>
                <h2 className="project-title" data-text="YAMYAP">YAMYAP</h2>
              </div>
            </a>
          </div>
        </main>

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
                  <h3 className="project-title" data-text="01" style={{ fontSize: "48px", marginBottom: "20px" }}>01</h3>
                  <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-syne)", marginBottom: "10px" }}>Consultation</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, opacity: 0.7 }}>Initial Communication · Define Design Goals · Confirm Quote & Timeline · Sign Contract · Pay Deposit</p>
                </div>
                <div>
                  <h3 className="project-title" data-text="02" style={{ fontSize: "48px", marginBottom: "20px" }}>02</h3>
                  <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-syne)", marginBottom: "10px" }}>Project Kickoff</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, opacity: 0.7 }}>Deep Dive into Requirements · Market Research · Style Positioning · Visual Direction Discussion · Confirm Direction</p>
                </div>
                <div>
                  <h3 className="project-title" data-text="03" style={{ fontSize: "48px", marginBottom: "20px" }}>03</h3>
                  <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-syne)", marginBottom: "10px" }}>Execution</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.8, opacity: 0.7 }}>Design Creation · Proposal Presentation · Feedback & Refinement · Deliver Files · Follow-up Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tomato Design Section */}
        <section id="atelier" style={{ margin: "120px 0", padding: "80px 0", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <div className="section-label">Design Studio</div>
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
                  <a href="https://www.xiaohongshu.com/user/profile/673f253d000000001c019c4d?xsec_token=ABoKjHX7oOVNorNGxELAgmp6zBimewLEGoqez11GXrKKA%3D&xsec_source=pc_search" target="_blank" rel="noopener noreferrer" className="project-title" data-text="RED">RED</a>
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
                  <a href="https://www.xiaohongshu.com/user/profile/673f253d000000001c019c4d?xsec_token=ABoKjHX7oOVNorNGxELAgmp6zBimewLEGoqez11GXrKKA%3D&xsec_source=pc_search" target="_blank" rel="noopener noreferrer" className="project-title" data-text="Tomato Design">Tomato Design</a>
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