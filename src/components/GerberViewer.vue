<script setup>
import { ref, watch, computed } from 'vue'
import { useOptionsStore } from '../stores/options'

const store = useOptionsStore()
const view = ref(null)
const pan = ref({ x: 0, y: 0 })
const zoom = ref(1)
const dragging = ref(false)
const last = ref({ x: 0, y: 0 })

const bbox = computed(() => store.bbox)

function onWheel(e) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  zoom.value *= delta
}
function onDown(e) {
  dragging.value = true
  last.value = { x: e.clientX, y: e.clientY }
}
function onMove(e) {
  if (!dragging.value) return
  pan.value.x += (e.clientX - last.value.x)
  pan.value.y += (e.clientY - last.value.y)
  last.value = { x: e.clientX, y: e.clientY }
}
function onUp() {
  dragging.value = false
}

watch(
  () => [store.primitives, store.scale, store.dpi, store.invert],
  () => {
    // trigger re-render by updating zoom slightly
    zoom.value = zoom.value * 1
  }
)
</script>

<template>
  <div class="border rounded relative overflow-hidden select-none">
    <svg
      ref="view"
      :width="bbox?.width || 100"
      :height="bbox?.height || 100"
      @wheel="onWheel"
      @mousedown="onDown"
      @mousemove="onMove"
      @mouseup="onUp"
      @mouseleave="onUp"
    >
      <g
        :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`"
        stroke-width="1"
        fill="none"
      >
        <template v-for="(p, i) in store.primitives" :key="i">
          <line
            v-if="p.type === 'line'"
            :x1="p.x1"
            :y1="p.y1"
            :x2="p.x2"
            :y2="p.y2"
            stroke="gray"
          />
          <circle
            v-else-if="p.type === 'circle' || p.type === 'flash'"
            :cx="p.cx"
            :cy="p.cy"
            :r="p.r || 0.5"
            stroke="skyblue"
          />
        </template>
      </g>
    </svg>
    <div v-if="bbox" class="absolute bottom-1 right-1 text-xs bg-white bg-opacity-75 p-1 rounded">
      {{ bbox.width.toFixed(2) }} x {{ bbox.height.toFixed(2) }} mm,
      {{ store.primitives.length }} primitives
    </div>
  </div>
</template>

<style scoped>
svg {
  width: 100%;
  height: 400px;
  cursor: grab;
}
</style>
