"""Blender 无头模板：地球 + 4 颗卫星绕轨 + 缓慢推镜。

用法（在 studio/ 下）：
  blender -b --factory-startup -P templates/blender/scene.py -- --frames 1-96 --res 50 --engine eevee --out out/blender/
  node render/ffmpeg.mjs -framerate 24 -i out/blender/%04d.png -c:v libx264 -pix_fmt yuv420p out/blender.mp4

参数：
  --frames  a-b       渲染帧范围（24fps，96 帧 = 4 秒）
  --res     百分比     相对 1920×1080，预览用 25–50
  --engine  eevee | workbench | cycles   （Intel Mac 上 cycles 只能用 CPU，慢）
  --save    path.blend 另存场景，方便在界面里打开检查
  --lens    焦段 mm（默认 50）：35 广、50 自然、85 压缩感          ← M10 镜头语言
  --move    dolly | orbit：推镜，或绕地球环绕
  --track   path.json  导出每一帧卫星/接收点在画面上的像素坐标     ← M11 3D × 2D 合成
  --transparent        背景透明（PNG 带 alpha），方便叠加 2D 层

原则（对应网页动画的 seek(t) 契约）：
  · 场景完全由脚本从零构建（--factory-startup），不依赖任何已打开的 .blend
  · 所有运动都是关键帧或驱动器 = 帧号的函数；需要随机就用 random.Random(固定种子)
  · 只用数据 API（bpy.data / obj.location），不用依赖界面上下文的 bpy.ops 操作符做动画
"""
import argparse
import math
import sys

import bpy

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--frames", default="1-96")
ap.add_argument("--res", type=int, default=50)
ap.add_argument("--engine", default="eevee", choices=["eevee", "workbench", "cycles"])
ap.add_argument("--out", default="out/blender/")
ap.add_argument("--save", default="")
ap.add_argument("--lens", type=float, default=50)
ap.add_argument("--move", default="dolly", choices=["dolly", "orbit"])
ap.add_argument("--track", default="")
ap.add_argument("--transparent", action="store_true")
args = ap.parse_args(argv)
f0, f1 = (int(x) for x in args.frames.split("-"))

# ── 清空默认场景 ──
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = 24
scene.frame_start, scene.frame_end = f0, f1

PALETTE = {"bg": (0.035, 0.04, 0.06), "earth": (0.13, 0.32, 0.75), "sat": (1.0, 0.35, 0.21), "orbit": (0.6, 0.62, 0.7)}


def material(name, rgb, emission=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*rgb, 1)
    bsdf.inputs["Roughness"].default_value = 0.55
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*rgb, 1)
        bsdf.inputs["Emission Strength"].default_value = emission
    return m


def keyframe(obj, path, frame, value, interp="BEZIER"):
    setattr(obj, path, value)
    obj.keyframe_insert(data_path=path, frame=frame)
    for fc in obj.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = interp


# ── 世界背景 ──
world = bpy.data.worlds.new("World")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (*PALETTE["bg"], 1)
scene.world = world

# ── 地球 ──
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=64, ring_count=32)
earth = bpy.context.object
earth.name = "Earth"
earth.data.materials.append(material("Earth", PALETTE["earth"]))
for p in earth.data.polygons:
    p.use_smooth = True
# 地面接收点（「你」）：挂在地球上，跟着地球转
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(0, -0.94, 0.34))
receiver = bpy.context.object
receiver.name = "Receiver"
receiver.data.materials.append(material("Receiver", (1.0, 0.84, 0.29), emission=1.0))
receiver.parent = earth
keyframe(earth, "rotation_euler", f0, (0, 0, 0), "LINEAR")
keyframe(earth, "rotation_euler", f1, (0, 0, math.radians(40)), "LINEAR")

# ── 4 颗卫星：轨道面（固定倾角）> 自转空物体（只绕本地 Z 转）> 卫星 ──
# 卫星的角位置 = 帧号的线性函数；轨道环挂在轨道面上，卫星永远在环上
sat_mat = material("Sat", PALETTE["sat"], emission=1.0)  # Standard 下 >1 会把颜色顶成白色
orbit_mat = material("Orbit", PALETTE["orbit"], emission=0.6)
for i, (tilt, node, phase, radius) in enumerate([(20, 0, 0, 2.2), (-35, 60, 90, 2.4), (55, 120, 200, 2.3), (-10, 200, 300, 2.5)]):
    plane = bpy.data.objects.new(f"OrbitPlane{i}", None)
    scene.collection.objects.link(plane)
    plane.rotation_euler = (math.radians(tilt), 0, math.radians(node))
    spin = bpy.data.objects.new(f"Spin{i}", None)
    scene.collection.objects.link(spin)
    spin.parent = plane
    keyframe(spin, "rotation_euler", f0, (0, 0, math.radians(phase)), "LINEAR")
    keyframe(spin, "rotation_euler", f1, (0, 0, math.radians(phase + 60)), "LINEAR")
    bpy.ops.mesh.primitive_cube_add(size=0.12, location=(radius, 0, 0))
    sat = bpy.context.object
    sat.name = f"Sat{i}"
    sat.data.materials.append(sat_mat)
    sat.parent = spin
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=0.004, major_segments=128, minor_segments=6)
    ring = bpy.context.object
    ring.data.materials.append(orbit_mat)
    ring.parent = plane

