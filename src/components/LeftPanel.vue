<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
  >
    <div class="column fit">
      <!-- Top menu (Home, About, Contact Us) -->
      <q-scroll-area class="col">
        <q-list>
          <template v-for="(menuItem, index) in topMenu" :key="index">
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

      <q-list class="q-mt-auto">
        <template v-for="(menuItem, index) in bottomMenu" :key="'bottom' + index">
          <q-separator v-if="menuItem.separator" />
          <q-item
            clickable
            v-ripple
            @click="menuItem.action ? menuItem.action() : null"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
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

// Function to determine if a route is active (for highlighting menu item)
const isActive = (path) => computed(() => route.path === path).value;

// Show Admin tab only with user role admin. Current user is staff roles only
const topMenu = computed(() =>
  menuList.filter(item => {
    if (item.label === 'Admin' && configStore.userRole !== 'admin') return false;
    return !item.bottom;
  })
);
const bottomMenu = computed(() => menuList.filter(item => item.bottom));

// Define menu items for the drawer
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
    label: 'Contact',
    route: '/contact',
  },
  {
    icon: 'people',
    label: 'Admin',
    route: '/admin',
  },
  {
    icon: 'logout',
    label: 'Logout',
    separator: true,
    bottom: true,
    action: () => onLogout() // Call logout function when clicked
  }
];

// Logout function
const onLogout = () => {
  configStore.logout(); // Clear auth state from store
  router.replace('/login'); // Redirect to login page
};
</script>
