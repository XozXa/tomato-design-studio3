# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目说明

Tomato Design Studio —— 一家位于中国成都的独立创意工作室的单页作品集网站。中英双语内容，编辑器风格的版式，动画效果丰富。最初由 v0.app 生成，后经手工修改。

> **历史变更**（功能 / 重构 / 部署 / 踩坑）全部在 git log + commit message 里；本文件只保留"现在是什么"+"为什么是这样"。

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
- **motion**（v12）—— Framer Motion 的继任者；以 `motion/react` 路径导入（实际零 consumer，依赖历史遗留）
- **next-themes** 处理暗色模式
- 字体：`Google Sans`（拉丁，self-hosted via `@font-face` in `app/globals.css`）+ `Noto Sans SC`（中文 17.7 MB，**`unicode-range` 限定为 CJK 区间**让浏览器只在遇到汉字时才拉它）

## 目录结构

```
app/
  layout.tsx           # 字体、metadata、百度统计 Script + RouteChangeTracker
  page.tsx             # 整个作品集（单文件客户端组件）
  globals.css          # shadcn 变量 + 品牌 CSS（一个文件，两个 :root 块）
  projects/[id]/       # 14 个项目详情页 SSG
  about/               # About 页面（About → Core Team → Services → Process → Footer）
components/
  theme-provider.tsx   # next-themes 包装（已定义但未在 layout 中挂载）
  ui/                  # 60+ shadcn 基础组件 + kinetic-shatter-box-section（未用）
  hero/                # 首屏 3D 漂浮场景（CSS 3D + JS 物理，详见下方）
  navbar.tsx           # 顶部 sticky 导航，client 组件（usePathname 判详情页）
  scroll-to-top.tsx    # 跨页面滚到顶（client 组件，监听 usePathname）
  fade-in.tsx          # 共享 IntersectionObserver 的入场动画
  route-change-tracker.tsx  # SPA 路由变化推 _trackPageview
  case-page-tracker.tsx     # 案例页 enter/leave + 停留秒数埋点
  sections/            # footer / services / process / team / about-intro / service-view-tracker
hooks/                        # shadcn 工具 hook（use-mobile, use-toast）
lib/
  utils.ts             # cn() = clsx + tailwind-merge
  analytics.ts         # 百度统计统一埋点入口（trackEvent / trackPageview）
public/                # 作品集 PNG（中文文件名）、占位图、抽象背景 JPG
styles/
  globals.css          # 孤立的重复文件——未被导入；可忽略
data/
  projects.ts          # 14 个项目元数据 + getProjectById(id)
ai-website-cloner-template/   # 独立的子项目（截图→代码流水线），与本项目无关
```

## `app/page.tsx` —— 页面本身就是架构

整个站点是一个 `"use client"` 组件，所有 section 内联其中：

- 锚链接的平滑滚动由 `globals.css` 里 `html { scroll-behavior: smooth }` 统一处理，不在 JS 里重复实现。
- 布局模式：两个 `div.container`（最大宽度 1200px）夹着一个更宽的 `section.portfolio-section`（1600px），让 14 张作品集小图可以铺到文字栏之外。
- 字体通过 CSS 变量 `--font-main` / `--font-heading` / `--font-sans` 统一引用，**不**在 `style={{ fontFamily: ... }}` 里硬编码家族名。

### 作品集小图的位置

14 张作品图以**平铺 4 列网格**呈现：`.portfolio-grid { grid-template-columns: repeat(4, 1fr); gap: 70px; max-width: 1000px }`，每张图 `aspect-ratio: 1/1`。Tablet (769-1024px) → 3 列；移动端 (≤768px) → 2 列 + gap `12px`。**默认展示原色**（2026-06-29 移除 `.project-image` 的 `filter: grayscale(100%)`），hover 时 `scale(1.05)` + `opacity: 0.9→1`。图片顺序就是 `app/page.tsx` 顶部 `PROJECTS` 数组的顺序。每个 `<Link>` 带 `onClick={() => trackEvent("Portfolio", "click", p.id)}` 埋点。

