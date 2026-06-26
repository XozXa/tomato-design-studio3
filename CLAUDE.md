# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目说明

Tomato Design Studio —— 一家位于中国成都的独立创意工作室的单页作品集网站。中英双语内容，编辑器风格的版式，动画效果丰富。最初由 v0.app 生成，后经手工修改。

## 常用命令

```bash
npm run dev      # next dev（开发服务器）
npm run build    # next build（生产构建；TS 错误会被忽略，见下方配置说明）
npm run start    # next start（生产服务器）
npm run lint     # eslint .
```

项目未配置测试套件。锁定文件是 `package-lock.json`（npm），而不是 pnpm —— 尽管 v0 导出的产物里残留了一个 `pnpm-lock.yaml`，请使用 npm。

## 技术栈

- **Next.js 16.0.10**（App Router）+ **React 19.2**
- **TypeScript**，路径别名 `@/*` 指向仓库根目录
- **Tailwind CSS 4**（`@tailwindcss/postcss`）—— 配置写在 `app/globals.css` 里通过 `@theme inline` 实现，没有 `tailwind.config.*` 文件
- **shadcn/ui**（new-york 风格，neutral 底色，lucide 图标）—— 配置见 `components.json`
- **motion**（v12）—— Framer Motion 的继任者；以 `motion/react` 路径导入
- **next-themes** 处理暗色模式
- 字体：`Google Sans`（拉丁，self-hosted via `@font-face` in `app/globals.css`，2026-06-04 从 `Oswald` 换过来）+ `Noto Sans SC`（中文，浏览器自动 fallback 渲染 CJK）。Noto Sans SC 的 variable TTF 是 17.7 MB，2026-06-04 给它的 `@font-face` 加了 `unicode-range` 限定为 CJK 区间（U+4E00-9FFF、U+3400-4DBF、U+20000-2A6DF、U+2A700-2B73F、U+2B740-2B81F、U+2B820-2CEAF、U+F900-FAFF、U+2F800-2FA1F），纯拉丁页（作品集图 alt、metadata 等）跳过这个 17.7 MB 下载，浏览器只在遇到汉字时才拉它。

## 目录结构

```
app/
  layout.tsx           # 字体、metadata、Analytics
  page.tsx             # 整个作品集（单文件客户端组件，见下文）
  globals.css          # shadcn 变量 + 品牌 CSS（一个文件，两个 :root 块）
components/
  theme-provider.tsx   # next-themes 包装（已定义但未在 layout 中挂载）
  ui/                  # 60+ shadcn 基础组件 + 2 个自定义组件（见下文）
  hero/                # 首屏 3D 漂浮场景（CSS 3D + JS 物理，见下文）
hooks/                        # shadcn 工具 hook（use-mobile, use-toast）
lib/
  utils.ts             # cn() = clsx + tailwind-merge
public/                # 作品集 PNG（中文文件名）、占位图、抽象背景 JPG
styles/
  globals.css          # 孤立的重复文件——未被导入；除非清理，否则可忽略
ai-website-cloner-template/   # 独立的子项目（截图→代码流水线），与本项目无关
```

## `app/page.tsx` —— 页面本身就是架构

整个站点是一个 `"use client"` 组件，所有 section 内联其中：

- 锚链接的平滑滚动由 `globals.css` 里 `html { scroll-behavior: smooth }` 统一处理，不在 JS 里重复实现。
- 布局模式：两个 `div.container`（最大宽度 1200px）夹着一个更宽的 `section.portfolio-section`（1600px），让 12 个作品集小图可以铺到文字栏之外。
- 字体通过 CSS 变量 `--font-main` / `--font-heading` / `--font-sans` 统一引用，**不**在 `style={{ fontFamily: ... }}` 里硬编码家族名（除了 .project-title / .section-title 等少数样式里需要时）。

### 作品集小图的位置

12 张作品图以**平铺 3 列网格**呈现：`.portfolio-grid { grid-template-columns: repeat(3, 1fr); gap: 8px }`（移动端 `gap: 4px`），每张图 `aspect-ratio: 4/5`，hover 时 `filter: grayscale → 0` + `scale(1.05)`。图片顺序就是 `app/page.tsx` 顶部 `PROJECTS` 数组的顺序，**不再**用 `nth-child` 散布定位。

## `components/ui/` 中的自定义组件

只剩一个：

- **`kinetic-shatter-box-section.tsx`** —— 拖动摇晃就会裂开、碎裂的盒子。`page.tsx` 中暂未使用，留作未来扩展。

> 历史：`gooey-marquee.tsx`（标题区黏性模糊大字，`filter: contrast(15) + blur(0.03em)`）和 `parallax-floating.tsx`（基于 motion/react 的 Parallax 容器）都曾用在首屏，2026-06-03 改用首屏 3D 场景后**已删除**。git 历史里可以找回参考实现。

## 首屏 3D Hero Scene（2026-06-03 新增；2026-06-04 性能 review；2026-06-26 加移动端适配）

首屏从「`GooeyMarquee` 大字标题」改成「中央 LOGO + 6 张番茄图自由漂浮 + 鼠标点击聚拢」的交互式场景。**没用 R3F/three.js**，纯 CSS 3D transforms + JS 物理循环，bundle 几乎零增量。

### 文件组成

| 路径 | 角色 | 行数 |
|---|---|---|
| `components/hero/css-3d-scene.tsx` | 主组件：DOM 渲染 + `requestAnimationFrame` 物理循环 + 鼠标/点击事件 + visibility/RAF 守卫 | ~330 |
| `components/hero/floating-config.ts` | 6 个浮动元素的初始位置、尺寸、旋转配置 + 中央 LOGO 常量 | ~33 |
| `components/hero/hero.module.css` | `.scene`/`.world`/`.element`/`.logo` 样式 | ~75 |
| `app/page.tsx` (L4, L60) | `import { Css3dScene }` + `<section className="hero-3d-section"><Css3dScene /></section>` | — |
| `app/globals.css` (`.hero-3d-section`) | 首屏专用 100vh 容器，**故意放在 `.container` 外**让场景铺满全宽 | — |

### 架构

```
.scene  (100vh × 100vw, perspective: 1500px, overflow: hidden, background: #fff)
  └─ .world  (preserve-3d, JS 每帧改 rotateX/rotateY 跟随鼠标，MAX_TILT_DEG=16)
      ├─ .element × 6  (FLOATING_ITEMS, JS 物理控制 position)
      └─ .element (中央 LOGO, 不进物理循环, 始终居中, breathe 动画在 CSS 里)
```

### 物理循环（6 阶段 + 2 模式状态机）

`useEffect` 里启动一个 `requestAnimationFrame` 循环（tab 隐藏时自动暂停），每帧对 6 个浮动元素跑：

1. **施力**：朝 attractor 的引力（仅 stir 模式有效）+ XY 平面顺时针轨道流（`ORBIT_CW_K`）+ +z 漂移（`Z_FLOW`）+ 3 个频率的正弦基底漂移（`BASE_DRIFT_FREQ_X/Y/Z` + `WOBBLE_FREQ`）+ 随机抖动（`RANDOM_PUSH`）
2. **阻尼 + 限速**：`vel *= DAMPING`；超 `MAX_SPEED` 时按比例缩回
3. **Z 自转弹簧**：`spinZ` 朝正弦目标 `Math.sin(t * ROT_FREQ_Z) * SPIN_AMP_Z` 收敛，碰撞或点击会注入 spin kick 后弹簧衰减
4. **积分位置**：`pos += vel`
5. **软边界**：超出 XY 半视口或 Z 范围时反向推回
6. **碰撞**：浮动↔浮动（全 3D 球碰撞 + Z 平面旋转 kick）、浮动↔LOGO（圆形包围盒 + 角点 fallback）
7. **绘制**：`el.style.transform = 'translate(-50%, -50%) translate3d(...) rotate(...)'`

