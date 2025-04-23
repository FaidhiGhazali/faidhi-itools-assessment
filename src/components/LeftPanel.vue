<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
  >
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            clickable
            v-ripple
            :active="isActive(menuItem.route)"
            :to="!menuItem.action ? menuItem.route : undefined"
            @click="menuItem.action ? menuItem.action() : null"
            >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index" v-if="menuItem.separator" />
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useConfigStore } from '../stores/store';

const route = useRoute();
const router = useRouter();
const configStore = useConfigStore();

const leftDrawerOpen = ref(false);

const isActive = (path) => computed(() => route.path === path).value;

const menuList = [
  {
    icon: 'house',
    label: 'Home',
    route: '/',
    separator: false
  },
  {
    icon: 'info',
    label: 'About',
    route: '/about',
    separator: false
  },
  {
    icon: 'call',
    label: 'Contact Us',
    route: '/contact',
  },
  {
    icon: 'logout',
    label: 'Logout',
    separator: true,
    action: () => onLogout()
  }
];

const onLogout = () => {
  configStore.logout();
  router.replace('/login');
};
</script>
