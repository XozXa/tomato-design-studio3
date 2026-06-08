"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isDetailPage = pathname?.startsWith("/projects/") ?? false

  return (
    <nav>
      {isDetailPage ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="nav-back-button"
          aria-label="返回上一页"
        >
          <img src="/返回.svg" alt="" width={20} height={20} />
        </button>
      ) : (
        <div className="nav-back-spacer" />
      )}
      <div className="nav-links">
        <Link href="/">Work</Link>
        <Link href="/about">About</Link>
        <Link href="/#contact">Contact</Link>
      </div>
      <div className="nav-back-spacer" />
    </nav>
  )
}
