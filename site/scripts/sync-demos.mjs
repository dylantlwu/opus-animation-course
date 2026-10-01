// studio/ 是模板和示例的唯一来源；网站里展示的 demo 从这里复制，避免两份各改各的。
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const pairs = [
  ['studio/templates/canvas/index.html', 'site/docs/public/demos/tpl-canvas.html'],
  ['studio/templates/svg/index.html', 'site/docs/public/demos/tpl-svg.html'],
  // M7 示例片：源码 + 时间轴（网站上可逐帧拖动；带声音的成片见 public/media/gps.mp4）
  ['studio/examples/gps/index.html', 'site/docs/public/demos/gps/index.html'],
  ['studio/examples/gps/audio/timeline.json', 'site/docs/public/demos/gps/audio/timeline.json'],
];
for (const [from, to] of pairs) {
  fs.mkdirSync(path.dirname(path.join(root, to)), { recursive: true });
  fs.copyFileSync(path.join(root, from), path.join(root, to));
  console.log(`sync ${from} → ${to}`);
}
