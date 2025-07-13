<script setup>
import { useOptionsStore } from '../stores/options'

const store = useOptionsStore()
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Layer</label>
      <select v-model="store.layer" class="border rounded w-full p-2">
        <option value="Top">Top</option>
        <option value="Bottom">Bottom</option>
        <option value="Outline">Outline</option>
        <option value="Unknown">Unknown</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Units</label>
      <select v-model="store.units" class="border rounded w-full p-2">
        <option value="mm">Millimetres</option>
        <option value="inch">Inches</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Scale</label>
      <input
        type="number"
        step="0.01"
        min="0.01"
        v-model.number="store.scale"
        class="border rounded w-full p-2"
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">DPI: {{ store.dpi }}</label>
      <input
        type="range"
        min="72"
        max="1200"
        v-model.number="store.dpi"
        class="w-full"
      />
    </div>
    <div class="flex items-center">
      <input type="checkbox" id="invert" v-model="store.invert" class="mr-2" />
      <label for="invert">Invert polarity</label>
    </div>
  </div>
</template>
