# M10 · Blender I：脚本化 3D

<div class="lesson-meta"><span class="tech">技术：bpy 无头脚本、blender-mcp、EEVEE</span><span class="dir">导演：3D 镜头语言</span><span>约 6 小时</span></div>

## 1. 本课目标

- 理解 Claude Code + Opus 5.5 + Blender 的两种协作方式，知道各自什么时候用
- 能用 `templates/blender/scene.py` 渲染出 3D 镜头，并让 Opus 改写它
- 掌握 3D 镜头语言：焦段、推拉、环绕、景深
- 知道 Opus 在 Blender 里擅长什么、不擅长什么
- 产出：一段 10 秒 3D 镜头

## 2. 为什么要加 Blender

纯 HTML/Canvas 擅长图形、文字、图表；**真 3D**——光照、材质、景深、摄影机运动——是 Blender 的主场。B 站「风之谷AI」的星舰科普就是 Blender + Remotion 组合：3D 负责空间感，2D 负责信息（下一课 M11 就做这个）。

本质和网页动画一样：**Opus 写 Python（bpy）代码，Blender 执行并逐帧渲染，ffmpeg 合成。**

下面是模板 `studio/templates/blender/scene.py` 渲染的 4 秒（EEVEE，半分辨率）：

<video controls preload="metadata" poster="/media/m10-earth-poster.jpg" src="/media/m10-earth.mp4" style="width:100%;border-radius:10px;border:1px solid var(--vp-c-divider)"></video>

## 3. 两种工作方式

| | A. 无头脚本 `blender -b -P` | B. MCP 实时控制 |
|---|---|---|
| 怎么做 | Opus 写 `scene.py`，Blender 后台执行并渲染 | Blender 开着，Opus 通过 MCP 发 Python 代码、看截图、继续改 |
| 优点 | 可复现、可版本管理、可批量、不卡界面 | 交互式探索：「这个太红了」「往左挪」，Opus 能看到画面 |
| 缺点 | 看不到实时视口，要渲染出图再看 | 阻塞 Blender 界面；可执行任意 Python，有安全风险 |
| 适合 | **正式出片**、长动画、参数化系列 | **找感觉**、搭场景、调灯光材质 |

推荐组合：**先用 B 探索，满意后让 Opus 把场景固化成 A 的脚本**——就像网页动画先在播放器里拖，再用 render.mjs 出片。

## 4. 起步模板（已实测）

```bash
cd ~/ops_animation/studio
# 渲一帧看看（25% 分辨率，几秒）
blender -b --factory-startup -P templates/blender/scene.py -- --frames 48-48 --res 25 --out out/blender/
# 整段 96 帧（4 秒 @24fps），50% 分辨率
blender -b --factory-startup -P templates/blender/scene.py -- --frames 1-96 --res 50 --out out/blender/
node render/ffmpeg.mjs -framerate 24 -i out/blender/%04d.png -c:v libx264 -pix_fmt yuv420p -movflags +faststart out/blender.mp4
```

| 参数 | 作用 |
|---|---|
| `--frames a-b` | 渲染帧范围（24fps） |
| `--res 25/50/100` | 分辨率百分比（相对 1920×1080） |
| `--engine eevee / workbench / cycles` | 渲染引擎 |
| `--lens 35/50/85` | 焦段（mm） |
| `--move dolly / orbit` | 推镜，或绕地球环绕 |
| `--transparent` | 背景透明（M11 合成用） |
| `--track path.json` | 导出每帧物体的画面坐标（M11 合成用） |
| `--save path.blend` | 另存场景，用 Blender 界面打开检查 |

模板里的原则，和网页动画的 seek(t) 契约一一对应：

| 网页动画 | Blender |
|---|---|
| `seek(t)` 是纯函数 | 所有运动都是**关键帧或驱动器** = 帧号的函数 |
| 禁止 `Math.random` | 用 `random.Random(固定种子)` |
| 从模板复制，不依赖外部状态 | `--factory-startup` + 脚本从零构建场景 |
| 用数据，不用副作用 | 用 `bpy.data` / `obj.location` 数据 API，**不用依赖界面上下文的 `bpy.ops` 做动画** |

模板注释里记着几个实际踩过的坑：
- **颜色发灰**：Blender 默认的 AgX 色彩管理适合写实；动态图形要 `view_transform = "Standard"`
- **自发光过曝**：Standard 下 emission 强度 > 1 会把颜色顶成白色
- **EEVEE 引擎名**：4.2–4.5 叫 `BLENDER_EEVEE_NEXT`，5.x 改回 `BLENDER_EEVEE`（模板两个都试）
- **轨道几何**：倾角和公转要分两层空物体，否则卫星不在自己的轨道环上

## 5. 3D 镜头语言

同一帧、同一个地球，三种焦段 + 一种运镜（`--lens 35 / 50 / 85`，`--move orbit`）：

![焦段对比](/img/m10-lens.png)

左上 35mm、右上 50mm、左下 85mm、右下 50mm 环绕。模板会按焦段自动调整距离，让地球在画面里大小相近——所以差别全在**透视**：35mm 的轨道更「近」、更有纵深；85mm 的空间被压平。

