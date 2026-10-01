# M0 作业 · 心智模型与环境

课程页：网站 → M0 心智模型与环境

## 环境

```bash
cd ~/ops_animation/studio && npm install    # 含 ffmpeg-static
node render/ffmpeg.mjs -version | head -1
```

## 第一支片子（不需要 AI）

```bash
node render/render.mjs templates/canvas/index.html --verify
node render/render.mjs templates/canvas/index.html --sheet=0.3,1,1.8,2.6,3.2,5.5 --cols=3
node render/render.mjs templates/canvas/index.html --clip --out=out/hello.mp4
```

## 第一次和 Opus 合作

```bash
cd ~/ops_animation/studio
claude --model opus --effort xhigh
```

把课程页 4.4 节的提示词发给它，走完 G0–G3。记录：

- 它在哪个闸门停下来等你了？哪个闸门它跳过了？
- 你第一次给的修改意见原话是什么？它理解对了吗？

## 看片笔记（5 支爆款，写进 notes.md）

| 作品 | 一句话（≤20 字） | 第一眼看哪 | 最爽瞬间（秒 + 原因） | 节奏问题（具体到秒） |
|---|---|---|---|---|
| | | | | |
