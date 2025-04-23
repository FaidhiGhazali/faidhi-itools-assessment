<template>
  <q-layout view="hHh Lpr lFf">

    <AppHeader @toggle-drawer="toggleLeftDrawer"/>
    <LeftPanel v-model="leftDrawerOpen"/>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from 'src/components/AppHeader.vue'
import LeftPanel from 'src/components/LeftPanel.vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
