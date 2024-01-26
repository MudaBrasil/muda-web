<script setup lang="ts">
import { UserStore, UserModel } from '@/stores/user'
import { NAvatar, NFlex, NIcon, NButton, NDrawer, NDrawerContent, NMenu, NDynamicTags } from 'naive-ui'
import { Menu } from '@vicons/ionicons5'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import EditProfileItem from '@/components/EditProfileItem.vue'
import { axiosInject } from '@/services/axios'

const router = useRouter()

const axios = axiosInject()
const userStore = UserStore()
const hasChanges = ref(false)
const mainMenu = ref({ active: false })
const userMenu = ref({ active: false })
const editUser = ref({ active: false })
// const activeKey = ref(null)

const userEditing = ref(new UserModel())

onMounted(() => resetEditingData())

const isEditing = ref({
	// allies: ['rennan96', 'carol95'],
	// assignees: ['654172253b44c11359e9ee1b'],
	// authSources: ['google', 'email'],
	// awards: ['Best International Teacher of 2023'],
	// deleted: false,
	// devicesLoggedIn: ['654172253b44c11359e9ee1b'],
	// devicesLoggedOut: [''],
	// email: 'e@a.com',
	// followers: ['rennan96', 'carol95'],
	// following: ['rennan96', 'carol95'],
	// funding: ['Muda', 'Cannan'],
	// helpedBy: [],
	// helping: [],
	// invitingUser: '654172253b44c11359e9ee1b',
	// loves: [],
	// mentees: [],
	// mentor: '654172253b44c11359e9ee1b',
	alias: false,
	birthDate: false,
	description: true, //'Eu me chamo Lucrécio e sou professor de filosofia. Gosto de Tai-Chi e de cultivar plantas.',
	gender: false,
	ideals: false, // 'Respeito, Altruísmo e Amor. Eu acredito que a educação é a chave para a transformação do mundo.',
	inviteCode: false, // 'MUDA96',
	invitedUsers: false, // [],
	jobTitle: false, //'Professor',
	knowsAbout: false, // 'Teologia, Tai-Chi e Cultivo de plantas',
	knowsLanguage: false, // ['pt-BR', 'en-US'],
	loved: false, // [], TODO: Criar historico de tudo que a pessoa amou
	liked: false, // [], TODO: Criar historico de tudo que a pessoa curtiu
	name: false, // 'Lucrécio da Silva',
	profilePhoto: false, // TODO: Colocar tooltip avisando que a foto de perfil é a do Google
	public: false, // TODO: Avisar que se ativar amigos de amigos e outras pessoas com o link poderão ver o seu perfil
	sponsors: false, // ['Meus pais', 'Google', 'carol95'],
	tags: false, // ['football', 'kids'],
	telephone: false, // '+55 13 99999-9999',
	url: false, // 'http: //muda.education/user/lucrecio',
	username: false, // 'lucrecio1911',
	website: false, // 'http://lucrecio.com.br',
	worksFor: false // Muda
})

const goTo = (name: string) => {
	mainMenu.value.active = false
	router.push({ name })
}

const resetEditingData = () => {
	userEditing.value = { ...userStore.user }

	Object.keys(isEditing.value).forEach(key => (isEditing.value[key] = false))
}

const openEditUser = () => {
	resetEditingData()

	userMenu.value.active = false
	editUser.value.active = true
}
const verifyChanges = () => {
	if (Object.values(isEditing.value).some(Boolean)) {
		return Object.keys(isEditing.value).some(i => {
			const changed = userEditing.value[i] || ''
			const original = userStore.user[i] || ''
			if (isEditing.value[i] && changed !== original) {
				return true
			}
		})
	}

	return false
}
watch(
	() => isEditing.value,
	() => (hasChanges.value = verifyChanges()),
	{ deep: true }
)

watch(
	() => userEditing.value,
	() => (hasChanges.value = verifyChanges()),
	{ deep: true }
)

// const goBack = () => {
// 	if (!window.history.state.back || window.history.length < 2) return router.push('/')

// 	return router.go(-1)
// }

const saveUser = () => {
	if (userStore.isOnRequest) return

	userStore.isOnRequest = true

	const changes = Object.keys(isEditing.value).reduce((acc, key) => {
		if (isEditing.value[key]) {
			acc[key] = userEditing.value[key]
		}

		return acc
	}, {})

	return axios
		.put('me', changes)
		.then(({ data }) => {
			userStore.user = data
			resetEditingData()
		})
		.catch(console.error)
		.finally(() => (userStore.isOnRequest = false))
}
</script>

