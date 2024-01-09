import { defineStore } from 'pinia'
import { useNotification, NotificationOptions } from 'naive-ui'

export const NotificationStore = defineStore('notification', () => {
	const notification = useNotification()
	const defaultOptions: NotificationOptions = {
		title: 'Aviso',
		duration: 5000
	}

	const defaultOptionsError: NotificationOptions = {
		...defaultOptions,
		title: 'Erro desconhecido',
		description:
			'Acabamos de detectar um erro, por favor, tente repetir sua ultima ação. ' +
			'Caso o erro persista entre em contato conosco informando o que aconteceu.',
		duration: 15000
	}

	const notify = {
		destroyAll: () => notification.destroyAll(),
		create: (options: NotificationOptions) => notification.create({ ...defaultOptions, ...options }),
		error: (options: NotificationOptions) => notification.error({ ...defaultOptionsError, ...options }),
		success: (options: NotificationOptions) => notification.success({ ...defaultOptions, ...options }),
		info: (options: NotificationOptions) => notification.info({ ...defaultOptions, ...options }),
		warning: (options: NotificationOptions) => notification.warning({ ...defaultOptions, ...options })
	}

	return notify
})
