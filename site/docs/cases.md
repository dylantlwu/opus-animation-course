# 爆款拆片库

M2 拉片练习用。每个案例：类型、技术栈、过程、**值得学的点**。数据为 2026-10-01 快照；「未核实」表示只有当事人自述或二手转述。

> 原片请点链接观看。本页只做拆解，不搬运原文和提示词全文。

## 科普 / 解说类

### 西方文明史（2:16）
- **作者**：[@IterIntellectus](https://x.com/IterIntellectus/status/2103212539895017864)　**播放**：~1400 万
- **技术**：推测为 JS 画布渲染 + 无头 Chrome + ffmpeg（作者未公开，[explainx 的分析](https://explainx.ai/blog/claude-opus-5-5-western-civilization-video-2026)）
- **过程**：作者称一次成型·未核实；第三方复现用了两轮
- **值得学**：① 长片按章节组织，每章一个渲染函数 ② 统一的视觉母题贯穿 2 分钟 ③ 时间轴型叙事天然适合「一个镜头一个事件」
- **注意**：引发过意识形态争论——科普的**选材与立场**也是编剧责任

### GPS 原理讲解
- **链接**：[YouTube](https://www.youtube.com/watch?v=K-pgPNFcAj4)
- **值得学**：每个抽象概念都有几何对应物（距离 → 圆，定位 → 交点）；画面替旁白说话
- **反思**：HN 上「花哨幻灯片、外行跟不上」的批评（见 [M3](/m03/)）

### 7 分钟 DeepSeek 架构讲解
- **作者**：[AJ](https://x.com/ItsmeAjayKV/status/2103591055396663493)
- **技术**：Opus 用 Python + ffmpeg **自己写了一个迷你 3B1B 风格引擎**（没用 Manim 库），edge-tts 配音，带字幕
- **值得学**：先让 Opus 读论文写脚本，再写分镜，最后才做画面；作者自述自己只花了约 30 分钟·未核实

### 中华上下五千年（2:38）
- **作者**：WY（@akokoi1）　**播放**：~15 万
- **技术 / 过程**：一句中文提示词，线稿风；约 Max 5x 周额度的 1%·未核实
- **值得学**：风格约束（线稿 + 轻松有趣）本身就能大幅降低「AI 味」

### 星舰科普（B 站）
- **作者**：[风之谷AI](https://www.bilibili.com/video/BV1VxhD6jE5V/)
- **技术**：**Blender** + Mantaflow（流体）+ Remotion；SeedAudio 配音
- **过程**：380 字提示词，5 小时，约 200 美元周额度的 18%
- **值得学**：3D 与 2D 分工——Blender 做空间，Remotion 做信息层（本课 [M10](/m10/)–M11）

### 3 分钟 AI 简史
- **作者**：[@kimmonismus](https://x.com/kimmonismus/status/2102844654169575547)
- **技术**：Remotion，约 7400 行；SVG + canvas；开源 TTS；Python 合成配乐
- **过程**：约 1 小时，周额度约 7%
- **值得学**：长片用框架（组件化、时间轴）更好管理

## 动态图形 / 宣传类

### 15 秒 showreel（爆款提示词源头）
- **作者**：[@stephanlivera](https://x.com/stephanlivera/status/2103315922098470926)　**播放**：~220 万
- **拆解**（[iArt](https://www.iart.ai/blog/claude-motion-graphics)，二手）：15 秒 7 个剪辑点，**全部落在 Claude 自己写的 128 BPM 音轨的小节线上**；一个红点贯穿所有镜头作为母题
- **值得学**：节拍网格（[M2](/m02/)）+ 视觉母题
- **注意**：同一句提示词被几百人复用，结果高度同质化（brief contagion）

### UI 形变循环
- **作者**：[@twoclipping](https://x.com/twoclipping/status/2103273003555402193)　**播放**：~101 万
- **技术**：单个 1440×1440 HTML；120 BPM；闭式弹簧；Playwright 每帧 4 子帧 + ffmpeg tmix 运动模糊
- **值得学**：「一个形状，从不切镜」——焦点永远不丢（[M1](/m01/)）

### 乔布斯生平（2 分钟）
- **作者**：[@oozn](https://x.com/oozn/status/2103482545111232946)
- **技术**：Remotion + React + SVG，约 8700 行；23 个转场；Node 合成配乐锁 120 BPM；3570 帧 5 分钟内渲完
- **值得学**：转场设计的密度；固定 BPM 让 23 个转场都有节奏依据

### CodePilot 宣传片（中文）
- **作者**：歸藏（op7418），方法开源为 [guizang-product-video-skill](https://github.com/op7418/guizang-product-video-skill)
- **值得学**：读取真实代码库、复用**真实组件**做 UI 画面，而不是手搓假界面

### Dub 宣传片
- **作者**：[@steventey](https://x.com/steventey/status/2103625902211088880)
- **技术**：Opus 5.5 High，通过 Cursor
- **值得学**：产品宣传片可以很短、很克制

## 混合 / 非纯代码（了解边界）

### P(doom) MV
- **作者**：[@donaldjewkes](https://x.com/donaldjewkes/status/2102801274173587569)　**播放**：~376 万
- 约 9500 字的导演简报，自主运行 12 小时；**调用了视频生成模型和配音服务**
- **启示**：长而具体的简报 + 长时间自主运行可以做出大作品，但成本和可控性是另一个量级

## 案例合集

- [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) — 475+ 条，含原片与重制
- [nickcheng/claude-opus-5-5-js-animation-research](https://github.com/nickcheng/claude-opus-5-5-js-animation-research) — 30 个浏览器动画案例，按播放量排序，附方法分析
- [X-RayLuan/awesome-opus-5-5-video-prompts](https://github.com/X-RayLuan/awesome-opus-5-5-video-prompts) — 68 条附提示词
- [huahua99599-commits/awesome-opus-gallery](https://github.com/huahua99599-commits/awesome-opus-gallery) — 含中文作品
