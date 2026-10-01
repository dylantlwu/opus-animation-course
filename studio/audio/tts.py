"""逐句配音 → voice.wav + timeline.json + voice.srt

「声音先行」：先合成配音，再用每句话的真实时长去排画面。
timeline.json 是画面和配音之间唯一的约定——index.html 读它，seek(t) 按它切镜头、出字幕。

用法（在 studio/ 下）：
  .venv/bin/python audio/tts.py work/<片名>/narration.txt --out work/<片名>/audio
  .venv/bin/python audio/tts.py narration.txt --out audio --voice zh-CN-YunyangNeural --rate +5% --gap 0.35
  .venv/bin/python audio/tts.py narration.txt --out audio --engine say --voice Tingting   # 离线：macOS 自带语音

narration.txt：每行一句旁白；空行 = 额外停顿 0.6 秒；以 # 开头的行是注释。
"""
import argparse
import asyncio
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

STUDIO = Path(__file__).resolve().parent.parent
RATE = 24000  # 统一采样率：所有句子都转成 24kHz 单声道 16bit，才能直接拼接


def ffmpeg(*args):
    # 复用 render/ffmpeg.mjs：ffmpeg 只有一个来源（ffmpeg-static）
    subprocess.run(["node", str(STUDIO / "render/ffmpeg.mjs"), "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def synth_edge(text, voice, rate, path):
    import edge_tts
    asyncio.run(edge_tts.Communicate(text, voice, rate=rate).save(str(path)))


def synth_say(text, voice, _rate, path):
    subprocess.run(["say", "-v", voice, "-o", str(path), text], check=True)


def read_script(path):
    """返回 [(句子, 句后额外停顿秒数)]。"""
    items = []
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line.startswith("#"):
            continue
        if not line:
            if items:
                items[-1] = (items[-1][0], items[-1][1] + 0.6)
            continue
        items.append((line, 0.0))
    if not items:
        sys.exit(f"✗ {path} 里没有旁白")
    return items


def split_subtitle(text, start, end):
    """把一句旁白切成若干条字幕 [(文字, 开始, 结束)]。

    TODO(你来写，M6 作业)：现在是「一句一条」。当一句话超过一行能放下的字数时，
    需要按标点 / 字数 / 呼吸点切开，并按每段的字数比例分配时间。
    要考虑：一行最多多少字？切在逗号还是任意位置？每条至少停留多久（风格专题：≥ 1.8s）？
    """
    return [(text, start, end)]


def srt_time(t):
    ms = round(t * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--out", required=True)
    ap.add_argument("--engine", choices=["edge", "say"], default="edge")
    ap.add_argument("--voice", default=None, help="edge 默认 zh-CN-YunyangNeural；say 默认 Tingting")
    ap.add_argument("--rate", default="+0%", help="edge-tts 语速，如 +10%%")
    ap.add_argument("--gap", type=float, default=0.35, help="句间停顿（秒）")
    ap.add_argument("--lead", type=float, default=0.4, help="开头留白（秒）")
    a = ap.parse_args()
    voice = a.voice or ("zh-CN-YunyangNeural" if a.engine == "edge" else "Tingting")
    synth = synth_edge if a.engine == "edge" else synth_say
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)

    items = read_script(a.script)
    lines, frames, t = [], bytearray(), a.lead
    silence = lambda s: b"\x00\x00" * round(s * RATE)
    frames += silence(a.lead)
    with tempfile.TemporaryDirectory() as tmp:
        for i, (text, extra) in enumerate(items):
            raw, wav = Path(tmp) / f"{i}.audio", Path(tmp) / f"{i}.wav"
            synth(text, voice, a.rate, raw)
            ffmpeg("-i", str(raw), "-ac", "1", "-ar", str(RATE), "-sample_fmt", "s16", str(wav))
            with wave.open(str(wav)) as w:
                data = w.readframes(w.getnframes())
            dur = len(data) / 2 / RATE
            lines.append({"i": i, "text": text, "start": round(t, 3), "end": round(t + dur, 3)})
            frames += data + silence(a.gap + extra)
            t += dur + a.gap + extra
            print(f"  [{i + 1}/{len(items)}] {dur:5.2f}s  {text}")

    with wave.open(str(out / "voice.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(bytes(frames))
    duration = round(len(frames) / 2 / RATE, 3)
    (out / "timeline.json").write_text(json.dumps({"duration": duration, "voice": voice, "lines": lines}, ensure_ascii=False, indent=2), encoding="utf-8")
    cues = [c for l in lines for c in split_subtitle(l["text"], l["start"], l["end"])]
    (out / "voice.srt").write_text("".join(f"{n}\n{srt_time(s)} --> {srt_time(e)}\n{txt}\n\n" for n, (txt, s, e) in enumerate(cues, 1)), encoding="utf-8")
    print(f"✓ {out}/voice.wav  {duration}s · timeline.json {len(lines)} 句 · voice.srt {len(cues)} 条")


if __name__ == "__main__":
    main()
