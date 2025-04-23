import { defineRouter } from '#q-app/wrappers'
import { useConfigStore } from 'src/stores/store'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const configStore = useConfigStore();

    if (!configStore.isAuthenticated && to.path !== '/login') {
      next('/login');
    } else if (to.matched.length === 0) {
      if (configStore.isAuthenticated) {
        next('/');
      } else {
        next('/login');
      }
    } else {
      next();
    }

  });

  return Router
})
