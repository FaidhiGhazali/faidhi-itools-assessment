<template>
  <q-header >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="emit('toggle-drawer')"
        />

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

const themeStore = useThemeStore()
const fullname = ref('')

const emit = defineEmits(['toggle-drawer'])

onMounted(() => {
  fullname.value = localStorage.getItem('fullname') || 'User'
})


</script>
