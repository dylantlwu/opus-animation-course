# M6 · 声音

<div class="lesson-meta"><span class="tech">技术：中文 TTS、timeline.json、字幕、混音、字体工程</span><span class="dir">导演：声音先行的节奏</span><span>约 6 小时</span></div>

## 1. 本课目标

- 理解**声音先行**：先有配音，再按每句话的真实时长排画面
- 用 `audio/tts.py` 生成配音 + `timeline.json` + 字幕，并让画面完全由 `timeline.json` 驱动
- 会混音：配乐在人声出现时自动避让，整体响度标准化到 -14 LUFS
- 解决中文字体的工程问题：子集化、加载、授权
- 产出：一支带配音、字幕、配乐的 30 秒片

## 2. 原理

### 2.1 为什么时长要跟配音走

如果先做画面再配音，你会遇到：画面 3 秒，这句话读了 4 秒；改语速，声音变怪；改画面，前后镜头全部错位。

反过来：**先合成配音，拿到每句话的真实起止时间，画面只引用这些时间**。改旁白、换音色、调语速，重跑一次 `tts.py`，画面自动对齐。

```
narration.txt ──tts.py──▶ voice.wav + timeline.json + voice.srt
                                   │
                    index.html 读 timeline.json：
                    镜头切换 = 某句话开始；元素入场 = 某句话开始 + 偏移
```

画面代码里**不写死秒数**，只写「第几句」：

```js
const TL = await fetch('audio/timeline.json').then((r) => r.json());
const S = (i) => TL.lines[i].start;              // 第 i 句开始的时刻
// 第 5 句开始时闪电；声波在之后 3 秒内匀速扩散
line(..., { p: IN(t, S(5), 0.15) });
```

### 2.2 配音工具 `tts.py`

```bash
cd ~/ops_animation/studio
python3 -m venv .venv && .venv/bin/pip install edge-tts      # 一次性
.venv/bin/python audio/tts.py work/<片名>/narration.txt --out work/<片名>/audio
```

`narration.txt`：每行一句；空行 = 段落停顿（额外 0.6 秒）；`#` 开头是注释（写事实核查）。

常用参数：`--voice`（音色）、`--rate +10%`（语速）、`--gap 0.35`（句间停顿）、`--engine say`（离线，用 macOS 自带语音）。

输出：
- `voice.wav`：整条配音（逐句合成后按停顿拼接）
- `timeline.json`：`{ duration, voice, lines: [{ i, text, start, end }] }`
- `voice.srt`：字幕

### 2.3 中文 TTS 怎么选

| 方案 | 类型 | 本课实测 | 说明 |
|---|---|---|---|
| **edge-tts** | 免费，联网 | ✅ 默认引擎 | 6 个普通话音色；`zh-CN-YunyangNeural` 稳重（新闻腔），`zh-CN-YunxiNeural` 活泼。社区普遍觉得「偏平」 |
| macOS `say` | 免费，离线 | ✅ 备用引擎 | 质量一般，适合打草稿、断网时用 |
| CosyVoice / IndexTTS | 开源，本地部署 | 未实测 | 可声音克隆，需要显卡或较长生成时间 |
| 火山引擎 / SeedAudio 等云服务 | 付费 | 未实测 | 中文自然度高，社区案例用过 |
| ElevenLabs | 付费 | 未实测 | 社区公认质量最好之一，中文需试听 |

**建议**：用 edge-tts 定稿节奏（免费、快），终版再决定要不要换付费音色。因为画面由 `timeline.json` 驱动，**换音色只需要重跑 tts.py**，画面自动跟上。

### 2.4 字幕

两种交付：
- **烧录**：字幕画进画面里（M7 示例片的做法：`seek(t)` 里按 `timeline.json` 画当前句）。所有平台都能看到，但不能关
- **软字幕**：上传 `voice.srt`，平台显示，可开关、可被搜索

断句是个设计问题——见第 6 节作业。

### 2.5 混音：避让 + 响度

```bash
.venv/bin/python audio/mix.py --voice work/<片名>/audio/voice.wav --bgm bgm.mp3 --out work/<片名>/audio/mix.wav
node render/render.mjs work/<片名>/index.html --clip --audio=work/<片名>/audio/mix.wav --out=out/final.mp4
```

`mix.py` 做三件事：
1. **人声压缩**：缩小峰值和平均音量的差距
2. **避让（sidechain ducking）**：人声一出现，配乐自动压低；人声停，配乐回来
3. **响度标准化**：测一遍响度，按「目标 − 实测」加增益，再在 4 倍过采样下限幅，保证真峰值不超过 -1.5 dBTP

::: details 为什么不直接用 ffmpeg 的 loudnorm？（M7 制作时的真实踩坑）
- 单遍 `loudnorm`（动态模式）对「人声 + 停顿」的素材实测只到 **-17.5 LUFS**（目标 -14）
- 两遍 `loudnorm` 线性模式：**-15.98**——人声瞬时峰值太高，线性增益会让峰值超标，loudnorm 自动退回动态模式
- 加了压缩但阈值设在 -20 dBFS：**-16.41**——人声平均电平只有 -24，压缩器几乎没起作用
- 只在 48kHz 样本上限幅：真峰值 **-0.85 dBTP**，超标——样本之间的峰值漏了
- 最终方案（压缩阈值 -30 dBFS + 192kHz 过采样限幅）：**-14.87 LUFS，真峰值 -1.47 dBTP** ✅

