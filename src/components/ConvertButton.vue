<script setup>
import { useOptionsStore } from '../stores/options'
import { useUiStore } from '../stores/ui'
import { generateDxf } from '../lib/dxf.service'

const store = useOptionsStore()
const ui = useUiStore()

function convert() {
  const layers = [
    { name: store.layer || 'Layer1', primitives: store.primitives }
  ]
  const dxf = generateDxf(layers, { units: store.units, scale: store.scale })
  const blob = new Blob([dxf], { type: 'application/dxf' })
  const url = URL.createObjectURL(blob)
  const name = store.file ? store.file.name.replace(/\.[^.]+$/, '.dxf') : 'output.dxf'
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
  ui.addToast('DXF ready')
}
</script>

<template>
  <button
    class="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
    :disabled="!store.isValid"
    @click="convert"
  >
    Convert &amp; Download
  </button>
</template>
