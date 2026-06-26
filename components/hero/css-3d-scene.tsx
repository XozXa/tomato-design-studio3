"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  CENTRAL_LOGO_ASPECT,
  CENTRAL_LOGO_SRC,
  DESKTOP_LOGO_WIDTH,
  FLOATING_ITEMS,
  MOBILE_FLOATING_ITEMS,
  MOBILE_LOGO_WIDTH,
} from "./floating-config"
import styles from "./hero.module.css"

const MQ_MOBILE = "(max-width: 768px)"
interface Vec3 { x: number; y: number; z: number }
interface Vec2 { x: number; y: number }
interface State {
  pos: Vec3
  vel: Vec3
  rot: number
  spinZ: number
  el: HTMLDivElement | null
  radius: number
  phaseX: number
  phaseY: number
  phaseZ: number
  wobbleX: number
  wobbleY: number
  wobbleZ: number
  rotPhaseZ: number
  lastZ: number
}
type Mode = "idle" | "stir"

function clampAxis(val: number, velRef: Vec3, axis: "x" | "y" | "z", halfRange: number, k: number) {
  if (val > halfRange) { velRef[axis] -= (val - halfRange) * k; return halfRange }
  if (val < -halfRange) { velRef[axis] -= (val + halfRange) * k; return -halfRange }
  return val
}

