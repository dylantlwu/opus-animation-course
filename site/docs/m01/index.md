# M1 · 时间即函数

<div class="lesson-meta"><span class="tech">技术：seek(t)、缓动、hash、运动模糊</span><span class="dir">导演：动画原理</span><span>约 6 小时</span></div>

## 1. 本课目标

- 能写出 / 读懂一个合格的 `seek(t)`：镜头表、局部时间、纯函数
- 掌握 5 条缓动曲线，知道什么场合用哪条
- 理解预备、过冲、错开三个动画原理，并能用**精确的语言**向 Opus 描述运动
- 亲手写一个缓动函数，并让它通过性质测试
- 会用子帧运动模糊

## 2. 原理

### 2.1 契约

```js
window.__meta = { duration: 6, fps: 30, width: 1920, height: 1080 };
window.seek = (t) => { /* 只根据 t 把整帧画出来 */ };
```

**禁止**：`Math.random`、`Date.now`、`requestAnimationFrame`、`setTimeout`、CSS `transition` / `animation`、任何「上一帧留下来的状态」。

为什么？下面这个反例左半边违反了契约。**拖动时间轴、来回逐帧**，看左右两边的区别：

<AnimDemo src="/demos/m01-random.html" caption="左：Math.random + 跨帧累加；右：hash(i) + t 的函数" :poster="1.5" />

左边的星星每次都重新洗牌，小球的位置取决于「你拖了多少次」而不是 t。放到渲染器里，就是闪烁、抖动、并行渲染时各段对不上。

需要随机感时，用**由序号决定的伪随机**：

```js
const hash = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
// 第 i 颗星的位置永远是 (hash(i) * W, hash(i + 99) * H)
```

### 2.2 镜头表

模板里的 `SHOTS` 和分镜里的 Shots 一一对应：

```js
const SHOTS = [
  { id: 'A', start: 0,   dur: 2.5, draw: shotA },
  { id: 'B', start: 2.5, dur: 3.5, draw: shotB },
];
window.seek = (t) => {
  const s = SHOTS.findLast((s) => t >= s.start) ?? SHOTS[0];
  s.draw(t - s.start, s.dur, t);   // lt = 镜头内时间
};
```

每个镜头只关心自己的 `lt`（从 0 开始）。好处：改某个镜头的时长或顺序，不会牵连其他镜头的内部时间。

最常用的工具函数是 `range`——把一段时间映射成 0→1 的进度：

```js
const range = (t, a, b) => clamp((t - a) / (b - a));
const k = ease.outExpo(range(lt, 0.2, 1.2));  // 0.2s 开始，1.2s 结束，快到轻落
x = lerp(from, to, k);
```

**「什么时候动」交给 range，「怎么动」交给缓动函数**——分开思考，分开描述。

### 2.3 缓动：时间怎么流

<AnimDemo src="/demos/m01-easing.html" caption="五条曲线，同样的起点终点和时长。右侧小图是曲线本身" :poster="1.0" />

| 曲线 | 感觉 | 用在 |
|---|---|---|
| linear | 机械、没有重量 | 几乎不用；匀速滚动的背景、进度条 |
| inOutCubic | 稳妥、电影感 | 镜头推拉、大块面的位移 |
| outExpo | **快到、轻落** | UI 和文字进场的首选 |
| outBack | 冲过头再回来，有弹性 | 强调、按钮、图标弹出（幅度要克制） |
| spring | 物理感、会晃 | 有「重量」的物体落定 |

注意 spring 用的是**闭式解**（直接写成 t 的公式），而不是逐帧积分速度和位置——后者违反契约。

### 2.4 三个让动画「活」起来的原理

<AnimDemo src="/demos/m01-principles.html" caption="左边机械，右边有生命。用 0.25× 速度和逐帧按钮仔细看差别" :poster="0.65" />

| 原理 | 做法 | 向 Opus 描述时这样说 |
|---|---|---|
| 预备 anticipation | 先往反方向蓄力（压扁/后撤），再出发 | 「出发前 0.3s 先后撤 40px 并压扁 15%」 |
| 过冲 overshoot | 冲过目标再回落 | 「outBack 进场，过冲约 8%」 |
| 错开 stagger | 一组元素依次出现，而不是同时 | 「6 根柱子依次出现，每根晚 80ms」 |

