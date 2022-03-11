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
        path: '/user/:id',
        component: () => import('pages/User.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/groups',
        component: () => import('pages/Groups.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/group/:id',
        component: () => import('pages/Group.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/studies',
        component: () => import('pages/Studies.vue'),
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/datasets',
        component: () => import('pages/Datasets.vue'),
        meta: { requiresAuth: true, noGuest: true }
      }
    ]
  },
  {
    path: '/study',
    component: () => import('layouts/StudyLayout.vue'),
    children: [
      {
        path: '/study/:id',
        component: () => import('pages/StudyForms.vue'),
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/forms',
        component: () => import('pages/StudyForms.vue'),
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/form/:fid',
        component: () => import('pages/StudyForm.vue'),
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/crfs',
        component: () => import('pages/StudyCaseReportForms.vue'),
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/records',
        component: () => import('pages/StudyRecords.vue'),
        meta: { requiresAuth: true, noGuest: true }
      }
    ]

  },
  {
    path: '/maintenance',
    component: () => import('pages/Maintenance.vue')
  },
  {
    path: '/loading',
    component: () => import('pages/Loading.vue')
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/register',
    component: () => import('pages/Register.vue')
  },
  {
    path: '/forgot-password',
    component: () => import('pages/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    component: () => import('pages/ResetPassword.vue')
  },
  {
    path: '/verify',
    component: () => import('pages/Verify.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