| 术语 | 含义 | 什么时候用 | bpy |
|---|---|---|---|
| 广角 35mm | 透视强、有纵深 | 交代环境、制造冲击 | `cam.data.lens = 35` |
| 标准 50mm | 接近人眼 | 默认 | `cam.data.lens = 50` |
| 长焦 85mm | 空间压缩、背景显大 | 特写、产品、庄重感 | `cam.data.lens = 85` |
| 推 / 拉（dolly） | 摄影机靠近 / 远离主体 | 引导注意力、揭示 | 关键帧 `cam.location` |
| 环绕（orbit） | 摄影机绕主体转 | 展示立体结构、产品转台 | 摄影机挂在旋转的空物体上 |
| 景深 | 主体清晰、前后虚化 | 强调主体 | `cam.data.dof.use_dof` |
| 跟踪 | 摄影机始终对准目标 | 几乎总是开着 | `TRACK_TO` 约束（模板已用） |

## 6. 你的机器 & 升级路径

| | 现在（Intel Mac + RX 560 + Blender 4.5 LTS） | 换 Apple Silicon Mac mini 之后 |
|---|---|---|
| Blender 版本 | 4.5 LTS（Intel Mac 最后一个官方版本，维护到 2027-07） | 可以升级到 5.x |
| Cycles GPU | ❌ 4.3 起 Metal 渲染只支持 Apple Silicon → 只能 CPU | ✅ Metal GPU |
| EEVEE | ✅ 实测 960×540 约 0.5 秒/帧 | ✅ 更快 |
| 官方 Blender MCP 连接器 | ❌ 需要 Blender 5.1+ | ✅ 可用 |
| 社区 blender-mcp | ✅ 支持 Blender 3.0+ | ✅ |
| Homebrew 安装 uv 等工具 | ❌ 不再提供 Intel 预编译包 | ✅ |

## 7. MCP 实时控制

### 社区版 blender-mcp（现在就能用）

仓库：[ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)。安装命令以仓库 README 为准（不同时期出现过 `uvx blender-mcp` 和 `uvx mcp-for-blender` 两种包名），大致流程：

1. 装 `uv`：Homebrew 已不支持 Intel Mac，用 uv 官方安装脚本（见 [docs.astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/)）
2. 按 README 安装 Blender 插件，在 Blender 偏好设置里启用
3. 在 Blender 侧边栏（N 面板）点「Start MCP Server」（默认 localhost:9876）
4. 在 Claude Code 里注册（命令见 README），之后在会话里就能让 Opus 看场景、执行代码、截图

### 官方 Blender 连接器（换机后）

Blender 开发者官方做的 MCP 服务器，需要 Blender 5.1+，可用于 Claude Desktop 和 Claude Code。它内置了完整的 Python API 参考和用户手册。官方说明页：blender.org/lab/mcp-server。

::: danger 安全
MCP 的代码执行工具可以在 Blender 里执行**任意 Python**（读写文件、联网都行）。规则：
- 每次让 Opus 动手前先**保存 .blend**
- 端口只开在 localhost
- 不在装着重要项目的 Blender 会话里做实验
:::

## 8. Opus 在 Blender 里擅长 / 不擅长

| 擅长 ✅ | 不擅长 ⚠️ |
|---|---|
| 搭场景、基础几何、摆放 | 复杂着色器节点链 |
| 简单材质（Principled BSDF） | Geometry Nodes（会写出已废弃的节点） |
| 摄影机运动、关键帧、约束 | 角色绑定、权重绘制、IK |
| 数学化的程序生成（轨道、阵列、数据可视化） | 需要艺术判断的造型 |
| 批量操作、参数化 | 「好看」——这需要你审片 |

判断法则：**能用一段话描述清楚的机械性工作 → 交给 Opus；需要审美判断的 → 你定，或你手动做。**

## 9. Opus 实操

```text
读 CLAUDE.md。以 templates/blender/scene.py 为起点，在 work/<片名>/scene.py 做一个 10 秒（240 帧）3D 镜头：
- 内容：[比如：太阳系的内三颗行星绕日公转；或：一个产品模型的转台]
- 镜头：前 4 秒 85mm 慢推，后 6 秒切 35mm 环绕（写两段关键帧，或两个摄影机按帧切换）
- 保持模板的原则：--factory-startup、只用 bpy.data、所有运动都是关键帧、Standard 色彩管理
- 保留 --frames / --res / --lens / --transparent / --track 参数
先用 --res 25 渲第 1、60、120、180、240 帧，拼成一张图给我看，停下等我。
```

拼图命令（ffmpeg 的 xstack / tile）：

```bash
node render/ffmpeg.mjs -framerate 24 -pattern_type glob -i 'out/<片名>/*.png' -vf "select='not(mod(n\,60))',scale=480:-1,tile=5x1" -frames:v 1 -update 1 out/check/blender-sheet.png
```

## 10. 作业 + 自检

作业目录：`studio/exercises/m10/`

- [ ] 用模板渲出 96 帧并合成 MP4
- [ ] 焦段练习：同一镜头 35 / 50 / 85 各渲一帧，写下每个焦段给你的感觉
- [ ] 10 秒 3D 镜头：至少两种镜头运动
- [ ] 记录 Opus 写的 bpy 代码里被你改掉的地方——它们属于「擅长」还是「不擅长」那一栏？
