import { defineStore } from 'pinia'
import { useNotification } from 'naive-ui'

export const NotificationStore = defineStore('notification', () => {
	const notify = useNotification()

	function destroyAll() {
		notify.destroyAll()
	}

	return { notify, destroyAll }
})
