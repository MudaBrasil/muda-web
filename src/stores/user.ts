import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/services/firebase'
import { saveUser } from '../services/firestore/users'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	sendPasswordResetEmail,
	GoogleAuthProvider,
	signInWithPopup
} from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import firebaseErrors from '@/assets/errors/firebase-error-messages.json'
import { Nullable } from 'vitest'
import { axiosInject } from '@/services/axios'
import { useRouter, useRoute } from 'vue-router'

class userModel {
	uid = ''
	email = ''
	isLogged = false
	displayName = ''
	phoneNumber = ''
	photoURL = ''
	createdAt: Date | Nullable<null>
	lastLogin: Date | Nullable<null>
}

export const UserStore = defineStore(
	'user',
	() => {
		const axios = axiosInject()

		const route = useRoute()
		const router = useRouter()

		auth?.onAuthStateChanged(sync)

		const isLogoutRunning = ref(false)
		const user = ref(new userModel())
		const reset = () => (user.value = new userModel())

		// TODO: Fazer internacionalização dos textos testando o i18n ou do jeito que eu fiz antes
		// TODO: Talvez criar um store para os erros

		function getError(error) {
			const code = error.code || firebaseErrors[0].code
			const message = error.message || firebaseErrors[0].message

			return firebaseErrors.find((e) => e.code === code) || { id: 0, code, message }
		}

		function sync(newUser) {
			if (newUser) {
				const redirectPath: any = route.query.redirect || '/'
				router.push(redirectPath)

				user.value = {
					uid: newUser.uid,
					email: newUser.email,
					isLogged: true,
					displayName: newUser.displayName,
					phoneNumber: newUser.phoneNumber,
					photoURL: newUser.photoURL,
					createdAt: new Date(parseInt(newUser.metadata?.createdAt ?? null)),
					lastLogin: new Date(parseInt(newUser.metadata?.lastLoginAt ?? null))
				}
				const createdAt = Timestamp.fromMillis(user.value.createdAt?.getTime() ?? 0)
				saveUser({ ...user.value, createdAt })
			} else {
				reset()
				if (route.name !== 'login' && !isLogoutRunning.value) {
					router.push('/logout')
				}
			}
		}

		// function logIn(user) {
		// 	return signInWithEmailAndPassword(auth, user.email, user.password).catch((error) => {
		// 		reset()
		// 		throw new Error(getError(error).message)
		// 	})
		// }

		// function logOut() {
		// 	reset()
		// 	return signOut(auth)
		// }

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
				.catch((error) => {
					reset()
					throw new Error(getError(error).message)
				})
		}

		function resetPassword(email) {
			return sendPasswordResetEmail(auth, email).catch((error) => {
				throw new Error(getError(error).message)
			})
		}

		function googleLogin() {
			const provider = new GoogleAuthProvider()
			provider.addScope('profile')
			provider.addScope('email')
			provider.addScope('openid')

			return signInWithPopup(auth, provider)
				.then(async (response) => {
					sync(response.user)
					return axios.prototype.googleLogin(await response.user.getIdToken())
				})
				.catch((error) => {
					reset()
					throw new Error(getError(error).message)
				})
		}

		async function googleLogout() {
			if (isLogoutRunning.value) return

			isLogoutRunning.value = true
			await axios.prototype.googleLogout()
			reset()
			return signOut(auth).finally(() => (isLogoutRunning.value = false))
		}

		return {
			sync,
			user,
			// logIn,
			// logOut,
			register,
			resetPassword,
			googleLogin,
			googleLogout
		}
	},
	{ persist: true }
)
