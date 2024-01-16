<script setup lang="ts">
import HomeContext from '@/components/HomeContext.vue'
import { UserStore } from '@/stores/user'
import { NAvatar, NFlex, NIcon, NButton, NCard } from 'naive-ui'
import { Menu } from '@vicons/ionicons5'

const photoURL = UserStore().user.photoURL
</script>

<template>
	<main style="max-width: 100%">
		<n-flex class="nav-header m-10 p-10" :justify="'space-between'" align="center">
			<n-button quaternary circle class="ml-4">
				<n-icon size="32" color="#1a9561"> <Menu /> </n-icon>
			</n-button>
			<h3 class="muda-logo">Muda</h3>
			<n-avatar round :fallback-src="photoURL" :src="photoURL" class="user-photo mr-2"></n-avatar>
		</n-flex>
		<HomeContext v-if="false" />
		<n-flex class="m-20">
			<n-card>
				<h3 class="muda-logo" style="color: gray">Muda</h3>
			</n-card>
		</n-flex>
		<n-flex class="m-20">
			<n-card>
				<h3 class="muda-logo" style="color: gray">Teste</h3>
			</n-card>
		</n-flex>
		<n-flex class="m-20">
			<n-card>
				<h3 class="muda-logo" style="color: gray">Eaeee asdasdasd</h3>
			</n-card>
		</n-flex>
		<n-flex class="m-20">
			<n-card>
				<h3 class="muda-logo" style="color: gray">Bora sim</h3>
			</n-card>
		</n-flex>
		<n-flex class="m-20">
			<n-card>
				<h3 class="muda-logo" style="color: gray">Topo topo pq nao</h3>
			</n-card>
		</n-flex>
		<n-flex class="m-20">
			<n-card>
				<h3 class="muda-logo2" style="color: gray">Ja acabou jessica</h3>
			</n-card>
		</n-flex>
		<div class="pb-100"></div>
	</main>
</template>
<style>
html {
	background-color: #f5f5f5;
}
</style>
<style scoped lang="scss">
.muda-logo {
	font-family: 'Geologica', Inter, sans-serif;
	color: #1a9561;
	text-transform: uppercase;
	letter-spacing: -2px;
	font-size: 24px;
	font-weight: 900;
	text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
}

.user-photo {
	border: 1px solid white;
	outline: 2px solid #1a9561;
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}
</style>
