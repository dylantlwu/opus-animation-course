# M11 作业 · 3D × 2D 合成

课程页：网站 → M11 Blender II

```bash
cd ~/ops_animation/studio
# 1. 渲染 3D 素材 + 坐标
blender -b --factory-startup -P templates/blender/scene.py -- --frames 1-96 --res 50 --transparent --track out/blender-track/track.json --out out/blender-track/
# 2. 合成
node render/render.mjs examples/blender-overlay/index.html --verify
node render/render.mjs examples/blender-overlay/index.html --clip --out=out/overlay.mp4
```

## 风格统一检查

| 维度 | 我怎么做的 |
|---|---|
| 颜色 | |
| 光照方向 | |
| 线条 | |
| 运动性格 | |
| 背景 | |
