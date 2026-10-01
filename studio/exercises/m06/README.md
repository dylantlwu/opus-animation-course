# M6 作业 · 声音

课程页：网站 → M6 声音

## 任务 1：字幕断句（这是留给你写的代码）

打开 `studio/audio/tts.py`，找到 `split_subtitle(text, start, end)`。现在它是「一句一条字幕」。

你要决定：
- 一行最多几个字？（1080p 横屏、40px 字号，物理上放得下 30 多个汉字，但为了来得及读，字幕一行通常不超过 16–20 个字；竖屏更少）
- 切在哪里？逗号、顿号？还是任意位置？不要把一个词切成两半
- 时间怎么分？按字数比例？每条至少停留多久？（风格专题：≥ max(1.8s, 语音时长 + 0.6s) —— 和「切开」本身有矛盾，你怎么取舍？）

测试：

```bash
cd ~/ops_animation/studio
.venv/bin/python audio/tts.py examples/gps/narration.txt --out out/tts-test
cat out/tts-test/voice.srt
```

> 我的断句规则和理由：

## 任务 2：30 秒带声音的片子

1. 写 `work/<片名>/narration.txt`（每句 ≤ 20 字，顶部注释写事实核查）
2. `.venv/bin/python audio/tts.py work/<片名>/narration.txt --out work/<片名>/audio`
3. 让 Opus 把画面改成由 `timeline.json` 驱动（课程页第 4 节的提示词）
4. `.venv/bin/python audio/mix.py --voice work/<片名>/audio/voice.wav --bgm <配乐> --out work/<片名>/audio/mix.wav`
5. `node render/render.mjs work/<片名>/index.html --clip --audio=work/<片名>/audio/mix.wav --out=out/m06.mp4`

## 任务 3：静音观看笔记

> 关掉声音，画面能讲明白多少？哪几个镜头完全依赖旁白？
