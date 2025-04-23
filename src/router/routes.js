// List all routes and lazy-loaded pages
const routes = [
  {
    path: '/', // Root path of the application
    component: () => import('layouts/MainLayout.vue'), // Main layout wrapper for the nested pages
    children: [
      { path: '', component: () => import('pages/HomePage.vue') }, // This is the default child route (example: when user visits "/")
      { path: 'about', component: () => import('pages/AboutPage.vue') }, // Render About when user choose from left panel
      { path: 'contact', component: () => import('pages/ContactUs.vue') },// Render ContactUs when user choose from left panel
      { path: 'admin', component: () => import('pages/AdminPage.vue'), meta: { requiresAuth: true, requiresRole: 'admin' } }, // Render Admin based on roles

    ]
  },
  {
    path: '/login', // Standalone login page route
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/:catchAll(.*)*', // Catch-all route for undefined paths
    redirect: '/' // Redirects to the home page if the route is not exixts
  }
]

export default routes