**两种模式（`Mode = "idle" | "stir"`）**：

| 模式 | 触发 | `pull` 行为 |
|---|---|---|
| `idle` | 默认 | 无中心引力，元素靠轨道流 + 漂移自由循环 |
| `stir` | 鼠标点击 scene | 每个元素获得切向脉冲（vortex around click point，距离衰减），同时向点击点施加 `STIR_PULL * (1 - elapsed/STIR_DURATION_MS)` 的中心引力；`STIR_DURATION_MS` 后回 `idle` |

**关键常数（`css-3d-scene.tsx` 顶部，组件函数内从 `isMobile` state 派生）**：
```ts
// 桌面端（2026-06-08 砍半后 + 2026-06-26 再砍前的值）
// 移动端（≤768px，2026-06-26 砍半）值用 ? 列出
const MAX_TILT_DEG        = isMobile ? 4   : 8   // 鼠标/触屏 tilt 上限
const RANDOM_PUSH         = isMobile ? 0.08: 0.15
const DAMPING             = 0.94
const MAX_SPEED           = isMobile ? 3   : 6
const ORBIT_CW_K          = 0.05
const Z_FLOW              = 0.05
const SWIRL_KICK          = isMobile ? 8   : 14  // click 漩涡初速
const SWIRL_FALLOFF       = 250                   // 距离衰减尺度
const STIR_PULL           = 0.004                 // stir 模式中心引力（线性衰减）
const STIR_DURATION_MS    = 2000                  // stir 持续时间
const TILT_EASE_K         = isMobile ? 0.025: 0.04
const EDGE_PAD            = isMobile ? 60  : 200
const HALF_Z              = isMobile ? 200 : 300
const BASE_DRIFT_AMP_XY   = isMobile ? 0.25: 0.5
const WOBBLE_AMP_XY       = isMobile ? 0.12: 0.25
const INIT_JITTER_XY      = isMobile ? 30  : 70
const INIT_JITTER_Z       = isMobile ? 80  : 150
const LOGO_WIDTH          = isMobile ? 240 : 600
```

`isMobile` 由 `useState(false)` + mount effect 读 `window.matchMedia("(max-width: 768px)").matches` 决定。**WHY 不用模块顶层 const**：模块顶层在 SSR 时 `typeof window === "undefined"` → 永远 false → server 渲染 desktop markup；client hydrate 时 matchMedia 可用 → 移动命中 → 渲染 mobile → hydration mismatch。useState 延迟方案让 SSR + 首次 hydrate 都是 desktop 一致，mount 后 setIsMobile(true) 触发 re-render + 物理 useEffect 重跑（deps `[isMobile]`）。详见下方"2026-06-26 移动端适配"和章节"2026-06-26 改动记录（Hero 3D 移动端适配）"。

### 元素初始位置（`floating-config.ts`）

桌面端 6 个元素配 `{ x, y, z, width, rot, src }`：
- `x/y` 是相对场景中心的 px 偏移；`RADIUS=480, Y_SPAN=300` 让 6 张图散布到视口四角
- `z` 配置里当前**全设为 0**（避免透视投影让远处元素视觉上偏向中央），但**初始化时每个元素会再叠 `±150` px 的随机 z 偏移**（见 `css-3d-scene.tsx` 中 `pos.z = (Math.random() - 0.5) * 2 * INIT_JITTER_Z`），让每次刷新 z 分布不同
- `width` 在 270-375 之间，`rot` 在 ±12° 之间
- 初始时还会叠 `±70` px 的 xy 随机偏移 + `±0.8` 的随机初速度，保证每次刷新形状不同

**移动端**用 `MOBILE_FLOATING_ITEMS`：同 src/rot/x/y/z 比例，`MOBILE_RADIUS=180` / `MOBILE_Y_SPAN=120` 替代桌面 480/300，width 缩到 145-190 区间。中央 LOGO `MOBILE_LOGO_WIDTH=240`（桌面 600）。物理初始化 jitter 也按断点缩（`INIT_JITTER_XY` 70→30, `INIT_JITTER_Z` 150→80）。

中央 LOGO：`CENTRAL_LOGO_SRC = "/hero-logo.png"`，`LOGO_WIDTH = isMobile ? 240 : 600`，`CENTRAL_LOGO_ASPECT = 0.3`（高 = 宽 × 0.3）。

### 已踩过的坑

- ⚠️ **DOM 节点和 state 数组的绑定**：JS 物理循环要直接操作 DOM `el.style.transform` 而不是走 React state（每帧 setState 60 次会卡死）。`useEffect` 里通过 `world.children[i]` 拿到 DOM 节点，绑到 `statesRef.current[i].el`。**注意 children 顺序**：6 个浮动元素在前（children[0..5]），中央 LOGO 是 children[6]，物理循环只跑前 6 个。
- ⚠️ **`translate(-50%, -50%)` 必须同时存在于 CSS 和 JS 输出**：CSS `.element` 的 `transform: translate(-50%, -50%)` 是基础居中，JS 每帧把整个 `transform` 字符串覆盖掉，所以 JS 字符串里也必须前置 `translate(-50%, -50%)` 才能保持图片以自己的中心点定位，否则会出现左上角对齐 → LOGO 跑偏的 bug。
- ⚠️ **LOGO 不能用 `marginLeft/marginTop = -width/2` 居中**：LOGO 图片高宽比不是 1:1（实际渲染高度 ≠ width），用 `margin` 算出来的 top-left 永远对不准。**只能**靠 `top: 50%; left: 50%; transform: translate(-50%, -50%)` 这套 CSS 标准居中。
- ⚠️ **场景必须铺满首屏**：原本 Hero 在 `.container`（max-width 1200px）里，3D 场景被夹在中间两侧留白。现在专门加了 `.hero-3d-section { width: 100%; height: 100vh; }` 在 `.container` **外面**，才铺满。
- ✅ **Z 轴自转只用 rotate（X/Y 不要用）**：图片是平面 PNG，绕 X/Y 旋转会侧面对相机变成一条线。`css-3d-scene.tsx` 里只写 `rotate(Z)`，碰撞的 spin kick 也只往 Z 注入。
- ✅ **资产命名（中文 + 全角空格）OK**：`番茄们 logo3.png` / `番茄们 浮动元素1.png` 等，Next.js 的 `<Image>` + 静态文件 handler 能自动处理，不需要 `encodeURI()`。
- ⚠️ **模块顶层不能用 `window` / `matchMedia` / `Date.now()` / `Math.random()`**：在 SSR 跟 client hydrate 表现不一致，会导致 hydration mismatch。**必须**用 `useState` 初值 + mount effect 延迟读取。client component 也一样要遵循此规则（React 19 server component 不会跑，但 client component 仍然走 SSR → hydrate 流程）。详见 2026-06-26 改动记录。
- ✅ **`touch-action: pan-y` 而非 `none`**：mobile 场景里 `none` 是"全场 sandbox"，会拦截 vertical scroll；用 `pan-y` 让浏览器接管 vertical pan，pointer events 处理其他方向。

### 验证

桌面端：
- `tsc --noEmit` 通过
- 6/7 元素每帧 transform 改变（中央 LOGO 不动）
- 点击 scene 任意位置 → 6 张图获得切向脉冲，沿漩涡方向飞散，`STIR_DURATION_MS` (2s) 内逐步回 `idle`
- 鼠标移动 → 整个 `.world` 跟随倾斜（最大 ±8°），离开 scene 自动回正
- 切到其他 tab → RAF 自动暂停（`visibilitychange` 监听），不耗电

