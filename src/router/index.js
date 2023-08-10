import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/users/Register.vue'
import ResetPassword from '../views/users/ResetPassword.vue'
import { UserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/register',
      name: 'register',
      component: Register
    }, {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword
    }, {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    }, {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach(to => {
  const userStore = UserStore()

  if (to.meta.requiresAuth && !userStore.isLogged) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

// router.beforeResolve(async to => {
//   if (to.meta.requiresCamera) {
//     try {
//       await askForCameraPermission()
//     } catch (error) {
//       if (error instanceof NotAllowedError) {
//         // ... handle the error and then cancel the navigation
//         return false
//       } else {
//         // unexpected error, cancel the navigation and pass the error to the global handler
//         throw error
//       }
//     }
//   }
// })

export default router
