# M7 项目 · 90 秒科普短片

课程页：网站 → M7 项目一

参考：`studio/examples/gps/`（完整导演文档包 + 成片）

```bash
cd ~/ops_animation/studio
mkdir -p work/<片名>
# 1. 旁白 → 配音 + 时间轴
.venv/bin/python audio/tts.py work/<片名>/narration.txt --out work/<片名>/audio
# 2. 和 Opus 走 G1–G3（课程页 3.3 的起手提示词）
claude --model opus --effort xhigh
# 3. 混音 + 终版
.venv/bin/python audio/mix.py --voice work/<片名>/audio/voice.wav --bgm <配乐> --out work/<片名>/audio/mix.wav
node render/render.mjs work/<片名>/index.html --verify
node render/render.mjs work/<片名>/index.html --clip --audio=work/<片名>/audio/mix.wav --out=out/<片名>.mp4
```

## 复盘

> 哪 3 条规则写进了 CLAUDE.md？

1.
2.
3.

> 和示例片的制作日志比，你踩的坑有哪些是一样的？