移动端（DevTools iPhone 12 Pro 390×844 模拟 / 真机）：
- `tsc --noEmit` 通过
- Console **无红字 hydration error**（React 不再报 server / client markup 不匹配）
- 6 张浮动图 width 145-190、LOGO 240px，**全部不超出 viewport**
- 单指拖动 scene → `.world` 跟随倾斜（最大 ±4°）
- tap scene → 6 张图聚拢漩涡飞散（stir 模式 2s）
- 上下 swipe scene → **页面流畅滚出 hero**（`touch-action: pan-y` 让 vertical scroll 浏览器接管）
- 旋转屏幕（portrait ↔ landscape）→ ResizeObserver 刷新 rect，元素仍在边界内
- 切到其他 tab → RAF 自动暂停

### 2026-06-04 性能 / 质量 review pass

跑了一次三 agent 并行 review（reuse / quality / efficiency），按发现改了：

- `hero.module.css` 的 `.world` 移除了 `transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)` —— rAF 每帧覆盖 transform，CSS transition 在打架，纯浪费。
- `css-3d-scene.tsx` 的 `mousemove` 从 `window` 挪到 `scene`（之前全页鼠标移动都触发 tilt 计算 + `getBoundingClientRect` layout read）。
- `dims` 缓存完整 rect（`w/h/left/top`），ResizeObserver 刷新；onMove / onClick 读缓存不再每事件强制 layout。
- `paintAll` 加 zIndex dirty check：`State.lastZ` 字段，rounded 值不变就不写 `style.zIndex`，z 稳定时省 6 次/帧的 style invalidation。
- 删 stir→idle 切换时 `attractorRef = {x: 0, y: 0}` 的死代码（idle 模式 `pull=0`，吸引子永不读）。
- 注释清理：删常量上方长 WHAT 注释块，State 字段尾部 `// current Z rotation (deg)` 之类字段注释删掉，6 个 `// ── Phase N: ... ──` ASCII 分隔符压成 `// N: ...`。保留 Z 轴 only（平面 PNG 绕 X/Y 会变线）等关键 WHY 注释。

**故意没动的**（false positive 或不值得）：
- 不换成 `motion/react` 的 `useAnimationFrame` —— 整个 useEffect 重写，收益有限
- 不合并 `mode` / `attractor` / `stirStart` refs —— 风格偏好
- 不统一两段碰撞循环 —— 球-球 vs 球-AABB，强行抽象更乱
- 不优化 `Math.hypot` / 不加 6 元素空间 culling / 不管 `toFixed` 分配 —— 量太小
- 不拆 `page.tsx` 的 server / client component —— 改动面太大

### 2026-06-26 移动端适配

在 ≤768px viewport 上自适应，desktop 配置不变。完整改动见下方"## 2026-06-26 改动记录（Hero 3D 移动端适配）"，这里只列关键决策：

- **数据层**：`floating-config.ts` 新增 `MOBILE_FLOATING_ITEMS`（width 145-190）+ `MOBILE_LOGO_WIDTH=240`，同桌面组共用 src/rot/x/y 比例。
- **物理层**：11 个常量按 `isMobile` 二选一，全部比桌面再砍半（2026-06-08 已砍过一次）。理由：物理参数是绝对像素值，viewport 缩 60% 后同样振幅看起来抖。
- **状态层**：模块顶层 `const isMobile = matchMedia(...)` 改为组件内 `useState(false)` + mount effect；物理 useEffect deps 改 `[isMobile]` —— state 变触发 cleanup + re-seed + restart rAF。**WHY**：模块顶层在 SSR 时 `typeof window === "undefined"` → 永远 false → 跟 client hydrate 命中移动时的 markup 对不上 → React hydration mismatch。
- **事件层**：在 mouse 事件之外**额外绑** `pointermove`/`pointerdown`/`pointerleave`，`setPointerCapture` 让手指拖出 scene 边界仍响应。mouse 事件保留作为桌面端老浏览器 defensive fallback。
- **CSS 层**：`.scene { touch-action: pan-y }`（不是 `none`）—— 保留 vertical scroll 给浏览器，pointer events 处理其他方向 + 触屏 tilt + tap stir。`@media (max-width: 768px)` 块内 `.hero-3d-section` 100vh→85vh，`.scene` perspective 1500px→900px。

**踩到的坑**（详见 2026-06-26 改动记录）：
- ⚠️ **模块顶层 `matchMedia` → hydration mismatch**：必须 useState 延迟。
- ✅ **`touch-action: pan-y` 而非 `none`**：`none` 把 vertical scroll 也吃掉了，用户反馈"上下 swipe 卡"。
- ✅ **不引入 CSS variable 方案**：matchMedia + state 在 React 里更直接，少一层 CSS ↔ JS 反向通信。

## 样式上的坑

- **`app/globals.css` 里有两段 `:root`** —— 第一段是 shadcn 的 neutral 调色板，第二段用品牌值覆盖（`--primary: #000`、`--accent: #ff3e00`、字体变量 `--font-main` / `--font-heading` / `--font-sans`）。后写者赢。删之前先确认设计系统。
- 全局规则把 `cursor: crosshair` 设在 `*` 上、把 `overflow-x: hidden` 设在 `body` 上 —— 这是有意为之，不是 bug。
- `.project-title::before/::after` 通过 `attr(data-text)` 在悬停时渲染色差副本（红 + 蓝，带倾斜）。所有带 `project-title` 类的元素都必须有 `data-text` 属性。
- 右侧固定导航（`width: 80px`，vertical-rl 书写方向）的样式写在 `globals.css` 里，但 `page.tsx` 中**没有渲染 `<nav>` 元素** —— 这套样式是预留的 CSS、待后续使用。移动端（`max-width: 768px`）会把它变成顶部水平条。
- 全局 `*` 规则里的 `cursor: url("/cursors/tomato-pointer.png") 16 2, crosshair` —— 用的是番茄蒂（绿色星芒）剪影，hotspot (16, 2) 设在图中心横坐标 + 顶部偏内 2 px，对准星芒最尖处；`crosshair` 是图片加载失败时的兜底。原图 2062×1855 用 `sips -Z 32` 缩成 32×28 px、2.8 KB。

## `next.config.mjs` —— 故意放得很松

- `typescript.ignoreBuildErrors: true` —— 类型错误不会导致构建失败。要修 TS 问题，但别依赖构建来发现问题；手动跑 `tsc --noEmit`。
- `images.unoptimized: true` —— 所有 `<Image>` 跳过优化。作品集里调用的 `<Image>` 也都显式传了 `unoptimized`。
- `devIndicators: false` —— 不显示 Next.js 的开发浮层。

## 公共资源

作品集 PNG 文件名带中文行业后缀，例如 `Zoonique｜宠物行业.png`（宠物行业）、`aevum｜家具行业png.png`（家具行业）。文件名里的 `｜` 是全角竖线，引用时务必保留。`public/` 里的抽象 JPG 用作背景/装饰。SVG 图标：`/tomato (1).svg`（注意文件名里有空格和括号）。

## 部署（tomatobrand.cn）

当前生产环境：阿里云 ECS（Windows Server）+ IIS 做 TLS 终止 / 反代 + 本机 Next.js 进程做渲染。

### 服务器拓扑

```
公网 <ECS_PUBLIC_IP> (ECS, Windows)
  └─ IIS (port 80 + 443, 5 个绑定)
      └─ ARR/3.0 反向代理 (proxy enabled)
          └─ Next.js 16 进程 [127.0.0.1:3000, pm2 托管]
```

- **公网 IP**：`<ECS_PUBLIC_IP>` —— DNS `tomatobrand.cn` 与 `www.tomatobrand.cn` 都解析到这里
- **VPC 内网 IP**：`172.18.175.85` —— `next start` 启动时 `- Network:` 那行打印的，仅本机通信用
- **5 个 IIS 绑定**：3 HTTP（`:80` 通配 / `*:80:tomatobrand.cn` / `*:80:www.tomatobrand.cn`）+ 2 HTTPS SNI（`:443:tomatobrand.cn` / `:443:www.tomatobrand.cn`）

### 文件路径速查

