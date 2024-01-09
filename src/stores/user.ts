import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/services/firebase'
import { saveUser } from '../services/firestore/users'
import {
	createUserWithEmailAndPassword,
	// signInWithEmailAndPassword,
	signOut,
	updateProfile,
	sendPasswordResetEmail,
	GoogleAuthProvider,
	signInWithPopup
	// TODO: maybe use setPersistence to persist the user login(But today this maybe is already resolved)
} from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import firebaseErrors from '@/assets/errors/firebase-error-messages.json'
import { Nullable } from 'vitest'
import { axiosInject } from '@/services/axios'
import { useRouter, useRoute } from 'vue-router'
import { NotificationStore } from '@/stores/notification'

class userModel {
	uid = ''
	email = ''
	isLogged = false
	displayName = ''
	phoneNumber = ''
	photoURL = ''
	userAlreadyRedirected = false
	createdAt: Date | Nullable<null>
	lastLogin: Date | Nullable<null>
}

// TODO: Fazer internacionalização dos textos testando o i18n ou do jeito que eu fiz antes
export const UserStore = defineStore(
	'user',
	() => {
		const axios = axiosInject()
		const route = useRoute()
		const router = useRouter()
		const user = ref(new userModel())
		const isLogoutRunning = ref(false)

		const reset = () => (user.value = new userModel())
		const resetAndLogout = () => {
			reset()
			if (route.name !== 'login' && !isLogoutRunning.value) {
				router.push({ path: '/logout', query: { redirect: route.fullPath } })
				return true
			}
			return false
		}

		auth?.onAuthStateChanged(sync, resetAndLogout)

		// TODO: Talvez criar um store para os erros
		function getError(error) {
			const code = error.code || firebaseErrors[0].code
			const message = error.message || firebaseErrors[0].message

			return firebaseErrors.find(e => e.code === code) || { id: 0, code, message }
		}

		function sync(newUserData) {
			if (newUserData) {
				user.value = {
					uid: newUserData.uid,
					email: newUserData.email,
					isLogged: true,
					displayName: newUserData.displayName,
					phoneNumber: newUserData.phoneNumber,
					photoURL: newUserData.photoURL,
					userAlreadyRedirected: user.value.userAlreadyRedirected,
					createdAt: new Date(parseInt(newUserData.metadata?.createdAt ?? null)),
					lastLogin: new Date(parseInt(newUserData.metadata?.lastLoginAt ?? null))
				}
				const createdAt = Timestamp.fromMillis(user.value.createdAt?.getTime() ?? 0)
				saveUser({ ...user.value, createdAt })
				if (!user.value.userAlreadyRedirected) {
					user.value.userAlreadyRedirected = true

					const redirectPath: any = route.query.redirect || '/'
					router.push(redirectPath)
				}
			} else {
				resetAndLogout()
			}
		}

		function register(newUser) {
			sync(auth.currentUser)
			return createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
				.then(() => {
					if (auth.currentUser) {
						updateProfile(auth.currentUser, { displayName: newUser.name }).then(() => {})
					} else {
						throw new Error('Erro ao criar o usuário')
					}
				})
				.catch(error => {
					reset()
					throw new Error(getError(error).message)
				})
		}

		function resetPassword(email) {
			return sendPasswordResetEmail(auth, email).catch(error => {
				throw new Error(getError(error).message)
			})
		}

		function googleLogin() {
			const provider = new GoogleAuthProvider()
			provider.addScope('profile')
			provider.addScope('email')
			provider.addScope('openid')

			return signInWithPopup(auth, provider)
				.then(async response => axios.googleLogin(response.user))
				.catch(error => {
					reset()
					throw new Error(getError(error).message)
				})
		}

		async function googleLogout() {
			if (isLogoutRunning.value) return

			isLogoutRunning.value = true

			await axios.googleLogout().catch(({ title, description }) => {
				NotificationStore().error({ title, description })
			})

			signOut(auth)
			isLogoutRunning.value = false
			resetAndLogout()

			return true
		}

		return {
			sync,
			user,
			register,
			resetPassword,
			googleLogin,
			googleLogout
		}
	},
	{ persist: true }
)
