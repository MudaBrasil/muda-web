import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/users/Register.vue'
import ResetPassword from '../views/users/ResetPassword.vue'
import { UserStore } from '@/stores/user'
import Timeline from '@/views/Timeline.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			alias: '/logout',
			name: 'login',
			component: Login,
			meta: { exceptAuth: true }
		},
		{
			path: '/register',
			name: 'register',
			component: Register,
			meta: { exceptAuth: true }
		},
		{
			path: '/reset-password',
			name: 'reset-password',
			component: ResetPassword,
			meta: { exceptAuth: true }
		},
		{
			path: '/',
			name: 'main',
			component: Main,
			meta: { requiresAuth: true },
			children: [
				{
					path: '/',
					name: 'home',
					component: Home
				},
				{
					path: '/dashboard',
					name: 'dashboard',
					component: Dashboard
				},

				{
					path: '/timeline',
					name: 'timeline',
					component: Timeline
				},
				{
					path: '/timeline/spaces/:spaceId/lists/:listId',
					name: 'timelineSpaceList',
					props: true,
					component: Timeline
				}
			]
		},
		{
			path: '/rennan',
			name: 'rennan',
			component: () => import('../views/Rennan.vue')
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('../views/NotFound.vue')
		}
	]
})

const noRedirectPaths = ['/', '/login', '/logout', '/register', '/reset-password']
const verifyRedirect = to => (noRedirectPaths.includes(to) ? undefined : to)

router.beforeEach(to => {
	const userStore = UserStore()
	if (to.path === '/logout' && userStore.auth.isLogged) {
		return userStore.googleLogout().then(() => {
			return { path: '/login', query: { redirect: verifyRedirect(to.query.redirect) } }
		})
	}
	if (to.meta.requiresAuth && !userStore.auth.isLogged) {
		return { path: '/login', query: { redirect: verifyRedirect(to.fullPath) } }
	}

	if (to.meta.exceptAuth && userStore.auth.isLogged) {
		return { path: '/dashboard' }
	}
})

// router.beforeResolve(async (to) => {
// const userStore = UserStore()
// if (to.meta.exceptAuth && !userStore.auth.isLogged) {
// }
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
