// M12 作业：并行渲染
//
//   node exercises/m12/parallel.mjs <file.html> --workers=4 [--audio=mix.wav] [--out=out/final.mp4]
//
// 思路：把整片切成 N 段，同时起 N 个 render.mjs（各自一个无头 Chrome）渲染 --from/--to，
// 再用 ffmpeg concat 无损拼接，最后**只在整片上混一次音频**（每段各带音频，段边界会有 AAC 的空隙）。
// 之所以能这样拆：seek(t) 是纯函数，任何一帧都不依赖前一帧 —— M0 第一课讲的那句话，在这里兑现。
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { FFMPEG } from '../../render/ffmpeg.mjs';

/**
 * 把 [0, duration) 切成 n 段，返回 [[from, to], ...]（单位：秒）。
 *
 * TODO(你来写)：约 5–10 行。要求：
 *   · 段与段首尾相接、不重不漏（render.mjs 会把 from/to 按帧对齐：Math.round(sec * fps)）
 *   · 每段尽量一样长（按「帧数」平均，而不是按秒——为什么？）
 *   · n 大于总帧数时怎么办？
 * 想一想：要不要切在镜头边界上？在 seek(t) 的世界里，平均切为什么已经足够？
 */
export function splitRanges(duration, fps, n) {
  throw new Error('splitRanges() 还没实现 —— 这是留给你的 M12 作业');
}

const argv = process.argv.slice(2);
const file = argv.find((a) => !a.startsWith('--'));
const opt = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
if (!file) { console.error('用法见文件头注释'); process.exit(2); }

const render = path.resolve(import.meta.dirname, '../../render/render.mjs');
const meta = JSON.parse(execFileSync('node', [render, file, '--meta'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString());
const n = Number(opt.workers ?? 4), out = path.resolve(opt.out ?? 'out/parallel.mp4');
const parts = path.join(path.dirname(out), 'parts');
fs.mkdirSync(parts, { recursive: true });
const ranges = splitRanges(meta.duration, meta.fps, n);
console.error(`▶ ${file}  ${meta.duration.toFixed(2)}s @${meta.fps}fps → ${ranges.length} 段并行`);

const t0 = Date.now();
await Promise.all(ranges.map(([from, to], k) => new Promise((ok, fail) => {
  const p = spawn('node', [render, file, '--clip', `--from=${from}`, `--to=${to}`, `--out=${path.join(parts, `part-${k}.mp4`)}`,
    ...(opt.scale ? [`--scale=${opt.scale}`] : [])], { stdio: ['ignore', 'ignore', 'pipe'] });
  let err = ''; p.stderr.on('data', (d) => (err += d));
  p.on('close', (c) => (c === 0 ? ok() : fail(new Error(`第 ${k} 段（${from}–${to}s）失败：\n${err.split('\n').filter((l) => l.includes('✗')).join('\n')}`))));
})));
console.error(`  ${ranges.length} 段渲染完成 ${((Date.now() - t0) / 1000).toFixed(1)}s`);

const list = path.join(parts, 'list.txt');
fs.writeFileSync(list, ranges.map((_, k) => `file 'part-${k}.mp4'`).join('\n'));
const joined = opt.audio ? path.join(parts, 'joined.mp4') : out;
execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', joined]);
if (opt.audio) {
  execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', joined, '-i', path.resolve(opt.audio), '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(meta.duration), '-movflags', '+faststart', out]);
}
console.error(`✓ ${out}  总用时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
