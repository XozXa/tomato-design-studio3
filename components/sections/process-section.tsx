const PROCESS = [
  {
    no: "01",
    nameCn: "前期沟通",
    nameEn: "Preliminary communication",
    items: ["了解需求", "确定报价和排期", "合同签署", "支付定金"],
  },
  {
    no: "02",
    nameCn: "中期设计",
    nameEn: "Mid-term design",
    items: ["深入了解需求", "项目风格调研", "方案产出", "优化沟通", "确认方向"],
  },
  {
    no: "03",
    nameCn: "后期交付",
    nameEn: "Later delivery",
    items: ["敲定方案", "支付尾款", "交付最终文件", "协助落地", "项目完结"],
  },
] as const

export default function ProcessSection() {
  return (
    <section id="process" className="section-block">
      <div className="section-header">
        <h2 className="section-title">Process</h2>
      </div>
      <div className="feature-grid feature-grid-3">
        {PROCESS.map((p) => (
          <div key={p.no} className="feature-card">
            <span className="feature-number">{p.no}</span>
            <h3 className="feature-name">
              {p.nameCn}
              <span className="bilingual-en">{p.nameEn}</span>
            </h3>
            <ul className="feature-list">
              {p.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
