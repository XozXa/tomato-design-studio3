const SERVICES = [
  {
    no: "01",
    nameCn: "品牌设计",
    nameEn: "Brand Design",
    items: ["品牌视觉搭建", "品牌LOGO设计", "VI视觉识别系统", "动态设计"],
  },
  {
    no: "02",
    nameCn: "包装设计",
    nameEn: "Packaging Design",
    items: ["产品包装设计", "产品外观设计", "包装建模渲染", "包装插画设计"],
  },
  {
    no: "03",
    nameCn: "IP 设计",
    nameEn: "IP Design",
    items: ["IP形象设计", "IP服装动作场景延展", "IP建模渲染", "IP应用物料延展"],
  },
  {
    no: "04",
    nameCn: "活动视觉",
    nameEn: "Event Visuals",
    items: ["主kv设计", "插画设计", "电商设计", "运营海报"],
  },
] as const

import ServiceViewTracker from "@/components/sections/service-view-tracker"

export default function ServicesSection() {
  return (
    <section id="services" className="section-block">
      <div className="section-header">
        <h2 className="section-title">Services</h2>
      </div>
      <div className="feature-grid feature-grid-4">
        {SERVICES.map((s) => (
          <div key={s.no} className="feature-card">
            <span className="feature-number">{s.no}</span>
            <h3 className="feature-name">
              {s.nameCn}
              <span className="bilingual-en">{s.nameEn}</span>
            </h3>
            <ul className="feature-list">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <ServiceViewTracker />
    </section>
  )
}
