# Opus 代码动画导演课

用 Claude Opus 5.5 **写代码**做科普解说与动态图形视频的中文自学课程：教学网站 + 练习工程。

**在线阅读：https://course.oxygentwo.com**

> 2026 年 9 月 Opus 5.5 发布后，X 上出现大量「Opus 直接做的视频」。它们都不是视频生成模型的产物——Opus 写 HTML / Canvas / SVG / Remotion / bpy 代码画出每一帧，无头浏览器或 Blender 逐帧渲染，ffmpeg 合成 MP4。这门课教你把这件事做稳定：**技术 / 导演 / 编剧三线并进**。

## 内容

- **第一阶段 · 基础**（已完成）：M0 心智模型与环境、M1 时间即函数、M2 拆片与复刻、M3 编剧 I：科普叙事
- **专题 · 视频风格**（已完成）：风格的四层拆解框架、16 张风格卡、`LOOK.md` 写法、参考片逆向、同一镜头 × 4 种风格的同步对照
- **第二阶段 · 导演工作流**（已完成）：M4 视觉语言、M5 导演工作流、M6 声音（配音 / 字幕 / 混音工具）、M7 项目一（附 76 秒示例片及完整导演文档包）
- **第三阶段 · 动态图形与 3D**（已完成）：M8 动态图形 & Remotion、M9 双画幅宣传片、M10 Blender 脚本化 3D、M11 3D × 2D 合成、M12 工业化（分段 / 并行渲染、成本、发布）
- 社区在讨论什么（2026-10 调研）、爆款拆片库、速查表

网站里每个示例都是可以拖动时间轴、逐帧观察的「活」动画。

## 本地运行

需要 Node 22+ 和 Chrome。

```bash
# 教学网站
cd site && npm install && npm run dev        # http://localhost:5173

# 练习工程（你的动画工作室）——ffmpeg 由 npm 包 ffmpeg-static 提供
cd studio && npm install
node render/render.mjs templates/canvas/index.html --verify
node render/render.mjs templates/canvas/index.html --clip --out=out/hello.mp4

# 和 Opus 一起做片子
cd studio && claude --model claude-opus-5-5 --effort xhigh
```

## 部署

网站托管在 Railway（项目 `opus-animation-course`，服务 `course-site`），域名 `course.oxygentwo.com` 经 Cloudflare CNAME 指向 Railway。
仓库根目录的 `Dockerfile` 先用 Node 构建 VitePress，再用 Caddy（`Caddyfile`）托管静态文件。更新网站：

```bash
railway up --service course-site      # 在仓库根目录执行
```

## 目录

- `site/` — VitePress 教学网站；`docs/public/demos/` 里每个示例都遵守 `seek(t)` 契约
- `studio/` — 练习工程
  - `CLAUDE.md` — 给 Opus 读的导演手册（学员逐课补充）
  - `render/render.mjs` — seek(t) 渲染器：`--clip` `--sheet` `--strip` `--still` `--verify` `--blur` `--audio`
  - `render/ffmpeg.mjs` — ffmpeg 入口（ffmpeg-static）
  - `templates/` — canvas / svg / blender 模板，REVIEW / HANDOFF 文档模板
  - `audio/` — `tts.py`（逐句配音 → timeline.json + 字幕）、`mix.py`（避让 + 响度标准化）
  - `examples/` — `gps/`（76 秒示例片）、`blender-overlay/`（3D × 2D 合成）
  - `styles/` — `LOOK.md` 风格模板与范例
  - `exercises/` — 每课作业
  - `work/` — 你的片子

## 契约

```js
window.__meta = { duration, fps, width, height };
window.seek = (t) => { /* 同一个 t 永远画同一帧 */ };
```

网站播放器和渲染器都只认这两个东西。

## 说明

- 课程里的环境实测（如 M0、M10 中的 Intel Mac + Blender 4.5 部分）基于作者自己的机器，你的环境可能不同。
- 示例里的书法 / 手写字体（行楷、翰字笔等）是 macOS 字体，其他系统会回退到楷体。
- 社区案例的播放量等数据是 2026-10-01 的快照；标「未核实」的内容只来自当事人自述或二手转述。

## 许可

- 代码（`studio/render/`、`studio/templates/`、`site/scripts/`、`site/docs/.vitepress/`、`site/docs/public/demos/`）：[MIT](LICENSE)
- 课程文字与教学材料：[CC BY-NC-SA 4.0](LICENSE-CONTENT)——可转载改编，须署名、不得商用、相同协议共享
- 课程中引用和链接的第三方内容版权归原作者所有

## 致谢

课程大量参考了社区的公开分享，包括 [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)、[ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)、[vox-director](https://github.com/Alisa0808/vox-director)、[opus-js-animations](https://github.com/klsoen/opus-js-animations)、[nickcheng 的 30 案例研究](https://github.com/nickcheng/claude-opus-5-5-js-animation-research) 等，具体出处见各页面。
