<template>
  <!-- Application top header -->
  <q-header >
    <!-- Toolbar inside the header -->
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="emit('toggle-drawer')"
        />

        <!-- Display user name from localStorage -->
        <q-toolbar-title>
          Welcome, {{ fullname }}
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          :icon="themeStore.dark ? 'dark_mode' : 'light_mode'"
          @click="themeStore.toggleDarkMode"
          aria-label="Toggle Dark Mode"
        />
      </q-toolbar>

    </q-header>

</template>
<script setup>
import { useThemeStore } from '../stores/theme'
import { ref, onMounted } from 'vue'

// Access the theme store
const themeStore = useThemeStore()
const fullname = ref('')

// Define emitted events from this component
const emit = defineEmits(['toggle-drawer'])

// When the component is mounted, get the full name from localStorage
onMounted(() => {
  fullname.value = localStorage.getItem('fullname') || 'User'
})


</script>
