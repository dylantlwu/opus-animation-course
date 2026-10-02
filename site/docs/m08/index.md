# M8 · 动态图形 & Remotion

<div class="lesson-meta"><span class="dir">导演：宣传片结构、节拍剪辑</span><span class="tech">技术：动态字体排版、框架横评、Remotion 起步</span><span>约 6 小时</span></div>

## 1. 本课目标

- 掌握宣传片的四段结构和时间规则
- 会做动态字体排版（kinetic typography）：遮罩升起、逐词卡拍、单词强调
- 知道什么时候值得从纯 HTML 换到 Remotion / HyperFrames，并能跑通 Remotion
- 产出：一支 15 秒 showreel——用你自己的简报，**不用**那句爆款提示词

## 2. 原理

### 2.1 宣传片的四段结构

| 段落 | 15 秒片里的位置 | 任务 |
|---|---|---|
| ① 痛点 / 钩子 | 0–2 秒 | 一句让目标用户点头的话。**前 2 秒必须有强钩子** |
| ② 转折 / 产品 | 2–6 秒 | 产品出场：一个形状变成产品，而不是 logo 淡入 |
| ③ 卖点 | 6–12 秒 | **最多 3 个**，每个一拍或一小节 |
| ④ CTA | 12–15 秒 | 一句话 + 一个动作（按钮 / 网址），停住 |

时间规则（来自社区实践）：静止画面不超过 0.4 秒；结尾留一个「logo 时刻」；剪辑点落在小节线上。

### 2.2 动态字体排版

下面是一支 8 秒的虚构产品宣传片，120 BPM，**每个词都落在拍点上**（打开节拍网格看）：

<AnimDemo src="/demos/m08-kinetic.html?beats=1" caption="痛点 → 转折 → 产品 → 卖点 → CTA。底部是节拍网格：粗线是强拍，蓝线是播放头" :poster="3.3" />

用到的技法：

| 技法 | 做法 | 用在 |
|---|---|---|
| 遮罩升起 | 每个词在一条看不见的线下面，从下往上升出来 | 标题、关键句（风格卡 ⑧ 的签名动作） |
| 逐词卡拍 | 第 n 个词在第 n 拍出现：`B(n) = n × 60 / BPM` | 所有文字节奏 |
| 单词强调 | 一句话里只有一个词换成衬线斜体 + 强调色 | 「想清楚」「再开拍」 |
| 形变出场 | 一个点用弹簧长成产品卡片 | 产品首次出现 |
| 收进遮罩 | 出场 = 文字向上收回遮罩线，不淡出 | 段落之间 |

代码上最关键的一行：所有时间都从节拍派生，换配乐只改 `BPM`。

```js
const BPM = 120, BEAT = 60 / BPM, B = (n) => n * BEAT;
rise([{ s: '是', at: 4 }, { s: '想清楚', at: 5, serif: true }, { s: '每个镜头。', at: 6 }], x, y, 128, t);
```

### 2.3 框架横评：什么时候离开纯 HTML

| 方案 | 心智模型 | 适合 | 代价 |
|---|---|---|---|
| **纯 HTML + seek(t)**（本课主线） | 一个函数画一帧 | 风格自由、单支作品、科普 | 时间轴、素材管理都要自己写 |
| **Remotion** | React 组件 + `useCurrentFrame()` | 模板化、系列化（一个模板出 100 支）、数据驱动、团队协作 | 要会 React；**4 人及以上团队需要商业授权** |
| **HyperFrames**（HeyGen） | HTML + `data-start` 属性 + GSAP 时间线 | 对 agent 友好，Apache-2.0 | 社区反馈「有时太有创意」 |
| **Manim** | Python 数学对象 | 公式、几何、算法 | 依赖重；字幕和 UI 常需另合成 |

**判断规则**：同一个版式要出很多支（每周一支产品更新、每个客户一支）→ Remotion；只做一支、风格要独特 → 纯 HTML。M9 的宣传片项目两种都可以。

### 2.4 Remotion 起步（本机实测）

