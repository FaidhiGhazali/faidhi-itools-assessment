import { defineRouter } from '#q-app/wrappers'
import { useConfigStore } from 'src/stores/store'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes' // Import route from a routes.js file

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory) // Dynamically choose history mode based on environment vueRouterMode set in quasar.config.js

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }), // Reset scroll position on route change
    routes, // Use the imported routes inside routes.js file
    history: createHistory(process.env.VUE_ROUTER_BASE) // Set base URL from environment
  })

  // Navigation guard to protect routes from unauthenticated access
  Router.beforeEach((to, from, next) => {
    const configStore = useConfigStore();

    // If the user is not authenticated and trying to access a protected route, redirect to login
    if (!configStore.isAuthenticated && to.path !== '/login') {
      next('/login');
    }
    // If route doesn't match any defined routes (404), redirect accordingly
    else if (to.matched.length === 0) {
      if (configStore.isAuthenticated) {
        next('/'); // Go to home page
      } else {
        next('/login');// Go to login page
      }
    }
    // Role-based access control
    else if (to.meta && to.meta.requiresRole && configStore.userRole !== to.meta.requiresRole) {
      next('/'); // Redirect if user does not have required role
    }
    // Otherwise, allow the navigation
    else {
      next();
    }

  });

  return Router
})
