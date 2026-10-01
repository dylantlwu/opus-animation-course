// 性质测试：不检查你「怎么写」，只检查曲线有没有「快到、轻落」该有的样子。
// 用法：node exercises/m01/check.mjs
import { arrive } from './motion.js';

const cases = [
  { frames: 24, r: 0.15 }, { frames: 30, r: 0.15 }, { frames: 60, r: 0.15 },
  { frames: 24, r: 0.12 }, { frames: 30, r: 0.19 },
];
const tests = [
  ['起止点精确', '不精确的话，元素最后会停在差几像素的位置，下一个镜头接不上',
    (f) => Math.abs(f(0)) < 1e-9 && Math.abs(f(1) - 1) < 1e-3],
  ['不回退', '位置往回走一下，看起来像抽搐',
    (f) => Array.from({ length: 100 }, (_, i) => f((i + 1) / 100) >= f(i / 100) - 1e-12).every(Boolean)],
  ['不过冲', '这是「轻落」，不是 outBack；需要弹性时用另一条曲线',
    (f) => Array.from({ length: 101 }, (_, i) => f(i / 100)).every((v) => v <= 1 + 1e-9)],
  ['快到：前 25% 时间走完 ≥ 50%', '进场慢吞吞，观众会觉得拖',
    (f) => f(0.25) >= 0.5],
  ['轻落：最后 10% 时间平均速度 ≤ 0.3', '落点太硬，像撞墙',
    (f) => (f(1) - f(0.9)) / 0.1 <= 0.3],
  ['越界安全', 'range() 之外直接调用时，不能飞出画面',
    (f) => f(-0.5) === f(0) && f(1.5) === f(1)],
  ['确定性', '同样的输入必须同样的输出，否则违反 seek(t) 契约',
    (f) => f(0.37) === f(0.37)],
];

let failed = 0;
for (const { frames, r } of cases) {
  const f = (x) => arrive(x, frames, r);
  for (const [name, why, test] of tests) {
    let ok;
    try { ok = test(f); } catch (e) { ok = false; console.log(`✗ [frames=${frames} r=${r}] ${name}：${e.message}`); failed++; break; }
    if (!ok) { failed++; console.log(`✗ [frames=${frames} r=${r}] ${name}\n    为什么重要：${why}`); }
  }
}
if (failed) { console.log(`\n${failed} 项未通过`); process.exit(1); }
console.log(`✓ 全部通过（${cases.length} 组参数 × ${tests.length} 项性质）`);
console.log('  f(x) 采样：', [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1].map((x) => arrive(x).toFixed(3)).join('  '));
