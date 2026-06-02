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
- 字体：`Space_Grotesk`（正文）+ `Syne`（标题），在 `app/layout.tsx` 中通过 `next/font/google` 加载

## 目录结构

```
app/
  layout.tsx           # 字体、metadata、Analytics
  page.tsx             # 整个作品集（单文件客户端组件，见下文）
  globals.css          # shadcn 变量 + 品牌 CSS（一个文件，两个 :root 块）
components/
  theme-provider.tsx   # next-themes 包装（已定义但未在 layout 中挂载）
  ui/                  # 60+ shadcn 基础组件 + 3 个自定义组件（见下文）
hooks/
  use-mouse-position-ref.ts   # 基于 ref 的鼠标坐标，供 Floating 使用
lib/
  utils.ts             # cn() = clsx + tailwind-merge
public/                # 作品集 PNG（中文文件名）、占位图、抽象背景 JPG
styles/
  globals.css          # 孤立的重复文件——未被导入；除非清理，否则可忽略
ai-website-cloner-template/   # 独立的子项目（截图→代码流水线），与本项目无关
```

## `app/page.tsx` —— 页面本身就是架构

整个站点是一个 `"use client"` 组件，所有 section 内联其中：

- `useEffect` 中挂载了 **锚链接平滑滚动**，以及在 `.project-title` 元素上的 **悬停扭曲动效**（CSS 动画 `distortion` + 类名 `distort-active`）。
- 布局模式：两个 `div.container`（最大宽度 1200px）夹着一个更宽的 `section.portfolio-section`（1600px），让 12 个散落分布的作品集小图可以铺到文字栏之外。
- 大量使用内联 `style={{...}}` 来处理一次性布局（Services、Process、Atelier、Footer）。不要为了风格统一把这些迁到 Tailwind class —— 它们是逐节调过的。

### 作品集小图的位置

12 张散落的小图通过 **`app/globals.css` 里的 `nth-child` 选择器**定位（`.project-wrapper:nth-child(2)` 到 `:nth-child(13)`），**桌面端和移动端（`@media max-width: 768px`）是各自独立的块**。增删小图时，`nth-child` 索引和居中 `<div.portfolio-center>` 带来的 `+1` 偏移是关键 —— 第一个 `.project-wrapper` 是 `:nth-child(2)`，不是 `:nth-child(1)`。

## `components/ui/` 中的自定义组件

以下三个不是 shadcn 组件，是站点专用的：

- **`gooey-marquee.tsx`** —— 标题区大字。利用 `filter: contrast(15)` + `blur(0.03em)` 实现类 SVG 的黏性模糊效果，文字复制两份以实现无缝循环，亮色/暗色各自一层。
- **`parallax-floating.tsx`** —— 导出 `Floating`（Provider）和 `FloatingElement`（子项）。使用 `motion/react` 的 `useAnimationFrame` 和 `useMousePositionRef`，按 `depth * sensitivity` 每帧平移子元素。作品集中 `sensitivity={-0.5}` 让方向反转。
- **`kinetic-shatter-box-section.tsx`** —— 拖动摇晃就会裂开、碎裂的盒子。`page.tsx` 中暂未使用，留作未来扩展。

## 样式上的坑

- **`app/globals.css` 里有两段 `:root`** —— 第一段是 shadcn 的 neutral 调色板（第 6–40 行），第二段（第 129–135 行）用品牌值覆盖（`--primary: #000`、`--accent: #ff3e00`、字体变量）。后写者赢。删之前先确认设计系统。
- 全局规则把 `cursor: crosshair` 设在 `*` 上、把 `overflow-x: hidden` 设在 `body` 上 —— 这是有意为之，不是 bug。
- `.project-title::before/::after` 通过 `attr(data-text)` 在悬停时渲染色差副本（红 + 蓝，带倾斜）。所有带 `project-title` 类的元素都必须有 `data-text` 属性。
- 右侧固定导航（`width: 80px`，vertical-rl 书写方向）的样式写在 `globals.css` 里，但 `page.tsx` 中**没有渲染 `<nav>` 元素** —— 这套样式是预留的 CSS、待后续使用。移动端（`max-width: 768px`）会把它变成顶部水平条。

## `next.config.mjs` —— 故意放得很松

- `typescript.ignoreBuildErrors: true` —— 类型错误不会导致构建失败。要修 TS 问题，但别依赖构建来发现问题；手动跑 `tsc --noEmit`。
- `images.unoptimized: true` —— 所有 `<Image>` 跳过优化。作品集里调用的 `<Image>` 也都显式传了 `unoptimized`。
- `devIndicators: false` —— 不显示 Next.js 的开发浮层。

## 公共资源

作品集 PNG 文件名带中文行业后缀，例如 `Zoonique｜宠物行业.png`（宠物行业）、`aevum｜家具行业png.png`（家具行业）。文件名里的 `｜` 是全角竖线，引用时务必保留。`public/` 里的抽象 JPG 用作背景/装饰。SVG 图标：`/tomato (1).svg`（注意文件名里有空格和括号）。

## 记忆提示（来自过往会话）

- 截图→代码的克隆任务，图片分析优先用 **M3（MiniMax-M3）** —— 它做穷举式枚举，而 Claude 原生视觉偏总结式。详见 `feedback_m3_for_clone_tasks.md`，适用于 `ai-website-cloner-template/` 流水线。
- 用户发来图片要求分析时，直接用 `Read` 工具读取，不要再走外部模型。
