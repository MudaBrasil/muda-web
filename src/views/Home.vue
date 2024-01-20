<script setup lang="ts">
import HomeContext from '@/components/HomeContext.vue'
import { axiosInject } from '@/services/axios'
import { UserStore, SpaceModel } from '@/stores/user'
import { NotificationStore } from '@/stores/notification'
import {
	NAvatar,
	NFlex,
	NIcon,
	NInput,
	NForm,
	NFormItem,
	NButton,
	NCard,
	NScrollbar,
	NTabs,
	NTag,
	NTabPane,
	NDrawer,
	NDrawerContent,
	NDynamicTags,
	NCollapse,
	NCollapseItem,
	useLoadingBar,
	FormRules,
	FormInst
} from 'naive-ui'
import { Menu, PencilSharp, EllipsisVertical } from '@vicons/ionicons5'
import { onMounted, ref, watch } from 'vue'

const formRef = ref<FormInst | null>(null)
const axios = axiosInject()
const loadingBar = useLoadingBar()
const userStore = UserStore()
const notification = NotificationStore()

const spaceCurrentTab = ref(0)
const listExpandedNames = ref(userStore.spaces.map(() => []))
const photoURL = userStore.user.photoURL
const newSpace = ref({} as SpaceModel)
const currentSpace = ref({} as SpaceModel)
const isEditingSpace = ref(false)

const loading = ref({
	newSpace: false,
	deleteSpace: false
})

const showModal = ref({
	newSpace: false,
	viewSpace: false
})

const validationSpaceRules: FormRules = {
	name: {
		required: true,
		message: 'Atenção: Informe o titulo do espaço.',
		trigger: 'blur',
		pattern: /[\S]/
	},
	description: {
		required: true,
		message: 'Atenção: Informe a descrição do espaço.',
		trigger: 'blur',
		pattern: /[\S]/
	},
	startDate: {
		required: true,
		message: 'Atenção: Informe a data de inicio do espaço.',
		trigger: 'blur',
		type: 'date'
	}
}

onMounted(async () => {
	await getSpaces()

	listExpandedNames.value = userStore.spaces.map(() => [])
})

watch(
	() => userStore.spaces.length,
	() => (listExpandedNames.value = userStore.spaces.map(() => []))
)

const getSpaces = () => {
	loadingBar.start()

	return axios
		.get('/users/spaces')
		.then(response => {
			loadingBar.finish()
			// listExpandedNames.value = [[], []]
			return (userStore.spaces = response.data)
		})
		.catch(({ title, description }) => {
			notification.error({ title, description })
			loadingBar.error()
		})
}

const addSpace = () => {
	loadingBar.start()
	loading.value.newSpace = true

	return axios
		.post('/users/spaces', newSpace.value)
		.then(() => {
			loadingBar.finish()
			showModal.value.newSpace = false
			loading.value.newSpace = false
			newSpace.value = {} as SpaceModel
			return getSpaces().then(spaces => (spaceCurrentTab.value = spaces.length - 1))
		})
		.catch(({ title, description }) => {
			notification.error({ title, description })
			loadingBar.error()
		})
}

const updateSpace = space => {
	loadingBar.start()

	delete space.lists
	return axios
		.put(`/users/spaces/${space._id}`, space)
		.then(() => {
			loadingBar.finish()
			showModal.value.viewSpace = false
			return getSpaces()
		})
		.catch(({ title, description }) => {
			notification.error({ title, description })
			loadingBar.error()
		})
}

const deleteSpace = spaceId => {
	loading.value.deleteSpace = true

	axios
		.delete(`/users/spaces/${spaceId}`)
		.then(() => {
			userStore.spaces = userStore.spaces.filter(space => space._id !== spaceId)

			showModal.value.viewSpace = false
			loading.value.deleteSpace = false

			spaceCurrentTab.value = spaceCurrentTab.value > 0 ? spaceCurrentTab.value - 1 : 0
			return getSpaces()
		})
		.catch(({ title, description }) => {
			notification.error({ title, description })
			loadingBar.error()
		})
}

