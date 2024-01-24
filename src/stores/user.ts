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

export class UserModel {
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

class Cell {
	_id: string
	name: string
	owner: string
	status: string
	priority: string
	children: string[]
	assignees: string[]
	tags: string[]
	url: string
	description: string
	active: boolean
	archived: boolean
	deleted: boolean
}

export class SpaceModel extends Cell {
	avatar: string
	color: string
	terms: string
	rules: string[]
	private: boolean
	members: object[]
	lists: ListModel[] | Nullable<[]>
}

export class ListModel extends Cell {
	parent: string
	orderIndex: number
	taskCount: number
	private: boolean
	grantedPermissions: object[]
	tasks: TaskModel[] | Nullable<[]>
}

export class TaskModel extends Cell {
	parent: string
	orderIndex: number
	dateDone: Date
	dateClosed: Date
	startDate: Date
	started: boolean
	dueDate: Date
	lated: boolean
	timeEstimate: number
	timeSpent: number
	timeTracked: object[]
}

// TODO: Fazer internacionalização dos textos testando o i18n ou do jeito que eu fiz antes
export const UserStore = defineStore(
	'user',
	() => {
		const axios = axiosInject()
		const route = useRoute()
		const router = useRouter()
		const user = ref(new UserModel())
		const tasks = ref<TaskModel[]>([])
		const spaces = ref<SpaceModel[]>([])
		const isOnRequest = ref(false)
		const isLogoutRunning = ref(false)
		const isNewUser = ref(false)

		const reset = () => (user.value = new UserModel())

		auth?.onAuthStateChanged(sync, resetAndLogout)

		// TODO: Talvez criar um store para os erros
		function getError(error) {
			const code = error.code || firebaseErrors[0].code
			const message = error.message || firebaseErrors[0].message

			return firebaseErrors.find(e => e.code === code) || { id: 0, code, message }
		}
		function goToLogout() {
			return router.push({ path: '/logout', query: { redirect: route.fullPath } })
		}

		function resetAndLogout() {
			reset()
			if (route.name !== 'login' && !isLogoutRunning.value) {
				goToLogout()
				return true
			}
			return false
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
				.then(async response => {
					if (!response.user) throw new Error('Erro ao logar com o Google - Usuário não encontrado')
					const user = await axios.googleLogin(response.user)
					isNewUser.value = user.data._newUser
					spaces.value = user.data.spaces
					return user
				})
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
			spaces,
			tasks,
			isNewUser,
			isOnRequest,
			register,
			resetPassword,
			goToLogout,
			googleLogin,
			googleLogout
		}
	},
	{
		persist: true,
		share: {
			omit: ['user'],
			enable: true,
			initialize: true
		}
	}
)
