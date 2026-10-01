# M12 · 毕业作品与工业化

<div class="lesson-meta"><span class="tech">技术：分章节、分段重渲、并行渲染、导出规格</span><span class="dir">导演：发布前审片、成本意识</span><span>建议 2–3 个周末</span></div>

## 1. 目标

- 完成一支 **2–3 分钟**的毕业作品：多章节、多会话协作
- 让渲染「工业化」：只重渲改过的部分、多进程并行
- 学会估算和控制模型用量
- 按平台规格导出并发布

## 2. 长片的组织

### 2.1 分章节

2–3 分钟的片子放进一个 `index.html` 会变得难以维护，也会让 Opus 的上下文爆掉。拆开：

```
work/<片名>/
├── index.html              只负责：读 timeline.json、按时间分派给章节、画字幕
├── chapters/
│   ├── 01-hook.js          export function draw(t, lt, ctx) { ... }
│   ├── 02-mechanism.js
│   └── 03-payoff.js
├── LOOK.md / STORYBOARD.md / HANDOFF.md
└── audio/timeline.json
```

每章一个会话（或一个 subagent）负责，所有人共用同一份 `LOOK.md`、token 和 `timeline.json`。章节交付时，和第 1 章的静帧**并排比较**（风格专题的防漂移）。

### 2.2 只重渲改过的部分

渲染器支持 `--from` / `--to`，按帧对齐：

```bash
# 只改了第 30–45 秒那一段
node render/render.mjs work/<片名>/index.html --clip --from=30 --to=45 --out=out/parts/fix.mp4
```

然后用 ffmpeg 的 concat 把各段无损拼起来（`-c copy`，不重新编码）。实测：模板分两段渲染后拼接，帧数和整片渲染完全一致（180 = 75 + 105）；画面和整片渲染**不是逐位相同**（编码器在段边界的码率分配不同），但 PSNR 57.8 dB，肉眼无差别。

::: tip 音频最后只混一次
不要每段各自带音频再拼接：AAC 编码在每段开头有一小段「预热」，拼起来段与段之间会有极短的空隙。**视频分段 → 拼接 → 在整片上混一次音频。**
:::

### 2.3 并行渲染

因为每一帧都只由 t 决定（M0 第一课的那句话），整片可以切成 N 段，同时开 N 个无头 Chrome 渲染：

```bash
node exercises/m12/parallel.mjs work/<片名>/index.html --workers=4 --audio=work/<片名>/audio/mix.wav --out=out/final.mp4
```

实测（M7 示例片，76 秒 / 2299 帧，半分辨率，i7-12700）：

| 方式 | 用时 |
|---|---|
| 单进程 | 117 秒 |
| 4 进程并行 | 35.5 秒（**3.3 倍**） |

`parallel.mjs` 里切分区间的函数 `splitRanges()` 是本课留给你写的——见第 6 节。

## 3. 成本：哪些步骤在花钱

社区里单条短片的花费从几毛到几美元不等，长项目可以到几百美元（见[社区在讨论什么](/community#_2-成本和额度)）。差别主要来自**调用模型的次数和方式**：

| 步骤 | 用模型？ | 省钱做法 |
|---|---|---|
| 写脚本、分镜、代码 | ✅ | 用模板起步；`CLAUDE.md` 写清规则，减少来回解释 |
| 改片 | ✅ | 每轮只提 2 条；小改用 `--effort medium` |
| 让模型看图自审 | ✅（图片也算输入） | **一张 contact sheet 代替十张单帧**；审片图用小尺寸（`--w=320`） |
| 渲染、`--verify`、`--sheet`、`--strip` | ❌ 纯本地 | 尽管多跑 |
| 配音（edge-tts）、混音、拼接 | ❌ 纯本地 | — |
| 长会话 | ✅ 上下文越长越贵 | 分章节、分会话，用 HANDOFF.md 交接 |

**effort 档位**：改小问题 `medium`；新片、分镜 `xhigh`；`max` 留给旗舰作品的关键环节。

养成一个习惯：每支片子结束时记一笔——用了几个会话、大概多少轮改片、你在哪一步花的时间最多。三支片子之后，你就有了自己的成本模型。

## 4. 导出与发布

### 4.1 推荐导出参数

| 用途 | 尺寸 | 帧率 | 编码 |
|---|---|---|---|
| B 站 / YouTube 横屏 | 1920×1080（或 3840×2160） | 30 或 60 | H.264 High，crf 18，yuv420p，AAC 192k |
| 抖音 / 视频号 / Shorts 竖屏 | 1080×1920 | 30 | 同上 |
| X（Twitter） | 1920×1080 或 1080×1920 | 30 | 同上 |
| 网页内嵌 | 按需 | 30 | 同上 + `-movflags +faststart`（render.mjs 默认已加） |

时长、文件大小上限各平台不同、经常调整（例如 X 免费账号单条视频约 2 分 20 秒、YouTube Shorts 目前最长 3 分钟），**以平台创作中心的最新说明为准**。

### 4.2 发布前审片

用[审片清单](/cheatsheets/checklist)的 G4 部分完整走一遍，另外：
- [ ] 第一帧能当封面吗？没有就单独做一张封面图
- [ ] 静音看一遍：没有声音时画面能讲明白吗？（很多人在信息流里静音刷）
- [ ] 软字幕 `.srt` 一起上传
- [ ] 简介写清楚：AI 配音、配乐来源、参考资料
- [ ] 数字和说法都有出处（M3 的事实核查）

## 5. 毕业作品

| 要求 | 说明 |
|---|---|
| 时长 | 2–3 分钟 |
| 结构 | 至少 3 个章节；至少用到一次 M11 的 3D × 2D 合成，或 M8 的动态字体 |
| 文档 | 完整导演文档包（narration / STORYBOARD / LOOK / REVIEW × n / HANDOFF） |
| 技术 | 并行渲染出片；`--verify` 通过；响度达标 |
| 发布 | 至少发到一个平台，记录一周后的数据 |
| 复盘 | 你的 `CLAUDE.md` 从 v1 到现在长了多少条？哪 3 条最有用？ |

## 6. 作业：实现 `splitRanges()`

打开 `studio/exercises/m12/parallel.mjs`，实现 `splitRanges(duration, fps, n)`：把 `[0, duration)` 切成 n 段，返回 `[[from, to], ...]`。

要考虑：
- 段与段首尾相接、不重不漏——渲染器会把 `from`/`to` 按帧对齐，你的边界最好本来就落在整帧上
- 按**帧数**平均还是按秒平均？
- `n` 比总帧数还大时怎么办？
- 要不要切在镜头边界上？在 seek(t) 的世界里，为什么平均切就已经足够？

写完验证：

```bash
node exercises/m12/parallel.mjs examples/gps/index.html --workers=4 --scale=0.5 --out=out/parallel.mp4
node render/ffmpeg.mjs -v error -i out/parallel.mp4 -map 0:v -f null - -stats   # 应该是 2299 帧
```
