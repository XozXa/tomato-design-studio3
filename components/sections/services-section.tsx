export default function ServicesSection() {
  return (
    <section id="services" className="section-block">
      <div className="section-header">
        <h2 className="section-title">
          服务内容<span className="bilingual-en">Services</span>
        </h2>
        <p className="section-intro">
          从第一笔草图到最终上架，我们覆盖年轻品牌从启动、成长到保持差异化所需的视觉表面。
          <span className="bilingual-en">
            From the first sketch to the final shelf, we cover the visual surface area a young brand needs to launch, grow, and stay distinct.
          </span>
        </p>
      </div>
      <div className="feature-grid feature-grid-4">
        <div className="feature-card">
          <span className="feature-number">01</span>
          <h3 className="feature-name">
            品牌设计
            <span className="bilingual-en">Brand Design</span>
          </h3>
          <p className="feature-desc">
            视觉识别、Logo 设计、品牌规范。
            <span className="bilingual-en">
              Visual Identity, Logo Design, and Brand Guidelines.
            </span>
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-number">02</span>
          <h3 className="feature-name">
            包装设计
            <span className="bilingual-en">Packaging Design</span>
          </h3>
          <p className="feature-desc">
            产品包装与开箱体验。
            <span className="bilingual-en">
              Product Packaging and Unboxing Experience.
            </span>
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-number">03</span>
          <h3 className="feature-name">
            IP 设计
            <span className="bilingual-en">IP Design</span>
          </h3>
          <p className="feature-desc">
            角色设计与 IP 生态。
            <span className="bilingual-en">
              Character Design and IP Ecosystems.
            </span>
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-number">04</span>
          <h3 className="feature-name">
            活动视觉
            <span className="bilingual-en">Event Visuals</span>
          </h3>
          <p className="feature-desc">
            展览、海报与空间视觉。
            <span className="bilingual-en">
              Exhibitions, Posters, and Spatial Visuals.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
