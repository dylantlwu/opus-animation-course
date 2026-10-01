# M4 作业 · 视觉语言

课程页：网站 → M4 导演 I：视觉语言

## 眯眼测试（每张 style frame 都要做）

```bash
cd ~/ops_animation/studio
node render/render.mjs work/<片名>/index.html --still=<时间> --out=out/check/frame.png
node render/ffmpeg.mjs -i out/check/frame.png -vf "gblur=sigma=24" -update 1 out/check/squint.png
```

| style frame | 我想让观众第一眼看到 | 模糊后第一眼看到 | 一致？ |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

## 转场翻译表

| 旁白里的逻辑词 | 位置（第几句） | 转场 | 理由 |
|---|---|---|---|
| 所以 | | | |

## 我领域的 5 条视觉隐喻

| 概念 | 视觉隐喻 |
|---|---|
| | |
