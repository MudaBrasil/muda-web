<script setup lang="ts">
import { UserStore } from '@/stores/user'
import { NAvatar, NFlex, NIcon, NButton, NDrawer, NDrawerContent } from 'naive-ui'
import { Menu } from '@vicons/ionicons5'
import { ref } from 'vue'

const userStore = UserStore()
const mainMenu = ref({
	active: false
})
const userMenu = ref({
	active: false
})

const teste = a => {
	console.log('ERRORRRRRRRRRRRRRRR: on avatar error: ', a)
}
</script>

<template>
	<div class="top-bar">
		<n-flex class="nav-header m-10 p-10" :justify="'space-between'" align="center">
			<n-button quaternary circle class="ml-4" @click="mainMenu.active = true">
				<n-icon size="32" color="#1a9561"><Menu /></n-icon>
			</n-button>
			<h3 class="muda-logo">Muda</h3>
			<n-avatar
				round
				:fallback-src="userStore.user.photoURL"
				:src="userStore.user.photoURL"
				:on-error="teste"
				class="user-photo mr-2"
				@click="userMenu.active = true"
			></n-avatar>
		</n-flex>

		<n-drawer v-model:show="mainMenu.active" placement="left" width="70%">
			<n-drawer-content closable title="Menu">
				Stoner is a 1965 novel by the American writer John Williams.
			</n-drawer-content>
		</n-drawer>

		<n-drawer v-model:show="userMenu.active" placement="right" width="70%">
			<n-drawer-content closable :title="userStore.user.displayName">
				<div v-if="userStore.user.email">
					<small>Email</small>
					<div>
						{{ userStore.user.email }}
					</div>
					<br />
				</div>
				<div v-if="userStore.user.phoneNumber">
					<small>Telefone</small>
					<div>
						{{ userStore.user.phoneNumber }}
					</div>
					<br />
				</div>
				<div></div>
				<template #footer>
					<n-button type="error" round @click.prevent="userStore.goToLogout">Deslogar</n-button>
				</template>
			</n-drawer-content>
		</n-drawer>
	</div>
</template>

<style scoped>
.top-bar {
	.muda-logo {
		user-select: none;
		cursor: pointer;
		font-family: 'Geologica', Inter, sans-serif;
		color: #1a9561;
		text-transform: uppercase;
		letter-spacing: -2px;
		font-size: 24px;
		font-weight: 900;
		text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
	}

	.user-photo {
		user-select: none;
		cursor: pointer;
		border: 1px solid white;
		outline: 2px solid #1a9561;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
	}
}
</style>
