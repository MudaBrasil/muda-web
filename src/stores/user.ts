import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth as firebaseAuth } from '@/services/firebase'
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

export class AuthModel {
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

export class UserModel extends Cell {
	// authId: string
	authSources: string[]
	devicesLoggedIn: string[]
	devicesLoggedOut: string[]
	lastVisited: Date
	public: boolean
	username: string
	alias: string
	birthDate: Date
	email: string
	telephone: string
	profilePhoto: string
	website: string
	gender: string
	nationality: string
	jobTitle: string
	worksFor: string
	ideals: string
	knowsAbout: string
	knowsLanguage: string[]
	following: string[]
	followers: string[]
	allies: string[]
	funding: string[]
	sponsors: string[]
	awards: string[]
	mentor: string
	mentees: string[]
	helping: string[]
	helpedBy: string[]
	inviteCode: string
	invitingUser: string
	invitedUsers: string[]
	loves: string[]
	loved: string[]
	liked: string[]
	roles: string[]
	spaces: SpaceModel[]
}

export class SpaceModel extends Cell {
	avatar: string
	color: string
	terms: string
	rules: string[]
	private: boolean
	members: object[]
	lists: ListModel[]
}

export class ListModel extends Cell {
	parent: string
	orderIndex: number
	taskCount: number
	private: boolean
	grantedPermissions: object[]
	tasks: TaskModel[]
}

export class TaskModel extends Cell {
	parent: string
	orderIndex: number
	dateDone: Date
	dateClosed: Date
	startDate: number
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
		const auth = ref(new AuthModel())
		const tasks = ref<TaskModel[]>([])
		const tasksSplitted = ref<TaskModel[][]>([])
		const isOnRequest = ref(false)
		const isLogoutRunning = ref(false)
		const isNewUser = ref(false)

		const reset = () => (auth.value = new AuthModel())

		firebaseAuth?.onAuthStateChanged(sync, resetAndLogout)

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
		function sync(authData) {
			isOnRequest.value = false

			if (authData) {
				verifyUserData()
				auth.value = {
					uid: authData.uid,
					email: authData.email,
					isLogged: true,
					displayName: authData.displayName,
					phoneNumber: authData.phoneNumber,
					photoURL: authData.photoURL,
					userAlreadyRedirected: auth.value.userAlreadyRedirected,
					createdAt: new Date(parseInt(authData.metadata?.createdAt ?? null)),
					lastLogin: new Date(parseInt(authData.metadata?.lastLoginAt ?? null))
				}
				const createdAt = Timestamp.fromMillis(auth.value.createdAt?.getTime() ?? 0)
				const lastLogin = Timestamp.fromMillis(auth.value.lastLogin?.getTime() ?? 0) // TODO: Verificar se isso aqui é necessário
				saveUser({ ...auth.value, createdAt, lastLogin }) // TODO: Ver de salvar mais dados aqui no firebase

				if (!auth.value.userAlreadyRedirected) {
					auth.value.userAlreadyRedirected = true

					const redirectPath: any = route.query.redirect || '/'
					router.push(redirectPath)
				}
			} else {
				resetAndLogout()
			}
		}

		function register(newUser) {
			sync(firebaseAuth.currentUser)
			return createUserWithEmailAndPassword(firebaseAuth, newUser.email, newUser.password)
				.then(() => {
					if (firebaseAuth.currentUser) {
						updateProfile(firebaseAuth.currentUser, { displayName: newUser.name }).then(() => {})
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
			return sendPasswordResetEmail(firebaseAuth, email).catch(error => {
				throw new Error(getError(error).message)
			})
		}

		async function verifyUserData() {
			if (user.value._id) return user.value

			isOnRequest.value = true

			const { data } = await axios.currentUser()

			isOnRequest.value = false

			if (!data) return console.error('Dados do usuário não encontrado')

			return saveUserData(data)
		}

		function saveUserData(userData) {
			isNewUser.value = userData._newUser

			delete userData._newUser
			delete userData.authId

			user.value = userData as UserModel
			return user.value
		}

		function googleLogin() {
			const provider = new GoogleAuthProvider()
			provider.addScope('profile')
			provider.addScope('email')
			provider.addScope('openid')

			isOnRequest.value = true
			return signInWithPopup(firebaseAuth, provider)
				.then(async response => {
					if (!response.user) throw new Error('Erro ao logar com o Google - Usuário não encontrado')
					const { data } = await axios.googleLogin()
					return saveUserData(data)
				})
				.catch(error => {
					reset()
					throw new Error(getError(error).message)
				})
				.finally(() => (isOnRequest.value = false))
		}

		async function googleLogout() {
			if (isLogoutRunning.value) return

			isLogoutRunning.value = isOnRequest.value = true

			await axios.googleLogout().catch(({ title, description }) => {
				NotificationStore().error({ title, description })
			})

			isLogoutRunning.value = false
			signOut(firebaseAuth).finally(() => (isOnRequest.value = false))
			resetAndLogout()
			return true
		}

		return {
			sync,
			auth,
			user,
			tasks,
			tasksSplitted,
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
		persist: {
			paths: ['auth', 'user', 'tasks', 'tasksSplitted']
		},
		share: {
			// omit: ['auth'], TODO: Entender o porque eu tinha colocado pra omitir o auth de compartilhar entre navegadores e guias. Verificar se é necessário, senao deixa comentado
			omit: ['isOnRequest'],
			enable: true,
			initialize: true
		}
	}
)
