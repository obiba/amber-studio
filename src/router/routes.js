const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Dashboard.vue')},
      {path: '/metrics', component: () => import('src/pages/Metrics.vue')},
      {path: '/profile', component: () => import('pages/UserProfile.vue')},
      {path: '/users', component: () => import('src/pages/Users.vue')},
      {path: '/studies', component: () => import('src/pages/Studies.vue')},
      {path: '/forms', component: () => import('src/pages/Forms.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  },
  {
    path: '/mail',
    component: () => import('layouts/Mail.vue')
  },
  {
    path: '/maintenance',
    component: () => import('pages/Maintenance.vue')
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/lock',
    component: () => import('pages/LockScreen.vue')
  }
]

export default routes
