const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', 
        component: () => import('pages/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/metrics',
        component: () => import('src/pages/Metrics.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/account',
        component: () => import('src/pages/Account.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/users', 
        component: () => import('src/pages/Users.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/groups', 
        component: () => import('src/pages/Users.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/studies', 
        component: () => import('src/pages/Studies.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/forms', 
        component: () => import('src/pages/Forms.vue'),
        meta: { requiresAuth: true }
      },
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
    path: "/register",
    component: () => import("pages/Register.vue")
  },
  {
    path: '/lock',
    component: () => import('pages/LockScreen.vue')
  }
]

export default routes