| 角色 | 路径 | 在仓库里？ |
|---|---|---|
| 代码 | `C:\tomato-site\` | ✅ 仓库根直接对应 |
| 证书 + 密码 | `C:\tomato-site\certs\` | ❌（密码存放方式见部署记录） |
| PM2 启动包装 | `C:\tomato-site\start.js` | ❌（手写） |
| IIS 反代配置 | `C:\inetpub\wwwroot\web.config` | ❌（**不在** `C:\tomato-site\` 下） |
| PM2 dump | `C:\Users\Administrator\.pm2\dump.pm2` | ❌ |

### 一次性部署（已跑过的命令）

> 2026-06-02 跑过初版，6/03 加了 www 绑定。

1. **拉代码 + 装依赖 + 构建**：
   ```powershell
   git clone https://github.com/XozXa/tomato-design-studio3.git C:\tomato-site
   cd C:\tomato-site
   npm install
   npm run build
   ```

2. **PM2 守护**（注意：**必须用 `start.js` 包装**，详见下方"坑"）：
   ```powershell
   npm install -g pm2 pm2-windows-startup
   pm2-startup install
   pm2 start C:\tomato-site\start.js --name "tomato-site"
   pm2 save
   ```

3. **IIS + ARR + URL Rewrite**：
   ```powershell
   Install-WindowsFeature -name Web-Server -IncludeManagementTools
   # 从微软下载中心拉 rewrite_amd64_en-US.msi + requestRouter_amd64.msi，msiexec /i 静默安装
   & "C:\Windows\System32\inetsrv\appcmd.exe" set config -section:system.webServer/proxy /enabled:true /commit:apphost
   iisreset
   ```

4. **IIS 反代规则**（写进 `C:\inetpub\wwwroot\web.config`）：
   ```xml
   <configuration><system.webServer><rewrite><rules>
     <rule name="ReverseProxyToNext" stopProcessing="true">
       <match url="(.*)" />
       <action type="Rewrite" url="http://127.0.0.1:3000/{R:1}" />
     </rule>
   </rules></rewrite></system.webServer></configuration>
   ```

5. **HTTP 绑定**（3 个）：
   ```powershell
   New-WebBinding -Name "Default Web Site" -Protocol http -Port 80 -HostHeader "tomatobrand.cn"
   New-WebBinding -Name "Default Web Site" -Protocol http -Port 80 -HostHeader "www.tomatobrand.cn"
   ```

6. **HTTPS 绑定**（每域名各做一次：导入 PFX → `New-WebBinding -SslFlags 1` → `AddSslCertificate`）：
   ```powershell
   $pwd = Get-Content "C:\tomato-site\certs\pfx-password.txt" -Raw -Encoding UTF8 | ConvertTo-SecureString -AsPlainText -Force
   $cert = Import-PfxCertificate -FilePath "C:\tomato-site\certs\tomatobrand.cn.pfx" -CertStoreLocation "Cert:\LocalMachine\My" -Password $pwd
   $thumb = $cert.Thumbprint
   New-WebBinding -Name "Default Web Site" -Protocol https -Port 443 -HostHeader "tomatobrand.cn" -SslFlags 1
   (Get-WebBinding -Name "Default Web Site" -Protocol https -HostHeader "tomatobrand.cn").AddSslCertificate($thumb, "My")
   ```
   `www.tomatobrand.cn` 同理，文件用 `www.tomatobrand.cn.pfx` + `www-pfx-password.txt`。

### 迭代部署（修改代码后）

```powershell
cd C:\tomato-site
git pull
# 仅当 package.json / 锁文件变了才需要：npm install
npm run build
pm2 restart tomato-site
```

> 目前**没有 CI/CD**，全手动。改完代码要 SSH 上去跑这 4 步。

### 已知状态（截至 2026-06-03）

- Next.js 进程：`pm2 list` → `tomato-site` 状态 `online`，~44 MB
- 证书指纹：
  - apex: `6A3761C34496BDE2A04A98EEAAB18F98922654F3`
  - www:  `145C1588CB12423E0209096835D9041D5B0C5BBA`
- 公网验证：`curl -I https://tomatobrand.cn` → `HTTP/2 200`，`x-powered-by: Next.js`，`etag: ziesrr2kqyeus`，`content-length: 19550`

### 坑 & 待办

- ⚠️ **阿里云安全组**：添 HTTPS 入站时**容易把 443 写成 433**（相邻数字），加完必须肉眼复查
- ⚠️ **PM2 启动器**：`pm2 start npm -- start` 会被解析成"找 start 脚本"报错；`start.bat` 包装会让 Node 把 bat 当 JS 解析报 `SyntaxError`。**只能**用 `start.js` 包一层 `child_process.spawn('npm', ['start'], { shell: true, stdio: 'inherit' })`
- ⚠️ **JKS 废文件**：`C:\tomato-site\certs\` 里还残留第一次下错的 `tomatobrand.cn.jks` + `jks-password.txt` + `25360625_tomatobrand.cn_jks\` 目录，可清理
- 🔜 **HTTP→HTTPS 跳转**未配：访问 `http://tomatobrand.cn` 不会自动跳到 HTTPS
- 🔜 **公网端口 3000 / 8080** 仍对 0.0.0.0/0 开放（3000 是 Next.js 残留，8080 用途不明），**应该收回**
- 🔜 **证书 2026-09-03 到期**：两张 DigiCert DV 免费测试证书，到期前要续期 + 重新导入 + 重新绑定
- 🔜 **可合并证书**：下次续期把单域名证书合并成多域名证书，只维护一张
- 🔜 **CI/CD**：未来加 GitHub Actions 或 webhook 触发 `git pull && npm run build && pm2 restart`

## 2026-06-04 改动记录

**功能 / 内容**
- 字体：英文 `Google Sans` + 中文 `Noto Sans SC`，都 self-hosted via `@font-face`（`public/fonts/`）。详见上方"技术栈"字体行 —— Noto Sans SC 17.7 MB，靠 `unicode-range` 按需加载。
- Footer：`.footer-grid` 加 `column-gap: 80px`，让 CTA 跟右侧两栏拉开间距。
- Cursor：换 `tomato-pointer.png`（32×28 番茄蒂剪影，hotspot 16, 2）。详见上方"样式上的坑"。

**架构 / 重构**
- Hero scene：原 `GooeyMarquee`（黏性模糊大字标题）+ `ParallaxFloating`（motion/react Parallax 容器）删了，换成 `components/hero/css-3d-scene.tsx`（CSS 3D transforms + JS 物理循环 rAF）。中央 LOGO + 6 张番茄图漂浮 + 鼠标点击聚拢（"stir"模式，2s 后回 idle）+ 鼠标移动 → 整 `.world` 倾斜（最大 ±16°）。**纯 CSS 3D + JS，没引 R3F / three.js**。
- 删 3 个 dead 文件：`components/ui/gooey-marquee.tsx`、`components/ui/parallax-floating.tsx`、`hooks/use-mouse-position-ref.ts`。
- 删 R3F 依赖：`three` / `@react-three/fiber` / `@react-three/drei` / `@types/three`（连同 59 个 transitive 包）。`package.json` 现在没有 3D 引擎。
- `app/page.tsx` 清理：去掉手写的 `useEffect` 平滑滚动（`html { scroll-behavior: smooth }` 已经在管了）；清理删掉的 `hero-3d.tsx` 8 行壳子，直接 import `Css3dScene`。
- `globals.css` 清理：去掉过时的 footer 几何背景、`.diagonal-grid` 等 dead class，精简装饰注释。

**性能 / 质量 review pass**
- 详见上方"首屏 3D Hero Scene"下的 "2026-06-04 性能 / 质量 review pass" 小节。7 项 fix 已落地，4 项建议明确不采纳（false positive 或收益不抵成本）。

## 2026-06-05 改动记录