教训：音频工具的「默认能用」不等于「达标」。`mix.py` 每次都会测量并报告最终响度，和目标差 1 LU 以上会明确警告。
:::

配乐来源：
- **代码合成**：M7 示例片用 ffmpeg 的 `aevalsrc` 合成了一段和弦铺底（占位）。社区里有人锁定 BPM 用 Python 合成配乐
- **授权音乐**：商用作品一定要确认授权；平台自带的音乐库通常只能在平台内使用

### 2.6 中文字体工程

| 问题 | 解决 |
|---|---|
| 渲染环境没有中文字体 → 方块字 | macOS 有苹方；Linux / Docker 要安装或打包字体 |
| 第一帧字体还没加载 | `render.mjs` 已等待 `document.fonts.ready`；自定义字体必须用 `@font-face` 声明 |
| 字体文件太大（几 MB 到几十 MB） | **子集化**：只保留片子里用到的字 |
| 换一台机器字形不一样 | 把字体文件放进 `work/<片名>/fonts/`，不依赖系统字体 |
| 授权 | **系统字体（苹方、华文黑体）不能随作品分发**。要打包的字体用开源授权的，如 Noto Sans SC / 思源黑体（SIL OFL） |

子集化（实测：一个 55MB 的中文字体 → 37KB）：

```bash
.venv/bin/pip install fonttools brotli
# 收集片子里用到的所有字
python3 -c "import json;L=json.load(open('work/<片名>/audio/timeline.json'))['lines'];open('chars.txt','w').write(''.join(set(''.join(l['text'] for l in L))+'0123456789'))"
.venv/bin/pyftsubset NotoSansSC-Regular.otf --text-file=chars.txt --flavor=woff2 --output-file=work/<片名>/fonts/sc.woff2
```

```css
@font-face { font-family: 'SC'; src: url('fonts/sc.woff2') format('woff2'); }
```

## 3. 拆爆款：声音怎么做的

| 作品 | 声音方案 |
|---|---|
| [AJ 的 7 分钟讲解](https://x.com/ItsmeAjayKV/status/2103591055396663493) | edge-tts 旁白 + 字幕 |
| [@kimmonismus 的 AI 简史](https://x.com/kimmonismus/status/2102844654169575547) | 开源 TTS + Python 合成配乐 |
| [@oozn 的乔布斯生平](https://x.com/oozn/status/2103482545111232946) | Node 合成配乐，锁 120 BPM，23 个转场卡拍 |
| 15 秒 showreel | 有人拆出 7 个剪辑点全在 128 BPM 小节线上 |

社区的两派：**代码合成派**（配乐和画面同一个时钟，卡点精确）和**真实素材派**（「Opus 听不见声音，别让它合成」，用真录音）。本课的立场：**旁白用 TTS 定节奏，配乐用授权素材或代码合成都行，但一定要有响度标准化**。

## 4. Opus 实操

```text
读 CLAUDE.md 和 work/<片名>/LOOK.md。
work/<片名>/narration.txt 是定稿旁白，已经用 audio/tts.py 生成了 audio/timeline.json。
把 index.html 改成由 timeline.json 驱动：
- 用 fetch 读取，S(i) = 第 i 句开始；代码里不写死任何秒数
- 镜头切换点 = 段落第一句开始前 0.25 秒
- 底部烧录字幕：显示当前句，字号 40px，半透明黑底
- __meta.duration = timeline.duration + 0.8
先跑 --verify，再在每段第一句开始后 1 秒各出一张 --sheet。
```

## 5. 导演训练

1. **听节奏**：把 M3 脚本用两种语速（`--rate -10%` 和 `+15%`）各合成一次，听哪个更适合你的受众。看 timeline.json 里总时长差多少
2. **停顿设计**：哪些句子之间应该留长停顿（让观众消化）？在 narration.txt 里用空行标出来，重新合成对比
3. **静音观看**：关掉声音看一遍片子。画面自己能讲明白多少？如果完全依赖旁白，说明画面没有承担叙事

## 6. 作业 + 自检

作业目录：`studio/exercises/m06/`。核心任务：**实现字幕断句**——`audio/tts.py` 里的 `split_subtitle()` 现在是「一句一条」，你来决定怎么切。

- [ ] 实现 `split_subtitle()`：长句按标点 / 字数切开，按字数比例分配时间，每条停留 ≥ 1.8 秒
- [ ] 一支 30 秒的片子：narration.txt → tts.py → 画面由 timeline.json 驱动 → mix.py → 带声音的 MP4
- [ ] `mix.py` 报告的响度在 -14 ± 1 LUFS
- [ ] 至少一个自定义字体，子集化后用 `@font-face` 加载
- [ ] 静音观看笔记
