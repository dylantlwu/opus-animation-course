---
layout: home
hero:
  name: Opus 代码动画导演课
  text: 让 Claude Opus 5.5 写代码，替你画每一帧
  tagline: 面向开发者的保姆级课程 · 科普解说 + 动态图形 + Blender 3D · 技术 / 导演 / 编剧三线并进
  actions:
    - theme: brand
      text: 从第 0 课开始
      link: /m00/
    - theme: alt
      text: 课程地图
      link: /roadmap
    - theme: alt
      text: 社区在讨论什么
      link: /community
features:
  - icon: 🎬
    title: 不是视频模型，是代码
    details: 爆款视频没有一帧是「生成」的。Opus 写 HTML/Canvas/SVG/Remotion/bpy，浏览器或 Blender 逐帧渲染，ffmpeg 合成 MP4。
  - icon: ⏱️
    title: 一个契约：seek(t)
    details: 每一帧都是时间 t 的纯函数。本站每个示例都遵守它——所以你能在网页上逐帧拖动，也能一行命令渲染出片。
  - icon: 🧭
    title: 导演比提示词重要
    details: 社区共识：「提示词占 10%，工作台占 90%」。分镜闸门、静帧审片、导演手册，才是稳定出好片的原因。
  - icon: ✍️
    title: 编剧与逻辑训练
    details: 科普片的难点不是画面，是「先讲什么后讲什么」。概念依赖图、reads、ABT 结构，每课都有刻意练习。
  - icon: 🔊
    title: 中文全流程
    details: 中文 TTS、逐词时间戳、字幕、中文字体工程、B 站/抖音导出规格——中文社区教程普遍缺的部分，这里补齐。
  - icon: 🧊
    title: Blender 3D 线
    details: Claude Code 写 bpy 脚本驱动 Blender 4.5（Intel Mac 最后官方版），EEVEE 出镜头，再与 2D 层合成。
---

## 一眼看懂：本站的示例就是「代码动画」

下面是练习工程里的 Canvas 模板。点 ▶ 播放，或拖动时间轴、逐帧前进——播放器每一帧都只是在调用 `seek(t)`。

<AnimDemo src="/demos/tpl-canvas.html" caption="studio/templates/canvas/index.html —— 你的第一支片子将从复制它开始" :poster="4.5" />
