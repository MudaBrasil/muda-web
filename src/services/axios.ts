import { inject, App } from 'vue'
import axios, { AxiosStatic } from 'axios'
import useCookies from 'js-cookie'
import { auth } from '@/services/firebase'
import { User } from 'firebase/auth'

const cookies = useCookies.withAttributes({
	// expires: 0.08,
	sameSite: 'strict',
	secure: true
})

interface AxiosOptions {
	baseUrl?: string
}

export const axiosInject = () => inject<customAxiosStatic>('axios')

interface customAxiosStatic extends AxiosStatic {
	googleLogin: (user: User) => Promise<any>
	googleLogout: () => Promise<any>
}

export default {
	install: async (app: App, options?: AxiosOptions) => {
		const customAxios = axios.create() as customAxiosStatic

		// TODO: Criar ID do dispositivo e salvar nos cookies
		const saveToken = async (user = auth?.currentUser, forceRefresh = false) => {
			if (!user) {
				return (customAxios.defaults.headers.common['Authorization'] = 'Bearer')
			}
			return user?.getIdTokenResult(forceRefresh).then(result => {
				const time = new Date(result.expirationTime)
				const timeIncreased = new Date(time.getTime() - 120000)

				cookies.set('expirationTime', timeIncreased)
				return (customAxios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`)
			})
		}

		await saveToken()

		customAxios.defaults.baseURL = options?.baseUrl || import.meta.env.VITE_API_URL
		customAxios.defaults.withCredentials = true

		customAxios.interceptors.request.use(
			async function (config) {
				const [type, token] = config.headers.Authorization.toString().split(' ') ?? []

				if (type !== 'Bearer' || !token || token === 'undefined') {
					config.headers.Authorization = await saveToken()
				}

				const expirationTime = await cookies.get('expirationTime')

				if (expirationTime && new Date(expirationTime) < new Date()) {
					config.headers.Authorization = await saveToken()
				}

				return config
			},
			function (error) {
				return Promise.reject(error)
			}
		)

		customAxios.interceptors.response.use(
			function (response) {
				return response
			},
			async function (error) {
				const isAuthEndpoint = error.config.url.split('/')[0] === 'auth'

				if (error.response?.status === 401) {
					if (isAuthEndpoint) {
						customAxios.defaults.headers.common['Authorization'] = 'Bearer'
						cookies.remove('expirationTime')

						if (error.config.url === 'auth/login/google') return error

						if (error.config.url === 'auth/logout/google') {
							error.config.headers.Authorization = `Bearer ${await auth.currentUser?.getIdToken()}`
							return customAxios.request(error.config)
						}
					} else {
						error.config.headers.Authorization = await saveToken()

						return customAxios.request(error.config)
					}
				} else {
					if (isAuthEndpoint) {
						customAxios.defaults.headers.common['Authorization'] = 'Bearer'
						cookies.remove('expirationTime')
						await auth.signOut()
						return error
					}
				}
				return error
			}
		)

		customAxios.googleLogin = async (user: User) => {
			await saveToken(user)
			return customAxios.post('auth/login/google')
		}

		customAxios.googleLogout = async () => {
			await customAxios.post('auth/logout/google')
			cookies.remove('expirationTime')
			customAxios.defaults.headers.common['Authorization'] = 'Bearer'
		}

		app.config.globalProperties.axios = customAxios
		app.provide('axios', app.config.globalProperties.axios)
	}
}
