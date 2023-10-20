<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useMenuFlexStore } from '@/stores/menuFlex'
import MenuBar from '@/components/MenuBar.vue'
import { UserStore } from '@/stores/user'
import { NotificationStore } from '@/stores/notification'

const userStore = UserStore()
const notificationStore = NotificationStore()

watch(
	() => userStore.user.isLogged,
	(isLogged) => {
		if (!isLogged) {
			notificationStore.notify.info({
				content: 'Voce foi deslogado!',
				meta: 'Para continuar acesse a tela de login',
				duration: 5000,
				keepAliveOnHover: true
			})
		}
	}
)

const menuFlexStore = useMenuFlexStore()

watch(
	() => menuFlexStore.active,
	(menuFlexEnabled) => {
		const body: any = document.querySelector('body')
		body.style.overflowY = menuFlexEnabled ? 'hidden' : 'auto'
	}
)
</script>

<template>
	<div>
		<!-- TODO: Componente MENU BAR -->
		<MenuBar />

		<RouterView v-slot="{ Component }">
			<Transition name="slide-fade">
				<component :is="Component" />
			</Transition>
		</RouterView>
	</div>
</template>
