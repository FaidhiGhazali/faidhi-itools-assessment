<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useConfigStore } from './stores/store.js'
import { useThemeStore } from './stores/theme.js'

const configStore = useConfigStore()
const themeStore = useThemeStore()

onMounted(() => {
  configStore.initTokenInterceptor()
  themeStore.initTheme()
})
</script>
