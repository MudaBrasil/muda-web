<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useMenuFlexStore } from '@/stores/menuFlex'
import MenuBar from '@/components/MenuBar.vue'
import { UserStore } from '@/stores/user'
import { NotificationStore } from '@/stores/notification'
import { useReward } from 'vue-rewards'

const userStore = UserStore()
const notification = NotificationStore()
const menuFlexStore = useMenuFlexStore()
const { reward } = useReward('main-confetti', 'confetti')

const playRewards = (isNewUser = userStore.isNewUser) => {
	if (!isNewUser) return
	userStore.isNewUser = false

	// TODO: Mostrar texto de boas vindas
	setTimeout(() => {
		reward()
		setTimeout(() => reward(), 1400)
	}, 500)
}

onMounted(() => playRewards())
watch(() => userStore.isNewUser, playRewards)

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

		<span id="main-confetti"></span>
	</div>
</template>

<style scoped>
#main-confetti {
	position: fixed;
	left: 50%;
	top: 70%;
	z-index: 2000;
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease-in;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
