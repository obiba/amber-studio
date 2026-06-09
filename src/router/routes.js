// Layouts
import MainLayout from 'layouts/MainLayout.vue'
import StudyLayout from 'layouts/StudyLayout.vue'

// Main pages
import Dashboard from 'pages/Dashboard.vue'
import Account from 'pages/Account.vue'
import Users from 'pages/Users.vue'
import User from 'pages/User.vue'
import Groups from 'pages/Groups.vue'
import Group from 'pages/Group.vue'
import Tasks from 'pages/Tasks.vue'
import Studies from 'pages/Studies.vue'
import Datasets from 'pages/Datasets.vue'

// Study pages
import Study from 'pages/Study.vue'
import StudyForms from 'pages/StudyForms.vue'
import StudyForm from 'pages/StudyForm.vue'
import StudyCaseReportForms from 'pages/StudyCaseReportForms.vue'
import StudyCaseReports from 'pages/StudyCaseReports.vue'
import StudyInterviewDesigns from 'pages/StudyInterviewDesigns.vue'
import StudyInterviewDesign from 'pages/StudyInterviewDesign.vue'
import StudyInterviews from 'pages/StudyInterviews.vue'

// Auth pages
import Login from 'pages/Login.vue'
import Register from 'pages/Register.vue'
import ForgotPassword from 'pages/ForgotPassword.vue'
import ResetPassword from 'pages/ResetPassword.vue'
import Verify from 'pages/Verify.vue'

// Other pages
import Maintenance from 'pages/Maintenance.vue'
import Loading from 'pages/Loading.vue'
import Error404 from 'pages/Error404.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Dashboard,
        meta: { requiresAuth: true }
      },
      {
        path: '/account',
        component: Account,
        meta: { requiresAuth: true }
      },
      {
        path: '/users',
        component: Users,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/user/:id',
        component: User,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/groups',
        component: Groups,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/group/:id',
        component: Group,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/tasks',
        component: Tasks,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/studies',
        component: Studies,
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/datasets',
        component: Datasets,
        meta: { requiresAuth: true, noGuest: true }
      }
    ]
  },
  {
    path: '/study',
    component: StudyLayout,
    children: [
      {
        path: '/study/:id',
        component: Study,
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/forms',
        component: StudyForms,
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/form/:fid',
        component: StudyForm,
        meta: { requiresAuth: true, noGuest: true }
      },
      { // deprecated
        path: '/study/:id/crfs',
        redirect: to => {
          return { path: `/study/${to.params.id}/case-report-forms` }
        }
      },
      {
        path: '/study/:id/case-report-forms',
        component: StudyCaseReportForms,
        meta: { requiresAuth: true, noGuest: true }
      },
      { // deprecated
        path: '/study/:id/records',
        redirect: to => {
          return { path: `/study/${to.params.id}/case-reports` }
        }
      },
      {
        path: '/study/:id/case-reports',
        component: StudyCaseReports,
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/interview-designs',
        component: StudyInterviewDesigns,
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/interview-design/:itwid',
        component: StudyInterviewDesign,
        meta: { requiresAuth: true, noGuest: true }
      },
      {
        path: '/study/:id/interviews',
        component: StudyInterviews,
        meta: { requiresAuth: true, noGuest: true }
      }
    ]

  },
  {
    path: '/maintenance',
    component: Maintenance
  },
  {
    path: '/loading',
    component: Loading
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/forgot-password',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    component: ResetPassword
  },
  {
    path: '/verify',
    component: Verify
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: Error404
  }
]

export default routes
