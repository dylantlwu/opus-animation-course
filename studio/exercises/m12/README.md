# M12 作业 · 毕业作品与工业化

课程页：网站 → M12 毕业作品与工业化

## 任务 1：实现 `splitRanges()`（留给你写的代码）

打开 `parallel.mjs`，实现 `splitRanges(duration, fps, n)`。验证：

```bash
cd ~/ops_animation/studio
node exercises/m12/parallel.mjs examples/gps/index.html --workers=4 --scale=0.5 --out=out/parallel.mp4
node render/ffmpeg.mjs -v error -i out/parallel.mp4 -map 0:v -f null - -stats   # 应为 2299 帧
```

> 你按帧还是按秒切？为什么平均切就够了？

## 任务 2：分段重渲

```bash
node render/render.mjs work/<片名>/index.html --clip --from=30 --to=45 --out=out/parts/fix.mp4
```

## 任务 3：成本记录

| 片子 | 会话数 | 改片轮数 | 最花时间的一步 | 备注 |
|---|---|---|---|---|
| | | | | |

## 毕业复盘

> CLAUDE.md 从 v1 到现在多了几条？最有用的 3 条：

1.
2.
3.
