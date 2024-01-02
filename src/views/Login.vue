<script setup lang="ts">
import { ref, watch } from 'vue'
import { UserStore } from '@/stores/user'
import { NButton, NInput, NCard, NSpace, NIcon, NTag } from 'naive-ui'
import Loading from '@/components/Loading.vue'

const userStore = UserStore()

const email = ref('')
const password = ref('')
const error = ref(null)
const showLoading = ref(false)

// TODO: Criar esquema de convite para novos usuários. Gerar link para compartilhar com amigos. Ver quem mais esta usando o Muda e quem mais recomendou
// TODO: ADD TELEFONE LOGIN https://firebase.google.com/docs/auth/web/phone-auth?hl=pt-br

const GoogleLogin = () => {
	error.value = null
	showLoading.value = true

	userStore
		.googleLogin()
		.then(() => {
			showLoading.value = false
		})
		.catch(err => {
			error.value = err.message
		})
}

const LogIn = () => {
	error.value = null

	// TODO: show a message that the register and login email is suspended, only google login is available

	// userStore
	// 	.logIn({
	// 		email: email.value,
	// 		password: password.value
	// 	})
	// 	.then(() => {
	// 		const redirectPath: any = route.query.redirect || '/dashboard'
	// 		router.push(redirectPath)
	// 	})
	// 	.catch((err) => {
	// 		error.value = err.message
	// 	})
}

watch(error, newVal => {
	if (newVal) {
		setTimeout(() => {
			error.value = null
		}, 10000)
	}
})
</script>

<template>
	<n-space
		justify="center"
		align="center"
		vertical
		style="background-color: #114c7c"
	>
		<img src="@/assets/logo.png" alt="Logo do Muda" height="150" />
		<n-space justify="center" align="center">
			<n-card title="Acessar o Muda" style="width: 300px">
				<n-tag v-if="error" closable class="mb-10" type="error" @close="error = null">
					{{ error }}
				</n-tag>
				<form>
					<n-space vertical>
						<n-input
							id="email"
							type="text"
							class="form-control"
							name="email"
							:input-props="{
								autocomplete: 'username'
							}"
							placeholder="E-mail"
							v-model:value="email"
						/>

						<n-input
							id="password"
							type="password"
							class="form-control"
							name="password"
							placeholder="Senha"
							:input-props="{
								autocomplete: 'current-password'
							}"
							v-model:value="password"
						/>
					</n-space>
				</form>
				<br />
				<template #footer>
					<div>
						Novo por aqui?
						<router-link to="/register">Registre-se</router-link>
					</div>

					<div>
						Esqueceu a senha?
						<router-link to="/reset-password">Recuperar</router-link>
					</div>
				</template>
				<template #action>
					<n-space>
						<n-button type="primary" @click="LogIn">Entrar</n-button>
						<n-button type="info" @click="GoogleLogin">
							<template #icon>
								<n-icon>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
										viewBox="0 0 488 512"
									>
										<path
											d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
											fill="currentColor"
										></path>
									</svg>
								</n-icon>
							</template>
						</n-button>
						<!-- <NButton @click="notify('info')"> Info </NButton> -->
					</n-space>
				</template>
			</n-card>
			<Loading :show="showLoading" :overlay="true" />
		</n-space>
	</n-space>
</template>

<style scoped lang="scss">
.alert-danger {
	color: #721c24;
}
</style>
