<script setup lang="ts">
import HomeContext from '@/components/HomeContext.vue'
import { axiosInject } from '@/services/axios'
import { UserStore, SpaceModel, ListModel } from '@/stores/user'
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
	NDivider,
	NDynamicTags,
	NPerformantEllipsis,
	useLoadingBar,
	FormRules,
	FormInst
} from 'naive-ui'
import { Menu, EllipsisVertical } from '@vicons/ionicons5'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const formRef = ref<FormInst | null>(null)
const axios = axiosInject()
const loadingBar = useLoadingBar()
const userStore = UserStore()
const notification = NotificationStore()

const router = useRouter()
const spaceCurrentTab = ref(0)
const listCurrentTab = ref(0)
const listExpandedNames = ref(userStore.spaces.map(() => []))
const photoURL = userStore.user.photoURL
const currentSpace = ref({} as SpaceModel)
const currentList = ref({} as ListModel)
const isEditingSpace = ref(false)
const isEditingList = ref(false)

const loading = ref({
	newSpace: false,
	newList: false,
	deleteSpace: false,
	deleteList: false
})

const showModal = ref({
	newSpace: false,
	newList: false,
	viewSpace: false,
	viewList: false
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

const validationListRules: FormRules = {
	name: {
		required: true,
		message: 'Atenção: Informe o titulo da lista.',
		trigger: 'blur',
		pattern: /[\S]/
	},
	description: {
		required: true,
		message: 'Atenção: Informe a descrição da lista.',
		trigger: 'blur',
		pattern: /[\S]/
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

const handleAddSpace = (e: MouseEvent) => {
	e.preventDefault()

	formRef.value?.validate(errors => {
		if (!errors) {
			addSpace()
		}
	})
}

const handleAddList = (e: MouseEvent) => {
	e.preventDefault()

	formRef.value?.validate(errors => {
		if (!errors) {
			addList()
		}
	})
}

const openViewSpace = () => {
	currentSpace.value = Object.assign({}, userStore.spaces[spaceCurrentTab.value])
	showModal.value.viewSpace = true
}

const cleanSpaceFields = () => {
	currentSpace.value = {} as SpaceModel
	isEditingSpace.value = false
}

const openViewList = () => {
	currentList.value = Object.assign({}, userStore.spaces[spaceCurrentTab.value].lists[listCurrentTab.value])
	showModal.value.viewList = true
}

const cleanListFields = () => {
	currentList.value = {} as ListModel
	isEditingList.value = false
}

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
		.post('/users/spaces', currentSpace.value)
		.then(() => {
			loadingBar.finish()
			showModal.value.newSpace = false
			loading.value.newSpace = false
			currentSpace.value = {} as SpaceModel
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

const addList = () => {
	loadingBar.start()
	loading.value.newList = true

	return axios
		.post(`/users/spaces/${userStore.spaces[spaceCurrentTab.value]._id}/lists`, currentList.value)
		.then(() => {
			loadingBar.finish()
			showModal.value.newList = false
			loading.value.newList = false
			currentList.value = {} as ListModel
			return getSpaces().then(spaces => (listCurrentTab.value = spaces[spaceCurrentTab.value]?.lists.length - 1))
		})
		.catch(({ title, description }) => {
			notification.error({ title, description })
			loadingBar.error()
		})
}

const updateList = list => {
	loadingBar.start()
	delete list.tasks

	return axios
		.put(`/users/spaces/${userStore.spaces[spaceCurrentTab.value]._id}/lists/${list._id}`, list)
		.then(() => {
			showModal.value.viewList = false
			loadingBar.finish()
			return getSpaces()
		})
		.catch(({ title, description }) => {
			notification.error({ title, description })
			loadingBar.error()
		})
}

const deleteList = listId => {
	loading.value.deleteList = true

	axios
		.delete(`/users/spaces/${userStore.spaces[spaceCurrentTab.value]._id}/lists/${listId}`)
		.then(() => {
			userStore.spaces[spaceCurrentTab.value].lists = userStore.spaces[spaceCurrentTab.value].lists.filter(
				list => list._id !== listId
			)

			showModal.value.viewList = false
			loading.value.deleteList = false

			listCurrentTab.value = listCurrentTab.value > 0 ? listCurrentTab.value - 1 : 0
			return getSpaces()
		})
		.catch(({ title, description }) => {
			notification.error({ title, description })
			loadingBar.error()
		})
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

			<div class="m-10">
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
						@update-value="listCurrentTab = 0"
						tab-style="padding: 0"
					>
						<n-tab-pane v-for="(space, index) in userStore.spaces" :key="index" :name="index">
							<template #tab>
								<div class="p-10 d-flex ai-center">
									<div class="mh-6">{{ space.name }}</div>

									<n-button v-if="spaceCurrentTab == index" circle quaternary size="small" @click="openViewSpace">
										<n-icon size="16" color="#1a9561"><EllipsisVertical /></n-icon>
									</n-button>
								</div>
							</template>

							<div class="mb-20">
								<h3>Descrição</h3>

								<n-performant-ellipsis :line-clamp="1" :tooltip="{ disabled: true }">
									{{ space.description }}
								</n-performant-ellipsis>
							</div>

							<div class="mb-20">
								<h3>Tags</h3>
								<n-tag v-for="(tag, index) in space.tags" :key="index" style="margin-right: 8px">{{ tag }}</n-tag>
							</div>

							<div class="mb-20">
								<n-divider dashed> Listas </n-divider>

								<n-tabs
									type="card"
									size="small"
									:default-value="1"
									v-model:value="listCurrentTab"
									addable
									@add="showModal.newList = true"
									tab-style="padding: 0"
								>
									<n-tab-pane v-for="(list, indexList) in space.lists" :key="indexList" :name="indexList">
										<template #tab>
											<div class="p-4 d-flex ai-center">
												<div class="ml-8 mr-2">{{ list.name }}</div>

												<n-button
													v-if="spaceCurrentTab == index && listCurrentTab == indexList"
													circle
													quaternary
													size="small"
													@click="openViewList"
												>
													<n-icon size="16" color="#1a9561"><EllipsisVertical /></n-icon>
												</n-button>
											</div>
										</template>
										<div class="mb-10">
											<p>
												Total de Tarefas: <strong> {{ list.tasks.length }}</strong>
											</p>
											<n-performant-ellipsis :line-clamp="1" :tooltip="{ disabled: true }">
												<p>
													Descrição:
													<strong>{{ list.description }}</strong>
												</p>
											</n-performant-ellipsis>
										</div>
										<div class="cards-scrollbar">
											<n-scrollbar x-scrollable trigger="hover">
												<div class="d-flex" style="gap: 8px">
													<n-card v-for="(task, indexTask) in list.tasks" :key="indexTask" style="width: 200px">
														<h4 style="color: rgb(104, 104, 104)">{{ task.name }}</h4>
														<br />

														<n-performant-ellipsis :line-clamp="3" :tooltip="{ disabled: true }">
															{{ task.description }}
														</n-performant-ellipsis>
													</n-card>
												</div>
											</n-scrollbar>
										</div>
									</n-tab-pane>
								</n-tabs>
							</div>
						</n-tab-pane>
					</n-tabs>
				</n-card>
			</div>

			<div class="cards-scrollbar">
				<n-flex class="m-10">
					<h3 style="color: rgb(83, 83, 83); font-size: 20px">Listas</h3>

					<n-scrollbar x-scrollable trigger="hover">
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
			@after-leave="cleanSpaceFields"
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
				<n-form ref="formRef" :model="currentSpace" :rules="validationSpaceRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="currentSpace.name" placeholder="Informe o titulo do espaço" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="currentSpace.description"
							placeholder="Informe a descrição do espaço"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item path="tags" label="Tags">
						<n-dynamic-tags v-model:value="currentSpace.tags" />
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button type="info" round @click="handleAddSpace" :loading="loading.newSpace"> Criar espaço </n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="showModal.viewList"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
			@after-leave="cleanListFields"
		>
			<n-drawer-content closable>
				<template #header>
					<n-input v-if="isEditingList" v-model:value="currentList.name" type="text" placeholder="Titulo da lista" />
					<div v-else>
						{{ currentList.name }}
					</div>
				</template>
				<small>Descrição</small>
				<n-input
					v-if="isEditingList"
					v-model:value="currentList.description"
					type="textarea"
					placeholder="Descrição da lista"
					class="mb-10"
				/>
				<div v-else style="white-list: pre-wrap">{{ currentList.description }}</div>
				<br />
				<small>Tags</small>
				<div>
					<n-dynamic-tags v-if="isEditingList" v-model:value="currentList.tags" />
					<n-tag v-else v-for="(tag, index) in currentList.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							@click="deleteList(currentList._id)"
							:loading="loading.deleteList"
							type="error"
							class="mr-10"
							round
						>
							Excluir
						</n-button>

						<n-button
							class="mr-10"
							type="info"
							round
							@click="
								router.push({
									name: 'timelineSpaceList',
									params: {
										spaceId: userStore.spaces[spaceCurrentTab]._id,
										listId: userStore.spaces[spaceCurrentTab].lists[listCurrentTab]._id
									}
								})
							"
						>
							Tarefas
						</n-button>
						<n-button v-if="isEditingList" type="success" round @click="updateList(currentList)">Salvar</n-button>
						<n-button v-else type="tertiary" round @click="isEditingList = true">Editar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="showModal.newList"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<!-- // TODO: Calcular o tamanho da tela e setar o max-height -->
			<n-drawer-content title="Criar nova lista" closable>
				<n-form ref="formRef" :model="currentList" :rules="validationListRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="currentList.name" placeholder="Informe o titulo da lista" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="currentList.description"
							placeholder="Informe a descrição da lista"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item path="tags" label="Tags">
						<n-dynamic-tags v-model:value="currentList.tags" />
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button type="info" round @click="handleAddList" :loading="loading.newList">Criar lista</n-button>
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
