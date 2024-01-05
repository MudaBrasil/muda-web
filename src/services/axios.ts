import { inject, App } from 'vue'
import axios, { AxiosHeaderValue, AxiosRequestConfig, AxiosStatic } from 'axios'
import useCookies from 'js-cookie'
import { auth } from '@/services/firebase'
import { User } from 'firebase/auth'

const cookies = useCookies.withAttributes({
	// expires: 0.08,
	sameSite: 'strict',
	secure: true
})
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const hasBearerToken = (auth: AxiosHeaderValue) => {
	const [type, token] = String(auth).split(' ')
	return type === 'Bearer' && token?.length > 10
}

interface AxiosOptions {
	baseUrl?: string
}

interface RetryConfig extends AxiosRequestConfig {
	retry: number
	retryDelay: number
}

const globalConfig: RetryConfig = {
	retry: 3,
	retryDelay: 1000
}

export const axiosInject = () => inject<customAxiosStatic>('axios')

interface customAxiosStatic extends AxiosStatic {
	googleLogin: (user: User) => Promise<any>
	googleLogout: () => Promise<any>
}

export default {
	install: async (app: App, options?: AxiosOptions) => {
		const customAxios = axios.create(globalConfig) as customAxiosStatic

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
				const expirationTime = await cookies.get('expirationTime')

				if (expirationTime && new Date(expirationTime) < new Date()) {
					config.headers.Authorization = await saveToken()
				}

				for (let attempt = 0; attempt < 10; attempt++) {
					if (hasBearerToken(config.headers.Authorization)) break

					config.headers.Authorization = await saveToken()
					await sleep(attempt * 100)
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

				if (error.config.retry < 1) return error

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
						error.config.retry--

						await sleep(error.config.retryDelay)
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
