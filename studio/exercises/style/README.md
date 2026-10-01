# 风格专题作业

课程页：网站 → 风格专题 → 练习

| 练习 | 产出 | 位置 |
|---|---|---|
| 1 拆风格 | 两支代表作的四层拆解表 | `breakdown.md` |
| 2 换风格 | 你写的 LOOK.md + Risograph 版 GPS 镜头 | `../../work/gps-riso/` |
| 3 逆向参考 | 参考片印样 + 从印样起草并核对过的 LOOK.md + 10 秒新片 | `../../refs/`、`../../work/<片名>/` |
| 4 你的风格卡 | 一张完整的风格卡 | `my-style.md` |

模板：`../../styles/_template/LOOK.md`；范例：`../../styles/swiss/LOOK.md`

常用命令（在 `studio/` 下）：

```bash
# 单独渲染四风格对照中的某一种
node render/render.mjs "../site/docs/public/demos/style-gps.html?s=swiss" --still=2.4 --out=out/check/swiss.png

# 参考片印样（每秒 2 帧，6×5）
node render/ffmpeg.mjs -i refs/ref.mp4 -vf "fps=2,scale=320:-1,tile=6x5" -frames:v 1 -update 1 out/ref/sheet.png
```