<template>
	<div class="top-bar">
		<n-flex class="nav-header m-10 p-6" :justify="'space-between'" align="center">
			<n-button quaternary circle class="ml-4" @click="mainMenu.active = true">
				<n-icon size="32" color="#1a9561"><Menu /></n-icon>
			</n-button>
			<h3 class="muda-logo" @click="console.log('TODO: Abrir noticias do Muda')">Muda</h3>
			<n-avatar
				class="user-photo mr-2"
				round
				:fallback-src="userStore.auth.photoURL"
				:src="userStore.auth.photoURL"
				@click="userMenu.active = true"
			></n-avatar>
		</n-flex>

		<!-- // TODO: AO INVÉS DE USAR DRAWER, CRIAR MODAL CENTRALIZADO IGUAL DO GOOGLE PLAY STORE -->

		<n-drawer v-model:show="mainMenu.active" placement="left" width="70%">
			<n-drawer-content body-content-style="padding: 0px">
				<template #header>
					<h3
						class="muda-logo mv-7"
						style="color: rgb(96, 96, 96)"
						@click="console.log('TODO: Abrir noticias do Muda')"
					>
						Muda
					</h3>
				</template>
				<!-- v-model:value="activeKey" -->
				<n-menu
					:root-indent="32"
					:indent="20"
					:options="[
						{
							label: 'Início',
							key: 'home',
							onClick: () => goTo('home')
						},
						{
							label: 'Dashboard',
							key: 'dashboard',
							onClick: () => goTo('dashboard')
						},
						{
							label: 'Cronograma',
							key: 'timeline',
							onClick: () => goTo('timeline')
						},
						{
							label: 'Atlas',
							key: 'atlas',
							disabled: true // TODO: Criar pagina do atlas
						},
						{
							label: 'Currículo',
							key: 'cv-rennan',
							disabled: true
						}
					]"
				/>
			</n-drawer-content>
		</n-drawer>

		<n-drawer v-model:show="userMenu.active" placement="right" width="70%">
			<n-drawer-content closable body-content-style="padding: 0px">
				<template #header>
					<div class="mv-1">
						{{ userStore.user.name }}
						<div v-if="userStore.user.email">
							<span style="font-size: 12px">{{ userStore.user.email }}</span>
						</div>
						<div v-else-if="userStore.user.telephone">
							<span>{{ userStore.user.telephone }}</span>
						</div>
					</div>
				</template>

				<n-menu
					:root-indent="32"
					:indent="20"
					:options="[
						{
							label: 'Editar perfil', // TODO: Abrir Drawer vindo de baixo e se conectar com API
							key: 'edit-profile',
							onClick: openEditUser
						},
						{
							label: 'Encontrar amigos',
							key: 'find-friends',
							disabled: true
						},
						{
							label: 'Explorar comunidades',
							key: 'explore-communities',
							disabled: true
						},
						{
							label: 'Configurações',
							key: 'settings',
							disabled: true
						}
					]"
				/>
				<template #footer>
					<n-button type="error" round @click.prevent="userStore.goToLogout">Deslogar</n-button>
				</template>
			</n-drawer-content>
		</n-drawer>

		<!-- @after-leave="cleanFields()" -->
		<n-drawer
			v-model:show="editUser.active"
			class="drawer-task"
			placement="bottom"
			height="84%"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<n-drawer-content closable title="Editar perfil">
				<EditProfileItem
					title="Nome"
					placeholder="Informe seu nome completo"
					:originalValue="userStore.user.name"
					v-model:editingValue="userEditing.name"
					v-model:isEditing="isEditing.name"
				/>

				<EditProfileItem
					title="Apelido"
					placeholder="Informe um apelido que voce quer que as pessoas vejam"
					:originalValue="userStore.user.alias"
					v-model:editingValue="userEditing.alias"
					v-model:isEditing="isEditing.alias"
				/>

				<EditProfileItem
					title="Descrição"
					placeholder="Descreva sobre você"
					:originalValue="userStore.user.description"
					v-model:editingValue="userEditing.description"
					v-model:isEditing="isEditing.description"
				/>

				<EditProfileItem
					title="Profissão"
					placeholder="Informe sua profissão"
					:originalValue="userStore.user.jobTitle"
					v-model:editingValue="userEditing.jobTitle"
					v-model:isEditing="isEditing.jobTitle"
				/>
				<small>Tags</small>
				<n-dynamic-tags v-model:value="userEditing.tags" />
				<div>
					<!-- <n-tag v-else v-for="(tag, index) in userEditing.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag> -->
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<n-button round @click="editUser.active = false">Cancelar</n-button>
						<n-button
							v-if="hasChanges"
							class="ml-10"
							type="success"
							round
							:loading="userStore.isOnRequest"
							:disabled="userStore.isOnRequest"
							@click="saveUser()"
							>Salvar</n-button
						>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>
	</div>
</template>

<style scoped>
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

.top-bar {
	.user-photo {
		user-select: none;
		cursor: pointer;
		border: 1px solid white;
		outline: 2px solid #1a9561;
		box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
	}
}
</style>
