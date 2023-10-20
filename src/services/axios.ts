import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'
import { auth } from '@/services/firebase'
import { inject, App } from 'vue'

interface AxiosOptions {
	baseUrl?: string
	token?: string
}
// TODO: Criar validador se o token esta expirado antes de fazer requisição ao backend para economizar

export const axiosInject = () => inject<AxiosInstance>('axios')

export default {
	install: (app: App, options?: AxiosOptions) => {
		axios.defaults.baseURL = options?.baseUrl || import.meta.env.VITE_API_URL
		axios.defaults.withCredentials = true
		axios.defaults.headers.common['Authorization'] = options?.token
			? `Bearer ${options.token}`
			: Cookies.get('bearerAuth')

		axios.interceptors.request.use(
			function (config) {
				if (!config.headers.Authorization) {
					config.headers.Authorization = Cookies.get('bearerAuth')
				}
				return config
			},
			function (error) {
				return Promise.reject(error)
			}
		)

		axios.interceptors.response.use(
			function (response) {
				return response
			},
			function (error) {
				const originalRequest = error.config
				if (error.response.status === 401 && !originalRequest._retry) {
					const urlsToNotRetry = ['auth/login/google', 'auth/logout/google']

					if (urlsToNotRetry.includes(error.config.url)) {
						Cookies.remove('bearerAuth')
						axios.defaults.headers.common['Authorization'] = `Bearer `
						return true
					}

					originalRequest._retry = true

					return auth.currentUser
						.getIdToken()
						.then((token) => {
							axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
							Cookies.set('bearerAuth', `Bearer ${token}`, { expires: 0.5 })
						})
						.catch((error) => {
							return Promise.reject(error)
						})
						.finally(() => {
							originalRequest._retry = true
						})
					// TODO: Validar se esta funcionando corretamente
					// TODO: Verificar se precisa limpar token e refreshToken dos cookies
				}
				return Promise.reject(error)
			}
		)

		axios.prototype.googleLogin = (token: string) => {
			// TODO: Criar ID do dispositivo e salvar nos cookies
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
			Cookies.set('bearerAuth', `Bearer ${token}`, { expires: 0.5 })
			return axios.post('auth/login/google')
		}

		axios.prototype.googleLogout = async () => {
			await axios.post('auth/logout/google')
			Cookies.remove('bearerAuth')

			// TODO: Validar se o refreshToken esta atualizando corretamente o token quando expira
			// Cookies.remove('refreshToken')
			axios.defaults.headers.common['Authorization'] = `Bearer `
		}

		app.config.globalProperties.axios = axios
		app.provide('axios', app.config.globalProperties.axios)
	}
}