**功能 / 内容**
- 无新功能。把 6/4 改完的 3D hero scene + 字体切换 + cloner 忽略项 commit 进 git（`1964f16`），再跑一轮 3-agent code review 把热路径清掉（`d2ed3fc`）。

**架构 / 重构**
- `1964f16`（19 文件 +1055/-336）：3D Hero Scene + Google Sans / Noto Sans SC self-hosted + `.gitignore` 加 `/ai-website-cloner-template/`（cloner 在自己的 `.git` 里走）。
- `d2ed3fc`（6 文件 +85/-70）：review pass 修复。

**性能 / 质量 review pass（2026-06-05）**
- 三个 agent 并行（reuse / quality / efficiency）。19 项发现，15 真问题，4 false positive。
- 修了：
  - **rAF 热路径**（`css-3d-scene.tsx`）：4 处 `Math.hypot` → `Math.sqrt`（speed cap + 2 段碰撞 + flowR）；速度上限和碰撞先比平方距离再 sqrt；`paintAll` 的 `toFixed(2)` × 24/帧 → `Math.round`。
  - **物理循环**：6 段软边界 if 块抽成 `clampAxis(value, vel, axis, half, k)` helper；5 个 magic number 常量化（`XY_BOUNDARY_K` / `Z_BOUNDARY_K` / `TILT_EASE_K` / `TILT_DEADBAND` / `Z_INDEX_BASE`）；idle 模式 `(attractor - pos) * 0` 整段挪进 `if (attractor)` 分支。
  - **资源**：12 张作品图加 `loading="lazy"` + `sizes="33vw"`；f3（375px）+ f6（345px）两张最大浮动图在 `floating-config.ts` 标 `priority: true` 跟中央 LOGO 一起预加载。
  - **去重**：`XHS_URL` 常量（footer 两处）、`--font-stack` CSS 变量（`globals.css` 3 处）、`Z_INDEX_BASE` 统一 `100` 字面量。
  - **死代码（三个 agent 都没报）**：`app/layout.tsx` 还在用 `next/font/google` 拉 `Space_Grotesk` + `Syne`，但 `globals.css` 早就切到 self-hosted `@font-face` 了，`--font-space-grotesk` / `--font-syne` 没人引用。删掉导入、删 `<html>` 上的 className。
  - **LCP 优化**：layout `<head>` 加 Google Sans `<link rel="preload" as="font" crossOrigin="anonymous">`；Noto SC 17.7 MB 不预加载（`unicode-range` 守门）。
  - **GPU 层**：`.scene` 的 `will-change: transform` 删了（`.scene` 自身不变换，`.world` 在内部动）。
  - 6 段物理循环的 `// 1:` … `// 6:` 阶段标签 + 3 处重复的 `// spin kick — Z axis only (planar images)` 注释删了（顶部那段 Z-axis-only 的 WHY 总览保留）。
- **明确不修的 4 项 false positive**：`useAnimationFrame` 替换（CLAUDE.md "首屏 3D Hero Scene" 已记不换，整个 useEffect 重写收益有限）、`*` cursor 选择器（CLAUDE.md "样式上的坑" 已记是有意的番茄蒂剪影全局 cursor）、两段碰撞循环合并（球-球 vs 球-AABB，强行抽公共函数数学不一致更乱）、物理 state in `useRef`（rAF 60Hz 直接操作 ref 是标准模式）。
- `tsc --noEmit` 通过。

## 2026-06-08 改动记录

**功能 / 内容**
- **项目详情页**：`/projects/[id]` 路由（`app/projects/[id]/page.tsx`）—— 14 个 id（`p1`-`p14`），`generateStaticParams` 从 `data/projects.ts` 派生；命中数据走完整详情页（hero 头图 + 4 列元数据 + 描述中英 + attached 全宽图 + 2 列 gallery），未命中走 "Coming soon" 占位 + 返回首页链接。**不**用 404 —— 后续补数据不用动路由。
- **数据层**：`data/projects.ts` —— `Project` 类型 + `getProjectById(id)`（`Object.fromEntries` 一次性建表）。14 个项目，p2 (aevum) / p4 (somesome✖️超级猩猩) / p7 (CookieJar) 有完整中英描述 + 全套图，其他 11 个是占位。`ProjectMeta` 字段：`service` / `date` / `industry`（**无 `client`** —— 与 `brand` 100% 重复已删）。
- **作品集首页重排**：`p1`-`p14` × 14 张作品图（`/1.png`-`/14.png`），网格 3 列 → **4 列**，gap `8px` → `70px`，卡片 `aspect-ratio: 4/5` → `1/1`，`max-width: 1000px` 居中。Tablet (769-1024px) → 3 列；移动端 (≤768px) → 2 列 + gap `12px`。`sizes="25vw"`（之前 3 列的 `33vw` 不再适用）。
- **导航重做**：固定右侧竖排（`position: fixed; writing-mode: vertical-rl`）→ **sticky 顶部横排**（`position: sticky; top: 0`）。详情页时左侧出现 `router.back()` 返回按钮 + 箭头 icon（`/返回.svg`），首页/About 页是占位。`nav + * { margin-top: 80px }` 给所有相邻兄弟加下边距。
- **About 页双语化**（`app/about/page.tsx`）：`Services` / `Process` / `Team` 三段全部中英双语，中文为主、英文次之（`.bilingual-en` class，12px / opacity 0.5）。`feature-card` 结构不变，仅文案分层。Footer 保持英文不变。**CC / Leo 名字保留不译**。最新文案（CC：艺术硕士 + 7 年 + 插画商业化；Leo：上市公司前团队负责人 + 消费科技 + 理性→感性品牌语言）。
- **跨页面滚到顶**：`components/scroll-to-top.tsx` —— 监听 `usePathname()` 变化，effect 里 `window.scrollTo(0, 0)`。挂在 `app/layout.tsx` body 顶部。详情页的"返回"按钮走 `router.back()` 不受干扰。

**架构 / 重构**
- `app/page.tsx` 瘦身：原来整页内联，现在只保留 Hero (3D scene) + Subtitle + Navbar + Portfolio grid + FooterSection。`handleDistortEnter/Leave` 删了 —— 直接内联到 `FooterSection` 内部。
- 抽出 4 个 section 组件：`components/sections/footer-section.tsx` / `services-section.tsx` / `process-section.tsx` / `team-section.tsx`。Footer 是 `"use client"`（要 onMouseEnter/Leave 内联函数）；3 个 section 文件是 Server Component（纯静态）。
- 抽出 `components/navbar.tsx`（client，`usePathname` 判断详情页）+ `components/fade-in.tsx`（client，IntersectionObserver 滚动淡入）。
- `data/projects.ts` 单独 `data/` 目录，Service 层跟 View 层（`app/page.tsx`）解耦。
- `app/globals.css` 大改：
  - `nav`：`display: grid; grid-template-columns: 36px 1fr 36px`（之前 flex + 两个 spacer 占位），`.nav-links { justify-self: center }`。
  - `.portfolio-grid` 重写（4 列 70px gap 1000px 居中 + 2 段响应式）。
  - `.project-card` 改 `background: #fff`（之前 `#000`，配合灰度→彩色的 hover 过渡）。
  - 新增 `.detail-*` 一整套（详情页 hero / meta / gallery grid / attached spacing）+ `.coming-soon` + `.fade-in` 系列 + `.bilingual-en`。
  - `.detail-images-grid` 移动端 2 列 → 1 列。
  - mobile nav padding 调到 `15px 20px`，`.nav-links gap` 24px，font 11px。

