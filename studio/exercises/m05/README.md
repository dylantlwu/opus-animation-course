# M5 作业 · 导演工作流

课程页：网站 → M5 导演工作流

模板：`studio/templates/REVIEW.md`（审片记录）、`studio/templates/HANDOFF.md`（交接）

```bash
cd ~/ops_animation/studio
cp templates/REVIEW.md work/<片名>/REVIEW-1.md
cp templates/HANDOFF.md work/<片名>/HANDOFF.md
# 转场处扫单帧跳变（时间会对齐到真实帧）
node render/render.mjs work/<片名>/index.html --strip=<切点-0.1>:<切点+0.05> --n=5
```

## 根因分组

> 把目前所有审片意见按根因分组：

| 根因 | 包含的意见 |
|---|---|
| | |

## 严审对照

> 同一份成品，制作会话自审 vs 新会话严审，意见有什么不同？
