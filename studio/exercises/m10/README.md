# M10 作业 · 脚本化 3D

课程页：网站 → M10 Blender I

```bash
cd ~/ops_animation/studio
# 焦段练习：同一帧三个焦段
for L in 35 50 85; do blender -b --factory-startup -P templates/blender/scene.py -- --frames 48-48 --res 25 --lens $L --out out/lens/l$L/; done
# 整段
blender -b --factory-startup -P templates/blender/scene.py -- --frames 1-96 --res 50 --out out/blender/
node render/ffmpeg.mjs -framerate 24 -i out/blender/%04d.png -c:v libx264 -pix_fmt yuv420p -movflags +faststart out/blender.mp4
```

## 焦段感受

| 焦段 | 给我的感觉 | 适合拍什么 |
|---|---|---|
| 35mm | | |
| 50mm | | |
| 85mm | | |

## Opus 的 bpy 代码，我改了哪些？

| 改了什么 | 属于「擅长」还是「不擅长」 |
|---|---|
| | |