**3D Hero 调整（2026-06-08）**
- 6 个常量砍半：`MAX_TILT_DEG` 16→8、`BASE_DRIFT_AMP_XY` 0.9→0.5、`WOBBLE_AMP_XY` 0.45→0.25、`RANDOM_PUSH` 0.4→0.15、`MAX_SPEED` 11→6、`TILT_EASE_K` 0.08→0.04。**WHY**：上一次视觉太抖动（首次滚过 hero 时的观感）。注释块 "Visual intensity halved 2026-06-08" 记在文件顶部，调参时按这个比例缩放。
- 新增 IntersectionObserver 复位 tilt：scene 离屏时 `tiltTargetRef.current = (0, 0)`，否则鼠标最后位置会让 world 一直偏着、平面 PNG 趋于侧对镜头变成一条线。

**性能 / 质量 review pass（2026-06-08）**
- 三个 agent 并行（reuse / quality / efficiency），覆盖最近所有未提交的改动（首页重排、详情页、About 双语化、Navbar 重做、3D 调参等）。24 项发现，**13 真问题修了**，12 skipped。
- 修了（**重点**）：
  - **rAF 离屏仍在跑**（Efficiency）：3D scene 的 IO 之前只复位 tilt；扩展成 `entry.isIntersecting` 时 `start()`，离屏 `stop()`，物理循环 60Hz 不再烧 CPU。
  - **Hero 头图 FadeIn 包裹 priority 图**（Efficiency）：`<FadeIn variant="hero">` 的 `.fade-in` 初始 `opacity: 0`，priority 图加载完用户还是要等 1.8s IO 触发才看见 —— 拆掉 FadeIn，让 priority 真正生效。
  - **作品图 `<a>` 触发整页 nav**（Efficiency）：14 张卡片 `<a href="/projects/...">` → `<Link>`，避免每次点击 reload + 3D 重 init + 14 张图重 fetch。
  - **`sizes="33vw"` 配 4 列网格**（Efficiency）：→ `25vw`（之前 3 列值）。
  - **3 页 chrome 复制 + 死节点**（Reuse + Quality）：`<div className="grid-overlay">` 移到 `app/layout.tsx`；`<div className="bg-accents">` 是死节点（无 CSS 规则），3 页都删。
  - **`onDistortEnter/Leave` 跨 Server/Client 边界**（Reuse）：提到 `FooterSection` 内部（加了 `"use client"`），about/detail 页也自动获得 hover 效果（之前只有首页传了 props）。
  - **`project.meta.client` 跟 `project.brand` 100% 重复**（Quality）：14 条全删，详情页 title + meta 行都用 `project.brand`。
  - **每 FadeIn 一个 IntersectionObserver**（Efficiency + Quality）：详情页一个 hero+meta+1 attached+7-8 gallery = 10+ observer。改成模块级共享 observer（`Map<Element, () => void>` 回调表），全页一个 IO。
  - **`generateStaticParams` 14 行硬编码**（Reuse）：→ `projects.map(p => ({id: p.id}))` 从数据层派生（之前 `projects` 不导出，加了 `export { projects }`）。
  - **3 个 detail `<Image>` 内联 `style={{width:100%,height:auto}}`**（Reuse）：收编到现有 `.detail-image-full` class（CSS 早就有这个规则，只在 header 上用了）。
  - **Navbar `<a href="#contact">`**（Reuse）：→ `<Link href="/#contact">`，跨页面也能客户端跳。
  - **`.nav-back-spacer` flexbox 占位 hack**（Quality）：→ `display: grid; grid-template-columns: 36px 1fr 36px; .nav-links { justify-self: center }`。spacer div 还在 JSX 里（占 36px 网格单元），CSS rule 删了。
  - **6 个砍半常量没注释**（Quality）：文件顶部加 "Visual intensity halved 2026-06-08" WHY 注释块。
- **明确不修的 12 项（false positive / 收益不抵成本）**：
  - 3 个 section 文件抽公共 `<FeatureSection>` —— 60 行 × 3，每段独立可读，抽象成本 > 收益
  - `TILT_DEADBAND = 0.01` 看似死代码 —— 收敛时仍有作用（unrounded tilt float 在指数衰减尾段跨过 0.01 阈值）
  - `nav + * { margin-top: 80px }` 隐式耦合 —— 3 个消费者全对
  - `<Cn en>` 双语 helper、`cn()` 改写 FadeIn、1fr/1.25fr 比例 —— 风格偏好或被共享 IO 重构 moot 掉
  - `motion/react useInView` 替 FadeIn —— motion 已在 deps 但零 consumer，加进去等于带运行时；共享 observer 更轻
  - `data/projects.ts` `Object.fromEntries` → `Map` —— 无 perf 差
  - `pathname?.startsWith("/projects/")` defensive `?? false` —— 实际不会触发，defensive 风格
  - 详情页"Coming soon"分支运行时是死分支 —— 是 forward-compat（`generateStaticParams` 跟 data 暂时同步，未来加 id 但忘加 data 时不用动路由）
  - `app/page.tsx` 整体 client → 拆 server/client island —— 改动面大，footer distort 还要传 props
  - `.detail-attached-image { margin-bottom: 15px }` 依赖 DOM 顺序 —— 只 1 处用
  - `data/projects.ts` vs `app/page.tsx` `PROJECTS` 数组双源 —— 数据层 + 首页 view-model 故意分开
- `tsc --noEmit` 通过；4 路由（`/`、`/about`、`/projects/p1`、`/projects/p2`）都 HTTP 200。

## 2026-06-09 改动记录

**功能 / 内容**
- About 三个 section 标题从「中文长句 + 英文长句」改成 4 字中文 + 紧凑英文双语：`服务内容 / Services`、`合作流程 / Process`、`核心团队 / Core Team`。下面 `section-intro` 双语段落保留作为展开。
- Navbar Contact 链接修复：`components/navbar.tsx` 把 `<Link href="/#contact">` 换成原生 `<a href="#contact">`。Next.js `Link` 走 `pushState`，`/` 跳到 `/#contact` 时不触发浏览器原生 hash 滚动 —— 在 About 页面会先 pushState 回首页再滚到 footer（同页锚点本应直接滚到本页 footer，因为 About 也包含 `<FooterSection id="contact">`）。改成原生 `<a href="#contact">` 后，浏览器原生 hash 滚动 + `html { scroll-behavior: smooth }` 接管，两页都直接滚到当前页 footer。

**架构 / 重构**
- 详情页入场动画更明显（`app/globals.css` `.fade-in` 系列 + `app/projects/[id]/page.tsx`）：
  - 头图加 `<FadeIn variant="hero">` 包裹（之前是无包裹，让 priority 图 LCP 立即可见；现在用户接受 1.0-1.2s 的 opacity 代价换取"明显"）。
  - 默认 `.fade-in`：Y 16→40px + scale 0.98→1，1.5s→1.0s 用 `cubic-bezier(0.16, 1, 0.3, 1)`（开始快、收尾柔和）。
  - hero 变体：Y 56→60px + scale 1.03→1.04，1.8s→1.2s。
  - 通用规则：`.fade-in--visible` 的 `transform` 加 `scale(1)`，确保默认变体的 scale 也能走 transition 落位。
- 详情页与导航的间距归零（`app/globals.css` `.project-detail`）：`margin-top: 0` 覆盖 `nav + * { margin-top: 80px }` 的全局规则，首页/About 仍吃 80px 呼吸空间，详情页头图直接顶在 nav 下面（hero 沉浸感）。

**部署（首次正式上线新代码）**
- 5 个 commit 通过 `git pull` 落到 ECS `C:\tomato-site`：`1964f16`（3D hero + 字体）/ `d2ed3fc`（3D 热路径 polish）/ `f469737`（详情页 + About 双语 + nav 重做）/ `c12cace`（133 张详情页 PNG，**522 MB**）/ `6340e49`（今天的 polish）。
- 服务器首次清理：`git restore package-lock.json`（丢弃上次 npm install 留下的本地 lock 改动）+ `git pull origin main`。
- `npm install`：up to date in 2s（node_modules 已含 motion）。
- `npm run build`：18/18 静态页生成（`/` `/about` 静态 + `/projects/[id]` SSG 14 个路径）。
- `pm2 restart tomato-site`：online，45.8 MB。
- 验证全链：
  - 本机 `curl.exe -I http://127.0.0.1:3000` → HTTP/1.1 200, `x-nextjs-prerender: 1`
  - 公网 `curl -I https://tomatobrand.cn/projects/p2` → HTTP/2 200, `x-powered-by: Next.js, ARR/3.0`, `x-nextjs-prerender: 1`
