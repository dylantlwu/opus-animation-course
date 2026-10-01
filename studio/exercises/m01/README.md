# M1 作业 · 时间即函数

课程页：网站 → M1 时间即函数

## 任务 1：读懂报错（10 分钟）

```bash
cd ~/ops_animation/studio
node render/render.mjs ../site/docs/public/demos/m01-random.html --verify
```

它会失败。在下面写出每条报错对应源码里的哪一行、为什么：

- 报错 1：
- 报错 2：

## 任务 2：亲手写 `arrive()`（30 分钟）

打开 `motion.js`，实现 `arrive(x, frames, r)`，然后：

```bash
node exercises/m01/check.mjs
```

全部通过后，回答：你是怎么处理「指数趋近永远到不了 1」的？这个选择对最后几帧有什么影响？

> 我的答案：

## 任务 3：用精确语言下单（1–2 小时）

按课程页第 4 节的提示词，让 Opus 做 `work/m01-logo/`。走完 G0–G3。

- [ ] `--verify` 通过
- [ ] `--strip=0.25:1.0 --n=8` 无单帧跳变
- [ ] 渲染两版：`--clip` 和 `--clip --blur=8`，对比后写下差别：

> 差别：

## 任务 4：逐帧拉片（1 小时）

课程页第 5 节的表格，填在这里：

| 元素 | 开始帧 | 结束帧 | 缓动 | 过冲 / 预备 |
|---|---|---|---|---|
| | | | | |

## 收尾

在 `studio/CLAUDE.md` 第 6 节加至少 1 条规则（格式：现象 → 规则 → 为什么）。
