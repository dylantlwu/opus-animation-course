#!/usr/bin/env node
// seek(t) 渲染器：任何暴露 window.__meta + window.seek(t) 的 HTML 都能被它出片。
//
//   node render/render.mjs <file.html> --clip   [--out=out/video.mp4] [--scale=0.5] [--blur=8] [--audio=a.wav]
//                                              [--from=2.5 --to=6]    # 只渲染这一段（秒，按帧对齐）
//   node render/render.mjs <file.html> --sheet=0.5,1.2,2.4 [--cols=4] [--w=480] [--out=out/sheet.png]
//   node render/render.mjs <file.html> --strip=2.0:2.5 [--n=6]            # 一段时间内均匀取 n 帧，抓「单帧跳变」
//   node render/render.mjs <file.html> --still=2.4 [--out=out/still.png]
//   node render/render.mjs <file.html> --verify                            # 确定性检查（藏计时器 / 依赖 seek 顺序）
//   node render/render.mjs <file.html> --meta                              # 只打印 __meta（JSON）
//
// 契约：window.__meta = { duration, fps, width, height }；window.seek(t) 是纯函数（同 t 必同帧，可返回 Promise）。
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { startServer } from './server.mjs';
import { FFMPEG } from './ffmpeg.mjs';

const argv = process.argv.slice(2);
const [file, query] = (argv.find((a) => !a.startsWith('--')) ?? '').split('?'); // 支持 demo.html?s=ink 这类参数
const opt = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => {
  const [k, v] = a.slice(2).split('=');
  return [k, v ?? true];
}));
if (!file) { console.error('用法见文件头注释'); process.exit(2); }

const abs = path.resolve(file);
const root = abs.startsWith(process.cwd() + path.sep) ? process.cwd() : path.dirname(abs);
const scale = Number(opt.scale ?? 1);
const fail = (msg) => { console.error(`\n✗ ${msg}`); process.exitCode = 1; };

const server = await startServer(root);
const url = `http://127.0.0.1:${server.address().port}/${path.relative(root, abs).split(path.sep).join('/')}${query ? '?' + query : ''}`;
const browser = await launch();
try {
  const page = await (await browser.newContext({ deviceScaleFactor: scale })).newPage(); // --scale=0.5 → 半分辨率草稿
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && pageErrors.push(m.text()));

  await page.goto(url);
  await page.waitForFunction(() => window.__meta && typeof window.seek === 'function', null, { timeout: 15000 });
  const meta = await page.evaluate(() => window.__meta);
  const fps = Number(opt.fps ?? meta.fps);
  await page.setViewportSize({ width: meta.width, height: meta.height });
  await page.evaluate(() => document.fonts.ready);
  console.error(`▶ ${path.relative(process.cwd(), abs)}  ${meta.width}×${meta.height} ${meta.duration}s @${fps}fps  scale=${scale}`);

  const seek = (t) => page.evaluate(async (t) => {
    await window.seek(t);
    await new Promise((r) => requestAnimationFrame(() => r()));
  }, t);
  const shot = async (t) => { await seek(t); return page.screenshot({ type: 'png' }); };

  if (opt.meta) console.log(JSON.stringify({ ...meta, fps }));            // 给并行渲染等脚本读取时长 / 帧率
  else if (opt.clip) await renderClip(page, meta, fps, shot);
  else if (opt.sheet) await contactSheet(page, (String(opt.sheet)).split(',').map(Number), shot, fps);
  else if (opt.strip) {
    const [a, b] = String(opt.strip).split(':').map(Number);
    const n = Number(opt.n ?? 6);
    await contactSheet(page, Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1)), shot, fps, n);
  } else if (opt.still !== undefined) {
    const out = outPath('out/still.png');
    fs.writeFileSync(out, await shot(Number(opt.still)));
    console.error(`✓ ${out}`);
  } else if (opt.verify) await verify(page, meta, fps, seek);
  else fail('需要 --clip / --sheet / --strip / --still / --verify 之一');

  if (pageErrors.length) fail(`页面报错 ${pageErrors.length} 条：\n  ` + pageErrors.slice(0, 5).join('\n  '));
} catch (e) {
  fail(e.message);
} finally {
  await browser.close();
  server.close();
}

async function launch() {
  const args = ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none', '--use-angle=metal'];
  // 优先用本机 Chrome，省去下载 Playwright 自带 Chromium
  return chromium.launch({ channel: 'chrome', args }).catch(() => chromium.launch({ args }));
}

function outPath(fallback) {
  const out = path.resolve(opt.out ?? fallback);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  return out;
}

