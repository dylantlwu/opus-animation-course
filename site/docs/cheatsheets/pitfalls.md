# 踩坑表

| 现象 | 原因 | 解决 |
|---|---|---|
| 拖动时间轴画面会「重新洗牌」 / 渲染出来闪烁 | `Math.random()` 或跨帧状态 | 用 `hash(i)`；跑 `--verify` |
| `--verify` 报「seek 后 0.5s 画面自己变了」 | 代码里有 `requestAnimationFrame` / `setTimeout` / CSS transition | 删掉，所有运动由 seek(t) 计算 |
| 中文显示成方块 | 渲染环境没有中文字体 | macOS 用 `"PingFang SC"`；正式作品把 Noto Sans SC 子集化成 woff2 用 `@font-face` 加载 |
| 第一帧字体不对，后面正常 | 字体还没加载完就截图了 | render.mjs 已等待 `document.fonts.ready`；自定义字体要确保在 `@font-face` 里声明 |
| 被缩放的文字发糊 | CSS `will-change: transform` | 被镜头缩放的元素不要加 `will-change` |
| 运动模糊有「台阶」 | 子帧太少 | `--blur=8` 到 `16` |
| ffmpeg 卡住不退出 | 带字幕 / 音频流时用了 `-shortest` | 用 `-t 时长`（render.mjs 已这么做） |
| 视频在某些播放器打不开 | 像素格式不是 yuv420p 或尺寸是奇数 | render.mjs 已强制 yuv420p 和偶数尺寸 |
| Opus 跳过分镜直接写代码 | 简报里没写流程指令 | 加「先给 G1 分镜，等我批准」；在 CLAUDE.md 加规则 |
| Opus 说「完成了」但画面有问题 | 它没看渲染结果 | 要求它「打开 sheet.png 看了再说」 |
| 改一个地方，别的镜头也变了 | 它顺手「优化」了 | 「只改镜头 X，其他不要动」 |
| 同一会话里自审总是说好 | 它对自己的作品手软 | 开新会话审片 |
| 长片后半段质量下降 | 上下文太长 | 分章节、分会话，用 HANDOFF.md 交接 |
| `brew install ffmpeg` 要编译好几个小时 | Homebrew 自 2026-09 不再给 Intel Mac 提供预编译包 | 用 npm 包 `ffmpeg-static`（studio 已内置）；直接调用用 `node render/ffmpeg.mjs` |
| Blender 渲染颜色发灰 | 默认 AgX 色彩管理 | `scene.view_settings.view_transform = "Standard"` |
| Blender Cycles 找不到 GPU | Intel Mac + AMD：4.3 起 Cycles Metal 只支持 Apple Silicon | 动画用 EEVEE；Cycles 用 CPU 只出静帧 |
| 官方 Blender MCP 装不上 | 需要 Blender 5.1+，而 5.x 不支持 Intel Mac | 用社区版 blender-mcp |
| `bpy.ops` 在后台脚本里报 context 错误 | 操作符依赖界面上下文 | 用 `bpy.data` 数据 API |
| 额度烧得飞快 | 每次小改都用 xhigh / max；反复整片重渲让模型看 | 小改用 medium；contact sheet 代替整片；渲染是本地的，不花额度 |
