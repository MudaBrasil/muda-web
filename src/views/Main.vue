<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useMenuFlexStore } from '@/stores/menuFlex'
import MenuBar from '@/components/MenuBar.vue'
import { UserStore } from '@/stores/user'
import { NotificationStore } from '@/stores/notification'

const userStore = UserStore()
const notification = NotificationStore()

watch(
	() => userStore.user.isLogged,
	isLogged => {
		!isLogged &&
			setTimeout(() => {
				notification.info({
					title: 'Voce foi deslogado!',
					description: 'Para continuar basta fazer login novamente'
				})
			}, 300)
	}
)

const menuFlexStore = useMenuFlexStore()

watch(
	() => menuFlexStore.active,
	menuFlexEnabled => {
		const body: any = document.querySelector('body')
		body.style.overflowY = menuFlexEnabled ? 'hidden' : 'auto'
	}
)
</script>

<template>
	<div>
		<MenuBar />

		<RouterView v-slot="{ Component }">
			<Transition>
				<component :is="Component" />
			</Transition>
		</RouterView>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease-in;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
