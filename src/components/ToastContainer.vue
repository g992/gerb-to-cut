<script setup>
import { useUiStore } from '../stores/ui'

const ui = useUiStore()
</script>

<template>
  <div class="fixed bottom-4 right-4 space-y-2">
    <div
      v-for="t in ui.toasts"
      :key="t.id"
      class="bg-gray-800 text-white px-3 py-2 rounded shadow"
    >
      {{ t.message }}
    </div>
  </div>
</template>