export function Css3dScene() {
  // SSR has no window, so the initial state is desktop. The mount effect
  // re-reads matchMedia after hydration — if the user is actually on mobile
  // React re-renders with mobile PARAMS / MOBILE_FLOATING_ITEMS, and the
  // physics useEffect below (deps: [isMobile]) re-seeds states + restarts
  // rAF. No hydration mismatch because SSR and first-paint client both
  // render the desktop markup.
  const [isMobile, setIsMobile] = useState(false)

  // All physics / sizing constants derived from isMobile. Cheap to
  // recompute each render (11 ternaries), keeps parity with module-level
  // constants the rest of the file references.
  const MAX_TILT_DEG        = isMobile ? 4   : 8
  const BASE_DRIFT_FREQ_X   = 0.00028
  const BASE_DRIFT_FREQ_Y   = 0.00032
  const BASE_DRIFT_FREQ_Z   = 0.00024
  const BASE_DRIFT_AMP_XY   = isMobile ? 0.25: 0.5
  const BASE_DRIFT_AMP_Z    = isMobile ? 0.3 : 0.6
  const WOBBLE_FREQ         = 0.0055
  const WOBBLE_AMP_XY       = isMobile ? 0.12: 0.25
  const WOBBLE_AMP_Z        = isMobile ? 0.12: 0.25
  const RANDOM_PUSH         = isMobile ? 0.08: 0.15
  const DAMPING             = 0.94
  const MAX_SPEED           = isMobile ? 3   : 6
  const EDGE_PAD            = isMobile ? 60  : 200
  const HALF_Z              = isMobile ? 200 : 300
  const XY_BOUNDARY_K       = 0.06
  const Z_BOUNDARY_K        = 0.15
  const Z_INDEX_BASE        = 100
  const INIT_JITTER_XY      = isMobile ? 30  : 70
  const INIT_JITTER_Z       = isMobile ? 80  : 150

  const ORBIT_CW_K = 0.05
  const Z_FLOW = 0.05

  // Z-axis self-rotation only. Rotating around X or Y on flat PNGs flips
  // them edge-on to the camera and they disappear.
  const ROT_FREQ_Z = 0.00055
  const SPIN_AMP_Z = 0.35
  const ROT_SPRING_K = 0.025
  const COLLISION_SPIN_K = 0.5

  // Visual width is the full PNG box, but the tomato silhouette only fills
  // ~50-60% of that. A fraction-of-width collision body keeps 6 items from
  // constantly bumping.
  const RESTITUTION = 0.3
  const COLLISION_RADIUS_FACTOR = 0.3
  const LOGO_WIDTH     = isMobile ? MOBILE_LOGO_WIDTH : DESKTOP_LOGO_WIDTH
  const LOGO_HALF_W    = LOGO_WIDTH / 2
  const LOGO_HALF_H    = (LOGO_WIDTH * CENTRAL_LOGO_ASPECT) / 2

  const SWIRL_KICK        = isMobile ? 8 : 14
  const SWIRL_FALLOFF     = 250
  const STIR_PULL         = 0.004
  const STIR_DURATION_MS  = 2000
  const TILT_EASE_K       = isMobile ? 0.025 : 0.04
  const TILT_DEADBAND     = 0.01

  const sceneRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const statesRef = useRef<State[]>([])
  const attractorRef = useRef<Vec2>({ x: 0, y: 0 })
  const modeRef = useRef<Mode>("idle")
  const stirStartRef = useRef<number>(0)
  const tiltRef = useRef<Vec2>({ x: 0, y: 0 })
  const tiltTargetRef = useRef<Vec2>({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setIsMobile(window.matchMedia(MQ_MOBILE).matches)
  }, [])

  useEffect(() => {
    const world = worldRef.current
    const scene = sceneRef.current
    if (!world || !scene) return

    // Seed states up front so the reduced-motion branch below can paint.
    // Mobile (≤768px) uses the tighter MOBILE_FLOATING_ITEMS — same x/y/z/rot
    // proportions at ~0.5× width, so visual balance survives the resize.
    const items = isMobile ? MOBILE_FLOATING_ITEMS : FLOATING_ITEMS
    statesRef.current = items.map((item) => {
      const initZ = (Math.random() - 0.5) * 2 * INIT_JITTER_Z
      return {
        pos: {
          x: item.x + (Math.random() - 0.5) * 2 * INIT_JITTER_XY,
          y: item.y + (Math.random() - 0.5) * 2 * INIT_JITTER_XY,
          z: initZ,
        },
        vel: {
          x: (Math.random() - 0.5) * 1.6,
          y: (Math.random() - 0.5) * 1.6,
          z: (Math.random() - 0.5) * 1.6,
        },
        rot: item.rot,
        spinZ: 0,
        el: null,
        radius: item.width * COLLISION_RADIUS_FACTOR,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        wobbleX: Math.random() * Math.PI * 2,
        wobbleY: Math.random() * Math.PI * 2,
        wobbleZ: Math.random() * Math.PI * 2,
        rotPhaseZ: Math.random() * Math.PI * 2,
        lastZ: Math.round(Z_INDEX_BASE + initZ),
      }
    })

    // Children order: 6 floating items first, then the central LOGO. The
    // physics loop only touches indices 0..N-1.
    const children = Array.from(world.children) as HTMLDivElement[]
    for (let i = 0; i < items.length; i++) {
      statesRef.current[i].el = children[i] ?? null
    }

    const paintAll = () => {
      for (const s of statesRef.current) {
        if (!s.el) continue
        const px = Math.round(s.pos.x)
        const py = Math.round(s.pos.y)
        const pz = Math.round(s.pos.z)
        s.el.style.transform =
          `translate(-50%, -50%) translate3d(${px}px, ${py}px, ${pz}px) rotate(${Math.round(s.rot)}deg)`
        // zIndex only needs an integer change — skip the style write when
        // the rounded value hasn't moved, otherwise we invalidate style on
        // 6 elements every frame for a property that rarely changes.
        const z = Z_INDEX_BASE + Math.round(s.pos.z)
        if (z !== s.lastZ) {
          s.el.style.zIndex = String(z)
          s.lastZ = z
        }
      }
    }
    paintAll()

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    // Cached scene rect — refreshed on resize so the per-event listeners
    // (mousemove, click) can do rect math without forcing layout. halfW/halfH
    // are precomputed because the rAF loop reads them 6×/frame.
    const dims = { w: 0, h: 0, left: 0, top: 0, halfW: 0, halfH: 0 }
    const refreshRect = () => {
      const r = scene.getBoundingClientRect()
      dims.w = r.width
      dims.h = r.height
      dims.left = r.left
      dims.top = r.top
      dims.halfW = r.width / 2 - EDGE_PAD
      dims.halfH = r.height / 2 - EDGE_PAD
    }
    const ro = new ResizeObserver(refreshRect)
    ro.observe(scene)
    refreshRect()

    const updateTilt = (clientX: number, clientY: number) => {
      const nx = ((clientX - dims.left) / dims.w) * 2 - 1
      const ny = ((clientY - dims.top) / dims.h) * 2 - 1
      tiltTargetRef.current.x = nx
      tiltTargetRef.current.y = ny
    }
    const onMove = (e: MouseEvent) => updateTilt(e.clientX, e.clientY)
    const onLeave = () => {
      tiltTargetRef.current.x = 0
      tiltTargetRef.current.y = 0
    }

    // Click = "stir the water": tangential impulse around the click point
    // (falls off with distance) + Z spin kick. Z-axis only — see top of file.
    const triggerStir = (clientX: number, clientY: number) => {
      const clickPos = {
        x: clientX - dims.left - dims.w / 2,
        y: clientY - dims.top - dims.h / 2,
      }

      for (const s of statesRef.current) {
        const dx = s.pos.x - clickPos.x
        const dy = s.pos.y - clickPos.y
        const distXY = Math.sqrt(dx * dx + dy * dy) + 0.001
        const tx = -dy / distXY
        const ty = dx / distXY
        const kick = SWIRL_KICK / (1 + distXY / SWIRL_FALLOFF)
        s.vel.x += tx * kick
        s.vel.y += ty * kick
        s.vel.z += (Math.random() - 0.5) * kick * 0.3
        s.spinZ += (Math.random() - 0.5) * 3
      }

      attractorRef.current = clickPos
      stirStartRef.current = performance.now()
      modeRef.current = "stir"
    }
    const onClick = (e: MouseEvent) => triggerStir(e.clientX, e.clientY)

    // Pointer events fire for both mouse and touch, so mobile users get
    // tilt-on-drag + tap-to-stir without needing parallel touchstart handlers.
    // setPointerCapture keeps the gesture tracked if the finger drifts past
    // the scene edge mid-drag.
    const onPointerMove = (e: PointerEvent) => updateTilt(e.clientX, e.clientY)
    const onPointerDown = (e: PointerEvent) => {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      triggerStir(e.clientX, e.clientY)
    }
    const onPointerLeave = () => {
      tiltTargetRef.current.x = 0
      tiltTargetRef.current.y = 0
    }

    let lastTiltX = 0
    let lastTiltY = 0

    const tick = () => {
      const states = statesRef.current
      const t = performance.now()
      const isStir = modeRef.current === "stir"
      let pull = 0
      let attractor = null as Vec2 | null
      if (isStir) {
        const elapsed = t - stirStartRef.current
        const t01 = Math.min(elapsed / STIR_DURATION_MS, 1)
        pull = STIR_PULL * (1 - t01)
        if (elapsed >= STIR_DURATION_MS) {
          modeRef.current = "idle"
        } else {
          attractor = attractorRef.current
        }
      }

      for (const s of states) {
        if (attractor) {
          s.vel.x += (attractor.x - s.pos.x) * pull
          s.vel.y += (attractor.y - s.pos.y) * pull
        }
        // CSS y points down, so CW tangent at (px,py) is (-py, px).
        const flowR = Math.sqrt(s.pos.x * s.pos.x + s.pos.y * s.pos.y) + 0.001
        s.vel.x += (-s.pos.y / flowR) * ORBIT_CW_K
        s.vel.y += (s.pos.x / flowR) * ORBIT_CW_K
        s.vel.z += Z_FLOW
        s.vel.x += Math.sin(t * BASE_DRIFT_FREQ_X + s.phaseX) * BASE_DRIFT_AMP_XY
        s.vel.y += Math.sin(t * BASE_DRIFT_FREQ_Y + s.phaseY) * BASE_DRIFT_AMP_XY
        s.vel.z += Math.sin(t * BASE_DRIFT_FREQ_Z + s.phaseZ) * BASE_DRIFT_AMP_Z
        s.vel.x += Math.sin(t * WOBBLE_FREQ + s.wobbleX) * WOBBLE_AMP_XY
        s.vel.y += Math.sin(t * WOBBLE_FREQ + s.wobbleY) * WOBBLE_AMP_XY
        s.vel.z += Math.sin(t * WOBBLE_FREQ + s.wobbleZ) * WOBBLE_AMP_Z
        s.vel.x += (Math.random() - 0.5) * RANDOM_PUSH
        s.vel.y += (Math.random() - 0.5) * RANDOM_PUSH
        s.vel.z += (Math.random() - 0.5) * RANDOM_PUSH
        s.vel.x *= DAMPING
        s.vel.y *= DAMPING
        s.vel.z *= DAMPING

        const sp2 = s.vel.x * s.vel.x + s.vel.y * s.vel.y + s.vel.z * s.vel.z
        if (sp2 > MAX_SPEED * MAX_SPEED) {
          const r = MAX_SPEED / Math.sqrt(sp2)
          s.vel.x *= r
          s.vel.y *= r
          s.vel.z *= r
        }

        // SpinZ damps toward a slow sinusoidal target — collision/stir
        // kicks briefly speed it up, then it eases back to baseline.
        const targetSpinZ = Math.sin(t * ROT_FREQ_Z + s.rotPhaseZ) * SPIN_AMP_Z
        s.spinZ += (targetSpinZ - s.spinZ) * ROT_SPRING_K
        s.rot += s.spinZ

        s.pos.x += s.vel.x
        s.pos.y += s.vel.y
        s.pos.z += s.vel.z

        s.pos.x = clampAxis(s.pos.x, s.vel, "x", dims.halfW, XY_BOUNDARY_K)
        s.pos.y = clampAxis(s.pos.y, s.vel, "y", dims.halfH, XY_BOUNDARY_K)
        s.pos.z = clampAxis(s.pos.z, s.vel, "z", HALF_Z, Z_BOUNDARY_K)
      }

      // floating ↔ floating (full 3D sphere + Z spin kick)
      for (let i = 0; i < states.length; i++) {
        for (let j = i + 1; j < states.length; j++) {
          const bodyA = states[i]
          const bodyB = states[j]
          const dx = bodyB.pos.x - bodyA.pos.x
          const dy = bodyB.pos.y - bodyA.pos.y
          const dz = bodyB.pos.z - bodyA.pos.z
          const dist2 = dx * dx + dy * dy + dz * dz
          const minDist = bodyA.radius + bodyB.radius
          if (dist2 < minDist * minDist) {
            const dist = Math.sqrt(dist2) + 0.001
            const nx = dx / dist
            const ny = dy / dist
            const nz = dz / dist
            const overlap = minDist - dist
            bodyA.pos.x -= nx * overlap * 0.5
            bodyA.pos.y -= ny * overlap * 0.5
            bodyA.pos.z -= nz * overlap * 0.5
            bodyB.pos.x += nx * overlap * 0.5
            bodyB.pos.y += ny * overlap * 0.5
            bodyB.pos.z += nz * overlap * 0.5
            const relVx = bodyB.vel.x - bodyA.vel.x
            const relVy = bodyB.vel.y - bodyA.vel.y
            const relVz = bodyB.vel.z - bodyA.vel.z
            const relVelN = relVx * nx + relVy * ny + relVz * nz
            if (relVelN < 0) {
              const impulse = -(1 + RESTITUTION) * relVelN * 0.5
              bodyA.vel.x -= nx * impulse
              bodyA.vel.y -= ny * impulse
              bodyA.vel.z -= nz * impulse
              bodyB.vel.x += nx * impulse
              bodyB.vel.y += ny * impulse
              bodyB.vel.z += nz * impulse
              const spinKick = Math.abs(impulse) * COLLISION_SPIN_K
              bodyA.spinZ += (Math.random() - 0.5) * spinKick
              bodyB.spinZ += (Math.random() - 0.5) * spinKick
            }
          }
        }
      }

      // floating ↔ LOGO (XY plane, with Z spin kick)
      for (const s of states) {
        const cx = Math.max(-LOGO_HALF_W, Math.min(LOGO_HALF_W, s.pos.x))
        const cy = Math.max(-LOGO_HALF_H, Math.min(LOGO_HALF_H, s.pos.y))
        const dx = s.pos.x - cx
        const dy = s.pos.y - cy
        const dist2 = dx * dx + dy * dy

        if (dist2 < s.radius * s.radius) {
          const dist = Math.sqrt(dist2)
          let nx: number, ny: number
          if (dist < 0.001) {
            const dR = LOGO_HALF_W + s.radius - s.pos.x
            const dL = s.pos.x - (-LOGO_HALF_W - s.radius)
            const dT = LOGO_HALF_H + s.radius - s.pos.y
            const dB = s.pos.y - (-LOGO_HALF_H - s.radius)
            const m = Math.min(dR, dL, dT, dB)
            if (m === dR)      { s.pos.x =  LOGO_HALF_W + s.radius; nx =  1; ny =  0 }
            else if (m === dL) { s.pos.x = -LOGO_HALF_W - s.radius; nx = -1; ny =  0 }
            else if (m === dT) { s.pos.y =  LOGO_HALF_H + s.radius; nx =  0; ny =  1 }
            else               { s.pos.y = -LOGO_HALF_H - s.radius; nx =  0; ny = -1 }
          } else {
            nx = dx / dist
            ny = dy / dist
            const overlap = s.radius - dist
            s.pos.x += nx * overlap
            s.pos.y += ny * overlap
          }
          const vDotN = s.vel.x * nx + s.vel.y * ny
          if (vDotN < 0) {
            s.vel.x -= nx * (1 + RESTITUTION) * vDotN
            s.vel.y -= ny * (1 + RESTITUTION) * vDotN
            const spinKick = Math.abs(vDotN) * COLLISION_SPIN_K
            s.spinZ += (Math.random() - 0.5) * spinKick
          }
        }
      }

      paintAll()

      const tt = tiltTargetRef.current
      const ct = tiltRef.current
      ct.x += (tt.x - ct.x) * TILT_EASE_K
      ct.y += (tt.y - ct.y) * TILT_EASE_K
      const tiltX = -ct.y * MAX_TILT_DEG
      const tiltY = ct.x * MAX_TILT_DEG
      if (
        Math.abs(tiltX - lastTiltX) > TILT_DEADBAND ||
        Math.abs(tiltY - lastTiltY) > TILT_DEADBAND
      ) {
        world.style.transform =
          `rotateX(${Math.round(tiltX)}deg) rotateY(${Math.round(tiltY)}deg)`
        lastTiltX = tiltX
        lastTiltY = tiltY
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    start()
    scene.addEventListener("mousemove", onMove, { passive: true })
    scene.addEventListener("mouseleave", onLeave)
    scene.addEventListener("click", onClick)
    scene.addEventListener("pointermove", onPointerMove, { passive: true })
    scene.addEventListener("pointerdown", onPointerDown)
    scene.addEventListener("pointerleave", onPointerLeave)
    document.addEventListener("visibilitychange", onVisibility)

    // Reset tilt and pause the rAF physics loop when the scene scrolls out
    // of view — otherwise (1) the last mouse position keeps pulling the
    // world toward a tilted state so flat PNGs end up edge-on, and (2) the
    // 60Hz loop burns CPU for a scene the user can't see.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start()
        } else {
          tiltTargetRef.current.x = 0
          tiltTargetRef.current.y = 0
          stop()
        }
      },
      { threshold: 0 }
    )
    io.observe(scene)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      scene.removeEventListener("mousemove", onMove)
      scene.removeEventListener("mouseleave", onLeave)
      scene.removeEventListener("click", onClick)
      scene.removeEventListener("pointermove", onPointerMove)
      scene.removeEventListener("pointerdown", onPointerDown)
      scene.removeEventListener("pointerleave", onPointerLeave)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [isMobile])

  return (
    <div ref={sceneRef} className={styles.scene}>
      <div ref={worldRef} className={styles.world}>
        {(isMobile ? MOBILE_FLOATING_ITEMS : FLOATING_ITEMS).map((item) => (
          <div
            key={item.id}
            className={styles.element}
            style={{
              width: `${item.width}px`,
              zIndex: Math.round(Z_INDEX_BASE + item.z),
            }}
          >
            <Image
              src={item.src}
              alt=""
              width={item.width}
              height={item.width}
              draggable={false}
              style={{ width: "100%", height: "auto" }}
              {...(item.priority && { priority: true })}
            />
          </div>
        ))}

        <div
          className={styles.element}
          style={{
            width: `${LOGO_WIDTH}px`,
            zIndex: Z_INDEX_BASE,
          }}
        >
          <Image
            src={CENTRAL_LOGO_SRC}
            alt="Tomato Design"
            width={LOGO_WIDTH}
            height={Math.round(LOGO_WIDTH * CENTRAL_LOGO_ASPECT)}
            priority
            draggable={false}
            className={styles.logo}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  )
}
