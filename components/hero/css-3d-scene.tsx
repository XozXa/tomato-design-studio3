"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { CENTRAL_LOGO_ASPECT, CENTRAL_LOGO_SRC, CENTRAL_LOGO_WIDTH, FLOATING_ITEMS } from "./floating-config"
import styles from "./hero.module.css"

const MAX_TILT_DEG = 16

const BASE_DRIFT_FREQ_X = 0.00028
const BASE_DRIFT_FREQ_Y = 0.00032
const BASE_DRIFT_FREQ_Z = 0.00024
const BASE_DRIFT_AMP_XY = 0.9
const BASE_DRIFT_AMP_Z = 0.6
const WOBBLE_FREQ = 0.0055
const WOBBLE_AMP_XY = 0.45
const WOBBLE_AMP_Z = 0.25
const RANDOM_PUSH = 0.4
const DAMPING = 0.94
const MAX_SPEED = 11
const EDGE_PAD = 200
const HALF_Z = 300

const ORBIT_CW_K = 0.05
const Z_FLOW = 0.05

// Z-axis self-rotation only. Rotating around X or Y on flat PNGs flips them
// edge-on to the camera and they disappear.
const ROT_FREQ_Z = 0.00055
const SPIN_AMP_Z = 0.35
const ROT_SPRING_K = 0.025
const COLLISION_SPIN_K = 0.5

// Visual width is the full PNG box, but the tomato silhouette only fills
// ~50-60% of that. A fraction-of-width collision body keeps 6 items from
// constantly bumping.
const RESTITUTION = 0.3
const COLLISION_RADIUS_FACTOR = 0.3
const LOGO_HALF_W = CENTRAL_LOGO_WIDTH / 2
const LOGO_HALF_H = (CENTRAL_LOGO_WIDTH * CENTRAL_LOGO_ASPECT) / 2

const SWIRL_KICK = 14
const SWIRL_FALLOFF = 250
const STIR_PULL = 0.004
const STIR_DURATION_MS = 2000

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

