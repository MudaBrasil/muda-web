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
import { onMounted, ref } from 'vue'
import { EllipsisVertical } from '@vicons/ionicons5'

const formRef = ref<FormInst | null>(null)
const axios = axiosInject()
const loadingBar = useLoadingBar()
const userStore = UserStore()
const notification = NotificationStore()
const router = useRouter()
const isEditing = ref(false)
const isDeleting = ref(false)

const initialState = <Type,>() => ({
	current: {} as Type, // TODO: Talvez transformar em uma variavel fora daqui e unica pra espaco e lista
	currentTab: 0,
	loading: {
		new: false,
		delete: false
	},
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

const space = ref(initialState<SpaceModel>())
const list = ref(initialState<ListModel>())

onMounted(() => getSpaces())

const handleForm = (e: MouseEvent) => {
	e.preventDefault()

	return formRef.value?.validate(errors => !errors)
}

const resolveCatch = ({ title, description }) => {
	notification.error({ title, description })
	loadingBar.error()
}

const openView = (type = 'space', index?, indexList?) => {
	if (type === 'space') {
		space.value.current = Object.assign({}, userStore.spaces[space.value.currentTab])
		space.value.show.view = true
	} else {
		if (space.value.currentTab == index && list.value.currentTab == indexList) {
			list.value.current = Object.assign({}, userStore.spaces[space.value.currentTab].lists[list.value.currentTab])
			list.value.show.view = true
		}
	}
}

const cleanFields = (type = 'space') => {
	isEditing.value = false
	if (type === 'space') {
		space.value.current = {} as SpaceModel
		space.value.show.new = false
		space.value.loading.new = false
	} else {
		list.value.current = {} as ListModel
		list.value.show.new = false
		list.value.loading.new = false
	}
}

const pushToTimeline = (currentSpace = userStore.spaces[space.value.currentTab]) => {
	router.push({
		name: 'timelineSpaceList',
		params: {
			spaceId: currentSpace._id,
			listId: currentSpace.lists[list.value.currentTab]._id
		}
	})
}

//#region Space Functions
const getSpaces = () => {
	loadingBar.start()
	userStore.isOnRequest = true

	return axios
		.get('/me/spaces')
		.then(response => {
			loadingBar.finish()
			userStore.isOnRequest = false
			return (userStore.spaces = response.data)
		})
		.catch(resolveCatch)
}

const addSpace = () => {
	loadingBar.start()
	space.value.loading.new = true

	return axios
		.post('/me/spaces', space.value.current)
		.then(async () => {
			loadingBar.finish()
			cleanFields()
			await getSpaces()

			return (space.value.currentTab = userStore.spaces.length - 1)
		})
		.catch(resolveCatch)
}

const updateSpace = space => {
	loadingBar.start()

	return axios
		.put(`/me/spaces/${space._id}`, { ...space, lists: undefined })
		.then(() => {
			loadingBar.finish()
			space.value.show.view = false
			return getSpaces()
		})
		.catch(resolveCatch)
}

const deleteSpace = spaceId => {
	space.value.loading.delete = true

	axios
		.delete(`/me/spaces/${spaceId}`)
		.then(() => {
			userStore.spaces = userStore.spaces.filter(space => space._id !== spaceId)
			space.value.show.view = false
			space.value.loading.delete = false

			space.value.currentTab = space.value.currentTab > 0 ? space.value.currentTab - 1 : 0

			return getSpaces()
		})
		.catch(resolveCatch)
}
//#endregion

//#region List Functions
const addList = () => {
	loadingBar.start()
	list.value.loading.new = true

	return axios
		.post(`/me/spaces/${userStore.spaces[space.value.currentTab]._id}/lists`, list.value.current)
		.then(async () => {
			loadingBar.finish()
			cleanFields('list')

			await getSpaces()
			return (list.value.currentTab = userStore.spaces[space.value.currentTab]?.lists.length - 1)
		})
		.catch(resolveCatch)
}

const updateList = list => {
	loadingBar.start()

	return axios
		.put(`/me/spaces/${userStore.spaces[space.value.currentTab]._id}/lists/${list._id}`, { ...list, tasks: undefined })
		.then(() => {
			list.value.show.view = false
			loadingBar.finish()
			return getSpaces()
		})
		.catch(resolveCatch)
}

const deleteList = listId => {
	list.value.loading.delete = true

	axios
		.delete(`/me/spaces/${userStore.spaces[space.value.currentTab]._id}/lists/${listId}`)
		.then(() => {
			userStore.spaces[space.value.currentTab].lists = userStore.spaces[space.value.currentTab].lists.filter(
				list => list._id !== listId
			)

			list.value.show.view = false
			list.value.loading.delete = false

			list.value.currentTab = list.value.currentTab > 0 ? list.value.currentTab - 1 : 0
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
					v-model:value="space.currentTab"
					addable
					@add="space.show.new = true"
					@update-value="list.currentTab = 0"
					tab-style="padding: 0"
				>
					<n-tab-pane v-for="(spaceItem, index) in userStore.spaces" :key="index" :name="index">
						<template #tab>
							<div class="p-10 d-flex ai-center" @click="space.currentTab == index && openView()">
								<div class="mh-6">{{ spaceItem.name }}</div>

								<n-button v-if="space.currentTab == index" circle quaternary size="small">
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
								v-model:value="list.currentTab"
								addable
								@add="list.show.new = true"
								tab-style="padding: 0"
							>
								<n-tab-pane v-for="(listItem, indexList) in spaceItem.lists" :key="indexList" :name="indexList">
									<template #tab>
										<div class="p-4 d-flex ai-center" @click="openView('list', index, indexList)">
											<div class="ml-8 mr-2">{{ listItem.name }}</div>

											<n-button
												v-if="space.currentTab == index && list.currentTab == indexList"
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
												:tasks="listItem.tasks"
												:spaceId="spaceItem._id"
												:listId="listItem._id"
												@update="getSpaces"
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
			v-model:show="space.show.view"
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
					<n-input v-if="isEditing" v-model:value="space.current.name" type="text" placeholder="Titulo do espaço" />
					<div v-else>
						{{ space.current.name }}
					</div>
				</template>
				<small>Descrição</small>
				<n-input
					v-if="isEditing"
					v-model:value="space.current.description"
					type="textarea"
					placeholder="Descrição do espaço"
					class="mb-10"
				/>
				<div v-else style="white-space: pre-wrap">{{ space.current.description }}</div>
				<br />
				<small>Tags</small>
				<div>
					<n-dynamic-tags v-if="isEditing" v-model:value="space.current.tags" />
					<n-tag v-else v-for="(tag, index) in space.current.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							@click="space.loading.delete = isDeleting = true"
							:loading="space.loading.delete"
							type="error"
							class="mr-10"
							round
						>
							Excluir
						</n-button>
						<n-button v-if="isEditing" type="success" round @click="updateSpace(space.current)">Salvar</n-button>
						<n-button v-else type="warning" round @click="isEditing = true">Editar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="space.show.new"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<!-- // TODO: Calcular o tamanho da tela e setar o max-height -->
			<n-drawer-content title="Criar novo espaço" closable>
				<n-form ref="formRef" :model="space.current" :rules="space.validationRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="space.current.name" placeholder="Informe o titulo do espaço" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="space.current.description"
							placeholder="Informe a descrição do espaço"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item path="tags" label="Tags">
						<n-dynamic-tags v-model:value="space.current.tags" />
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button type="info" round @click="handleForm && addSpace()" :loading="space.loading.new">
							Criar espaço
						</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="list.show.view"
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
					<n-input v-if="isEditing" v-model:value="list.current.name" type="text" placeholder="Titulo da lista" />
					<div v-else>
						{{ list.current.name }}
					</div>
				</template>
				<small>Descrição</small>
				<n-input
					v-if="isEditing"
					v-model:value="list.current.description"
					type="textarea"
					placeholder="Descrição da lista"
					class="mb-10"
				/>
				<div v-else style="white-list: pre-wrap">{{ list.current.description }}</div>
				<br />
				<small>Tags</small>
				<div>
					<n-dynamic-tags v-if="isEditing" v-model:value="list.current.tags" />
					<n-tag v-else v-for="(tag, index) in list.current.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<n-button class="mr-10" type="info" round @click="pushToTimeline()"> Tarefas </n-button>

						<n-button
							@click="list.loading.delete = isDeleting = true"
							:loading="list.loading.delete"
							type="error"
							class="mr-10"
							round
						>
							Excluir
						</n-button>

						<n-button v-if="isEditing" type="success" round @click="updateList(list.current)">Salvar</n-button>
						<n-button v-else type="warning" round @click="isEditing = true">Editar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="list.show.new"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<!-- // TODO: Calcular o tamanho da tela e setar o max-height -->
			<n-drawer-content title="Criar nova lista" closable>
				<n-form ref="formRef" :model="list.current" :rules="list.validationRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="list.current.name" placeholder="Informe o titulo da lista" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="list.current.description"
							placeholder="Informe a descrição da lista"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item path="tags" label="Tags">
						<n-dynamic-tags v-model:value="list.current.tags" />
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button type="info" round @click="handleForm && addList()" :loading="list.loading.new">
							Criar lista
						</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-modal
			v-model:show="isDeleting"
			type="error"
			title="Deseja realmente remover?"
			content="Caso você opte por excluir não será possivel recuperar esses dados. Tem certeza de que deseja excluir?"
			preset="confirm"
			positive-text="Excluir"
			negative-text="Cancelar"
			:positive-button-props="{ round: true }"
			:negative-button-props="{ round: true }"
			@positive-click="list.loading.delete ? deleteList(list.current._id) : deleteSpace(space.current._id)"
			@negative-click="list.loading.delete = space.loading.delete = isDeleting = false"
			@after-leave="list.loading.delete = space.loading.delete = isDeleting = false"
		/>
	</div>
</template>
