import { defineStore } from 'pinia'
import { parseGerber } from '../lib/parseGerber'
import { useUiStore } from './ui'

export const useOptionsStore = defineStore('options', {
  state: () => ({
    file: null,
    layer: '',
    units: 'mm',
    scale: 1,
    dpi: 300,
    invert: false,
    primitives: [],
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

      const reader = new FileReader()
      reader.onload = () => {
        try {
          this.primitives = parseGerber(reader.result)
        } catch (e) {
          this.primitives = []
          useUiStore().addToast(e.message)
        }
      }
      reader.readAsText(file)
    },
  },
})
