export interface FloatingItemConfig {
  id: string
  src: string
  /** rendered width in px */
  width: number
  /** position relative to scene center, in px */
  x: number
  y: number
  /** positive = closer to camera (bigger + higher z-index) */
  z: number
  /** subtle rest rotation in deg */
  rot: number
  /** preload this image so it lands with the rest of the LCP assets */
  priority?: boolean
}

// Desktop layout (RADIUS=480, Y_SPAN=300, width 270-375) was tuned for a
// 1440-ish viewport. On a 375px mobile viewport those widths would each
// fill nearly the whole screen, so MOBILE_FLOATING_ITEMS scales the same
// (x, y, z, rot, src) at ~0.5× with a tighter RADIUS / Y_SPAN.
const RADIUS = 480
const Y_SPAN = 300
const MOBILE_RADIUS = 180
const MOBILE_Y_SPAN = 120

export const FLOATING_ITEMS: FloatingItemConfig[] = [
  { id: "f1", src: "/hero-f1.png", width: 285, x: -RADIUS * 0.95, y: -Y_SPAN * 0.7, z: 0, rot: -8 },
  { id: "f2", src: "/hero-f2.png", width: 330, x: RADIUS * 0.85, y: -Y_SPAN * 0.55, z: 0, rot: 6 },
  { id: "f3", src: "/hero-f3.png", width: 375, x: -RADIUS * 0.55, y: Y_SPAN * 0.85, z: 0, rot: -4, priority: true },
  { id: "f4", src: "/hero-f4.png", width: 300, x: RADIUS * 0.75, y: Y_SPAN * 0.95, z: 0, rot: 10 },
  { id: "f5", src: "/hero-f5.png", width: 270, x: -RADIUS * 1.05, y: Y_SPAN * 0.1, z: 0, rot: 12 },
  { id: "f6", src: "/hero-f6.png", width: 345, x: RADIUS * 0.15, y: -Y_SPAN * 1.0, z: 0, rot: -10, priority: true },
]

export const MOBILE_FLOATING_ITEMS: FloatingItemConfig[] = [
  { id: "f1", src: "/hero-f1.png", width: 145, x: -MOBILE_RADIUS * 0.95, y: -MOBILE_Y_SPAN * 0.7, z: 0, rot: -8 },
  { id: "f2", src: "/hero-f2.png", width: 165, x: MOBILE_RADIUS * 0.85, y: -MOBILE_Y_SPAN * 0.55, z: 0, rot: 6 },
  { id: "f3", src: "/hero-f3.png", width: 190, x: -MOBILE_RADIUS * 0.55, y: MOBILE_Y_SPAN * 0.85, z: 0, rot: -4, priority: true },
  { id: "f4", src: "/hero-f4.png", width: 150, x: MOBILE_RADIUS * 0.75, y: MOBILE_Y_SPAN * 0.95, z: 0, rot: 10 },
  { id: "f5", src: "/hero-f5.png", width: 140, x: -MOBILE_RADIUS * 1.05, y: MOBILE_Y_SPAN * 0.1, z: 0, rot: 12 },
  { id: "f6", src: "/hero-f6.png", width: 175, x: MOBILE_RADIUS * 0.15, y: -MOBILE_Y_SPAN * 1.0, z: 0, rot: -10, priority: true },
]

export const CENTRAL_LOGO_SRC = "/hero-logo.png"
export const DESKTOP_LOGO_WIDTH = 600
export const MOBILE_LOGO_WIDTH = 240
/** rendered logo height = WIDTH × ASPECT */
export const CENTRAL_LOGO_ASPECT = 0.3