# ── 灯光 ──
sun = bpy.data.objects.new("Sun", bpy.data.lights.new("Sun", "SUN"))
sun.data.energy = 3.5
sun.rotation_euler = (math.radians(50), math.radians(10), math.radians(-40))
scene.collection.objects.link(sun)

# ── 摄影机：--lens 焦段；--move dolly（缓慢推近）或 orbit（绕地球转）──
cam = bpy.data.objects.new("Camera", bpy.data.cameras.new("Camera"))
cam.data.lens = args.lens
scene.collection.objects.link(cam)
scene.camera = cam
target = bpy.data.objects.new("Target", None)
scene.collection.objects.link(target)
aim = cam.constraints.new("TRACK_TO")
aim.target = target
dist = 11.5 * args.lens / 50                                  # 换焦段时保持地球在画面里大小相近
if args.move == "dolly":
    keyframe(cam, "location", f0, (0, -dist, 2.8 * args.lens / 50))
    keyframe(cam, "location", f1, (0, -dist * 0.85, 2.0 * args.lens / 50))
else:
    rig = bpy.data.objects.new("CamRig", None)
    scene.collection.objects.link(rig)
    cam.parent = rig
    cam.location = (0, -dist, 2.4 * args.lens / 50)
    keyframe(rig, "rotation_euler", f0, (0, 0, math.radians(-25)))
    keyframe(rig, "rotation_euler", f1, (0, 0, math.radians(25)))

# ── 渲染设置 ──
r = scene.render
r.resolution_x, r.resolution_y, r.resolution_percentage = 1920, 1080, args.res
r.image_settings.file_format = "PNG"
r.filepath = args.out if args.out.endswith("/") else args.out + "/"
r.filepath += "####"
# 动态图形用 Standard：色板原样输出。默认的 AgX 会压淡饱和度（适合写实，不适合图形）
scene.view_settings.view_transform = "Standard"
if args.transparent:
    r.film_transparent = True
    r.image_settings.color_mode = "RGBA"
if args.engine == "eevee":
    # Blender 4.2–4.5 叫 BLENDER_EEVEE_NEXT，5.x 又改回 BLENDER_EEVEE
    names = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
    r.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in names else "BLENDER_EEVEE"
    scene.eevee.taa_render_samples = 32
elif args.engine == "workbench":
    r.engine = "BLENDER_WORKBENCH"
else:
    r.engine = "CYCLES"
    scene.cycles.device = "CPU"  # Intel Mac + AMD：Blender 4.3 起 Cycles 不支持 Metal GPU
    scene.cycles.samples = 64
    scene.cycles.use_denoising = True

if args.track:
    # 每一帧把物体中心投影到画面上（像素坐标，按 1920×1080、左上角为原点），给 2D 层贴标签用
    import json
    from bpy_extras.object_utils import world_to_camera_view
    from mathutils import Vector
    names = ["Receiver"] + [f"Sat{i}" for i in range(4)]
    frames = {}
    for f in range(f0, f1 + 1):
        scene.frame_set(f)
        pts = {}
        for n in names:
            v = world_to_camera_view(scene, cam, bpy.data.objects[n].matrix_world.translation)
            pts[n] = [round(v.x * 1920, 1), round((1 - v.y) * 1080, 1), round(v.z, 3)]   # z = 到相机的距离
        # 地球：中心 + 画面上的半径（像素）——2D 层用它判断卫星是否被地球挡住
        c = earth.matrix_world.translation
        right = cam.matrix_world.to_quaternion() @ Vector((1, 0, 0))
        vc, ve = world_to_camera_view(scene, cam, c), world_to_camera_view(scene, cam, c + right * 1.0)
        pts["Earth"] = [round(vc.x * 1920, 1), round((1 - vc.y) * 1080, 1), round(vc.z, 3), round(abs(ve.x - vc.x) * 1920, 1)]
        frames[f] = pts
    import os
    os.makedirs(os.path.dirname(bpy.path.abspath(args.track)) or ".", exist_ok=True)   # 此时 Blender 还没建输出目录
    with open(bpy.path.abspath(args.track), "w") as fp:
        json.dump({"fps": scene.render.fps, "frame_start": f0, "frame_end": f1, "frames": frames}, fp)
    print(f"[scene.py] track → {args.track}")

print(f"[scene.py] engine={r.engine} lens={args.lens} move={args.move} frames={f0}-{f1} res={args.res}% → {r.filepath}")
if args.save:
    bpy.ops.wm.save_as_mainfile(filepath=bpy.path.abspath(args.save))
bpy.ops.render.render(animation=True)
