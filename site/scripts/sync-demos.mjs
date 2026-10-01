// studio/templates 是模板的唯一来源；网站里展示的模板 demo 从这里复制，避免两份各改各的。
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const pairs = [
  ['studio/templates/canvas/index.html', 'site/docs/public/demos/tpl-canvas.html'],
  ['studio/templates/svg/index.html', 'site/docs/public/demos/tpl-svg.html'],
];
for (const [from, to] of pairs) {
  fs.copyFileSync(path.join(root, from), path.join(root, to));
  console.log(`sync ${from} → ${to}`);
}