- **新踩坑**（已记）：Windows PowerShell 把 `curl` 别名到 `Invoke-WebRequest`，跑 `curl -I http://...` 会报 `Uri:` 缺参。必须用 `curl.exe` 调真正的 curl 二进制（ECS 自带的 Git for Windows / curl-for-Windows 都行）。
- **遗留 3 件后事**（**不**在今天范围）：
  1. `.gitignore` 加 `/certs/`（PFX 证书 + 密码 txt）/ `/start.js` / `/start.bat` —— 防止敏感文件被误 commit。本地（macOS）改完 push，下次部署生效。
  2. `del start.bat`（CLAUDE.md 已知是 Node 解析失败的废包装）。
  3. 证书 2026-09-03 到期续期 + 合并双域名证书。

## 2026-06-09 改动记录（About 重做）

commit `0fdffe0`，6 文件改 / 新增 1 文件。**未**部署到 ECS。

**功能 / 内容**
- **About 页面顶部新增 `AboutIntroSection`**（`components/sections/about-intro-section.tsx`）—— 5 段中文独立段落：Tomato Design 名字起源、协同方式、年轻化策略、设计哲学。`<h2>About</h2>`（继承 `section-title` 风格 = `ABOUT` 大写粗体紧凑字距）。
- **About 页面 section 顺序**：`About → Core Team → Services → Process → Footer`（`app/about/page.tsx`）。原来是 `Services → Process → Team → Footer`。
- **Services 4 张卡片**（`components/sections/services-section.tsx`）—— 改成数据驱动 `SERVICES` const array，4 张卡片从"段落描述"改成 4 行 bullet 列表，标题保留 `品牌设计 / Brand Design` 等双语：
  - 品牌设计：品牌视觉搭建 / 品牌LOGO设计 / VI视觉识别系统 / 动态设计
  - 包装设计：产品包装设计 / 产品外观设计 / 包装建模渲染 / 包装插画设计
  - IP 设计：IP形象设计 / IP服装动作场景延展 / IP建模渲染 / IP应用物料延展
  - 活动视觉：主kv设计 / 插画设计 / 电商设计 / 运营海报
- **Process 3 阶段**（`components/sections/process-section.tsx`）—— 同样数据驱动 `PROCESS` const array，bullet 列表（前期沟通 4 项 / 中期设计 5 项 / 后期交付 5 项）。
- **Team section**（`components/sections/team-section.tsx`）—— 新增 intro 段落："我们是一个年轻的团队，由两位性格迥异但都对生活充满热爱的主理人带领..."。CC / Leo 卡片描述 `<p class="feature-desc">` 删英文翻译，保留中文。卡片标题里的英文小字（Studio Manager / Design Partner）保留。

**架构 / 重构**
- **三个 section 标题简化**：`<h2 class="section-title">中文<span class="bilingual-en">English</span></h2>` → `<h2>English</h2>`。只保留 `Services` / `Process` / `Core Team` 英文。
- **三个 section 的 `section-intro` 双语段落全删**（之前 services / process / team 各有一段中文 + 英文长 intro）。
- **`.section-title` 字体风格对齐 `.footer-cta`**（`app/globals.css`）—— `font-weight: 400 → 800` / `letter-spacing: -1.5px → -2px` / 加 `text-transform: uppercase`。font-size 56px 保留（section title 视觉权重比 footer-cta 大）。最终标题显示成 `CORE TEAM` / `SERVICES` / `PROCESS` 大写粗体紧凑字距。
- **`.section-header` 改 1 列布局**（`grid-template-columns: 2fr 1fr → 1fr` / `gap: 60px → 24px`）—— 标题在上、intro 在下。删 `section-header` 内部的中文 + 英文双语副标题 span 结构。
- **Team section 重新组织成 2×2 网格**（`app/globals.css` `.team-layout`）—— 4 个独立子元素（h2 / intro / CC / Leo）直接挂 `.team-layout` 下，用 `grid-template-areas: "title title" / "intro intro" / "cc leo"` 锁 2 列布局：
  - row 1: 标题跨整行（col 1 + col 2）
  - row 2: intro 段跨整行
  - row 3: CC 在 col 1、Leo 在 col 2（**横排各 50% 宽**）
  - 早期试过 `.team-members` 嵌套 wrapper + 2 列 grid 让 CC / Leo 各 25% 宽（**太挤**）；试过 padding-top: 86px 让 CC 顶部对齐 intro（**改用 grid-template-areas 后不需要 padding**）；试过 `border-top: 1px solid` 加视觉横线（用户嫌"不好看"撤掉）；最终定稿用 `grid-template-areas` + `gap: 80px 80px`。
- **新 `.section-intro p` 段落间距**（`app/globals.css`）—— `.section-intro` 容器内嵌套多个 `<p>` 时 `margin: 0 0 1em 0`，最后一段 `margin-bottom: 0`。给 `AboutIntroSection` 用。
- **新 `.feature-list` 样式**（`app/globals.css`）—— `list-style: none` / `text-align: center` / `font-size: 15px` / `line-height: 2.2`。给 services / process 的 bullet 列表用。
- **mobile override** 同步：`@media (max-width: 768px)` 里 `.team-layout` 改 1 列 + 4 行 `grid-template-areas: "title" "intro" "cc" "leo"`，所有子元素垂直堆叠。

**踩到的坑**
- **JS 字符串含 ASCII 双引号打断**：`AboutIntroSection` 第 2-5 段中文里有 `"爆浆"` / `"年轻基因"` / `"策略"` 三个全角 `""` 词组。第一次用 ASCII 双引号 `""` 包 JS 字符串时把字符串打断（`tsc` 报 `TS1005: ',' expected`）。**解决**：含 ASCII `"` 的字符串换成反引号（模板字符串）包裹。中文字符本身的全角 `""` 跟 ASCII `"` 字符不同，不会打断。
- **用户 `::before` 装饰先加再删**：Services section 起初加 `::before` 红方块（`var(--accent)` = `#ff3e00`，14×14 px 在标题前左上角），用户嫌"不好看"撤掉；之后用户又让换成 `/下载/tomato (2).svg`（番茄 + 蒂 SVG），复制到 `public/tomato-icon.svg`；用户又说"都删掉" —— `.feature-card::before` 整块规则删掉，`public/tomato-icon.svg` 删掉。
- **Team 布局反复调**：用户对"CC / Leo 横排 vs 竖排 / 标题 + intro 上下 vs 左右 / 2×2 网格对齐"等需求多次反复。最终用 `grid-template-areas` 4 子元素独立 grid 锁布局。
- **`shadcn base layer * { @apply border-border }` 残留 1px 边框**：用户在 Team section intro 段下方看到两条紧挨的横线，其实是 shadcn 主题在 `*` 上 `@apply border-border`（`--border: oklch(0.922 0 0)` 浅灰）给所有元素加的 1px 边框。`.team-layout > * { border-top: none !important; border-bottom: none !important; }` 强制覆盖。**WHY 记下**：shadcn base layer `*` 规则会传染到所有元素，自定义 layout 时要主动 override。

**部署**
- `0fdffe0` 已 `git push origin main`，**未**部署到 ECS。要部署按既定流程：`cd C:\tomato-site && git pull && npm run build && pm2 restart tomato-site`。

## 2026-06-26 改动记录（Hero 3D 移动端适配）

2 个 commit，已 push origin main，已部署到 ECS。

