import { defineStore } from 'pinia'
import { Dark } from 'quasar' // Import from quasar

export const useThemeStore = defineStore('theme', {
  state: () => ({
    dark: localStorage.getItem('darkMode') === 'true' // Stored theme in localStorage for persistence
  }),
  actions: {
    // Toggle dark & light theme
    toggleDarkMode() {
      this.dark = !this.dark
      Dark.set(this.dark)
      localStorage.setItem('darkMode', this.dark) // Save the theme in localStorage
    },
    // Set the dark mode to a specific value
    setDarkMode(value) {
      this.dark = value
      Dark.set(value)
      localStorage.setItem('darkMode', value) // Persist the value
    },
    // Initialize the theme on app load based on stored preference
    initTheme() {
      Dark.set(this.dark)
    },
  }
})
