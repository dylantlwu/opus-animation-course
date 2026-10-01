# M10 · Blender I：脚本化 3D

<div class="lesson-meta"><span class="tech">技术：bpy 无头脚本、blender-mcp、EEVEE</span><span class="dir">导演：3D 镜头语言</span><span>🚧 正文建设中，本页是路线总览 + 已验证的起步模板</span></div>

## 为什么要加 Blender

纯 HTML/Canvas 擅长图形、文字、图表，但「真 3D」——光照、材质、景深、摄影机运动——是 Blender 的主场。B 站「风之谷AI」的星舰科普就是 **Blender + Remotion** 组合：3D 负责空间感，2D 负责信息。

**Claude Code + Opus 5.5 + Blender 的本质和网页动画一样**：Opus 写代码（Python / `bpy`），Blender 执行代码、逐帧渲染，ffmpeg 合成。

## 两种工作方式

| | A. 无头脚本 `blender -b -P` | B. MCP 实时控制 |
|---|---|---|
| 怎么做 | Opus 写 `scene.py`，Blender 后台执行并渲染 | Blender 开着，Opus 通过 MCP 插件发 Python 代码、看截图、继续改 |
| 优点 | 可复现、可版本管理、可批量、不卡界面 | 交互式探索：「这个太红了」「把它往左挪」，Opus 能看到画面 |
| 缺点 | 看不到实时视口，要渲出图再看 | 阻塞 Blender 界面线程；可执行任意 Python，有安全风险 |
| 适合 | **正式出片**、长动画、参数化系列 | **找感觉（look dev）**、搭场景、调灯光材质 |

推荐组合：**先用 B 探索，满意后让 Opus 把场景固化成 A 的脚本**——就像网页动画里先在播放器里拖着看，再用 render.mjs 出片。

## ⚠️ 你这台机器的约束（已实测）

| 项目 | 情况 | 影响 |
|---|---|---|
| Blender 版本 | 4.5.13 LTS | **4.5 是 Intel Mac 最后一个官方版本**（维护到 2027-07）。5.x 只支持 Apple Silicon，不要升级 |
| 官方 Blender MCP 连接器 | 需要 Blender 5.1+ | **你用不了**。改用社区版 blender-mcp（支持 3.0+） |
| Cycles GPU | Blender 4.3 起 Metal 渲染只支持 Apple Silicon | Cycles 只能用 **CPU**（i7-12700 20 线程，出静帧可以，出动画慢） |
| EEVEE | RX 560 4GB，Metal | **动画首选**。实测 960×540、32 采样 ≈ 0.5 秒/帧 |
| Workbench | 极快 | 构图 / 运动预览 |

## 起步模板（已在你的机器上验证）

`studio/templates/blender/scene.py`：地球 + 4 颗倾斜轨道上的卫星 + 50mm 缓慢推镜，4 秒。

```bash
cd ~/ops_animation/studio
# 渲一帧看看（25% 分辨率，几秒钟）
blender -b --factory-startup -P templates/blender/scene.py -- --frames 48-48 --res 25 --out out/blender/
# 整段 96 帧，50% 分辨率
blender -b --factory-startup -P templates/blender/scene.py -- --frames 1-96 --res 50 --out out/blender/
node render/ffmpeg.mjs -framerate 24 -i out/blender/%04d.png -c:v libx264 -pix_fmt yuv420p out/blender.mp4
# 想在界面里打开检查：加 --save out/scene.blend
```

模板里的几条原则，和网页动画的 `seek(t)` 契约一一对应：

| 网页动画 | Blender |
|---|---|
| `seek(t)` 是纯函数 | 所有运动都是**关键帧或驱动器** = 帧号的函数 |
| 禁止 `Math.random` | 用 `random.Random(固定种子)` |
| 从模板复制，不依赖外部状态 | `--factory-startup` + 脚本从零构建场景 |
| 用数据，不用副作用 | 用 `bpy.data` / `obj.location` 数据 API，**不用依赖界面上下文的 `bpy.ops` 做动画** |

两个踩过的坑（已写进模板注释）：
- **颜色发灰**：Blender 默认的 AgX 色彩管理适合写实；动态图形要 `view_transform = "Standard"`，色板才原样输出
- **EEVEE 引擎名**：4.2–4.5 叫 `BLENDER_EEVEE_NEXT`，5.x 改回 `BLENDER_EEVEE`

## MCP 实时控制（社区版 blender-mcp）

仓库：[ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)。安装命令以仓库 README 为准（不同时期出现过 `uvx blender-mcp` 和 `uvx mcp-for-blender` 两种包名），大致流程：

1. 装 `uv`：Homebrew 已不支持 Intel Mac，用 uv 官方安装脚本（见 [astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/)）
2. 按 README 安装 Blender 插件，在 Blender 偏好设置里启用
3. 在 Blender 侧边栏（N 面板）点「Start MCP Server」（默认 localhost:9876）
4. 在 Claude Code 里注册：`claude mcp add blender ...`（命令见 README）

::: danger 安全
`execute_blender_code` 工具可以在 Blender 里执行**任意 Python**（读写文件、联网都行）。规则：
- 每次让 Opus 动手前先**保存 .blend**
- 端口只开在 localhost，不要暴露到网络
- 不在装着重要项目的 Blender 会话里做实验
:::

## Opus 在 Blender 里擅长 / 不擅长

| 擅长 ✅ | 不擅长 ⚠️ |
|---|---|
| 搭场景、基础几何、摆放 | 复杂着色器节点链 |
| 简单材质（Principled BSDF） | Geometry Nodes（会写出已废弃的节点） |
| 摄影机运动、关键帧、约束 | 角色绑定、权重绘制、IK |
| 数学化的程序生成（轨道、阵列、数据可视化） | 需要艺术判断的造型 |
| 批量操作 | 「好看」——这需要你审片 |

判断法则：**能用一段话描述清楚的机械性工作 → 交给 Opus；需要审美判断的 → 你来定，或者你手动做。**

## 3D 镜头语言（本课导演训练的主题）

| 术语 | 含义 | 在 bpy 里 |
|---|---|---|
| 焦段 | 35mm 广、50mm 自然、85mm 压缩感 | `cam.data.lens` |
| 推 / 拉（dolly in/out） | 摄影机向主体移动 | 关键帧 `cam.location` |
| 环绕（orbit） | 摄影机绕主体转 | 摄影机挂在旋转的空物体上 |
| 景深 | 主体清晰、前后虚化 | `cam.data.dof.use_dof` |
| 跟踪 | 摄影机始终对准目标 | `TRACK_TO` 约束（模板已用） |

## 后续计划

- **M10 正文**：从模板出发，让 Opus 按闸门做一个 10 秒 3D 镜头；MCP 实操；3D 镜头语言训练
- **M11**：Blender 渲染层 + HTML 文字层合成，同一份 `timeline.json` 同时驱动两边
