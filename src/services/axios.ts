import axios, { AxiosStatic } from 'axios'
import useCookies from 'js-cookie'
import { auth } from '@/services/firebase'
import { inject, App } from 'vue'

const cookies = useCookies.withAttributes({
	expires: 0.08,
	sameSite: 'None',
	secure: true
})

interface AxiosOptions {
	baseUrl?: string
	token?: string
}
// TODO: Criar validador se o token esta expirado antes de fazer requisição ao backend para economizar

export const axiosInject = () => inject<customAxiosStatic>('axios')

interface customAxiosStatic extends AxiosStatic {
	googleLogin: (token: string) => Promise<any>
	googleLogout: () => Promise<any>
}

export default {
	install: (app: App, options?: AxiosOptions) => {
		const customAxios = axios.create() as customAxiosStatic

		customAxios.defaults.baseURL = options?.baseUrl || import.meta.env.VITE_API_URL
		customAxios.defaults.withCredentials = true
		customAxios.defaults.headers.common['Authorization'] = options?.token
			? `Bearer ${options.token}`
			: `Bearer ${atob(cookies.get('_fa') || '')}`

		customAxios.interceptors.request.use(
			function (config) {
				if (!config.headers.Authorization) {
					config.headers.Authorization = `Bearer ${atob(cookies.get('_fa') || '')}`
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
			function (error) {
				const originalRequest = error.config
				if (error.response.status === 401 && !originalRequest._retry) {
					const urlsToNotRetry = ['auth/login/google', 'auth/logout/google']

					if (urlsToNotRetry.includes(error.config.url)) {
						cookies.remove('_fa')
						customAxios.defaults.headers.common['Authorization'] = `Bearer `
						return true
					}

					originalRequest._retry = true

					return auth.currentUser
						.getIdToken()
						.then(token => {
							customAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`
							cookies.set('_fa', btoa(token))
						})
						.catch(error => {
							return Promise.reject(error)
						})
						.finally(() => {
							originalRequest._retry = false
						})
					// TODO: Validar se tem uma forma de forçar a invalidação do token do firebase
					// TODO: Validar se esta funcionando corretamente o refresh token do firebase
					// TODO: Verificar se precisa limpar token e refreshToken dos cookies
				}
				return Promise.reject(error)
			}
		)

		customAxios.googleLogin = (token: string) => {
			// TODO: Criar ID do dispositivo e salvar nos cookies
			customAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`
			cookies.set('_fa', btoa(token))
			return customAxios.post('auth/login/google')
		}

		customAxios.googleLogout = async () => {
			await customAxios.post('auth/logout/google')
			cookies.remove('_fa')

			// TODO: Validar se o refreshToken esta atualizando corretamente o token quando expira
			// Cookies.remove('refreshToken')
			customAxios.defaults.headers.common['Authorization'] = `Bearer `
		}

		app.config.globalProperties.axios = customAxios
		app.provide('axios', app.config.globalProperties.axios)
	}
}
