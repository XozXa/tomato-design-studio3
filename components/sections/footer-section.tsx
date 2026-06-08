"use client"

import type React from "react"

const XHS_URL =
  "https://www.xiaohongshu.com/user/profile/673f253d000000001c019c4d?xsec_token=ABoKjHX7oOVNorNGxELAgmp6zBimewLEGoqez11GXrKKA%3D&xsec_source=pc_search"

const handleDistortEnter = (e: React.MouseEvent<HTMLElement>) =>
  e.currentTarget.classList.add("distort-active")
const handleDistortLeave = (e: React.MouseEvent<HTMLElement>) =>
  e.currentTarget.classList.remove("distort-active")

export default function FooterSection() {
  return (
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
              <a
                href={XHS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="project-title"
                data-text="RED"
                onMouseEnter={handleDistortEnter}
                onMouseLeave={handleDistortLeave}
              >
                RED
              </a>
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
              <a
                href={XHS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="project-title"
                data-text="Tomato Design"
                onMouseEnter={handleDistortEnter}
                onMouseLeave={handleDistortLeave}
              >
                Tomato Design
              </a>
            </li>
            <li>Chengdu, China</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