async function renderClip(page, meta, fps, shot) {
  const out = outPath('out/video.mp4');
  const blur = Number(opt.blur ?? 1); // 每帧子帧数，>1 时开启运动模糊（建议 8–16）
  const shutter = Number(opt.shutter ?? 0.5); // 180° 快门 = 曝光半帧
  // --from/--to：只渲染一段（只重渲改过的镜头、并行渲染的基础）。按帧号对齐，段与段之间不重不漏
  const fFrom = Math.round(Number(opt.from ?? 0) * fps), fTo = Math.round(Number(opt.to ?? meta.duration) * fps);
  const frames = fTo - fFrom, segDur = frames / fps;
  if (frames <= 0) throw new Error(`--from/--to 范围为空：${opt.from} → ${opt.to}`);
  const vf = ['scale=trunc(iw/2)*2:trunc(ih/2)*2'];
  if (blur > 1) vf.unshift(`tmix=frames=${blur}`, `select='eq(mod(n\\,${blur})\\,${blur - 1})'`, `setpts=N/${fps}/TB`);
  const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps * blur), '-i', '-'];
  if (opt.audio) ffArgs.push('-ss', String(fFrom / fps), '-i', path.resolve(opt.audio));
  ffArgs.push('-vf', vf.join(','), '-r', String(fps), '-map', '0:v');
  if (opt.audio) ffArgs.push('-map', '1:a', '-c:a', 'aac', '-b:a', '192k');
  // 用 -t 明确时长，不用 -shortest（带字幕/音频流时 -shortest 可能卡住）
  // +faststart：索引放到文件开头，网页里边下边播
  ffArgs.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', '-t', String(segDur), out);

  const ff = spawn(FFMPEG, ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg 退出码 ${c}`)))));
  ff.on('error', (e) => fail(`无法启动 ffmpeg（${FFMPEG}）：${e.message}——在 studio/ 下运行 npm install`));
  const t0 = Date.now();
  let t = 0;
  try {
    for (let i = 0; i < frames; i++) {
      for (let k = 0; k < blur; k++) {
        t = (fFrom + i + (blur > 1 ? (k / blur) * shutter : 0)) / fps;
        const png = await shot(Math.min(t, meta.duration - 1e-6));
        if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
      }
      if (i % 30 === 0 || i === frames - 1) process.stderr.write(`\r  帧 ${i + 1}/${frames}  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
  } catch (e) {
    // 不留半成品：ffmpeg 会把已收到的帧封装成一个「看起来正常」的 MP4（音频完整、画面半截）
    ffDone.catch(() => {}); // 是我们主动杀掉的，不算 ffmpeg 失败
    ff.kill('SIGKILL');
    fs.rmSync(out, { force: true });
    throw new Error(`渲染在 t=${t.toFixed(3)}s 失败，已删除不完整的 ${path.relative(process.cwd(), out)}\n  ${e.message.split('\n')[0]}`);
  }
  ff.stdin.end();
  await ffDone;
  console.error(`\n✓ ${out}`);
}

async function contactSheet(page, times, shot, fps, cols = Number(opt.cols ?? Math.min(times.length, 4))) {
  const w = Number(opt.w ?? 480);
  const cells = [];
  // 对齐到真实帧时间：成片里只存在 i/fps 这些时刻，审片看到的必须是同一批帧（避免 1.99999 被当成 2.000）
  for (const t of times.map((t) => Math.round(t * fps) / fps)) cells.push({ t, src: 'data:image/png;base64,' + (await shot(t)).toString('base64') });
  const sheet = await page.context().newPage();
  await sheet.setViewportSize({ width: cols * (w + 12) + 12, height: 200 });
  await sheet.setContent(`<body style="margin:0;background:#16161a;font:14px ui-monospace,monospace;color:#cfd2dc">
    <div style="display:grid;grid-template-columns:repeat(${cols},${w}px);gap:12px;padding:12px">
    ${cells.map((c) => `<figure style="margin:0"><img src="${c.src}" style="width:${w}px;display:block;outline:1px solid #333">
      <figcaption style="padding:4px 0">t=${c.t.toFixed(3)}s · f${Math.round(c.t * fps)}</figcaption></figure>`).join('')}
    </div></body>`);
  const out = outPath('out/check/sheet.png');
  await sheet.screenshot({ path: out, fullPage: true });
  console.error(`✓ ${out}  (${times.length} 帧)`);
}

async function verify(page, meta, fps, seek) {
  const hash = (buf) => createHash('sha1').update(buf).digest('hex').slice(0, 12);
  const snap = async () => hash(await page.screenshot({ type: 'png' }));
  const ts = [0, 0.37, 0.71, 0.97].map((r) => Math.round(r * meta.duration * fps) / fps);
  let ok = true;

  // 检查 1：seek 之后画面不应自己变化（抓 requestAnimationFrame / setTimeout / CSS transition）
  for (const t of ts) {
    await seek(t);
    const a = await snap();
    await page.waitForTimeout(500);
    if (a !== (await snap())) { ok = false; fail(`t=${t}s：seek 后 0.5s 画面自己变了 → 有计时器/rAF/CSS 动画在跑`); }
  }
  // 检查 2：同一 t 的画面不应依赖之前 seek 过哪里（抓帧间状态、Math.random）
  const forward = [];
  for (const t of ts) { await seek(t); forward.push(await snap()); }
  for (const [i, t] of [...ts.entries()].reverse()) {
    await seek(t);
    if (forward[i] !== (await snap())) { ok = false; fail(`t=${t}s：倒序 seek 后画面不同 → 有帧间状态或未设种子的随机数`); }
  }
  console.error(ok ? `✓ 确定性检查通过（${ts.length} 个时间点 × 2 项）` : '');
}
