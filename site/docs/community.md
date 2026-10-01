# 社区在讨论什么

> 调研时间：2026-10-01（Opus 5.5 于 2026-09-22 发布后第 9 天）。数据为当日快照，X 帖子正文多经镜像读取；标注「未核实」的内容只来自搜索摘要或当事人自述。
> 本页只做中文转述和链接，不搬运原文。

## 一句话：到底发生了什么

Opus 5.5 发布后，X 上出现了一批「Opus 直接做的视频」：历史大片、科普讲解、产品宣传片、15 秒动效 showreel。
**它们都不是视频生成模型的产物**——Opus 写的是代码（HTML / Canvas / SVG / p5.js / Three.js / Remotion，少数是 Python），代码给出「任意时刻 t 的画面」，再由无头 Chrome 逐帧截图、ffmpeg 合成 MP4。
有人在 Opus 5.5 不指定框架时观察到：它默认就会写「单个 index.html + seek(t) + Playwright + ffmpeg」这套（[Tommy Rossi](https://x.com/i/status/2103485566570369333)）。本课的主线就是这套。

## 头部爆款（按播放量）

| 作品 | 作者 | 播放（快照） | 怎么做的 | 「一次成型」？ |
|---|---|---|---|---|
| 西方文明史 2:16 | [@IterIntellectus](https://x.com/IterIntellectus/status/2103212539895017864) | ~1400 万 | 推测为 JS Canvas/SVG + 无头 Chrome + ffmpeg，作者未公开提示词 | 作者自称 one shot；第三方复现需要两轮（[explainx](https://explainx.ai/blog/claude-opus-5-5-western-civilization-video-2026)）·未核实 |
| P(doom) MV | [@donaldjewkes](https://x.com/donaldjewkes/status/2102801274173587569) | ~376 万 | 约 9500 字的导演简报，自主跑 12 小时；还调用了视频生成模型和配音服务，**不是纯代码** | 「一个提示词」但很长 |
| 15 秒 showreel | [@stephanlivera](https://x.com/stephanlivera/status/2103315922098470926) | ~220 万 | 爆款提示词的源头；有人拆出 7 个剪辑点全落在 128 BPM 的小节线上（[iArt](https://www.iart.ai/blog/claude-motion-graphics)） | 是 |
| UI 形变循环 | [@twoclipping](https://x.com/twoclipping/status/2103273003555402193) | ~101 万 | 单个 HTML、闭式弹簧、每帧 4 个子帧 + ffmpeg tmix 做运动模糊；公开了模板 | 研究仓库判定非一次成型 |
| 3 分钟 AI 简史 | [@kimmonismus](https://x.com/kimmonismus/status/2102844654169575547) | ~20 万 | Remotion，约 7400 行；开源 TTS + Python 合成配乐；约 1 小时、周额度约 7% | 未说明 |
| 乔布斯生平 2 分钟 | [@oozn](https://x.com/oozn/status/2103482545111232946) | 1.8 万（被大量转引） | Remotion + React + SVG，约 8700 行，23 个转场，锁 120 BPM，3570 帧 5 分钟内渲完 | 自称是 |
| 中华上下五千年 2:38 | WY（@akokoi1） | ~15 万 | 一句中文提示词，线稿风，约 Max 5x 周额度的 1%（[合集](https://github.com/huahua99599-commits/awesome-opus-gallery)） | 自称是·未核实 |
| 星舰科普（B 站） | [风之谷AI](https://www.bilibili.com/video/BV1VxhD6jE5V/) | — | **Blender** + Mantaflow + Remotion，380 字提示词，5 小时，约 200 美元周额度的 18% | 否 |
| GPS 原理讲解 | — | — | 与西方文明史同类技术做的技术科普（[YouTube](https://www.youtube.com/watch?v=K-pgPNFcAj4)） | — |

更多：[yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos)（475+ 条）、[nickcheng 30 案例研究](https://github.com/nickcheng/claude-opus-5-5-js-animation-research)、[X-RayLuan 提示词合集](https://github.com/X-RayLuan/awesome-opus-5-5-video-prompts)。

## 九个热门争论

### 1. 「一次成型」是真的吗？
这是最大的争论。[@rexan_wong](https://x.com/rexan_wong/status/2103707054108299437) 一句「我的一句话视频很 mid」获得 60 万播放，引出大家去拆别人的工作流。
目前的共识大致是：**短片（15 秒）一句话确实可能出好结果；长片靠的是很长的简报、skills、多轮迭代甚至通宵运行。** 有人总结为「提示词是一条，工作不是一遍」（[OrcaRouter](https://www.orcarouter.ai/blog/claude-opus-5-5-video-plan-one-shot)）。中文圈也有「很多作品其实改了 8 轮」的反馈。
→ 本课立场：**把迭代设计进流程**（M5 的闸门），而不是赌一次成型。

### 2. 成本和额度
- 短片单条从几毛到几美元不等（[HF 教程](https://huggingface.co/blog/karmen-beatapi/how-to-make-videos-with-claude-opus-5-5)估约 $0.66；[HN](https://news.ycombinator.com/item?id=49836374) 有人报 $3.21）
- 长项目是另一个量级：可交互小岛项目约 $1874 / 8 小时 / Max 20x 周额度 59%（[Latent Space](https://www.latent.space/p/ainews-opus-55-is-good-at-explainer)）
- effort 档位的社区共识：**改小问题 medium、新片 xhigh、旗舰作品才 max**
- 中文圈吐槽：Pro 计划做一条短宣传片就吃掉 5 小时额度的 20–40%（linux.do 自述·未核实）
→ M12 专讲成本预算：哪些步骤可以不调用模型（重渲、contact sheet 都是纯本地）。

### 3. 和别的模型比
同提示词对比 GPT-6 Astra 的帖子有 180 万播放（[@shneural](https://x.com/shneural/status/2103151003272962130)）；[MindStudio](https://www.mindstudio.ai/blog/opus-5-5-vs-gpt-6-astra) 有 12 项任务横评；Blender 法拉利测试里 Opus 画质更好但成本约 6 倍（[Better Stack](https://betterstack.com/community/guides/ai/opus-55-vs-gpt6-blender/)）。与 Fable 5.1、Gemini 的同提示词视频对比暂未找到。

### 4. 动效设计师要失业了吗？
一方说「cooked」；另一方说「好的动效设计师会做得更狠」。讨论逐渐转向**可编辑性和客户能不能改**。[Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/) 的观点很准：模型「感受不到曲线在全速播放时是什么感觉」——**这正是导演（你）存在的意义。**

### 5. 「AI 味」与同质化
有人预言会出现一种「motion design AI smell」；0xMovez 把原因叫作 **brief contagion**——几百个人用同一句提示词，自然长得一样。常被点名的俗套：居中大字 + 渐变底、所有元素同时淡入、片尾 logo、角落标签。
→ 本课的 `CLAUDE.md` 第 4 节「反 AI 味」就是这份清单。

### 6. 纯代码 vs 调度生成模型
部分爆款其实混用了视频/图像生成模型（P(doom) 用了视频生成，有人接了 Runway）。0xMovez 提出「先生成、再描摹」：生成模型出底片，Opus 用 JS 重绘。
→ 本课主线坚持纯代码（可控、可复现、可改），M11 再讨论混合。

### 7. 确定性与 seek(t)
HeyGen 的工程师统计 74 次运行里有 64 次 Opus 自发采用「帧 = f(t)」（[来源](https://x.com/i/status/2104707129101988095)，注意其为 HyperFrames 厂商）。但也有人发现长时间生成后，模型会**悄悄混进计时器**。
→ 所以要用工具验证，而不是只靠提示词：`render.mjs --verify`（M1）。

### 8. 选什么技术栈
| 方案 | 社区评价 |
|---|---|
| 纯 HTML/Canvas + seek(t) | 爆款最多、最自由；渲染脚本百来行；Opus 默认就这么写 |
| Remotion（React） | 排版/UI/数据图强，生态成熟，有官方 Claude Code skill；**4 人以上团队需商业授权** |
| HyperFrames（HeyGen） | 纯 HTML + data 属性 + GSAP，对 agent 友好，Apache-2.0；有评测说它「有时太有创意」 |
| Manim | 数学/几何最强，3B1B 风格；依赖重，字幕和 UI 常需另合成 |

→ 本课：先手搓纯 HTML 吃透原理（M0–M7），M8 再横评框架。

### 9. 声音
两派：**代码合成派**（Node/Python 合成配乐，锁 BPM）和 **真实素材派**（「Opus 听不见声音，所以别让它合成」，用真录音、统一到 -14 LUFS）。edge-tts 免费但被普遍认为「太平」。
→ M6 讲中文 TTS 横评和「声音先行」的节奏设计。

## 社区的工作流共识

把几十个教程和帖子合起来，大致是这条流水线（本课 M5 会把它落成你的闸门）：

1. 找参考片（常用 whatships.com），抽帧写 `style_guide.md`
2. 要 2–3 套分镜方案，挑一套
3. 每个镜头先出**静帧**，审过再动
4. 渲染后出 **contact sheet**，让 Opus 看图自评（打分到 8 以上才过）
5. **换一个全新会话**做严苛评审（同一会话里它会对自己手软）
6. 长片拆成多会话，用 `HANDOFF.md` 交接；规则沉淀进 `CLAUDE.md`
7. 素材用真的：「永远不要编造一个界面」

## 中文社区

- **讨论焦点**：「它一帧都没生成」的原理科普；歸藏（op7418）用 Opus 5.5 做 CodePilot 宣传片并开源 [guizang-product-video-skill](https://github.com/op7418/guizang-product-video-skill)；linux.do 大量「额度瘫坐」帖；V2EX「打败 Seedance 的会是 Opus 吗」（[帖子](https://www.v2ex.com/t/1245333)）
- **好的中文资料**：[cosine.ren 资源汇总](https://blog.cosine.ren/post/opus-5-5-motion-video-resources)（目前最全）、[haiy/opus55-video-guide-zh](https://github.com/haiy/opus55-video-guide-zh)（MV 方向）、[awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills)（180+ 仓库，约 40% 中文）
- **中文特有的坑**：无头环境缺中文字体 → 方块字；国内访问与中转站风险；改片口令要说具体（「第 8 秒太快」而不是「节奏不好」）

### 中文教程普遍缺的（本课重点补）

1. 一条完整可复现的**中文科普流水线**：选题 → 事实核查 → 解说稿 → 中文 TTS（逐词时间戳）→ 画面对齐 → 字幕 → BGM 避让 → 质检（M3、M6、M7）
2. **中文字体工程**：子集化、`document.fonts.ready`、跨机器一致（M6、踩坑表）
3. **国内 TTS 横评**：edge-tts / CosyVoice / IndexTTS / 火山 / SeedAudio（M6）
4. **成本与额度预算方法**（M12）
5. **分平台导出规格**：B 站横屏、抖音/视频号竖屏（M9、M12）
6. **品牌宣传片方法**：分镜、静帧确认、参考片（M8、M9）

## 现有的英文课程

| 课程 | 一句话 |
|---|---|
| [@0xMovez · motion design studio](https://x.com/0xMovez/status/2104216919033192746) | 138 万播放，12 步；核心观点「提示词只占 10%，90% 是 harness」 |
| [@notdwd · motionmaxx](https://x.com/notdwd/status/2104684539142648062) | 9 模块，动效规则如「arrive fast, land soft」 |
| [@socialwithaayan · 产品发布片](https://x.com/socialwithaayan/status/2104519430814482644) | 5 文件结构：CLAUDE.md / LOOK.md / kit / scenes / clock |
| [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) | 卡通短片起步仓库，`ANIMATION_GUIDE.md` 值得通读 |
| [Remotion 官方 skills](https://github.com/remotion-dev/skills) | `npx remotion skills add` |
| [HyperFrames skills](https://github.com/heygen-com/hyperframes) | `npx skills add heygen-com/hyperframes` |
