import { defineRouter } from '#q-app/wrappers';
import { useConfigStore } from 'src/stores/store';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes'; // Import routes from a routes.js file

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory); // Dynamically choose history mode based on environment vueRouterMode set in quasar.config.js

  // Clear token on app start to handle terminal-restart scenarios
  localStorage.removeItem('token');

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }), // Reset scroll position on route change
    routes, // Use the imported routes inside routes.js file
    history: createHistory(process.env.VUE_ROUTER_BASE), // Set base URL from environment
  });

  // Navigation guard to protect routes from unauthenticated access
  Router.beforeEach((to, from, next) => {
    const configStore = useConfigStore();

    if (!localStorage.getItem('token') && to.path !== '/login') {
      next('/login'); // Redirect to login if no token exists
    } else if (to.matched.length === 0) {
      next('/login'); // Redirect to login for undefined routes
    } else if (to.meta && to.meta.requiresRole && configStore.userRole !== to.meta.requiresRole) {
      next('/'); // Redirect if user lacks the required role
    } else {
      next(); // Allow navigation
    }
  });

  return Router;
});
