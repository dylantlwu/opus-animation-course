# 风格卡片库

16 种在 Opus 社区实际被用过的视频风格，按[四层框架](/style/)整理。数值（色值、曲线、帧率）多来自社区规范文件，**是起点而不是标准答案**——用的时候抄进你的 `LOOK.md` 再按片子改。

主要来源：[lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)（43 种风格 STYLE.md，下文简称 lemo）、[vox-director](https://github.com/Alisa0808/vox-director)、[hand-drawn-explainer](https://github.com/hi-nikola/hand-drawn-explainer-video-nikola)、[ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)、社区帖子。标「未核实」的是没有找到 Opus 专用规范、只有通用描述的。

::: tip 怎么用这一页
1. 先看「适用」挑 2–3 张候选卡
2. 把卡片的「关键词」+「禁区」放进提示词，让 Opus 各出一张风格静帧（见[使用方法](/style/workflow)的 bake-off）
3. 选定后，把整张卡展开成你这支片子的 `LOOK.md`
:::

## A. 科普讲解向

### ① 3Blue1Brown / Manim 数学风
**本质**：深色黑板上的数学对象在连续变形。**不是**：PPT 动画、霓虹科技风。

| | |
|---|---|
| 视觉 | 深底 `#1C1C1C`；蓝 `#58C4DD`、绿 `#83C167`、黄 `#FFFF00`（色值取自社区 [manim-video skill](https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/manim-video/SKILL.md)，非官方）；公式用 LaTeX，正文细体无衬线 |
| 运动 | 逐帧；**Write**（写出）与 **Transform**（一个对象连续变成另一个）；「旧元素变暗 → 新元素揭示」；关键揭示后停约 2 秒 |
| 适用 | 数学、算法、论文、物理原理 |
| 关键词 | Manim CE, Write, Transform, dim-and-reveal ／ 公式推导、连续变形、变暗再揭示、留白停顿 |
| 禁区 | 发光、粒子、渐变底；布局溢出屏幕；不停顿地连续揭示 |
| 参考 | [AJ 的 7 分钟讲解](https://x.com/ItsmeAjayKV/status/2103591055396663493)、[3brown1blue skill](https://github.com/AmitSubhash/3brown1blue)（封装了容易崩的 Manim API） |

### ② 扁平矢量科普（常被称作「Kurzgesagt 风」）· 未核实
**本质**：圆润几何构成的可爱宇宙。**不是**：儿童绘本、企业扁平插画。

| | |
|---|---|
| 视觉 | 深空蓝底、高饱和、圆角几何、柔光、无描边或极细描边 |
| 运动 | 视差分层、平滑缓动、所有东西都在**持续微动** |
| 适用 | 宏观科学、宇宙、生物、历史 |
| 关键词 | flat vector, rounded geometric, soft glow, parallax layers ／ 扁平矢量、圆角几何、视差 |
| 禁区 | 粗圆描边（会显得幼稚）；直接复用该工作室的角色造型 |
| 参考 | [@kimmonismus 的 AI 简史](https://x.com/kimmonismus/status/2102844654169575547)（方向接近） |

### ③ 白板手绘讲解
**本质**：边讲边画的白板。**不是**：蓝图、卡片飞入的 PPT。

| | |
|---|---|
| 视觉 | 纯白底；**最多 3 色马克笔，每种颜色全片含义固定**（如黑=结构、蓝=对象、红=重点）；单线手写字体 |
| 运动 | 笔画按**慢-快-慢**画出；短标签 0.3–0.8s、标题约 3s；不切镜头，用镜头甩移换区域 |
| 适用 | 概念讲解、流程、因果链 |
| 关键词 | stroke-by-stroke, whiteboard, marker, whip pan ／ 逐笔落墨、边讲边画 |
| 禁区 | 用整图淡入或卡片飞入**冒充**绘制；画面里出现手或光标 |
| 参考 | lemo `whiteboard`、[hand-drawn-explainer](https://github.com/hi-nikola/hand-drawn-explainer-video-nikola)（中文、火山 TTS） |

### ④ 一笔线稿
**本质**：一根从不断开的线，从一个画面流向下一个。**不是**：白板讲解（有很多笔）。

| | |
|---|---|
| 视觉 | 暖黑 `#1D1A17` + 暖白纸 `#F4EFE4`；全片最多一个强调色且只用一次；线宽随速度变（快细慢粗） |
| 运动 | 逐帧；**没有剪辑**：上一幕最后一笔就是下一幕第一笔；镜头跟随笔尖 |
| 适用 | 口播的 B-roll、品牌故事、抒情段落 |
| 关键词 | continuous line, one-line drawing, morph transition ／ 一笔画、连笔转场 |
| 禁区 | 相邻线条粘连；停笔处的墨点画成「痣」；镜头拉远线条消失 |
| 参考 | lemo `one-line`、[@AxtonLiu](https://x.com/AxtonLiu/status/2102827887732932956) |

### ⑤ 数据新闻
**本质**：图表本身就是电影。**不是**：仪表盘、PPT 图表。

| | |
|---|---|
| 视觉 | 奶油色纸 + 点网格；标题用衬线体（如 Newsreader），刻度用等宽体（如 IBM Plex Mono）；**颜色只编码数值** |
| 运动 | 转场就是图表操作：轴生长、重新缩放、形变；一镜到底；节奏跟着数据密度走 |
| 适用 | 数据驱动的论证、趋势、对比 |
| 关键词 | chart-as-film, rescale, data-driven transition ／ 一次只讲一个观点 |
| 禁区 | 堆成仪表盘；为戏剧效果拉伸色阶；外推数据之外的部分；编造数字 |
| 参考 | lemo `dataviz` |

### ⑥ 等距信息图
**本质**：真等距的剖面世界。**不是**：透视 3D。

| | |
|---|---|
| 视觉 | 真等距 30°；不描边；每个面三档色调；颜色像图例一样编码含义 |
| 运动 | 每个移动前先画出引导线；剖切动画约 0.3 + 0.35s |
| 适用 | 系统架构、工厂流程、城市、硬件拆解 |
| 关键词 | true isometric, cutaway, leader line ／ 等距、剖切、引线标注 |
| 禁区 | 半透明的运动实体（像幽灵）；混入透视 |
| 参考 | lemo `iso-infographic` |

### ⑦ 蓝图 / 技术图纸
**本质**：晒图纸上的工程制图。**不是**：发光线框的全息 HUD。

| | |
|---|---|
| 视觉 | 只有普鲁士蓝（`#18336B`–`#2A58A6`）+ 白线（`#E7F0F9`）；4 级线宽；45° 剖面线；红色印章全片只出现一次 |
| 运动 | **按制图顺序画出**：中心线 → 轮廓 → 细节 → 标注；在强拍上切镜 |
| 适用 | 工程原理、机械、建筑、产品结构 |
| 关键词 | cyanotype, blueprint, drafting order ／ 晒图、工程线稿、制图顺序 |
| 禁区 | 3D 渲染；发光线框 |
| 参考 | lemo `blueprint` |

## B. 品牌宣传向

### ⑧ 浅色极简 + 动态字体（常被称作「Apple 风」）
**本质**：大留白里，一个词一个词地升起。**不是**：模板化 SaaS 宣传片。

| | |
|---|---|
| 视觉 | 暖白底（如 `#F7F8F6`）；粗无衬线标题（如 Manrope 800，字距 -0.045em），每个标题只有**一个词**换成衬线斜体；真实 UI 截图放白卡片上，圆角 20 |
| 运动 | 文字从遮罩线下**逐词升起**；形状变成下一个东西而不是切镜；一镜到底；spring |
| 适用 | SaaS 发布、产品宣传、功能介绍 |
| 关键词 | mask reveal, morph, one continuous take, kinetic typography ／ 遮罩揭示、形变转场、一镜到底 |
| 禁区 | 淡入、模糊入、交叉溶解；**自己画假 UI** |
| 参考 | [@socialwithaayan 的 LOOK.md 方法](https://x.com/socialwithaayan/status/2104519430814482644)、[@twoclipping](https://x.com/twoclipping/status/2103835273813496100) |

### ⑨ 暗色科技发布会
**本质**：冷灰暗场里的一个发光强调色。**不是**：赛博朋克、霓虹。

| | |
|---|---|
| 视觉 | 冷灰中性阶梯，**只有一个**发光强调色；Inter / JetBrains Mono；1px 边框 + 三层阴影 |
| 运动 | 一切**吸附网格和节拍**；快出缓动带小回弹（overshoot ≈1.3）；退场靠收缩 / 挤压，**从不淡出** |
| 适用 | 开发者工具、AI 产品、技术发布 |
| 关键词 | snap-to-grid, single accent, beat-synced ／ 吸附网格、单一强调色 |
| 禁区 | 多个强调色；正弦漂浮；真实操作系统界面元素（红绿灯按钮、Dock） |
| 参考 | lemo `dark-keynote` |

### ⑩ 瑞士国际主义排版
**本质**：网格、左对齐、一个信号色。**不是**：极简风（极简可以居中，瑞士不行）。

| | |
|---|---|
| 视觉 | 一种字体 + 一个信号色，其余只有纸、墨、浅灰；模块网格；左对齐、右侧不齐 |
| 运动 | **只用两条曲线**：`cubic-bezier(.7,0,.2,1)` 做吸附，linear 画线；不回弹、不淡入；删除元素用一条细线「刀切」 |
| 适用 | 品牌、数据、严肃话题、设计类内容 |
| 关键词 | grid, flush-left, knife cut, clip-reveal ／ 网格、刀切、裁切揭示 |
| 禁区 | 渐变、发光、spring、溶解；lemo 的规范甚至禁用 Helvetica / Akzidenz，改用 Archivo、Inter（规避授权与陈词滥调，此为推测） |
| 参考 | lemo `swiss-motion`；本站[四风格对照](/style/)左上 |

### ⑪ 液态玻璃 / Glass
**本质**：玻璃质感的 UI 或产品。**不是**：2021 年的毛玻璃卡片。

| | |
|---|---|
| 视觉 | 2D UI 版：暖米白画布 + 液态玻璃控件；3D 产品版：折射率约 1.5、开色散 |
| 运动 | 一切都在缓慢运动；只在节拍上切镜 |
| 适用 | 硬件、消费电子、高端产品 |
| 关键词 | liquid glass, refraction, dispersion ／ 液态玻璃、折射、色散 |
| 禁区 | 静止的玻璃（玻璃要靠运动才显出折射）；过度彩虹色散 |
| 参考 | lemo `glass-product`、[@twoclipping](https://x.com/twoclipping/status/2103273003555402193) |

## C. 手工媒介向

### ⑫ 纸拼贴（常被称作「Vox 风」）
**本质**：撕下来的报纸、胶带和网点组成的活海报。**不是**：3D、CGI、写实。

| | |
|---|---|
| 视觉 | 撕纸边、胶带、半调网点、旧报纸剪贴；**每一拍一个纯色底**；大号剪纸标题 |
| 运动 | 两条路线：整张海报一起「活」起来，或切成碎片逐块拼装 |
| 适用 | 新闻评论、社会议题、历史 |
| 关键词 | torn paper, halftone, Ben-Day dots, misregistration ／ 撕纸、网点、错版 |
| 禁区 | 滑向 3D / CGI / 写实 |
| 参考 | [vox-director](https://github.com/Alisa0808/vox-director)（自带 10 个主题预设：瑞士现代、苏联构成主义、中国水墨、报纸社论等） |

### ⑬ 国风水墨（含红色剪纸变体）
**本质**：宣纸上的五个墨阶和留白。**不是**：水彩（不能有彩色晕染）。

| | |
|---|---|
| 视觉 | 焦、浓、重、淡、清五个墨阶 + 一枚朱砂印；程序生成的宣纸纹理；**留白就是空间** |
| 运动 | **人物 12fps、镜头和晕染 24fps**；按笔顺画出，不切出；关键一笔前先静止；转场用墨晕、长卷平移、雾 |
| 适用 | 中国历史、传统文化、节日、诗词 |
| 关键词 | five ink tones, rice paper, vermilion seal, handscroll pan ／ 水墨晕染、留白、朱印、长卷、飞白 |
| 禁区 | 与水彩混用；矢量形状加笔刷贴图；闭合轮廓；彩色晕染 |
| 剪纸变体 | 中国红 `#D2201F`；深度靠相邻纸色不靠阴影；12fps 硬姿态；转场用折纸、翻页 |
| 参考 | lemo `ink-wash` / `papercut-red`；本站[四风格对照](/style/)右下；[腾讯新闻·中秋案例](https://news.qq.com/rain/a/20260926A00WSQ00) |

### ⑭ 水彩 / 笔刷绘画
**本质**：纸是白的，颜料是透明的。**不是**：数字插画加水彩滤镜。

| | |
|---|---|
| 视觉 | 纸本身就是白色，**绝不画纯白**；每景 3–5 色；暗部靠多遍叠加；线条「沸腾」（boil，每秒重新随机 12 次，种子固定） |
| 运动 | 主要动作就是「画进去」；转场用笔刷擦除、翻页；每一处衔接都要有转场 |
| 适用 | 抒情、故事、儿童、旅行 |
| 关键词 | p5.brush, wet bleed, dry-brush, boiling line ／ 水彩、湿画晕染、飞白、线条抖动 |
| 禁区 | 用 p5 原生几何形状；3D 旋转；纯黑或纯白；机械的线性运动 |
| 参考 | [ClaudeAnimationBase 的 ANIMATION_GUIDE](https://github.com/JohnHeibel/ClaudeAnimationBase)、lemo `watercolor` |

### ⑮ Risograph 孔版印刷
**本质**：2–3 个专色叠印，带一点错版。**不是**：数字半调滤镜。

| | |
|---|---|
| 视觉 | 2–3 个专色 + 纸色（如 `#F4EEE2`）；错版偏移**固定**在 ±1–3px；不同色版的网点角度相差 ≥15° |
| 运动 | 人物 12fps、镜头 24fps；转场用叠印生长、滚筒刷过 |
| 适用 | 文化、独立品牌、杂志感内容 |
| 关键词 | risograph, spot color, misregistration, halftone ／ 孔版、专色、错版、叠印 |
| 禁区 | 叠三层网点（发脏）；**每帧抖动错版**；输出时 JPEG 压坏网点（终版用高质量编码） |
| 参考 | lemo `risograph` |

### ⑯ 像素风（16-bit）/ 复古终端
**本质**：固定调色板 + 整像素。**不是**：高清图缩小后加滤镜。

| | |
|---|---|
| 视觉 | 像素：原生 320×180 或 128×96，**最近邻放大**；固定 24–32 色调色板；渐变用 Bayer 抖动 ／ 终端：所有画面由真实字形放在字符网格上组成，单一荧光色（琥珀 / 绿 / 白） |
| 运动 | 精灵 8–12fps，镜头按**整像素**移动；转场用马赛克或调色板切换；不用 alpha 淡入淡出 |
| 适用 | 游戏、怀旧、开发者文化、技术史 |
| 关键词 | indexed palette, nearest-neighbor, dither, character grid ／ 像素、固定色板、抖动、字符网格 |
| 禁区 | 亚像素位置、抗锯齿、`shadowBlur`；先画全彩再量化；用图片加「ASCII 滤镜」冒充终端；黑客代码雨；**现有游戏 IP** |
| 参考 | lemo `pixel-rpg` / `ascii-crt`、[@majidmanzarpour](https://x.com/majidmanzarpour/status/2102476258948927543) |

## 暂无可靠 Opus 规范的风格

- **新粗野主义（Neo-brutalism）**、**VHS 复古失真**：调研中没有找到 Opus 的实际案例或规范。想用的话，按四层框架自己写一份 `LOOK.md`——这正是[练习 4](/style/practice) 的内容。
