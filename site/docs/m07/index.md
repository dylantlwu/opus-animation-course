# M7 · 项目一：90 秒科普短片

<div class="lesson-meta"><span class="dir">综合：导演文档包</span><span class="write">编剧：M3 脚本落地</span><span class="tech">技术：M0–M6 全流程</span><span>建议 2 个周末</span></div>

## 1. 项目目标

把你在 M3 写的脚本，做成一支**可以直接发 B 站**的中文科普短片：60–90 秒，1080p，有配音、字幕、配乐，响度达标。

## 2. 示例片：《GPS 为什么要 4 颗卫星》

本课程按自己教的流程做了一支完整示例。先看成片（有声音）：

<video controls preload="metadata" poster="/media/gps-poster.jpg" src="/media/gps.mp4" style="width:100%;border-radius:10px;border:1px solid var(--vp-c-divider)"></video>

再用播放器逐帧看（无声，画面和字幕由同一份 `timeline.json` 驱动）：

<AnimDemo src="/demos/gps/index.html" caption="examples/gps/index.html —— 拖到 16.6 秒看打雷那一段，就是下面「制作日志」里那次崩溃的位置" :poster="49" />

### 导演文档包

所有中间产物都在 `studio/examples/gps/`，可以和你自己的作业逐项对照：

| 文件 | 对应课程 | 内容 |
|---|---|---|
| `narration.txt` | M3 + M6 | 22 句旁白，顶部注释是**事实核查**（声速、光速、球面交点） |
| `STORYBOARD.md` | M3 + M5 | logline（ABT）、受众、母题（时钟）、8 个镜头的 reads 表 |
| `LOOK.md` | 风格专题 | 风格卡 ① 3B1B 数学风，含风格块 |
| `audio/timeline.json` | M6 | `tts.py` 生成：每句话的真实起止时间 |
| `index.html` | M1 + M4 | 画面本体，代码里没有一个写死的秒数 |

### 制作日志：真实踩过的坑

这些不是为了教学编出来的，是做这支片子时实际发生的：

**① 事实核查改了脚本**（G0 之前）
M3 示例脚本里写的是「三颗卫星就能交出一个点」——不严谨：三个球面一般交于**两点**，其中一点远离地球被排除。还有「GPS 帮手机对了表」改成了「顺便算出了精确的时间」。→ 这正是 M3「每个说法都要有出处」的意义。

**② 声音先行**（G1）
先跑 `tts.py`：22 句、75.8 秒。比计划的 60 秒长——于是按 90 秒的规格做，而不是去压缩旁白。

**③ 第一轮静帧审出 5 个问题**（G2）

| 问题 | 怎么发现的 | 修法 |
|---|---|---|
| 时钟数字溢出手机轮廓 | contact sheet | 手机放大、字号缩小 |
| 标题「4颗卫星」挤在一起 | contact sheet | 三段文字按实际字宽排列 |
| 声波画成整圆，横穿画面、压住标尺 | contact sheet | 只画朝向「你」的 60° 弧 |
| 第三颗卫星和第二颗挨着，看起来像一颗 | contact sheet | 拉开位置、图标放大 |
| 「要求的精度：十亿分之一秒」说法含糊 | 自审文案 | 改成可核实的「10 亿分之一秒 ≈ 30 厘米」，和后面「1 毫秒 → 300 公里」呼应 |

**④ 整片渲染时崩溃**（G4）
闪电刚出现的 0.3 秒里，后两圈声波的半径是负数，canvas 报错。`--verify` 和 `--sheet` 都是抽查，没碰到这几帧。更糟的是，当时的渲染器崩溃后 ffmpeg 仍然封装出了一个「看起来正常」的 MP4：音频完整 75.8 秒，画面只有一半。
→ 修了两处：片子里半径 ≤ 0 不画；渲染器遇到页面报错会**立刻停止、删除不完整的文件、报出出错时间点**（见 M5 的「抽查不等于全检」）。

**⑤ 响度调了 4 次才达标**（G4）
从 -17.5 到 -14.87 LUFS 的完整过程见 [M6 · 混音](/m06/#_2-5-混音-避让-响度)。

## 3. 你的项目

### 3.1 交付物

- [ ] `narration.txt`（每句 ≤ 20 字，顶部有事实核查）
- [ ] `STORYBOARD.md`（logline、受众、母题、每个镜头的 reads）
- [ ] `LOOK.md`（从风格卡展开）
- [ ] `index.html`（由 `audio/timeline.json` 驱动，`--verify` 通过）
- [ ] 每个闸门一份 `REVIEW.md`
- [ ] `final.mp4`：1920×1080、30fps、H.264、AAC；响度 -14 ± 1 LUFS
- [ ] `voice.srt`（软字幕）
- [ ] 复盘：哪 3 条规则写进了 CLAUDE.md？

### 3.2 两个周末怎么排

| 时间 | 做什么 | 闸门 |
|---|---|---|
| 周六上午 | 脚本定稿 + 事实核查 + `tts.py` 生成配音 | G0 |
| 周六下午 | STORYBOARD（让 Opus 起草，你改 reads） | G1 |
| 周日 | LOOK.md + 4 张 style frames + 眯眼测试 | G2 |
| 第二个周六 | 全部镜头动画 + 每个转场 `--strip` | G3 |
| 第二个周日 | 配乐 + `mix.py` + 终版渲染 + 新会话严审 + 复盘 | G4 |

### 3.3 起手提示词

```text
读 CLAUDE.md。这是 M7 项目，参考 examples/gps/ 的完整文档包。
work/<片名>/narration.txt 是定稿旁白（已做事实核查），audio/timeline.json 已生成。
按 G1 开始：起草 STORYBOARD.md，格式照 examples/gps/STORYBOARD.md——
logline（ABT）、受众、母题、每个镜头对应哪几句旁白、画面事件、reads、入场转场。
每个镜头只用视觉隐喻库里的一个隐喻，写出是哪一个。写完停下等我。
```

### 3.4 推荐选题

- 为什么天空是蓝的（瑞利散射）
- 大模型为什么会「幻觉」
- 为什么飞机能飞（不只是伯努利）
- 你自己领域里，外行最常误解的一个概念

## 4. 发布前

- 用[审片清单](/cheatsheets/checklist)走一遍 G4
- 第一帧和最后一帧都能当封面吗？
- 软字幕 `voice.srt` 一起上传
- 片尾或简介里写清楚：旁白是 AI 合成的、配乐来源
