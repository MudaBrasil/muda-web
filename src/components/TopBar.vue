<script setup lang="ts">
import { UserStore, UserModel } from '@/stores/user'
import { NAvatar, NFlex, NIcon, NButton, NDrawer, NDrawerContent, NMenu, NInput, NTag, NDynamicTags } from 'naive-ui'
import { Menu } from '@vicons/ionicons5'
import { ref, onMounted } from 'vue'

const userStore = UserStore()
const mainMenu = ref({ active: false })
const userMenu = ref({ active: false })
const editUser = ref({ active: false })
// const activeKey = ref(null)

const userEditing = ref(new UserModel())

onMounted(() => (userEditing.value = userStore.user))

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
	description: false, //'Eu me chamo Lucrécio e sou professor de filosofia. Gosto de Tai-Chi e de cultivar plantas.',
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
</script>

<template>
	<div class="top-bar">
		<n-flex class="nav-header m-10 p-10" :justify="'space-between'" align="center">
			<n-button quaternary circle class="ml-4" @click="mainMenu.active = true">
				<n-icon size="32" color="#1a9561"><Menu /></n-icon>
			</n-button>
			<h3 class="muda-logo" @click="console.log('TODO: Abrir noticias do Muda')">Muda</h3>
			<n-avatar
				round
				:fallback-src="userStore.auth.photoURL"
				:src="userStore.auth.photoURL"
				class="user-photo mr-2"
				@click="userMenu.active = true"
			></n-avatar>
		</n-flex>

		<n-drawer v-model:show="mainMenu.active" placement="left" width="70%">
			<n-drawer-content body-content-style="padding: 0px">
				<template #header>
					<h3 class="muda-logo" @click="console.log('TODO: Abrir noticias do Muda')">Muda</h3>
				</template>
				<!-- v-model:value="activeKey" -->
				<n-menu
					:root-indent="32"
					:indent="20"
					:options="[
						{
							label: 'Início',
							key: 'home',
							disabled: true
						},
						{
							label: 'Dashboard',
							key: 'dashboard',
							disabled: true
						},
						{
							label: 'Cronograma',
							key: 'timeline',
							disabled: true
						},
						{
							label: 'Atlas',
							key: 'atlas',
							disabled: true
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
					<div>
						{{ userStore.auth.displayName }}
						<div v-if="userStore.auth.email">
							<span style="font-size: 12px">{{ userStore.auth.email }}</span>
						</div>
						<div v-else-if="userStore.auth.phoneNumber">
							<span>{{ userStore.auth.phoneNumber }}</span>
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
							onClick: () => (editUser.active = !(userMenu.active = false))
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
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<n-drawer-content closable title="Editar perfil">
				<small>Nome</small>

				<n-input v-if="isEditing.name" v-model:value="userEditing.name" type="text" placeholder="Titulo da tarefa" />
				<div v-else>
					{{ userEditing.name }}
				</div>
				<small>Descrição</small>
				<n-input
					v-if="isEditing.description"
					v-model:value="userEditing.description"
					type="textarea"
					placeholder="Descrição da tarefa"
					class="mb-10"
				/>
				<div v-else style="white-task: pre-wrap">{{ userEditing.description }}</div>
				<br />
				<small>Tags</small>
				<div>
					<n-dynamic-tags v-if="isEditing.description" v-model:value="userEditing.tags" />
					<n-tag v-else v-for="(tag, index) in userEditing.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<!-- <n-button
							@click="taskState.loading.delete = isDeleting = true"
							:loading="taskState.loading.delete"
							type="error"
							class="mr-10"
							round
						>
							Excluir
						</n-button> -->
						<n-button type="success" round @click="">Salvar</n-button>
						<!-- <n-button type="warning" round>Editar</n-button> -->
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
