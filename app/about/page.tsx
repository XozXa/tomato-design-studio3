import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import AboutIntroSection from "@/components/sections/about-intro-section"
import ServicesSection from "@/components/sections/services-section"
import ProcessSection from "@/components/sections/process-section"
import TeamSection from "@/components/sections/team-section"
import FooterSection from "@/components/sections/footer-section"

export const metadata: Metadata = {
  title: "About — TOMATODESIGN",
  description:
    "Tomato Design is a creative studio focused on youthful brand expression. Services, process, and team.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <AboutIntroSection />
        <TeamSection />
        <ServicesSection />
        <ProcessSection />
        <FooterSection />
      </div>
    </>
  )
}