```bash
# 1. 创建项目（实测：Remotion 4.0.531）
npx create-video@latest --yes --blank --no-tailwind my-video
cd my-video && npm i

# 2. 给 Claude Code 装 Remotion 官方技能包（来自 remotion-dev/skills）
npx remotion skills add

# 3. 预览与渲染
npm run dev                                      # Remotion Studio，可拖时间轴
npx remotion still MyComp out/still.png --frame=0   # 渲染单帧（首次会自动下载无头 Chrome）
npx remotion render                              # 渲染整片

# 4. 和 Opus 一起做
claude --model claude-opus-5-5 --effort xhigh
```

实测记录：创建项目约 1 分钟；`npm i` 后第一次渲染会下载 Remotion 自己的 Headless Shell；渲染一帧约 3 秒。创建时 Remotion 自己会提示：「Remotion is free for teams of up to 3」——商用前看一眼 [remotion.pro/license](https://www.remotion.pro/license)。

Remotion 和本课 seek(t) 契约的对应关系：

| 本课 | Remotion |
|---|---|
| `window.__meta = { duration, fps, width, height }` | `<Composition durationInFrames fps width height>` |
| `seek(t)` | 组件里 `const frame = useCurrentFrame()` |
| `range(t, a, b)` + 缓动 | `interpolate(frame, [a, b], [0, 1], { easing })` |
| 闭式弹簧 | `spring({ frame, fps })` |
| 镜头表 `SHOTS` | `<Sequence from={...} durationInFrames={...}>` |
| `render.mjs --clip` | `npx remotion render` |

**确定性规则完全一样**：Remotion 也要求组件只依赖 `frame`，不能用 `Math.random()`（它提供 `random(seed)`）。

## 3. 拆爆款

- **15 秒 showreel**（[@stephanlivera](https://x.com/stephanlivera/status/2103315922098470926)）：7 个剪辑点全在 128 BPM 小节线上，一个红点贯穿全片。好在节奏，弱在内容——它没有在卖任何东西
- **乔布斯生平**（[@oozn](https://x.com/oozn/status/2103482545111232946)）：Remotion，23 个转场锁 120 BPM。长片用框架的好处：组件可复用
- **CodePilot 宣传片**（歸藏，[skill 开源](https://github.com/op7418/guizang-product-video-skill)）：读真实代码库、复用真实组件——「永远不要编造一个界面」

## 4. Opus 实操

用宣传片结构写简报，而不是「go all out」：

```text
读 CLAUDE.md。做一支 15 秒宣传片，产品：[你的产品 / 项目，一句话说它解决什么]。
受众：[谁]；他们现在的痛点：[一句话]。
结构：0–2s 痛点（逐词卡拍）/ 2–6s 产品出场（一个形状长成产品，不用 logo 淡入）/
6–12s 三个卖点（每个一小节）/ 12–15s CTA：[网址或动作]。
120 BPM，所有事件落在拍点，代码里用 B(n) 表示第 n 拍。
风格：风格卡 ⑧（浅色极简 + 动态字体），每段只有一个词用衬线斜体。
UI 只能用 assets/ 里的真实截图，不许自己画界面。
先给 G1 分镜（标出每个事件在第几拍），等我批准。
```

## 5. 导演训练

1. **数拍子**：拿一支你喜欢的宣传片，用节拍器 App 找出 BPM，标出每个剪辑点落在第几拍。有多少落在强拍上？
2. **一词强调**：给你的产品写 5 句 slogan，每句只允许强调一个词。哪个词？为什么？
3. **砍卖点**：列出产品的所有卖点，砍到 3 个。砍掉的理由写下来

## 6. 作业 + 自检

作业目录：`studio/exercises/m08/`

- [ ] 15 秒 showreel：四段结构，所有事件在拍点上（`?beats=1` 式的节拍网格自检）
- [ ] 至少 3 种动态字体技法
- [ ] 跑通 Remotion：`create-video` → `still` 渲染出一帧
- [ ] 写一段：你的下一个项目该用纯 HTML 还是 Remotion，为什么
