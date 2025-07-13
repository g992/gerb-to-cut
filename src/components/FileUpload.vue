<script setup>
import { ref, computed } from "vue";
import { useOptionsStore } from "../stores/options";
import { useUiStore } from "../stores/ui";

const store = useOptionsStore();
const ui = useUiStore();

const dragActive = ref(false);
const input = ref(null);

const icon = computed(() => {
  if (!store.file) return "";
  const ext = store.file.name.split(".").pop().toLowerCase();
  if (ext === "zip") return "📦";
  if (ext === "gtp") return "⬆️";
  if (ext === "gbr") return "📄";
  return "📄";
});

function handleFiles(files) {
  if (!files.length) return;
  const file = files[0];
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["gtp", "gbr", "zip"].includes(ext)) {
    ui.addToast("Unsupported file type");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    ui.addToast("File too large");
    return;
  }
  store.setFile(file);
}

function onDrop(e) {
  e.preventDefault();
  dragActive.value = false;
  handleFiles(e.dataTransfer.files);
}
</script>

<template>
  <div
    class="border-2 border-dashed rounded p-6 text-center"
    :class="{ 'bg-blue-50': dragActive }"
    @dragover.prevent="dragActive = true"
    @dragleave.prevent="dragActive = false"
    @drop="onDrop"
  >
    <input
      type="file"
      multiple
      class="hidden"
      ref="input"
      @change="handleFiles($event.target.files)"
    />
    <p class="mb-2">Drag & drop Gerber or ZIP here</p>
    <button
      class="underline text-blue-600"
      type="button"
      @click="input.click()"
    >
      Browse
    </button>
    <p
      v-if="store.file"
      class="mt-2 text-sm text-gray-700 flex items-center justify-center space-x-1"
    >
      <span>{{ icon }}</span>
      <span>
        {{ store.file.name }} ({{ (store.file.size / 1024).toFixed(1) }} kB)
      </span>
    </p>
  </div>
</template>
