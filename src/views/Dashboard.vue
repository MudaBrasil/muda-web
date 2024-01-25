<script setup lang="ts">
import imgTreeBackground from '@/assets/tree_background.png'
import { RouterLink } from 'vue-router'
import { NAvatar, NButton } from 'naive-ui'
import { UserStore } from '@/stores/user'

const userStore = UserStore()
</script>

<template>
	<main>
		<div class="bg-image" :style="{ backgroundImage: `url(${imgTreeBackground})` }"></div>

		<div class="context">
			<div class="context-field">
				<h1 style="font-size: 40px">MUDA</h1>
				<a href="">Continue a nadar(mudar)!</a>
				<h2>O Muda vai virar todo esse jogo, o Muda é pra tudo, o Muda é pra todos!</h2>

				<br />
				<n-avatar round :size="100" :src="userStore.auth.photoURL"></n-avatar>
				<br />
				<br />
				<div>
					UID: <strong>{{ userStore.auth.uid }}</strong>
				</div>
				<div>
					isLogged: <strong>{{ userStore.auth.isLogged }}</strong>
				</div>
				<div>
					displayName: <strong>{{ userStore.auth.displayName }}</strong>
				</div>
				<div>
					email: <strong>{{ userStore.auth.email }}</strong>
				</div>
				<br />

				<br />
				<br />
				<div>
					<div class="" v-if="userStore.auth.isLogged">
						<div class="card-header">Welcome, {{ userStore.auth.displayName }}</div>

						<br />

						<div class="card-header">
							<router-link to="/">Ir para home</router-link>
						</div>
						<div class="card-header">
							<router-link to="/timeline">Ir para cronograma</router-link>
						</div>
						<br />

						<div class="d-flex jc-center">
							<n-button type="error" round class="m-20" @click.prevent="userStore.goToLogout()">Deslogar</n-button>
						</div>
					</div>

					<div v-else class="alert alert-danger" role="alert">
						You are not logged in!
						<router-link to="/login">Go to login</router-link>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<style scoped lang="scss">
.n-avatar {
	position: initial;
}

.context {
	padding-bottom: 140px;
	display: flex;
	align-items: center;
	flex-direction: column;
	background: linear-gradient(0deg, rgba(241, 246, 247, 1) 77%, rgba(144, 182, 47, 1) 100%);

	.context-field {
		padding: 20px;
		display: flex;
		align-items: center;
		flex-direction: column;

		img {
			max-width: 100px;
		}
	}
}

.bg-image {
	width: 100%;
	min-height: 234px;
}

h3 {
	color: brown;
}
</style>
