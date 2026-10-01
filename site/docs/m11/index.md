# M11 · Blender II：3D × 2D 合成

<div class="lesson-meta"><span class="tech">技术：透明渲染、track.json、分层合成</span><span class="dir">导演：3D 负责空间，2D 负责信息</span><span>约 6 小时</span></div>

## 1. 本课目标

- 理解分层合成：背景层、3D 层、信息层，各管各的
- 会让 Blender 导出 `track.json`：每一帧、每个物体在画面上的像素坐标
- 用 seek(t) 把 Blender 的帧序列和 HTML 信息层合成到同一个时钟下
- 统一 2D 与 3D 的风格
- 产出：一段 3D 科普或宣传段落，接进 M7 / M9 的作品

## 2. 示例：标签跟着 3D 物体走

<video controls preload="metadata" poster="/media/m11-overlay-poster.jpg" src="/media/m11-overlay.mp4" style="width:100%;border-radius:10px;border:1px solid var(--vp-c-divider)"></video>

地球、卫星、轨道、光影来自 Blender；「卫星 1–4」「你」的标签和蓝色测距线是 HTML 画的。卫星转动时标签一直贴着它；卫星转到地球背后时，标签自动隐藏。

源码：`studio/examples/blender-overlay/index.html`

## 3. 原理

### 3.1 三层，一个时钟

```
① 2D 背景       seek(t) 里画：纯色 / 渐变 / 网格
② 3D 帧         Blender 渲染的透明 PNG 序列：frames[floor(t × 24)]
③ 2D 信息层     seek(t) 里画：标签、测距线、标题——位置查 track.json
```

为什么不在 Blender 里直接做文字？
- 中文排版、字体、动态字体效果，HTML 强得多
- 改一个标签的文案，不用重渲 3D
- 信息层可以按 reads 节奏出现，和 3D 的运动解耦

### 3.2 track.json：让 2D 知道 3D 在哪

关键问题：卫星在 3D 里转，2D 标签怎么知道每一帧该画在哪？
**不要在 2D 里猜**——让 Blender 算：`world_to_camera_view` 把 3D 坐标投影成画面坐标，每帧导出一次。

```bash
cd ~/ops_animation/studio
blender -b --factory-startup -P templates/blender/scene.py -- \
  --frames 1-96 --res 50 --transparent --track out/blender-track/track.json --out out/blender-track/
```

`track.json` 长这样（像素坐标，1920×1080，左上角原点；第三个数是到相机的距离）：

```json
{ "fps": 24, "frame_start": 1, "frame_end": 96,
  "frames": { "48": { "Receiver": [1045.0, 503.5, 9.98], "Sat0": [1390.6, 407.3, 11.84],
                      "Earth": [960.0, 540.0, 10.92, 244.2] } } }
```

`Earth` 多一个数：地球在画面上的半径（像素）。有了它，2D 层就能判断遮挡：

```js
// 卫星在地球「后面」（距离更远）且投影落在地球圆盘内 → 被挡住，不贴标签
const hidden = (p, e) => p[2] > e[2] && Math.hypot(p[0] - e[0], p[1] - e[1]) < e[3];
```

### 3.3 在 seek(t) 里合成

```js
const TR = await fetch(BASE + 'track.json').then((r) => r.json());
const frames = await Promise.all(/* 预加载全部 PNG */);
window.__meta = { duration: N / TR.fps, fps: TR.fps, width: 1920, height: 1080 };
window.seek = (t) => {
  const i = Math.floor(t * TR.fps), P = TR.frames[F0 + i];
  drawBackground();                         // ①
  ctx.drawImage(frames[i], 0, 0, W, H);     // ②
  drawLabels(P, t);                         // ③ 位置来自 P，出现时机来自 t（reads）
};
```

注意：
- **帧率跟着 3D 走**：`__meta.fps = 24`，和 Blender 一致，一帧对一帧
- **预加载**：所有 PNG 加载完才暴露 `__meta`，渲染器会等它；缺帧时报出具体文件名
- **半分辨率素材**：3D 用 50% 渲染（快 4 倍），合成时放大到 1080p；文字层是全分辨率，所以字依然清晰

### 3.4 风格统一

2D 和 3D 放在一起最常见的问题是「看起来像两支片子」：

| 维度 | 统一方法 |
|---|---|
| 颜色 | 3D 材质颜色和 2D 色板用同一份 token；Blender 用 Standard 色彩管理 |
| 光照方向 | 2D 的投影 / 高光方向和 3D 主光一致 |
| 线条 | 3D 的轨道线粗细和 2D 测距线相近 |
| 运动性格 | 3D 摄影机的缓动和 2D 元素的缓动是同一族 |
| 背景 | 3D 透明渲染，背景统一由 2D 画 |

## 4. 也可以反过来：3D 数据可视化

`track.json` 的思路还能反用：把数据（比如人口、温度）写成 JSON，让 bpy 脚本读取并生成 3D 柱状图 / 地球上的点，再由 2D 层加标题和图例。同一份数据驱动两层——数字只有一个来源。

## 5. Opus 实操

```text
读 CLAUDE.md、work/<片名>/LOOK.md。
work/<片名>/scene.py（M10 做的）加上 --transparent 和 --track，导出这些物体的画面坐标：[物体名列表]。
然后参考 studio/examples/blender-overlay/index.html 做 work/<片名>/composite.html：
- 背景、3D 帧、信息层三层；fps 跟 Blender 一致
- 标签按 STORYBOARD 的 reads 依次出现；被遮挡时隐藏
- 颜色只用 LOOK.md 的 token
先用 --res 25 出素材，--sheet 4 个时间点给我看，停下等我。
```

## 6. 作业 + 自检

作业目录：`studio/exercises/m11/`

- [ ] 跑通示例：渲染 `out/blender-track/` 素材，再 `render.mjs examples/blender-overlay/index.html --clip`
- [ ] 你自己的合成段落：至少 3 个跟随 3D 物体的标签，有遮挡处理
- [ ] 风格统一检查表：五个维度各写一句你怎么做的
- [ ] 把这段接进 M7 或 M9 的作品
