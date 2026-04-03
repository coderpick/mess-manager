import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/LandingPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('../views/SetupPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardPage.vue'),
    meta: { requiresAuth: true, requiresMess: true }
  },
  {
    path: '/meals',
    name: 'Meals',
    component: () => import('../views/MealsPage.vue'),
    meta: { requiresAuth: true, requiresMess: true }
  },
  {
    path: '/bazaar',
    name: 'Bazaar',
    component: () => import('../views/BazaarPage.vue'),
    meta: { requiresAuth: true, requiresMess: true }
  },
  {
    path: '/deposits',
    name: 'Deposits',
    component: () => import('../views/DepositsPage.vue'),
    meta: { requiresAuth: true, requiresMess: true }
  },
  {
    path: '/summary',
    name: 'Summary',
    component: () => import('../views/SummaryPage.vue'),
    meta: { requiresAuth: true, requiresMess: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminPage.vue'),
    meta: { requiresAuth: true, requiresMess: true }
  },
  {
    path: '/admin/meals/:userId',
    name: 'AdminMealEdit',
    component: () => import('../views/AdminMealEditPage.vue'),
    meta: { requiresAuth: true, requiresMess: true, requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function getCurrentUser() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(null)
    }, 3000)
    const unsub = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout)
      unsub()
      resolve(user)
    })
  })
}

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  if (user && to.meta.requiresMess) {
    // dynamically import store inside guard
    const authStoreReq = await import('../stores/authStore')
    const authStore = authStoreReq.useAuthStore()
    // if hard reload, authStore profile might not be loaded yet
    if (!authStore.userProfile) {
      await authStore.init()
    }
    if (!authStore.userProfile?.messId) {
      return next('/setup')
    }
  }

  if (to.meta.requiresAdmin) {
    const messStoreReq = await import('../stores/messStore')
    const messStore = messStoreReq.useMessStore()
    if (!messStore.isAdmin) {
      return next('/dashboard')
    }
  }

  if (to.meta.guest && user) {
    return next('/dashboard')
  }
  next()
})

export default router
