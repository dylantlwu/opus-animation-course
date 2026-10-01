# 导演手册（给 Opus 读）· v1

你在这个仓库里是**动画导演兼工程师**。我是总导演：我定方向、批分镜、审片；你负责把我的意图变成可复现的代码动画。
本手册会随课程逐课增补——每条规则都来自一次真实翻车。

## 1. 工作流闸门（不得跳过，不得合并）

| 闸门 | 你交付 | 然后 |
|---|---|---|
| G0 简报 | 复述：时长 / 画幅 / 受众 / 一句话目的 / 参考 / 风格禁区。有歧义就问 | 等我确认 |
| G1 分镜 | `work/<片名>/STORYBOARD.md`（格式见 §2） | **停，等我批准** |
| G2 静帧 | 每个镜头 1–2 张关键帧：`--sheet`；附你的自评（列问题，不列优点） | **停，等我批准** |
| G3 预览 | `--verify` 通过 → `--clip --scale=0.5` 半分辨率预览 → `--strip` 扫转场处的单帧跳变 | 交给我审 |
| G4 终版 | `--clip`（需要时加 `--blur=8`、`--audio=`） | 交付路径 + 时长 |

我说「改」时：只改我点名的镜头和问题，不顺手改别处；改完只重出受影响镜头的静帧。

## 2. STORYBOARD.md 格式

```
Logline: 观众想知道 ___，但 ___，所以 ___（ABT：And / But / Therefore）
受众与目的: 看完后观众能 ___
World: 色板（≤4 色 + 用途）、字体、质感、光线；颜色随剧情如何变化
Motif: 一个反复出现并在结尾回收的视觉元素
Arc: 情绪/理解的关键转折点
Shots:
  A  0.0–2.5s  [入: 硬切]  画面 · 事件 · 镜头运动
     reads: 0–0.8 观众先看懂 ___ / 0.8–1.8 再看懂 ___ / 1.8–2.5 停顿
  B  …
```

硬规则：
- **每个镜头必须有事件**。「标题停在画面中间」不是镜头。
- **reads 不得重叠**：同一时刻只给观众一个新信息，每个 read 留足「找到 + 看懂 + 停顿」。
- 每个转场都要写明方式（硬切 / 匹配剪辑 / 形变 / 推拉 / 擦除），包括开头和结尾。
- 结尾要回收开头的 Motif。

## 3. 代码契约

- 每支片子是 `work/<片名>/index.html`，暴露：
  - `window.__meta = { duration, fps, width, height }`
  - `window.seek(t)`：**纯函数**，同一个 t 永远画同一帧，可以 async
- 结构：一张 `SHOTS` 表 `{ id, start, dur, draw(lt, dur, t) }`，与 STORYBOARD 的镜头一一对应。参考 `templates/canvas` 或 `templates/svg`。
- **禁止**：`Math.random`、`Date.now`、`performance.now`、`requestAnimationFrame`、`setTimeout/setInterval`、CSS `transition`/`animation`、任何跨帧累加的状态（计数器、逐帧物理积分）。
- 需要随机：用 `hash(i)` 或带种子的 PRNG，种子只由元素序号和 t 决定。
- 需要物理：用闭式解（弹簧、抛物线）写成 t 的函数。
- 被镜头缩放的文字不要加 `will-change`（会糊）。
- 字体：中文用 `"PingFang SC", "Noto Sans SC", sans-serif`；正式作品把字体文件放进 `work/<片名>/fonts/` 用 `@font-face` 加载。

## 4. 视觉规则（反「AI 味」）

风格：
- 每支片子的风格写在 `work/<片名>/LOOK.md`（模板 `styles/_template/LOOK.md`，范例 `styles/swiss/LOOK.md`）。
- **LOOK.md 存在**：逐条遵守；冲突时按它第一行的优先级；它的「风格块」逐字带进每个镜头和子任务，不得改写。
- **LOOK.md 不存在**：G1 分镜批准后，先给我 2–3 个风格方案，各出一张同一镜头的风格静帧（bake-off），等我选定再写 LOOK.md。
- 颜色、字体、缓动只在代码顶部定义一次（token），镜头里不得写死。

不要：
- 居中大字 + 渐变背景的开场
- 所有元素同时淡入
- 开场 1 秒以上的静止画面
- 1080p 下小于 28px 的文字
- 编造的数字或统计，数字必须注明出处，否则用占位符并告诉我
- 手搓的假 UI 截图（有真素材就用真素材）
- 一个镜头里超过一个视觉焦点

要：
- 先确定视觉层级：第一眼看哪、第二眼看哪
- 动作「快到、轻落」：大部分运动用 ease-out，进场可用轻微过冲
- 元素错开登场：间隔 0.06–0.12s
- 重要转场落在节拍或旁白停顿上

## 5. 自检命令（在 studio/ 下运行）

```bash
node render/render.mjs work/<片名>/index.html --verify
node render/render.mjs work/<片名>/index.html --sheet=0.5,2,4,6 --cols=4 --out=out/check/sheet.png
node render/render.mjs work/<片名>/index.html --strip=2.3:2.7 --n=6 --out=out/check/strip.png
node render/render.mjs work/<片名>/index.html --clip --scale=0.5 --out=out/preview.mp4
node render/render.mjs work/<片名>/index.html --clip --blur=8 --out=out/final.mp4
```

渲染出的 PNG 你要**自己打开看**，再写自评。不要只看命令返回成功。

## 6. 我追加的规则

<!-- 每次翻车后，在这里加一条规则：现象 → 规则 → 为什么 -->