const handleAddSpace = (e: MouseEvent) => {
	e.preventDefault()

	formRef.value?.validate(errors => {
		if (!errors) {
			addSpace()
		}
	})
}

const openViewSpace = () => {
	currentSpace.value = Object.assign({}, userStore.spaces[spaceCurrentTab.value])
	showModal.value.viewSpace = true
}
</script>

<template>
	<main style="max-width: 100%">
		<n-scrollbar trigger="hover" style="max-height: 100%">
			<n-flex class="nav-header m-10 p-10" :justify="'space-between'" align="center">
				<n-button quaternary circle class="ml-4">
					<n-icon size="32" color="#1a9561"><Menu /></n-icon>
				</n-button>
				<h3 class="muda-logo">Muda</h3>
				<n-avatar round :fallback-src="photoURL" :src="photoURL" class="user-photo mr-2"></n-avatar>
			</n-flex>
			<HomeContext v-if="false" />

			<div class="m-10 pl-5">
				<n-flex class="mb-5">
					<h3 style="color: rgb(83, 83, 83); font-size: 20px">Espaços</h3>
				</n-flex>

				<n-card>
					<n-tabs
						type="card"
						size="large"
						:default-value="1"
						v-model:value="spaceCurrentTab"
						addable
						@add="showModal.newSpace = true"
						tab-style="padding: 0"
					>
						<n-tab-pane v-for="(space, index) in userStore.spaces" :key="index" :name="index" :tab="space.name">
							<template #tab>
								<div class="p-10 d-flex ai-center">
									<div class="mh-6">{{ space.name }}</div>

									<n-button v-if="spaceCurrentTab == index" circle quaternary size="small" @click="openViewSpace">
										<n-icon size="16" color="#1a9561"><EllipsisVertical /></n-icon>
									</n-button>
								</div>
							</template>
							<n-collapse
								arrow-placement="right"
								accordion
								v-model:expanded-names="listExpandedNames[index]"
								:trigger-areas="['main', 'arrow']"
							>
								<n-collapse-item
									v-for="(list, indexList) in space.lists"
									:key="indexList"
									:name="indexList"
									:title="`${list.name} (Tarefas: ${list.tasks.length})`"
								>
									<!-- :disabled="!list.tasks.length" -->
									<template #header-extra>
										<n-button
											v-if="listExpandedNames[index].includes(indexList)"
											circle
											quaternary
											style="height: 22px"
											@click="openViewSpace"
										>
											<n-icon size="16" color="#1a9561"><PencilSharp /></n-icon>
										</n-button>
									</template>
									<n-flex>
										<n-card v-for="(task, indexTask) in list.tasks" :key="indexTask">
											<h5>{{ task.name }}</h5>
											<br />
											<p>{{ task.description }}</p>
										</n-card>
									</n-flex>
								</n-collapse-item>
							</n-collapse>
						</n-tab-pane>
					</n-tabs>
				</n-card>
			</div>

			<div class="cards-scrollbar">
				<n-flex class="m-10">
					<h3 style="color: rgb(83, 83, 83); font-size: 20px">Listas</h3>

					<n-scrollbar x-scrollable trigger="hover">
						<!-- <div class="d-flex" style="gap: 8px 12px; z-index: 0"> -->
						<div class="d-flex ph-5" style="gap: 8px 12px">
							<n-card class="home-card">
								<h3>Ver cris no domingo</h3>
								<br />
								<p>
									Quasi, quibusdam. Lorem ipsum dolor sit amet cons ectetur adipi sicing elit. Quasi, quibusdam. Lorem
									ipsum dolor sit amet cons ectetur adipi sicing elit.
								</p>
							</n-card>
							<n-card class="home-card">
								<h3>Fazer cronograma para a Carol</h3>
								<br />
								<p>
									Sit amet cons ectetur adipi sicing elit. Quasi, quibusdam. Lorem ipsum dolor sit amet cons ectetur
									adipi sicing elit. Quasi, quibusdam. Lorem ipsum dolor.
								</p>
							</n-card>
							<n-card class="home-card">
								<h3>Fazer trilha</h3>
								<br />
								<p>
									Lorem ipsum dolor sit amet cons ectetur adipi sicing elit. Quasi, quibusdam. Lorem ipsum dolor sit
									amet cons ectetur adipi sicing elit. Quasi, quibusdam.
								</p>
							</n-card>
						</div>
					</n-scrollbar>
				</n-flex>
			</div>

			<div class="pb-100"></div>
		</n-scrollbar>

		<n-drawer
			v-model:show="showModal.viewSpace"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
			@after-leave="isEditingSpace = false"
		>
			<n-drawer-content closable>
				<template #header>
					<n-input v-if="isEditingSpace" v-model:value="currentSpace.name" type="text" placeholder="Titulo do espaço" />
					<div v-else>
						{{ currentSpace.name }}
					</div>
				</template>
				<small>Descrição</small>
				<n-input
					v-if="isEditingSpace"
					v-model:value="currentSpace.description"
					type="textarea"
					placeholder="Descrição do espaço"
					class="mb-10"
				/>
				<div v-else style="white-space: pre-wrap">{{ currentSpace.description }}</div>
				<br />
				<small>Tags</small>
				<div>
					<n-dynamic-tags v-if="isEditingSpace" v-model:value="currentSpace.tags" />
					<n-tag v-else v-for="(tag, index) in currentSpace.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>

				<!-- <div>
					<n-time :time="new Date(currentSpace.startDate)" type="datetime" format="dd/MM/yyyy HH:mm" />
				</div> -->

				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							@click="deleteSpace(currentSpace._id)"
							:loading="loading.deleteSpace"
							type="error"
							class="mr-10"
							round
						>
							Excluir
						</n-button>
						<n-button v-if="isEditingSpace" type="success" round @click="updateSpace(currentSpace)">Salvar</n-button>
						<n-button v-else type="info" round @click="isEditingSpace = true">Editar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="showModal.newSpace"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<!-- // TODO: Calcular o tamanho da tela e setar o max-height -->
			<n-drawer-content title="Criar novo espaço" closable>
				<n-form ref="formRef" :model="newSpace" :rules="validationSpaceRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="newSpace.name" placeholder="Informe o titulo do espaço" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="newSpace.description"
							placeholder="Informe a descrição do espaço"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item path="tags" label="Tags">
						<n-dynamic-tags v-model:value="newSpace.tags" />
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button type="info" round @click="handleAddSpace" :loading="loading.newSpace"> Criar espaço </n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>
	</main>
</template>

<style>
html {
	background-color: #f5f5f5 !important;
}
.cards-scrollbar {
	.n-scrollbar-container {
		background-image:
   /* Shadows */
			linear-gradient(to right, #f5f5f5, #f5f5f5),
			linear-gradient(to right, #f5f5f5, #f5f5f5),
			/* Shadow covers */ radial-gradient(ellipse at left, rgb(129, 129, 129, 0.4), transparent),
			radial-gradient(ellipse at right, rgba(179, 179, 179, 0.6), transparent);

		background-position:
			left center,
			right center,
			left center,
			right center;

		background-repeat: no-repeat;
		background-size:
			5px 100%,
			5px 100%,
			5px 99.6%,
			5px 99.6%;

		/* Opera doesn't support this in the shorthand */
		background-attachment: local, local, scroll, scroll;
	}
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

.home-card {
	max-width: 250px;
	min-width: 250px;
	white-space: wrap;
	// margin: 0px 20px;
	z-index: -1;
}

.user-photo {
	border: 1px solid white;
	outline: 2px solid #1a9561;
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}
</style>
