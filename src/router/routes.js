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
        component: () => import('pages/Metrics.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/account',
        component: () => import('pages/Account.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/users', 
        component: () => import('pages/Users.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/groups', 
        component: () => import('pages/Groups.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/studies', 
        component: () => import('pages/Studies.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/forms', 
        component: () => import('pages/Forms.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/datasets',
        component: () => import('pages/Datasets.vue'),
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
    path: "/forgot-password",
    component: () => import("pages/ForgotPassword.vue")
  },
  {
    path: "/reset-password",
    component: () => import("pages/ResetPassword.vue")
  },
  {
    path: "/verify",
    component: () => import("pages/Verify.vue")
  },
  {
    path: '/lock',
    component: () => import('pages/LockScreen.vue')
  }
]

export default routes
