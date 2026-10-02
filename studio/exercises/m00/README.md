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

## 找茬

`out/hello.mp4` 里藏着一个穿帮。找到之后回答：

1. 第几秒？
2. 是什么东西露了馅？
3. 它向观众泄露了什么？
4. 两种修法，以及它们给观众的不同感觉：

> 我的回答：

## 我写给 Opus 的修改意见

> 镜头 __（__–__ 秒）：
> 期望：

## 第一次和 Opus 合作

```bash
cd ~/ops_animation/studio
claude --model claude-opus-5-5 --effort xhigh
```

把课程页 4.4 节的提示词发给它，走完 G0–G3。记录：

- 它在哪个闸门停下来等你了？哪个闸门它跳过了？
- 你第一次给的修改意见原话是什么？它理解对了吗？

## 看片笔记（5 支爆款，写进 notes.md）

| 作品 | 一句话（≤20 字） | 第一眼看哪 | 最爽瞬间（秒 + 原因） | 节奏问题（具体到秒） |
|---|---|---|---|---|
| | | | | |
