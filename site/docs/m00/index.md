# M0 · 心智模型与环境

<div class="lesson-meta"><span class="tech">技术：渲染管线</span><span class="dir">导演：看片</span><span>约 4–6 小时</span></div>

## 1. 本课目标

- 说清楚「Opus 做视频」到底是什么、不是什么
- 装好环境，渲染出你的第一支 MP4
- 让 Opus 5.5 在你的规则下改一版片子，并亲眼看到闸门流程
- 看 5 个爆款，写下你自己的判断

## 2. 原理：代码画帧，不是生成

### 管线

```
你（导演）
  │  简报 / 分镜 / 审片意见
  ▼
Claude Code + Opus 5.5 ── 写 ──▶ index.html（暴露 __meta 和 seek(t)）
                                      │
                       render.mjs：for 每一帧 i：
                         seek(i / fps) → 无头 Chrome 截图 → PNG
                                      │ 管道
                                      ▼
                                   ffmpeg ──▶ video.mp4（+ 配音 / 音乐）
```

关键点只有一个：**画面是时间 t 的纯函数**。给定 t，就能画出那一帧——不依赖「上一帧画了什么」。

<AnimDemo src="/demos/tpl-canvas.html" caption="点 ⏮ ⏭ 逐帧走：播放器只是在不停地调用 seek(t)" :poster="3.4" />

为什么这个约定这么重要？因为渲染器**不是**实时播放：

| 能力 | 前提 |
|---|---|
| 逐帧截图、慢慢渲染也不会卡顿掉帧 | 每帧独立可算 |
| 只重渲改过的镜头 | 帧之间没有依赖 |
| 多个浏览器并行渲染不同片段 | 帧之间没有依赖 |
| 在一帧内采多个时刻做运动模糊 | 能求任意（非整数帧）时刻的画面 |
| 网页上拖动时间轴预览 | 能跳到任意时刻 |

### 它和 Sora / 可灵 / Seedance 的区别

| | 视频生成模型 | Opus 写代码 |
|---|---|---|
| 擅长 | 写实画面、真人、自然光影 | 图形、文字、图表、UI、风格化插画、精确的时间控制 |
| 不擅长 | 精确文字、精确时间、改一个细节 | 写实画面、角色一致性 |
| 可修改性 | 重新抽卡 | 改一行代码、只重渲一个镜头 |
| 输出 | 像素 | 源代码（可复用、可版本管理） |

**结论**：科普解说、数据可视化、产品宣传、动态字体——正是代码动画的主场。

## 3. 拆爆款：先看，再说话

去 [社区在讨论什么](/community) 的爆款表里挑 5 个看。这一步不学技术，只练**眼睛**——见下面第 5 节的训练。

## 4. 实操

### 4.1 装环境（一次性）

你的机器（已实测）：Intel i7-12700 / AMD RX 560 / macOS 15.7 / Node 22 / Python 3.11 / Chrome / Claude Code 已装。只需要：

```bash
cd ~/ops_animation/studio
npm install    # Playwright（优先用你已装的 Chrome）+ ffmpeg-static（预编译 ffmpeg，只装在 node_modules 里）
```

::: warning 为什么不用 brew install ffmpeg
Homebrew 自 2026 年 9 月起不再支持 Intel Mac、不再提供预编译包——`brew install ffmpeg` 会从源码编译 ffmpeg 和 15 个依赖，并升级 openssl、Python 等系统包，耗时数小时。
所以本课用 npm 包 `ffmpeg-static`。需要直接调用 ffmpeg 时：`node render/ffmpeg.mjs <参数>`。
:::

### 4.2 渲染你的第一支片子（不需要 AI）

```bash
cd ~/ops_animation/studio
node render/render.mjs templates/canvas/index.html --verify      # 确定性检查
node render/render.mjs templates/canvas/index.html --sheet=0.3,1,1.8,2.6,3.2,5.5 --cols=3
node render/render.mjs templates/canvas/index.html --clip --out=out/hello.mp4
open out/hello.mp4
```

你应该看到：
- `--verify` 输出「确定性检查通过」
- `out/check/sheet.png`：6 张关键帧拼在一起，每张标着时间和帧号
- `out/hello.mp4`：6 秒、1920×1080、30fps

### 4.3 启动 Opus 5.5

```bash
cd ~/ops_animation/studio
claude --model opus --effort xhigh
```

- `--model opus`：用最新的 Opus（即 5.5）
- `--effort` 可选 `low / medium / high / xhigh / max`。社区经验：**改小问题用 medium，做新片用 xhigh，旗舰作品才用 max**（max 很费额度，收益有限）

Claude Code 启动时会自动读取 `studio/CLAUDE.md`——这就是你给它的**导演手册**。打开看一遍，现在不用全懂。

### 4.4 第一次合作

把下面这段发给它（替换方括号里的内容）：

```text
读 CLAUDE.md。
把 templates/canvas 复制到 work/hello/，做一支 6 秒的片头：
- 主题：[你的名字或项目名] 的个人片头
- 风格：[比如：深色背景、一个强调色、干净的几何图形]
- 受众：[比如：B 站科技区观众]
按闸门走：先给我 G0 简报复述和 G1 分镜，等我批准再写代码。
```

**预期会发生的事**：
1. 它复述简报，可能问你 1–2 个问题（G0）
2. 它写出 `work/hello/STORYBOARD.md` 然后**停下来等你**（G1）——如果它没停，直接开写代码，提醒它：「你跳过了 G1 闸门」
3. 你批准后，它出静帧 contact sheet 并附自评（G2）
4. 再批准，它跑 `--verify`、出半分辨率预览（G3）

::: warning 常见翻车
- **它不停下来等你批准**：在消息里明确说「等我批准」，或在 `CLAUDE.md` 第 6 节加一条你自己的规则
- **它说「已完成」但没看渲染结果**：要求它「打开 sheet.png 看一下再告诉我问题」
- **中文变成方块**：字体问题，见 [踩坑表](/cheatsheets/pitfalls)
:::

## 5. 导演训练：看片写判断

从爆款表里挑 5 个看（每个至少看 3 遍），每个写 4 行：

| 问题 | 写法要求 |
|---|---|
| 它在讲什么？ | 一句话，不超过 20 字 |
| 第一眼看哪里？ | 指出画面里的具体元素 |
| 最爽的一个瞬间 | 写时间点（第几秒）+ 为什么 |
| 节奏 | 哪里太快 / 太慢，具体到秒 |

这个练习的目的：以后给 Opus 提意见，你要能说「第 8 秒的标题出来太快，观众还没读完就切了」，而不是「节奏不太好」。

## 6. 作业 + 自检

作业目录：`studio/exercises/m00/`

- [ ] `npm install` 完成，`node render/ffmpeg.mjs -version` 有输出
- [ ] `out/hello.mp4` 能播放，6 秒
- [ ] 和 Opus 走完 G0–G3，`work/hello/` 下有 `STORYBOARD.md` 和 `index.html`
- [ ] `--verify` 对你的片子通过
- [ ] 5 个爆款的看片笔记写进 `exercises/m00/notes.md`
- [ ] 在 `CLAUDE.md` 第 6 节加上你的第一条规则（哪怕是「回答用中文」）
