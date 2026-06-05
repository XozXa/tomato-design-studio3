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
}

const RADIUS = 480
const Y_SPAN = 300

export const FLOATING_ITEMS: FloatingItemConfig[] = [
  { id: "f1", src: "番茄们 浮动元素1.png", width: 285, x: -RADIUS * 0.95, y: -Y_SPAN * 0.7, z: 0, rot: -8 },
  { id: "f2", src: "番茄们 浮动元素2.png", width: 330, x: RADIUS * 0.85, y: -Y_SPAN * 0.55, z: 0, rot: 6 },
  { id: "f3", src: "番茄们 浮动元素3.png", width: 375, x: -RADIUS * 0.55, y: Y_SPAN * 0.85, z: 0, rot: -4 },
  { id: "f4", src: "番茄们 浮动元素4.png", width: 300, x: RADIUS * 0.75, y: Y_SPAN * 0.95, z: 0, rot: 10 },
  { id: "f5", src: "番茄们 浮动元素5.png", width: 270, x: -RADIUS * 1.05, y: Y_SPAN * 0.1, z: 0, rot: 12 },
  { id: "f6", src: "番茄们 浮动元素6.png", width: 345, x: RADIUS * 0.15, y: -Y_SPAN * 1.0, z: 0, rot: -10 },
]

export const CENTRAL_LOGO_SRC = "番茄们 logo3.png"
export const CENTRAL_LOGO_WIDTH = 600
/** rendered logo height = WIDTH × ASPECT */
export const CENTRAL_LOGO_ASPECT = 0.3