## 首屏 3D Hero Scene

首屏从「`GooeyMarquee` 大字标题」改成「中央 LOGO + 6 张番茄图自由漂浮 + 鼠标点击聚拢」的交互式场景。**没用 R3F/three.js**，纯 CSS 3D transforms + JS 物理循环，bundle 几乎零增量。

### 文件组成

| 路径 | 角色 |
|---|---|
| `components/hero/css-3d-scene.tsx` | DOM 渲染 + `requestAnimationFrame` 物理循环 + 鼠标 / 触屏事件 + visibility/RAF 守卫 |
| `components/hero/floating-config.ts` | 6 个浮动元素的初始位置、尺寸、旋转配置 + 中央 LOGO 常量（桌面 + 移动两组） |
| `components/hero/hero.module.css` | `.scene`/`.world`/`.element`/`.logo` 样式 |
| `app/page.tsx` | `import { Css3dScene }` + `<section className="hero-3d-section"><Css3dScene /></section>` |
| `app/globals.css` | `.hero-3d-section` 100vh 容器，**故意放在 `.container` 外**让场景铺满全宽 |

### 架构

```
.scene  (100vh × 100vw, perspective: 1500px [mobile 900px], overflow: hidden, background: #fff)
  └─ .world  (preserve-3d, JS 每帧改 rotateX/rotateY 跟随鼠标, MAX_TILT_DEG=8 [mobile 4])
      ├─ .element × 6  (FLOATING_ITEMS, JS 物理控制 position)
      └─ .element (中央 LOGO, 不进物理循环, 始终居中, breathe 动画在 CSS 里)
```

### 物理循环（6 阶段 + 2 模式状态机）

`useEffect` 里启动一个 `requestAnimationFrame` 循环（tab 隐藏时自动暂停），每帧对 6 个浮动元素跑：施力（轨道流 + 漂移 + 抖动）→ 阻尼 + 限速 → Z 自转弹簧 → 积分位置 → 软边界 → 碰撞（球-球 / 球-AABB）→ 绘制。**IO 离屏时停 rAF**，不在视野内不烧 CPU。

**两种模式**：`idle`（默认，元素自由漂浮） / `stir`（点击 scene → 切向脉冲 + 中心引力，2s 后回 idle）。

### 关键常数（`css-3d-scene.tsx` 顶部，组件函数内从 `isMobile` state 派生）

```ts
// 桌面端（2026-06-08 砍半后 + 2026-06-26 再砍前的值）
// 移动端（≤768px，2026-06-26 砍半）值用 ? 列出
const MAX_TILT_DEG        = isMobile ? 4   : 8   // 鼠标/触屏 tilt 上限
const MAX_SPEED           = isMobile ? 3   : 6
const SWIRL_KICK          = isMobile ? 8   : 14  // click 漩涡初速
const STIR_DURATION_MS    = 2000                  // stir 持续时间
const LOGO_WIDTH          = isMobile ? 240 : 600
// ... 其余 9 个常量
```

**WHY 砍过两次**：2026-06-08 砍半（视觉太抖），2026-06-26 移动端再砍半（viewport 缩 60% 后同样振幅看起来抖）。调参时按这个比例缩放。

### 已踩过的坑