**精确描述**是这门课反复训练的能力。「弹一点」「更有活力」这类话，Opus 只能猜；「过冲 8%、错开 80ms」它一次就能做对。

### 2.5 子帧运动模糊

真实摄像机曝光时，快速运动的物体会拖出模糊。代码动画默认每一帧都是「瞬间」，快速运动看起来会一卡一卡的。

因为画面是 t 的纯函数，我们可以在一帧的曝光时间里**多采几个时刻再平均**：

```bash
node render/render.mjs work/xxx/index.html --clip --blur=8          # 每帧 8 个子帧，180° 快门
node render/render.mjs work/xxx/index.html --clip --blur=8 --shutter=1   # 360° 快门，模糊更长
```

- 4 个子帧在快速运动时还能看出「台阶」，社区建议 **8–16**
- 渲染时间 × 子帧数，所以**只在终版开**
- 被镜头缩放的文字不要加 CSS `will-change`，会糊

## 3. 拆爆款：UI 形变循环

[@twoclipping](https://x.com/twoclipping/status/2103273003555402193) 的 UI 形变循环约 100 万播放，技术上值得学的三点：

1. **一个形状，从不切镜**：所有状态都是同一个元素在改变大小、圆角、颜色——观众的眼睛不用重新找焦点
2. **闭式弹簧**：所有回弹都是 t 的公式，配合 120 BPM 卡点
3. **子帧运动模糊**：Playwright 每帧采 4 个子帧，ffmpeg `tmix` 合成——正是我们 `--blur` 的做法

## 4. Opus 实操

练习用精确的运动语言下单。在 `studio/` 里启动 `claude --model claude-opus-5-5 --effort xhigh`：

```text
读 CLAUDE.md。在 work/m01-logo/ 做一支 4 秒的 logo 揭示，1920×1080，30fps。
- 画面：一个圆角方块（我的 logo 占位）和下方的文字「OPS STUDIO」
- 0.0–0.3s：空场，只有背景
- 0.3–0.9s：方块 outBack 进场，从 0 缩放到 1，过冲约 8%
- 0.9–1.6s：文字逐字母出现，每个字母晚 50ms，outExpo，从下方 30px 升起
- 1.6–4.0s：保持，方块有极轻微的呼吸（缩放 ±1%，周期 2s）
- 禁止渐变背景，禁止同时淡入
先给我 G1 分镜，等我批准。
```

批准后检查：
- 让它跑 `--verify`，确认通过
- 让它出 `--strip=0.25:1.0 --n=8`，看进场的每一帧有没有跳变
- 对比 `--clip` 和 `--clip --blur=8` 两个版本

## 5. 导演训练：逐帧拉片

用本页的播放器（⏮ ⏭ 按钮 + 0.25× 速度），对 2.4 节的「有生命」那一列做逐帧记录：

| 元素 | 开始帧 | 结束帧 | 缓动（你的判断） | 过冲 / 预备 |
|---|---|---|---|---|
| 橙色方块（行 ①） | | | | |
| 橙色方块（行 ②） | | | | |
| 柱子 1 / 柱子 6 | | | | |

然后找一个你喜欢的 App 转场动画（手机录屏），用同样的表格拆一遍。

## 6. 作业 + 自检

作业目录：`studio/exercises/m01/`，详见其中的 `README.md`。核心任务：**自己实现一个缓动函数**（`motion.js` 里的 `arrive`），通过 `node check.mjs` 的性质测试。

- [ ] `node render/render.mjs ../site/docs/public/demos/m01-random.html --verify` 看到报错，并能解释每条报错的原因
- [ ] `arrive()` 通过 `node exercises/m01/check.mjs`
- [ ] `work/m01-logo/` 通过 `--verify`，`--strip` 无单帧跳变
- [ ] 有 / 无 `--blur=8` 两个版本对比过，能说出差别
- [ ] 逐帧拉片表填完
- [ ] `CLAUDE.md` 第 6 节新增至少 1 条规则
