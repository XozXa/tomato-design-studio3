const PARAGRAPHS = [
  "Tomato Design这个名字，源于我们对品牌塑造最根本的信念：",
  "像一颗好番茄那样，扎根于真实的商业土壤，吸收创意的养分，最终结出饱满、鲜活、可感知的设计成果",
  `我们希望自己交付的设计，能像一颗熟透的番茄——既有令人心动的"爆浆"创意，也具备滋养品牌的扎实营养，陪伴品牌生长周期`,
  `我们擅长用年轻化视觉策略与创意图形表达为品牌注入真实、有趣、大胆的"年轻基因"，帮助品牌从0到1，快速建立鲜明的视觉身份`,
  `相信好设计自己会说话，所以我们让视觉本身成为最好的"策略"`,
] as const

export default function AboutIntroSection() {
  return (
    <section id="about" className="section-block">
      <div className="section-header">
        <h2 className="section-title">About</h2>
      </div>
      <div className="section-intro">
        {PARAGRAPHS.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  )
}
