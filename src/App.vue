<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useConfigStore } from './stores/store.js'
import { useThemeStore } from './stores/theme.js'
import { useRouter } from 'vue-router'

const configStore = useConfigStore()
const themeStore = useThemeStore()
const router = useRouter()

onMounted(() => {
  // Initialize token interceptor and theme
  configStore.initTokenInterceptor()
  themeStore.initTheme()

  // Clear authentication state on app start (force redirect to login if not authenticated)
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')

  // Check if user is authenticated, if not, redirect to login
  if (!configStore.isAuthenticated) {
    router.push('/login') // Redirect to the login page
  }
})
</script>
