"""人声 + 配乐混音：配乐在人声出现时自动避让（sidechain ducking），再两遍 loudnorm 到目标响度。

用法（在 studio/ 下）：
  .venv/bin/python audio/mix.py --voice work/<片名>/audio/voice.wav --bgm bgm.mp3 --out work/<片名>/audio/mix.wav
  .venv/bin/python audio/mix.py --voice voice.wav --out mix.wav                # 没有配乐：只做响度标准化
  .venv/bin/python audio/mix.py --voice voice.wav --bgm bgm.wav --out mix.wav --bgm-gain 0.25 --lufs -14

为什么两遍：loudnorm 只跑一遍时是动态模式，对「人声 + 停顿」这种素材常常达不到目标
（实测 -17.5 LUFS，目标 -14）。所以第一遍只测量，第二遍按「目标 - 实测」直接加增益，
再用限幅器把峰值卡在真峰值上限以下（母带处理的标准做法）。
"""
import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

STUDIO = Path(__file__).resolve().parent.parent
# 人声压缩：缩小「峰值 - 平均响度」的差距，线性 loudnorm 才能把整体推到目标而不超真峰值
VOICE_COMP = "acompressor=threshold=0.03:ratio=4:attack=2:release=100:makeup=4"  # 阈值约 -30 dBFS：要低于人声平均电平才压得到


def ffmpeg(*args, capture=False):
    # 测量时要 info 级日志（loudnorm 的 JSON 打在 info 级），其他时候只看错误
    cmd = ["node", str(STUDIO / "render/ffmpeg.mjs"), "-hide_banner", "-loglevel", "info" if capture else "error", "-y", *args]
    r = subprocess.run(cmd, check=True, capture_output=capture, text=True)
    return r.stderr if capture else None


def measure(path, lufs, tp, lra):
    err = ffmpeg("-i", str(path), "-af", f"loudnorm=I={lufs}:TP={tp}:LRA={lra}:print_format=json", "-f", "null", "-", capture=True)
    return json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", err, re.S).group(0))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", required=True)
    ap.add_argument("--bgm")
    ap.add_argument("--out", required=True)
    ap.add_argument("--bgm-gain", type=float, default=0.35, help="配乐基础音量（避让前）")
    ap.add_argument("--lufs", type=float, default=-14, help="目标整体响度；网络视频常用 -14")
    ap.add_argument("--tp", type=float, default=-1.5, help="真峰值上限 dBTP")
    ap.add_argument("--lra", type=float, default=11)
    a = ap.parse_args()

    with tempfile.TemporaryDirectory() as tmp:
        pre = Path(tmp) / "pre.wav"
        if a.bgm:
            # 人声分两路：一路当「钥匙」压低配乐，一路参与最终混音
            graph = (f"[0:a]aresample=48000,{VOICE_COMP},asplit=2[v1][v2];[1:a]aresample=48000,volume={a.bgm_gain}[b];"
                     "[b][v1]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[bd];"
                     "[bd][v2]amix=inputs=2:duration=longest:normalize=0[out]")
            ffmpeg("-i", a.voice, "-i", a.bgm, "-filter_complex", graph, "-map", "[out]", "-ar", "48000", str(pre))
        else:
            ffmpeg("-i", a.voice, "-af", VOICE_COMP, "-ar", "48000", str(pre))

        m = measure(pre, a.lufs, a.tp, a.lra)                       # 第一遍：测量
        gain = a.lufs - float(m["input_i"])                         # 第二遍：整体增益 + 峰值限幅
        ceiling = 10 ** (a.tp / 20)
        # 4 倍过采样（192kHz）下限幅 ≈ 真峰值限幅；只按 48kHz 样本限幅会漏掉样本之间的峰值
        ffmpeg("-i", str(pre), "-af", f"aresample=192000,volume={gain:.2f}dB,alimiter=limit={ceiling:.3f}:attack=1:release=50:level=false,aresample=48000", "-ar", "48000", a.out)

    r = measure(a.out, a.lufs, a.tp, a.lra)
    print(f"✓ {a.out}  整体响度 {r['input_i']} LUFS（目标 {a.lufs}）· 真峰值 {r['input_tp']} dBTP")
    if abs(float(r["input_i"]) - a.lufs) > 1:
        print("  ⚠ 与目标相差超过 1 LU：限幅器削掉了太多峰值。可加大人声压缩（VOICE_COMP 的 ratio）或降低目标响度。")


if __name__ == "__main__":
    main()
