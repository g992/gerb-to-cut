import { defineStore } from 'pinia'

export const useOptionsStore = defineStore('options', {
  state: () => ({
    file: null,
    layer: '',
    units: 'mm',
    scale: 1,
    dpi: 300,
    invert: false,
  }),
  getters: {
    isValid: (state) =>
      !!state.file && state.scale > 0 && state.dpi >= 72 && state.dpi <= 1200,
  },
  actions: {
    setFile(file) {
      this.file = file
      const ext = file.name.split('.').pop().toLowerCase()
      if (ext === 'gtp') this.layer = 'Top'
      else if (ext === 'gbr') this.layer = 'Outline'
      else this.layer = 'Unknown'
    },
  },
})
