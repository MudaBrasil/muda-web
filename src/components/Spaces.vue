<script setup lang="ts">
import { axiosInject } from '@/services/axios'
import { UserStore, SpaceModel, ListModel } from '@/stores/user'
import { NotificationStore } from '@/stores/notification'
import {
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
	NModal,
	useLoadingBar,
	FormRules,
	FormInst
} from 'naive-ui'
import Tasks from '@/components/Tasks.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref, watch, computed } from 'vue'
import { EllipsisVertical } from '@vicons/ionicons5'

const formRef = ref<FormInst | null>(null)
const axios = axiosInject()
const loadingBar = useLoadingBar()
const userStore = UserStore()
const notification = NotificationStore()
const router = useRouter()
const isEditing = ref(false)
const isDeleting = ref(false)
const deleteCurrentSpace = ref(false)
const deleteCurrentList = ref(false)

const initialState = <Type,>() => ({
	current: {} as Type, // TODO: Talvez transformar em uma variavel fora daqui e unica pra espaco e lista
	currentTab: 0,
	show: {
		new: false,
		view: false
	},
	validationRules: {
		name: {
			required: true,
			message: 'Atenção: Informe o titulo.',
			trigger: 'blur',
			pattern: /[\S]/
		}
	} as FormRules
})

const spaceState = ref(initialState<SpaceModel>())
const listState = ref(initialState<ListModel>())

onMounted(() => getSpaces())

const openDeleteConfirmation = computed({
	get: () => deleteCurrentSpace.value || deleteCurrentList.value,
	set: val => (deleteCurrentSpace.value = deleteCurrentList.value = val)
})

watch(
	() => userStore.isOnRequest,
	newVal => (newVal ? loadingBar.start() : loadingBar.finish())
)

const handleForm = (e: MouseEvent) => {
	e.preventDefault()

	return formRef.value?.validate(errors => !errors)
}

const resolveCatch = error => {
	console.error(error)
	const { title, description } = error

	notification.error({ title, description })
	loadingBar.error()
	userStore.isOnRequest = isDeleting.value = false
}

const openViewList = list => {
	if (!spaceState.value.current._id) {
		spaceState.value.current = { ...userStore.user.spaces[spaceState.value.currentTab] }
	}

	listState.value.current = { ...list }
	listState.value.show.view = true
}

const openViewSpace = space => {
	spaceState.value.current = { ...space }
	spaceState.value.show.view = true
}

const cleanFields = (type = 'space') => {
	if (type === 'space') {
		spaceState.value.current = {} as SpaceModel
		spaceState.value.show.new = false
	} else {
		listState.value.current = {} as ListModel
		listState.value.show.new = false
	}
	setTimeout(() => (isEditing.value = false), 500)
}

const pushToTimeline = (spaceId = spaceState.value.current._id, listId = listState.value.current._id) => {
	router.push({ name: 'timelineSpaceList', params: { spaceId, listId } })
}

const updateTasks = () => {
	userStore.isOnRequest = false
	return getSpaces()
}

//#region Space Functions
const getSpaces = () => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = true

	return axios
		.get('/me/spaces')
		.then(response => {
			userStore.isOnRequest = false
			return (userStore.user.spaces = response.data)
		})
		.catch(resolveCatch)
}

const addSpace = () => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = true

	return axios
		.post('/me/spaces', spaceState.value.current)
		.then(async () => {
			cleanFields()
			userStore.isOnRequest = false
			await getSpaces()

			return (spaceState.value.currentTab = userStore.user.spaces.length - 1)
		})
		.catch(resolveCatch)
}

const updateSpace = spaceItem => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = true

	return axios
		.put(`/me/spaces/${spaceItem._id}`, { ...spaceItem, lists: undefined })
		.then(() => {
			userStore.isOnRequest = spaceState.value.show.view = false

			return getSpaces()
		})
		.catch(resolveCatch)
}

const deleteSpace = spaceId => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = isDeleting.value = true

	axios
		.delete(`/me/spaces/${spaceId}`)
		.then(() => {
			// userStore.user.spaces = userStore.user.spaces.filter(space => space._id !== spaceId) // TODO: Pensar se faço apenas essa delecao local ou se faço uma chamada no getSpaces()
			spaceState.value.currentTab = spaceState.value.currentTab > 0 ? spaceState.value.currentTab - 1 : 0
			userStore.isOnRequest = isDeleting.value = spaceState.value.show.view = false
			return getSpaces()
		})
		.catch(resolveCatch)
}
//#endregion

//#region List Functions
const addList = () => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = true

	return axios
		.post(`/me/spaces/${userStore.user.spaces[spaceState.value.currentTab]._id}/lists`, listState.value.current)
		.then(async () => {
			cleanFields('list')
			userStore.isOnRequest = false

			await getSpaces()
			return (listState.value.currentTab = userStore.user.spaces[spaceState.value.currentTab]?.lists.length - 1)
		})
		.catch(resolveCatch)
}

