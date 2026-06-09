import type { Metadata } from "next"
import Image from "next/image"
import Navbar from "@/components/navbar"
import FooterSection from "@/components/sections/footer-section"
import { FadeIn } from "@/components/fade-in"
import { getProjectById, projects } from "@/data/projects"

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = getProjectById(id)
  return project
    ? { title: `${project.brand} — TOMATODESIGN` }
    : { title: "Coming soon — TOMATODESIGN" }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = getProjectById(id)

  return (
    <>
      <Navbar />

      {project ? (
        <article className="project-detail">
          <FadeIn variant="hero">
            <Image
              src={project.assets.header}
              alt={project.brand}
              width={3750}
              height={2495}
              priority
              unoptimized
              className="detail-image-full"
            />
          </FadeIn>

          <FadeIn>
            <section className="detail-meta-section">
              <h1 className="detail-meta-title">{project.brand}</h1>
              <div className="detail-meta-list">
                <div className="detail-meta-row">
                  <span className="detail-meta-label">CLIENT:</span>
                  <span className="detail-meta-value">{project.brand}</span>
                </div>
                <div className="detail-meta-row">
                  <span className="detail-meta-label">SERVICE:</span>
                  <span className="detail-meta-value">{project.meta.service}</span>
                </div>
                {project.meta.industry && (
                  <div className="detail-meta-row">
                    <span className="detail-meta-label">INDUSTRY:</span>
                    <span className="detail-meta-value">{project.meta.industry}</span>
                  </div>
                )}
              </div>

              <div className="detail-description-content">
                <p className="detail-description">{project.description}</p>
                {project.descriptionEn && (
                  <p className="detail-description detail-description--en">
                    {project.descriptionEn}
                  </p>
                )}
              </div>
            </section>
          </FadeIn>

          {project.assets.attached.map((src) => (
            <FadeIn key={src} className="detail-attached-image">
              <Image
                src={src}
                alt={project.brand}
                width={3750}
                height={5000}
                loading="lazy"
                unoptimized
                className="detail-image-full"
              />
            </FadeIn>
          ))}

          <div className="detail-images-grid">
            {project.assets.gallery.map((src, i) => (
              <FadeIn key={src}>
                <Image
                  src={src}
                  alt={`${project.brand} ${i + 1}`}
                  width={3750}
                  height={5000}
                  loading="lazy"
                  unoptimized
                  className="detail-image-full"
                />
              </FadeIn>
            ))}
          </div>
        </article>
      ) : (
        <section className="coming-soon">
          <h1 className="section-title">Coming soon</h1>
          <p className="section-intro">
            这个项目正在准备中。
            <br />
            <a href="/">返回首页</a>
          </p>
        </section>
      )}

      <div className="container">
        <FooterSection />
      </div>
    </>
  )
}