export function Css3dScene() {
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
    const world = worldRef.current
    const scene = sceneRef.current
    if (!world || !scene) return

    // Seed states up front so the reduced-motion branch below can paint.
    statesRef.current = FLOATING_ITEMS.map((item) => {
      const initZ = (Math.random() - 0.5) * 300
      return {
        pos: {
          x: item.x + (Math.random() - 0.5) * 140,
          y: item.y + (Math.random() - 0.5) * 140,
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
        lastZ: Math.round(100 + initZ),
      }
    })

    // Children order: 6 floating items first, then the central LOGO. The
    // physics loop only touches indices 0..N-1.
    const children = Array.from(world.children) as HTMLDivElement[]
    for (let i = 0; i < FLOATING_ITEMS.length; i++) {
      statesRef.current[i].el = children[i] ?? null
    }

    const paintAll = () => {
      for (const s of statesRef.current) {
        if (!s.el) continue
        s.el.style.transform =
          `translate(-50%, -50%) translate3d(${s.pos.x.toFixed(2)}px, ${s.pos.y.toFixed(2)}px, ${s.pos.z.toFixed(2)}px) rotate(${s.rot.toFixed(2)}deg)`
        // zIndex only needs an integer change — skip the style write when
        // the rounded value hasn't moved, otherwise we invalidate style on
        // 6 elements every frame for a property that rarely changes.
        const z = Math.round(100 + s.pos.z)
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
    // (mousemove, click) can do rect math without forcing layout.
    const dims = { w: scene.clientWidth, h: scene.clientHeight, left: 0, top: 0 }
    const refreshRect = () => {
      const r = scene.getBoundingClientRect()
      dims.w = r.width
      dims.h = r.height
      dims.left = r.left
      dims.top = r.top
    }
    const ro = new ResizeObserver(refreshRect)
    ro.observe(scene)
    refreshRect()

    const onMove = (e: MouseEvent) => {
      const nx = ((e.clientX - dims.left) / dims.w) * 2 - 1
      const ny = ((e.clientY - dims.top) / dims.h) * 2 - 1
      tiltTargetRef.current.x = nx
      tiltTargetRef.current.y = ny
    }
    const onLeave = () => {
      tiltTargetRef.current.x = 0
      tiltTargetRef.current.y = 0
    }

    // Click = "stir the water": tangential impulse around the click point
    // (falls off with distance) + Z spin kick. Z-axis only — see top of file.
    const onClick = (e: MouseEvent) => {
      const clickPos = {
        x: e.clientX - dims.left - dims.w / 2,
        y: e.clientY - dims.top - dims.h / 2,
      }

      for (const s of statesRef.current) {
        const dx = s.pos.x - clickPos.x
        const dy = s.pos.y - clickPos.y
        const distXY = Math.hypot(dx, dy) + 0.001
        const tx = -dy / distXY
        const ty = dx / distXY
        const kick = SWIRL_KICK / (1 + distXY / SWIRL_FALLOFF)
        s.vel.x += tx * kick
        s.vel.y += ty * kick
        s.vel.z += (Math.random() - 0.5) * kick * 0.3
        // stir spin kick — Z axis only (planar images)
        s.spinZ += (Math.random() - 0.5) * 3
      }

      attractorRef.current = clickPos
      stirStartRef.current = performance.now()
      modeRef.current = "stir"
    }

    const tick = () => {
      const states = statesRef.current
      const attractor = attractorRef.current
      const halfW = dims.w / 2 - EDGE_PAD
      const halfH = dims.h / 2 - EDGE_PAD
      const t = performance.now()

      let pull = 0
      if (modeRef.current === "stir") {
        const elapsed = t - stirStartRef.current
        const t01 = Math.min(elapsed / STIR_DURATION_MS, 1)
        pull = STIR_PULL * (1 - t01)
        if (elapsed >= STIR_DURATION_MS) {
          modeRef.current = "idle"
        }
      }

      // 1: forces → velocity, then spring-update Z self-rotation
      for (const s of states) {
        s.vel.x += (attractor.x - s.pos.x) * pull
        s.vel.y += (attractor.y - s.pos.y) * pull
        // CSS y points down, so CW tangent at (px,py) is (-py, px).
        const flowR = Math.hypot(s.pos.x, s.pos.y) + 0.001
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

        const sp = Math.hypot(s.vel.x, s.vel.y, s.vel.z)
        if (sp > MAX_SPEED) {
          const r = MAX_SPEED / sp
          s.vel.x *= r
          s.vel.y *= r
          s.vel.z *= r
        }

        // SpinZ damps toward a slow sinusoidal target — collision/stir
        // kicks briefly speed it up, then it eases back to baseline.
        const targetSpinZ = Math.sin(t * ROT_FREQ_Z + s.rotPhaseZ) * SPIN_AMP_Z
        s.spinZ += (targetSpinZ - s.spinZ) * ROT_SPRING_K
        s.rot += s.spinZ

        // 2: integrate position
        s.pos.x += s.vel.x
        s.pos.y += s.vel.y
        s.pos.z += s.vel.z

        // 3: soft boundary (XY edges + Z range)
        if (s.pos.x > halfW) { s.vel.x -= (s.pos.x - halfW) * 0.06; s.pos.x = halfW }
        if (s.pos.x < -halfW) { s.vel.x -= (s.pos.x + halfW) * 0.06; s.pos.x = -halfW }
        if (s.pos.y > halfH) { s.vel.y -= (s.pos.y - halfH) * 0.06; s.pos.y = halfH }
        if (s.pos.y < -halfH) { s.vel.y -= (s.pos.y + halfH) * 0.06; s.pos.y = -halfH }
        if (s.pos.z > HALF_Z) { s.vel.z -= (s.pos.z - HALF_Z) * 0.15; s.pos.z = HALF_Z }
        if (s.pos.z < -HALF_Z) { s.vel.z -= (s.pos.z + HALF_Z) * 0.15; s.pos.z = -HALF_Z }
      }

      // 4: floating ↔ floating (full 3D sphere + Z spin kick)
      for (let i = 0; i < states.length; i++) {
        for (let j = i + 1; j < states.length; j++) {
          const bodyA = states[i]
          const bodyB = states[j]
          const dx = bodyB.pos.x - bodyA.pos.x
          const dy = bodyB.pos.y - bodyA.pos.y
          const dz = bodyB.pos.z - bodyA.pos.z
          const dist = Math.hypot(dx, dy, dz) + 0.001
          const minDist = bodyA.radius + bodyB.radius
          if (dist < minDist) {
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
              // spin kick — Z axis only (planar images)
              const spinKick = Math.abs(impulse) * COLLISION_SPIN_K
              bodyA.spinZ += (Math.random() - 0.5) * spinKick
              bodyB.spinZ += (Math.random() - 0.5) * spinKick
            }
          }
        }
      }

      // 5: floating ↔ LOGO (XY plane, with Z spin kick)
      for (const s of states) {
        const cx = Math.max(-LOGO_HALF_W, Math.min(LOGO_HALF_W, s.pos.x))
        const cy = Math.max(-LOGO_HALF_H, Math.min(LOGO_HALF_H, s.pos.y))
        const dx = s.pos.x - cx
        const dy = s.pos.y - cy
        const dist = Math.hypot(dx, dy)

        if (dist < s.radius) {
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
            // spin kick — Z axis only (planar images)
            const spinKick = Math.abs(vDotN) * COLLISION_SPIN_K
            s.spinZ += (Math.random() - 0.5) * spinKick
          }
        }
      }

      // 6: paint
      paintAll()

      const tt = tiltTargetRef.current
      const ct = tiltRef.current
      ct.x += (tt.x - ct.x) * 0.08
      ct.y += (tt.y - ct.y) * 0.08
      const tiltX = -ct.y * MAX_TILT_DEG
      const tiltY = ct.x * MAX_TILT_DEG
      if (
        Math.abs(tiltX - lastTiltX) > 0.01 ||
        Math.abs(tiltY - lastTiltY) > 0.01
      ) {
        world.style.transform =
          `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`
        lastTiltX = tiltX
        lastTiltY = tiltY
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    let lastTiltX = 0
    let lastTiltY = 0

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
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      stop()
      ro.disconnect()
      scene.removeEventListener("mousemove", onMove)
      scene.removeEventListener("mouseleave", onLeave)
      scene.removeEventListener("click", onClick)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div ref={sceneRef} className={styles.scene}>
      <div ref={worldRef} className={styles.world}>
        {FLOATING_ITEMS.map((item) => (
          <div
            key={item.id}
            className={styles.element}
            style={{
              width: `${item.width}px`,
              zIndex: Math.round(100 + item.z),
            }}
          >
            <Image
              src={item.src}
              alt=""
              width={item.width}
              height={item.width}
              unoptimized
              priority={false}
              draggable={false}
            />
          </div>
        ))}

        <div
          className={styles.element}
          style={{
            width: `${CENTRAL_LOGO_WIDTH}px`,
            zIndex: 100,
          }}
        >
          <Image
            src={CENTRAL_LOGO_SRC}
            alt="Tomato Design"
            width={CENTRAL_LOGO_WIDTH}
            height={Math.round(CENTRAL_LOGO_WIDTH * CENTRAL_LOGO_ASPECT)}
            unoptimized
            priority
            draggable={false}
            className={styles.logo}
          />
        </div>
      </div>
    </div>
  )
}
