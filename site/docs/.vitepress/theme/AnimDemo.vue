<script setup lang="ts">
// 活体示例播放器：demo 自己不跑时钟，只暴露 seek(t)；时钟在这里（播放器）手里。
// 这正是渲染器的工作方式——所以网站上能拖动的，就一定能被逐帧渲染出片。
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(defineProps<{ src: string; caption?: string; poster?: number }>(), { poster: 0 })

type Meta = { duration: number; fps: number; width: number; height: number }
const frame = ref<HTMLIFrameElement>()
const meta = ref<Meta | null>(null)
const t = ref(0)
const playing = ref(false)
const speed = ref(1)
let raf = 0
let last = 0

const win = () => frame.value?.contentWindow as (Window & { seek?: (t: number) => void; __meta?: Meta }) | null

function seek(v: number) {
  if (!meta.value) return
  t.value = Math.min(Math.max(v, 0), meta.value.duration)
  win()?.seek?.(t.value)
}
function loop(now: number) {
  if (!playing.value || !meta.value) return
  const next = t.value + ((now - last) / 1000) * speed.value
  last = now
  seek(next >= meta.value.duration ? 0 : next)
  raf = requestAnimationFrame(loop)
}
function toggle() {
  playing.value = !playing.value
  if (playing.value) { last = performance.now(); raf = requestAnimationFrame(loop) }
}
function step(n: number) {
  if (!meta.value) return
  playing.value = false
  const f = 1 / meta.value.fps
  seek(Math.round(t.value / f) * f + n * f)
}
function onLoad() {
  const m = win()?.__meta
  if (!m) return
  meta.value = m
  seek(props.poster)
}
onMounted(() => { if (frame.value?.contentDocument?.readyState === 'complete') onLoad() }) // SSR 水合前 iframe 可能已加载完
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <figure class="anim-demo">
    <iframe ref="frame" :src="withBase(src)" @load="onLoad" loading="lazy"
      :style="{ aspectRatio: meta ? `${meta.width} / ${meta.height}` : '16 / 9' }" />
    <div class="bar" v-if="meta">
      <button @click="step(-1)" title="上一帧">⏮</button>
      <button @click="toggle" :title="playing ? '暂停' : '播放'">{{ playing ? '❚❚' : '▶' }}</button>
      <button @click="step(1)" title="下一帧">⏭</button>
      <input type="range" min="0" :max="meta.duration" :step="1 / meta.fps" :value="t"
        @input="(e) => { playing = false; seek(+(e.target as HTMLInputElement).value) }" />
      <span class="time">{{ t.toFixed(2) }}s · f{{ Math.round(t * meta.fps) }}</span>
      <select v-model.number="speed" title="播放速度">
        <option :value="0.25">0.25×</option><option :value="0.5">0.5×</option><option :value="1">1×</option>
      </select>
      <a :href="withBase(src)" target="_blank" title="新窗口打开源码">源码 ↗</a>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.anim-demo { margin: 20px 0; border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden; background: var(--vp-c-bg-soft); }
iframe { width: 100%; border: 0; display: block; background: #000; }
.bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 13px; }
.bar button { min-width: 30px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.bar input[type=range] { flex: 1; }
.time { font-family: var(--vp-font-family-mono); min-width: 96px; text-align: right; }
.bar select { border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 1px 4px; background: var(--vp-c-bg); }
.bar a { white-space: nowrap; }
figcaption { padding: 0 12px 10px; font-size: 13px; color: var(--vp-c-text-2); }
</style>
