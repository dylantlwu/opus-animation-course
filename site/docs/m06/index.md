# M6 · 声音

::: info 🚧 阶段 B 建设中
:::

## 本课目标

- **声音先行**：先有配音，再按每句话的真实时长排画面
- 中文 TTS 横评：edge-tts（免费）/ CosyVoice / IndexTTS（本地）/ 火山 / SeedAudio
- 拿到**逐句 / 逐词时间戳**，生成 `timeline.json` 驱动镜头和字幕
- 字幕：逐词高亮、SRT 软字幕 vs 烧录
- BGM 与音效：节拍对齐、人声出现时自动避让（ducking）、响度统一到 -14 LUFS
- 产出：`studio/audio/tts.py` + 一支带配音字幕的 30 秒片

## 大纲

1. 为什么时长要跟配音走，而不是反过来
2. edge-tts 起步：逐句合成 + 时间戳
3. 时间戳 → `timeline.json` → `SHOTS` 的 start/dur
4. 字幕：断句策略（你来决定：按标点？按字数？按呼吸？）
5. BGM：代码合成派 vs 真实素材派
6. ffmpeg 混音：避让、淡入淡出、响度
7. 中文字体工程：子集化 woff2、`document.fonts.ready`、跨机器一致