- ⚠️ **DOM 节点和 state 数组的绑定**：JS 物理循环要直接操作 DOM `el.style.transform` 而不是走 React state（每帧 setState 60 次会卡死）。`useEffect` 里通过 `world.children[i]` 拿到 DOM 节点，绑到 `statesRef.current[i].el`。**注意 children 顺序**：6 个浮动元素在前（children[0..5]），中央 LOGO 是 children[6]，物理循环只跑前 6 个。
- ⚠️ **`translate(-50%, -50%)` 必须同时存在于 CSS 和 JS 输出**：JS 每帧把整个 `transform` 字符串覆盖掉，所以 JS 字符串里也必须前置 `translate(-50%, -50%)` 才能保持图片以自己的中心点定位，否则会出现左上角对齐 → LOGO 跑偏的 bug。
- ⚠️ **模块顶层不能用 `window` / `matchMedia` / `Date.now()` / `Math.random()`**：在 SSR 跟 client hydrate 表现不一致，会导致 hydration mismatch。**必须**用 `useState` 初值 + mount effect 延迟读取，物理 useEffect deps 改 `[isMobile]` —— state 变触发 cleanup + re-seed + restart rAF 才能读到新值。
- ✅ **`touch-action: pan-y` 而非 `none`**：mobile 场景里 `none` 是"全场 sandbox"，会拦截 vertical scroll；用 `pan-y` 让浏览器接管 vertical pan，pointer events 处理其他方向。
- ✅ **Z 轴自转只用 rotate（X/Y 不要用）**：图片是平面 PNG，绕 X/Y 旋转会侧面对相机变成一条线。
- ✅ **资产命名（中文 + 全角空格）OK**：`番茄们 logo3.png` / `番茄们 浮动元素1.png` 等，Next.js 的 `<Image>` + 静态文件 handler 能自动处理。

## Analytics 埋点

国内访客场景下 `@vercel/analytics` 的脚本域名（`v.qi.n.s-data.vpcdn.net`）被 GFW 墙掉，等于**完全没有数据**。换 **Baidu Tongji（百度统计）** —— `hm.baidu.com` 在国内可达、免费、事件 API (`_trackEvent`) 够用、自带转化漏斗工具。

### 文件组成

- `lib/analytics.ts` —— 统一入口 `trackEvent(category, action, label?, value?)` + `trackPageview(path)`，自动追加设备分段（`mobile` / `desktop` @ `≤768px`，单次 `matchMedia` 读），env 没值整段 no-op
- `components/route-change-tracker.tsx` —— `usePathname` 变化推 `_trackPageview`，挂在 `app/layout.tsx`
- `components/case-page-tracker.tsx` —— 案例页 `pagehide` / `visibilitychange→hidden` 推 enter + leave（value=停留秒数）
- `components/sections/service-view-tracker.tsx` —— IO（threshold 0.4）监听 `.feature-card` 首次曝光推 `Service/view/{name}`，unobserve 去重
- `app/layout.tsx` —— `<Script id="baidu-tongji" strategy="afterInteractive" src="https://hm.baidu.com/hm.js?{ID}" />`

### 事件分类

| Category | Action | Label | value | 触发位置 |
|---|---|---|---|---|
| `Portfolio` | `click` | `p1` … `p14` | — | `app/page.tsx` 14 个 `<Link>` onClick |
| `Contact` | `copy` | `email` / `wechat` | — | `footer-section.tsx` `handleCopy(text, key)` 内 |
| `Contact` | `click` | `xhs` | — | footer 2 个 RED `<a>` onClick（保留默认 `target="_blank"`） |
| `Nav` | `contact_click` | — | — | `navbar.tsx` Contact `<a>` onClick（hash 滚动仍由浏览器原生接管） |
| `CasePage` | `enter` | projectId | — | `case-page-tracker` mount effect |
| `CasePage` | `leave` | projectId | 停留秒数 | `pagehide` / `visibilitychange→hidden`（`< 1s` 不发，避免 bounce） |
| `Service` | `view` | `Brand Design` / `Packaging Design` / `IP Design` / `Event Visuals` | — | `service-view-tracker` IO 首次曝光后 `unobserve` |

所有事件 label 末尾追加 `|mobile` / `|desktop`。Baidu 后台「访客分析」已经按设备分桶，事件 label 再加一层让「事件分析」也能按设备筛选。

### 漏斗配置（用户侧操作）

