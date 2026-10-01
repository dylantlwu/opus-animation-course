# M9 项目 · 30 秒产品宣传片（16:9 + 9:16）

课程页：网站 → M9 项目二

参考：`site/docs/public/demos/m09-aspect.html`（`?ar=169` / `?ar=916` / `?safe=1`）

```bash
cd ~/ops_animation/studio
mkdir -p work/<片名>/assets work/<片名>/fonts
# 竖版安全区检查
node render/render.mjs "work/<片名>/index.html?ar=916&safe=1" --sheet=1,5,10,15,20,25,29 --cols=7 --w=240
# 两个画幅的终版
node render/render.mjs "work/<片名>/index.html?ar=169" --clip --audio=work/<片名>/audio/mix.wav --out=out/promo-169.mp4
node render/render.mjs "work/<片名>/index.html?ar=916" --clip --audio=work/<片名>/audio/mix.wav --out=out/promo-916.mp4
```

## 品牌审查

> 遮住 logo，这还像我们的片子吗？哪些元素让它像 / 不像？
