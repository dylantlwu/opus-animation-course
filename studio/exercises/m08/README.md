# M8 作业 · 动态图形 & Remotion

课程页：网站 → M8 动态图形 & Remotion

参考：`site/docs/public/demos/m08-kinetic.html`（加 `?beats=1` 显示节拍网格）

```bash
cd ~/ops_animation/studio
# 你的 showreel 做好后，带节拍网格出一张检查图
node render/render.mjs "work/<片名>/index.html?beats=1" --sheet=1,3,5,7,9,11,13,15 --cols=4

# Remotion 起步（在 studio 外面的任意目录）
npx create-video@latest --yes --blank --no-tailwind my-video
cd my-video && npm i && npx remotion still MyComp out/still.png --frame=0
```

## 数拍子

| 参考片 | BPM | 剪辑点（第几拍） | 落在强拍的比例 |
|---|---|---|---|
| | | | |

## 纯 HTML 还是 Remotion？

> 我的下一个项目选：
> 理由：