百度统计后台 → 「转化」→ 「转化漏斗」按这 3 步建漏斗（Baidu 按 session 自动串起来）：
1. `Service/view`（任一 service 卡片曝光）
2. `Portfolio/click`（任一作品卡点击）
3. `Contact/copy` 或 `Contact/click`（任一联系转化）

### 环境变量

| 变量 | 用途 | 必需？ |
|---|---|---|
| `NEXT_PUBLIC_BAIDU_TONGJI_ID` | 百度统计跟踪 ID（`hm.js?` 后那串 hash） | 否（不设 = 脚本不加载，事件走 no-op） |

`.env.local` 已被 `.gitignore` 的 `.env*` 覆盖。**改完 env 后必须重启 dev server**（`NEXT_PUBLIC_*` 是构建时常量，HMR 不会重读）。

### 已踩过的坑

- ✅ **`pagehide` + `visibilitychange` 而非 `beforeunload`**：前者对移动端 Safari 切后台 / 锁屏更稳。Baidu 自家脚本在页面卸载时内部 flush `_hmt` 队列，普通 push 可走通。
- ✅ **不接 `navigator.sendBeacon` 直接打 Baidu**：Baidu 没公开 beacon endpoint。
- ✅ **不抽 service-view 的 IO 跟 `fade-in.tsx` 共享**：两个 unobserve 时机语义不同（fade-in 是入场动画、service-view 是首次曝光且去重），强行抽象更乱。

## 样式上的坑

- **`app/globals.css` 里有两段 `:root`** —— 第一段是 shadcn 的 neutral 调色板，第二段用品牌值覆盖（`--primary: #000`、`--accent: #ff3e00`、字体变量）。后写者赢。删之前先确认设计系统。
- **shadcn base layer `* { @apply border-border }` 会传染**：所有元素都被加 1px 浅灰边框，自定义 layout 时要主动 override（`.team-layout > * { border-top: none !important; ... }`）。
- 全局规则把 `cursor: crosshair` 设在 `*` 上、把 `overflow-x: hidden` 设在 `body` 上 —— 这是有意为之（番茄蒂剪影全局 cursor），不是 bug。
- `.project-title::before/::after` 通过 `attr(data-text)` 在悬停时渲染色差副本（红 + 蓝，带倾斜）。**所有带 `project-title` 类的元素都必须有 `data-text` 属性**。
- **历史 dead CSS**：右侧固定导航（`width: 80px`，vertical-rl 书写方向）的样式仍在 `globals.css` 里，但 2026-06-08 nav 重做后**实际是 sticky 顶部横排**（`components/navbar.tsx`），这套右侧竖排样式是死代码、待清理。
- **Footer 邮箱/微信可点击复制**（`components/sections/footer-section.tsx`）：value `<li>` 用 `<button class="copy-btn">` 重置 button 默认样式，`onClick` → `navigator.clipboard.writeText` → 1.5s 全局浮窗 toast「复制成功」。fallback：clipboard API 在 LAN http / 旧浏览器失败时走隐藏 `<textarea>` + `execCommand("copy")`。
- **浮窗 toast 不许动**（`.copy-float-toast`）：`position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%)`，`@keyframes copyFloatToastIn` **只剩 `opacity: 0 → 1`**（translate 那段上滑 12px 用户嫌丑删了）。`pointer-events: none` 防止 toast 挡按钮。`z-index: 9999` 不会被 nav / 3D 场景盖住。
- **改 DOM 丢 wrapper class 时记得 promote 样式**：原 `<div class="social-list text-right"><ul>...` 结构，wrapper div 上的 `text-right` 让 li 内部右对齐。改 DOM 时去掉 wrapper 但没补 `text-align: right`，**会导致桌面端 value 列从右对齐变成左对齐**（回归）。CSS "不会自然继承"。
- **`.social-list` 里的 label 不要用 `<a href="#">`**：`html { scroll-behavior: smooth }` 让所有 `href="#"` 点击都平滑滚到顶部。`components/sections/footer-section.tsx:67-89` 里 EMAIL / WECHAT / LOCATION 三个 label 是分类展示不是真链接，所以用 `<span>`。配套 CSS 选择器扩展为 `.social-list a, .social-list span`（`globals.css:489-495`）保持视觉一致。
- **`.project-title` 在 footer 里要 override**：`globals.css:391-402` 的全局 `.project-title` 是为作品集卡片设计的（48px / 800 weight / display: block）。RED 那个 a 标签（`footer-section.tsx:74-85`）挂了它是为了继承 hover 时的红蓝色差副本（`globals.css:410-422` 的 `::before/::after`），但在 footer 里字号/字重/display 会被全局规则污染。修复：`globals.css:501-507` 加 `.social-list .project-title { font-size: 14px; font-weight: 500; display: inline; word-break: normal; overflow-wrap: normal; }`（同优先级 0,2,0 写在 `.social-list a, .social-list span` **之后**才能胜出）。**How to apply：** 任何在 `.social-list` 里挂 `.project-title` 的元素都依赖这条 override；不要去 className，否则丢 hover 色差副本。
- **Footer 底部版权行**（`components/sections/footer-section.tsx:128`）：`<div className="copyright">© 2025 TOMATO DESIGN</div>`，样式在 `globals.css:505-510`（margin-top 80px 跟 grid 隔开，居中，12px，letter-spacing 2px，`var(--muted-foreground)` 灰）。

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

