import { defineStore } from 'pinia'
import { Dark } from 'quasar'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    dark: localStorage.getItem('darkMode') === 'true'
  }),
  actions: {
    toggleDarkMode() {
      this.dark = !this.dark
      Dark.set(this.dark)
      localStorage.setItem('darkMode', this.dark)
    },
    setDarkMode(value) {
      this.dark = value
      Dark.set(value)
      localStorage.setItem('darkMode', value)
    },
    initTheme() {
      Dark.set(this.dark)
    },
  }
})
