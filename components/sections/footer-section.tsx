"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"
import { trackEvent } from "@/lib/analytics"

const XHS_URL =
  "https://www.xiaohongshu.com/user/profile/673f253d000000001c019c4d?xsec_token=ABoKjHX7oOVNorNGxELAgmp6zBimewLEGoqez11GXrKKA%3D&xsec_source=pc_search"

const handleDistortEnter = (e: React.MouseEvent<HTMLElement>) =>
  e.currentTarget.classList.add("distort-active")
const handleDistortLeave = (e: React.MouseEvent<HTMLElement>) =>
  e.currentTarget.classList.remove("distort-active")

const COPY_RESET_MS = 1500
const EMAIL = "tomatodesign2025@163.com"
const WECHAT = "Tomato9467"

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    // navigator.clipboard requires a secure context (HTTPS / localhost);
    // fall back to a hidden textarea for LAN http / older browsers.
  }
  const ta = document.createElement("textarea")
  ta.value = text
  ta.setAttribute("readonly", "")
  ta.style.position = "fixed"
  ta.style.opacity = "0"
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand("copy")
  } catch {}
  document.body.removeChild(ta)
}

export default function FooterSection() {
  const [showToast, setShowToast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = async (text: string, key: "email" | "wechat") => {
    await copyText(text)
    trackEvent("Contact", "copy", key)
    setShowToast(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShowToast(false), COPY_RESET_MS)
  }

  return (
    <footer id="contact" className="footer">
      <div className="footer-grid">
        <div className="footer-cta-cell">
          <div className="footer-cta">
            LET&apos;S CREATE SOMETHING BOLD TOGETHER
          </div>
        </div>
        <ul className="social-list social-labels">
          <li>
            <span>EMAIL</span>
          </li>
          <li>
            <span>WECHAT</span>
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
              onClick={() => trackEvent("Contact", "click", "xhs")}
            >
              RED
            </a>
          </li>
          <li>
            <span>LOCATION</span>
          </li>
        </ul>
        <ul className="social-list social-values">
          <li>
            <button
              type="button"
              className="copy-btn"
              onClick={() => handleCopy(EMAIL, "email")}
              aria-label="复制邮箱地址"
            >
              {EMAIL}
            </button>
          </li>
          <li>
            <button
              type="button"
              className="copy-btn"
              onClick={() => handleCopy(WECHAT, "wechat")}
              aria-label="复制微信号"
            >
              {WECHAT}
            </button>
          </li>
          <li>
            <a
              href={XHS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="project-title"
              data-text="Tomato Design"
              onMouseEnter={handleDistortEnter}
              onMouseLeave={handleDistortLeave}
              onClick={() => trackEvent("Contact", "click", "xhs")}
            >
              Tomato Design
            </a>
          </li>
          <li>Chengdu, China</li>
        </ul>
      </div>
      <div className="copyright">© 2025 TOMATO DESIGN</div>
      {showToast && (
        <div className="copy-float-toast" role="status" aria-live="polite">
          复制成功
        </div>
      )}
    </footer>
  )
}
