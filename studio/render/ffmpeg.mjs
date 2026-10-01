// ffmpeg 可执行文件的唯一来源：环境变量 FFMPEG > npm 包 ffmpeg-static > 系统 PATH 里的 ffmpeg。
// （Homebrew 自 2026-09 起不再给 Intel Mac 提供预编译包，所以默认用 ffmpeg-static。）
// 也可以直接当命令用：node render/ffmpeg.mjs -framerate 24 -i out/blender/%04d.png ... out.mp4
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const FFMPEG = process.env.FFMPEG ?? (await import('ffmpeg-static').then((m) => m.default).catch(() => null)) ?? 'ffmpeg';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(spawnSync(FFMPEG, process.argv.slice(2), { stdio: 'inherit' }).status ?? 1);
}