**功能 / 内容**
- Hero 3D 场景从桌面单一配置扩成桌面 + 移动两组，在 ≤768px viewport 自动切换。`matchMedia("(max-width: 768px)")` 决定走哪一组：
  - **元素尺寸**：`MOBILE_FLOATING_ITEMS`（width 145-190px 替代 270-375px），`MOBILE_LOGO_WIDTH=240`（替代 600px）。`floating-config.ts` 里 `MOBILE_RADIUS=180` / `MOBILE_Y_SPAN=120` 替代桌面 480/300，构图比例一致。
  - **物理参数全部再砍半**（2026-06-08 已经砍过一次）：`MAX_TILT_DEG` 8→4, `MAX_SPEED` 6→3, `BASE_DRIFT_AMP_XY` 0.5→0.25, `WOBBLE_AMP_XY` 0.25→0.12, `RANDOM_PUSH` 0.15→0.08, `EDGE_PAD` 200→60, `HALF_Z` 300→200, `SWIRL_KICK` 14→8, `TILT_EASE_K` 0.04→0.025。理由：物理参数是绝对像素值，viewport 缩了 60% 后同样振幅看起来抖。
  - 初始化 jitter 缩：xy ±70→±30, z ±150→±80。
  - **视角**：`@media (max-width: 768px)` 块内 `.hero-3d-section` 100vh→85vh，`.scene` perspective 1500px→900px。
- **touch 事件支持**：在原有 mouse 事件（mousemove/leave/click）之外**额外绑** `pointermove`/`pointerdown`/`pointerleave`，`setPointerCapture` 让手指拖出 scene 边界仍响应。mouse 事件保留作为桌面端老浏览器 defensive fallback（CLAUDE.md 反复强调的"故意保留的多份逻辑"风格）。

**架构 / 重构**
- `components/hero/floating-config.ts`：
  - `CENTRAL_LOGO_WIDTH` 重命名为 `DESKTOP_LOGO_WIDTH`（更准确，反映存在 mobile 对应物）。
  - 新增 `MOBILE_FLOATING_ITEMS`（同 src/rot/x/y/z 比例，width 缩 ~0.5×）+ `MOBILE_LOGO_WIDTH = 240`。
- `components/hero/css-3d-scene.tsx`：
  - **模块顶层 `const isMobile = matchMedia(...)` 改为组件函数内 `useState(false)` + mount effect**。WHY：模块顶层在 SSR 时 `typeof window === "undefined"` → 永远 false → server 渲染 desktop markup；client hydrate 时 matchMedia 可用 → 移动命中 → 渲染 mobile markup → 两边 markup 对不上 → React 报 hydration mismatch。**useState 延迟方案**：SSR + 首次 hydrate 都用 desktop 一致 ✓ → mount effect 跑完 `setIsMobile(true)` → 触发 re-render + 物理 useEffect 重跑（deps 改 `[isMobile]`）。
  - 物理 useEffect deps 从 `[]` 改为 `[isMobile]`，isMobile 变 → cleanup（停 rAF / 解绑事件 / disconnect IO+RO）→ re-seed states + restart rAF + 重新绑事件。**WHY 记下**：物理参数从 state 派生时，rAF 闭包捕获的是启动那一刻的 const，state 变必须重启闭包才能读到新值。
  - 提取 `updateTilt(x, y)` + `triggerStir(x, y)` helper，桌面 `onMove` / `onClick` 和移动 `onPointerMove` / `onPointerDown` 都复用同一函数，**不要**写两份实现。
  - `LOGO_HALF_W`/`LOGO_HALF_H` 从模块顶层 const 改为函数内 const（依赖 isMobile state）。`LOGO_WIDTH` 单一派生常量替代之前的 `CENTRAL_LOGO_WIDTH`。
- `components/hero/hero.module.css`：
  - `.scene` 加 `touch-action: pan-y`（最初用 `none`，见下方"踩到的坑"）。注释块记 WHY 和为什么不选 `none` / `manipulation`。
- `app/globals.css`：
  - `@media (max-width: 768px)` 块内追加 `.hero-3d-section { height: 85vh }` 和 `.hero-3d-section .scene { perspective: 900px }`。
- **顺便 commit（pre-existing 修改）**：`app/layout.tsx` 加 `suppressHydrationWarning` 到 `<html>`（针对 Immersive Translate 浏览器扩展注入的 `data-immersive-translate-page-theme` 属性），`CLAUDE.md` 上一节 2026-06-09 About 改动记录。

**踩到的坑**
- **Hydration mismatch（最大坑）**：模块顶层 `const isMobile = matchMedia(...)` → SSR 永远 false → server 渲染 desktop → client hydrate 命中 mobile → 渲染 mobile → React 报 "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties"。console 还附带 Image 警告说 width/height modified（mobile `width:145` vs server `width:285`）。**修复**：useState 延迟判断 + 物理 useEffect deps 改 `[isMobile]`。**WHY 记下**：模块顶层不能用 `window` / `matchMedia` / `Date.now()` / `Math.random()` 这类 SSR/CSR 不一致的 API，client component 也一样要走 state/effect 延迟路径。
- **`touch-action: none` 拦截上下滚动**：移动端最初版用 `touch-action: none` 让 scene 完全接管手势，但用户反馈"上下 swipe 卡"——browser scroll 也被吃掉了，要 swipe 到 hero 边界外才能滚。改为 `pan-y` 后保留 vertical scroll 给浏览器，pointer events 处理其他方向 + 触屏 tilt + tap stir。**WHY 记下**：mobile 场景里 `touch-action: none` 是"全场 sandbox"，要谨慎；`pan-y` / `pan-x` / `manipulation` 给浏览器留出该留的方向。
- **CSS variable 方案未采用**：本来想用 CSS `clamp()` 让元素 width 响应式（避开 matchMedia 切换），但物理循环 11 个常量也得跟着 viewport 缩，纯 CSS variable 还得 JS 端 `getComputedStyle` 读 + `el.style.setProperty`，改完跟现在 matchMedia 方案复杂度一样。**结论**：matchMedia + state 在 React 里更直接，少一层"CSS → JS"反向通信。
- **没做 3-agent perf review pass**：2026-06-04 / 06-05 / 06-08 三次都跑了并行 review。2026-06-26 没跑（用户没要求 + 改动主要是常量值替换、physics 逻辑结构没动）。**记下**：下次再有 3D 场景大改建议重跑 review pass。

**部署**
- 2 commit 顺序：
  - `2f399be` "Adapt hero 3D scene for mobile (≤768px); suppress html hydration warning"
  - `963ac8b` "Fix mobile hero swipe: touch-action pan-y instead of none"（部署后用户反馈"上下 swipe 卡"，诊断后改 touch-action 重新 commit）
- 已 `git push origin main`。
- ECS `C:\tomato-site` 部署步骤（无 `npm install`，因 `package.json` / 锁文件没变）：`git pull` → `npm run build` → `pm2 restart tomato-site` → `curl.exe -I http://127.0.0.1:3000` → `curl.exe -I https://tomatobrand.cn`。
- 移动端验证：DevTools iPhone 12 Pro (390×844) 模拟 / 真机，开 `https://tomatobrand.cn`，确认 ① Console 没红字 hydration error ② 6 张浮动图不超过 viewport ③ 上下 swipe 顺畅出 hero ④ tap → stir 漩涡飞散 ⑤ 横向 swipe → tilt（不常见但能用）。

## 记忆提示（来自过往会话）

- 截图→代码的克隆任务，图片分析优先用 **M3（MiniMax-M3）** —— 它做穷举式枚举，而 Claude 原生视觉偏总结式。详见 `feedback_m3_for_clone_tasks.md`，适用于 `ai-website-cloner-template/` 流水线。
- 用户发来图片要求分析时，直接用 `Read` 工具读取，不要再走外部模型。