const updateList = listItem => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = true
	delete listItem.tasks

	return axios
		.put(`/me/spaces/${userStore.user.spaces[spaceState.value.currentTab]._id}/lists/${listItem._id}`, listItem)
		.then(() => {
			userStore.isOnRequest = listState.value.show.view = false
			return getSpaces()
		})
		.catch(resolveCatch)
}

const deleteList = listId => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = isDeleting.value = true

	axios
		.delete(`/me/spaces/${userStore.user.spaces[spaceState.value.currentTab]._id}/lists/${listId}`)
		.then(() => {
			// userStore.user.spaces[space.value.currentTab].lists = userStore.user.spaces[space.value.currentTab].lists.filter(
			// 	list => list._id !== listId
			// )// TODO: Pensar se faço apenas essa delecao local ou se faço uma chamada no getSpaces()

			listState.value.currentTab = listState.value.currentTab > 0 ? listState.value.currentTab - 1 : 0
			userStore.isOnRequest = isDeleting.value = listState.value.show.view = false
			return getSpaces()
		})
		.catch(resolveCatch)
}
//#endregion
</script>

<template>
	<div>
		<div class="m-10">
			<n-flex class="mb-5">
				<h3 style="color: rgb(83, 83, 83); font-size: 20px">Espaços</h3>
			</n-flex>

			<n-card>
				<n-tabs
					type="card"
					size="large"
					:default-value="1"
					v-model:value="spaceState.currentTab"
					addable
					@add="spaceState.show.new = true"
					@update-value="listState.currentTab = 0"
					tab-style="padding: 0"
				>
					<n-tab-pane v-for="(spaceItem, index) in userStore.user.spaces" :key="index" :name="index">
						<template #tab>
							<div class="p-10 d-flex ai-center" @click="spaceState.currentTab == index && openViewSpace(spaceItem)">
								<div class="mh-6">{{ spaceItem.name }}</div>

								<n-button v-if="spaceState.currentTab == index" circle quaternary size="small">
									<n-icon size="16" color="#1a9561"><EllipsisVertical /></n-icon>
								</n-button>
							</div>
						</template>

						<div class="mb-20">
							<h3>Descrição</h3>

							<n-performant-ellipsis :line-clamp="1" :tooltip="{ disabled: true }">
								{{ spaceItem.description }}
							</n-performant-ellipsis>
						</div>

						<div class="mb-20">
							<h3>Tags</h3>
							<n-tag v-for="(tag, index) in spaceItem.tags" :key="index" style="margin-right: 8px">{{ tag }}</n-tag>
						</div>

						<div class="mb-20">
							<n-divider dashed> Listas </n-divider>

							<n-tabs
								type="card"
								size="small"
								:default-value="1"
								v-model:value="listState.currentTab"
								addable
								@add="listState.show.new = true"
								tab-style="padding: 0"
							>
								<n-tab-pane v-for="(listItem, indexList) in spaceItem.lists" :key="indexList" :name="indexList">
									<template #tab>
										<div
											class="p-4 d-flex ai-center"
											@click="listState.currentTab == indexList && openViewList(listItem)"
										>
											<div class="ml-8 mr-2">{{ listItem.name }}</div>

											<n-button
												v-if="spaceState.currentTab == index && listState.currentTab == indexList"
												circle
												quaternary
												size="small"
											>
												<n-icon size="16" color="#1a9561"><EllipsisVertical /></n-icon>
											</n-button>
											<div v-else class="mr-6"></div>
										</div>
									</template>
									<div class="mb-10">
										<p>
											Total de Tarefas: <strong> {{ listItem.tasks.length }}</strong>
										</p>
										<n-performant-ellipsis :line-clamp="1" :tooltip="{ disabled: true }">
											<p>
												Descrição:
												<strong>{{ listItem.description }}</strong>
											</p>
										</n-performant-ellipsis>
									</div>
									<div>
										<!-- class="cards-scrollbar" TODO: Entender pq sombra na lista dos cards nao aparecem quando esta dentro de outro card -->
										<n-scrollbar x-scrollable trigger="hover">
											<Tasks
												:spaceId="spaceItem._id"
												:listId="listItem._id"
												:tasks="listItem.tasks"
												@update="updateTasks()"
											/>
										</n-scrollbar>
									</div>
								</n-tab-pane>
							</n-tabs>
						</div>
					</n-tab-pane>
				</n-tabs>
			</n-card>
		</div>

		<n-drawer
			v-model:show="spaceState.show.view"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
			@after-leave="cleanFields()"
		>
			<n-drawer-content closable>
				<template #header>
					<n-input
						v-if="isEditing"
						v-model:value="spaceState.current.name"
						type="text"
						placeholder="Titulo do espaço"
					/>
					<div v-else>
						{{ spaceState.current.name }}
					</div>
				</template>
				<small>Descrição</small>
				<n-input
					v-if="isEditing"
					v-model:value="spaceState.current.description"
					type="textarea"
					placeholder="Descrição do espaço"
					class="mb-10"
				/>
				<div v-else style="white-space: pre-wrap">{{ spaceState.current.description }}</div>
				<br />
				<small>Tags</small>
				<div>
					<n-dynamic-tags v-if="isEditing" v-model:value="spaceState.current.tags" />
					<n-tag v-else v-for="(tag, index) in spaceState.current.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							round
							type="error"
							class="mr-10"
							:loading="isDeleting"
							:disabled="isDeleting"
							@click="deleteCurrentSpace = true"
						>
							Excluir
						</n-button>
						<n-button
							v-if="isEditing"
							round
							type="success"
							:disabled="userStore.isOnRequest"
							:loading="userStore.isOnRequest"
							@click="updateSpace(spaceState.current)"
							>Salvar</n-button
						>
						<n-button v-else type="warning" round @click="isEditing = true">Editar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="spaceState.show.new"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<!-- // TODO: Calcular o tamanho da tela e setar o max-height -->
			<n-drawer-content title="Criar novo espaço" closable>
				<n-form ref="formRef" :model="spaceState.current" :rules="spaceState.validationRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="spaceState.current.name" placeholder="Informe o titulo do espaço" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="spaceState.current.description"
							placeholder="Informe a descrição do espaço"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item path="tags" label="Tags">
						<n-dynamic-tags v-model:value="spaceState.current.tags" />
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							type="info"
							round
							:disabled="userStore.isOnRequest"
							:loading="userStore.isOnRequest"
							@click="handleForm && addSpace()"
						>
							Criar espaço
						</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="listState.show.view"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
			@after-leave="cleanFields('list')"
		>
			<n-drawer-content closable>
				<template #header>
					<n-input v-if="isEditing" v-model:value="listState.current.name" type="text" placeholder="Titulo da lista" />
					<div v-else>
						{{ listState.current.name }}
					</div>
				</template>
				<small>Descrição</small>
				<n-input
					v-if="isEditing"
					v-model:value="listState.current.description"
					type="textarea"
					placeholder="Descrição da lista"
					class="mb-10"
				/>
				<div v-else style="white-list: pre-wrap">{{ listState.current.description }}</div>
				<br />
				<small>Tags</small>
				<div>
					<n-dynamic-tags v-if="isEditing" v-model:value="listState.current.tags" />
					<n-tag v-else v-for="(tag, index) in listState.current.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<n-button class="mr-10" type="info" round @click="pushToTimeline()"> Tarefas </n-button>

						<n-button
							round
							type="error"
							class="mr-10"
							:loading="isDeleting"
							:disabled="isDeleting"
							@click="deleteCurrentList = true"
						>
							Excluir
						</n-button>

						<n-button
							v-if="isEditing"
							type="success"
							round
							:disabled="userStore.isOnRequest"
							:loading="userStore.isOnRequest"
							@click="updateList(listState.current)"
							>Salvar</n-button
						>
						<n-button v-else type="warning" round @click="isEditing = true">Editar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="listState.show.new"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<!-- // TODO: Calcular o tamanho da tela e setar o max-height -->
			<n-drawer-content title="Criar nova lista" closable>
				<n-form ref="formRef" :model="listState.current" :rules="listState.validationRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="listState.current.name" placeholder="Informe o titulo da lista" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="listState.current.description"
							placeholder="Informe a descrição da lista"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item path="tags" label="Tags">
						<n-dynamic-tags v-model:value="listState.current.tags" />
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							type="info"
							round
							@click="handleForm && addList()"
							:loading="userStore.isOnRequest"
							:disabled="userStore.isOnRequest"
						>
							Criar lista
						</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-modal
			v-model:show="openDeleteConfirmation"
			type="error"
			title="Deseja realmente remover?"
			content="Caso você opte por excluir não será possível recuperar esses dados. Tem certeza de que deseja excluir?"
			preset="confirm"
			positive-text="Excluir"
			negative-text="Cancelar"
			:positive-button-props="{ round: true }"
			:negative-button-props="{ round: true }"
			@positive-click="
				() => {
					if (openDeleteConfirmation) {
						deleteCurrentList ? deleteList(listState.current._id) : deleteSpace(spaceState.current._id)
					}
				}
			"
			@negative-click="deleteCurrentList = deleteCurrentSpace = false"
			@after-leave="deleteCurrentList = deleteCurrentSpace = false"
		/>
	</div>
</template>