### 迭代部署（修改代码后）

```powershell
cd C:\tomato-site
git pull
# 仅当 package.json / 锁文件变了才需要：npm install
npm run build
pm2 restart tomato-site
```

> 目前**没有 CI/CD**，全手动。改完代码要 SSH 上去跑这 4 步。

> Windows PowerShell 把 `curl` 别名到 `Invoke-WebRequest`，跑 `curl -I http://...` 会报 `Uri:` 缺参。必须用 `curl.exe` 调真正的 curl 二进制。

### 坑 & 待办

- ⚠️ **阿里云安全组**：添 HTTPS 入站时**容易把 443 写成 433**（相邻数字），加完必须肉眼复查
- ⚠️ **PM2 启动器**：`pm2 start npm -- start` 会被解析成"找 start 脚本"报错；`start.bat` 包装会让 Node 把 bat 当 JS 解析报 `SyntaxError`。**只能**用 `start.js` 包一层 `child_process.spawn('npm', ['start'], { shell: true, stdio: 'inherit' })`
- ⚠️ **JKS 废文件**：`C:\tomato-site\certs\` 里还残留第一次下错的 `tomatobrand.cn.jks` + `jks-password.txt` + `25360625_tomatobrand.cn_jks\` 目录，可清理
- 🔜 **HTTP→HTTPS 跳转**未配：访问 `http://tomatobrand.cn` 不会自动跳到 HTTPS
- 🔜 **公网端口 3000 / 8080** 仍对 0.0.0.0/0 开放（3000 是 Next.js 残留，8080 用途不明），**应该收回**
- 🔜 **证书 2026-09-03 到期**：两张 DigiCert DV 免费测试证书，到期前要续期 + 重新导入 + 重新绑定
- 🔜 **可合并证书**：下次续期把单域名证书合并成多域名证书，只维护一张
- 🔜 **CI/CD**：未来加 GitHub Actions 或 webhook 触发 `git pull && npm run build && pm2 restart`
- 🔜 **`.gitignore` 漏配**：应加 `/certs/`（PFX 证书 + 密码 txt）/ `/start.js` / `/start.bat`

## 记忆提示（来自过往会话）

- 截图→代码的克隆任务，图片分析优先用 **M3（MiniMax-M3）** —— 它做穷举式枚举，而 Claude 原生视觉偏总结式。详见 `feedback_m3_for_clone_tasks.md`，适用于 `ai-website-cloner-template/` 流水线。
- 用户发来图片要求分析时，直接用 `Read` 工具读取，不要再走外部模型。
