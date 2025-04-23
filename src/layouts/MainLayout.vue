<template>
  <!-- QLayout defines the main structure of the app layout -->
  <q-layout view="hHh Lpr lFf">
    <!-- Custom header component, emits event to toggle the left drawer -->
    <AppHeader @toggle-drawer="toggleLeftDrawer"/>
    <!-- Custom left drawer panel, two-way bound to control open/close state -->
    <LeftPanel v-model="leftDrawerOpen"/>
    <!-- Main page content container, where route pages will be rendered -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from 'src/components/AppHeader.vue'
import LeftPanel from 'src/components/LeftPanel.vue'

// State for controlling the visibility of the left drawer
const leftDrawerOpen = ref(false)

// Function to toggle drawer open/close state
function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
