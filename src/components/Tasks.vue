<script setup lang="ts">
import { axiosInject } from '@/services/axios'
import { UserStore, TaskModel } from '@/stores/user'
import { NotificationStore } from '@/stores/notification'
import {
	NCard,
	NPerformantEllipsis,
	NInput,
	// NDynamicTags,
	NSelect,
	NTag,
	NButton,
	NDrawerContent,
	NDrawer,
	NForm,
	NFormItem,
	NModal,
	NIcon,
	NDatePicker,
	FormRules,
	FormInst,
	useLoadingBar
} from 'naive-ui'
import { ref, watch } from 'vue'
import { AddCircleOutline } from '@vicons/ionicons5'
import { SelectMixedOption } from 'naive-ui/es/select/src/interface'

const formRef = ref<FormInst | null>(null)
const axios = axiosInject()
const loadingBar = useLoadingBar()
const userStore = UserStore()
const notification = NotificationStore()
const isEditing = ref(false)
const isDeleting = ref(false)
const deleteCurrentTask = ref(false)
const tagOptions = ref([] as SelectMixedOption[])

tagOptions.value = [
	{ label: 'tag1', value: 'tag1' },
	{ label: 'tag2', value: 'tag2' },
	{ label: 'tag3', value: 'tag3' }
]

const { tasks, spaceId, listId } = defineProps(['tasks', 'spaceId', 'listId'])
const emit = defineEmits(['update'])

const initialState = () => ({
	current: {} as TaskModel,
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

watch(
	() => userStore.isOnRequest,
	(newValue, oldValue) => {
		!newValue && oldValue && cleanFields()
		newValue ? loadingBar.start() : loadingBar.finish()
	},
	{ immediate: true }
)

const taskState = ref(initialState())

const handleForm = (e: MouseEvent) => {
	e.preventDefault()

	return formRef.value?.validate(errors => !errors)
}

const resolveCatch = error => {
	console.error(error)
	const { title, description } = error
	notification.error({ title, description })
	loadingBar.finish()
}

const openView = task => {
	taskState.value.current = { ...task, startDate: new Date(task.startDate).getTime() }
	taskState.value.show.view = true
}

const cleanFields = () => {
	setTimeout(() => (isDeleting.value = isEditing.value = false), 500)
	taskState.value.show.new = taskState.value.show.view = false
	taskState.value.current = {} as TaskModel
}

//#region Task Functions

const addTask = (task = taskState.value.current) => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = true

	return axios
		.post(`/me/spaces/${spaceId}/lists/${listId}/tasks`, task)
		.then(() => emit('update'))
		.catch(resolveCatch)
		.finally(() => (userStore.isOnRequest = false))
}

const updateTask = (task = taskState.value.current) => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = true

	console.log('task StartDate', task.startDate)

	return axios
		.put(`/me/spaces/${spaceId}/lists/${listId}/tasks/${task._id}`, task)
		.then(() => emit('update'))
		.catch(resolveCatch)
		.finally(() => (userStore.isOnRequest = false))
}

const deleteTask = (taskId = taskState.value.current._id) => {
	if (userStore.isOnRequest) return
	userStore.isOnRequest = isDeleting.value = true

	axios
		.delete(`/me/spaces/${spaceId}/lists/${listId}/tasks/${taskId}`)
		.then(() => emit('update'))
		.catch(resolveCatch)
		.finally(() => (userStore.isOnRequest = isDeleting.value = false))
}
//#endregion
</script>

<template>
	<div class="d-flex" style="gap: 8px">
		<n-card v-for="(task, index) in tasks" :key="index" style="width: 200px; cursor: pointer" @click="openView(task)">
			<h4 style="color: rgb(104, 104, 104)">{{ task.name }}</h4>
			<br />

			<n-performant-ellipsis :line-clamp="3" :tooltip="{ disabled: true }">
				{{ task.description }}
			</n-performant-ellipsis>
		</n-card>
		<n-card style="width: 200px" @click="taskState.show.new = true">
			<div class="new-card">
				<div class="new-card-content">
					<n-icon size="28" color="rgb(163, 163, 163)"><AddCircleOutline /></n-icon>
					<div>Criar tarefa</div>
				</div>
			</div>
		</n-card>

		<n-drawer
			v-model:show="taskState.show.view"
			class="drawer-task"
			placement="bottom"
			default-height="84%"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<n-drawer-content closable>
				<template #header>
					<n-input v-if="isEditing" v-model:value="taskState.current.name" type="text" placeholder="Titulo da tarefa" />
					<div v-else>
						{{ taskState.current.name }}
					</div>
				</template>
				<small>Descrição</small>
				<n-input
					v-if="isEditing"
					v-model:value="taskState.current.description"
					type="textarea"
					placeholder="Descrição da tarefa"
					class="mb-10"
				/>
				<div v-else style="white-task: pre-wrap">{{ taskState.current.description }}</div>
				<br />
				<small>Tags</small>
				<div>
					<n-select
						v-if="isEditing"
						v-model:value="taskState.current.tags"
						:options="tagOptions"
						filterable
						multiple
						tag
						placeholder="Adicione tags para relacionar a outras tarefas"
						:show-arrow="false"
					/>
					<n-tag v-else v-for="(tag, index) in taskState.current.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>
				<br />
				<small>Data de inicio</small>

				<!-- <n-form-item label="Data de inicio" path="startDate"> -->
				<n-date-picker
					v-model:value="taskState.current.startDate"
					type="datetime"
					style="width: 100%"
					format="dd/MM/yyyy HH:mm:ss"
					clearable
				/>
				<!-- </n-form-item> -->

				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							round
							type="error"
							class="mr-10"
							:disabled="isDeleting"
							:loading="isDeleting"
							@click="deleteCurrentTask = true"
						>
							Excluir
						</n-button>
						<n-button
							v-if="isEditing"
							type="success"
							round
							:loading="userStore.isOnRequest"
							:disabled="userStore.isOnRequest"
							@click="updateTask()"
						>
							Salvar
						</n-button>
						<n-button v-else type="warning" round @click="isEditing = true">Editar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="taskState.show.new"
			class="drawer-task"
			placement="bottom"
			default-height="84%"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<n-drawer-content title="Criar nova tarefa" closable>
				<n-form ref="formRef" :model="taskState.current" :rules="taskState.validationRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="taskState.current.name" placeholder="Informe o titulo da tarefa" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="taskState.current.description"
							placeholder="Informe a descrição da tarefa"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item path="tags" label="Tags">
						<n-select
							v-model:value="taskState.current.tags"
							:options="tagOptions"
							filterable
							multiple
							tag
							placeholder="Adicione tags para relacionar a outras tarefas"
							:show-arrow="false"
						/>
					</n-form-item>

					<n-form-item label="Data de inicio" path="startDate">
						<n-date-picker
							v-model:value="taskState.current.startDate"
							type="datetime"
							style="width: 100%"
							format="dd/MM/yyyy HH:mm:ss"
							clearable
						/>
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							type="info"
							round
							:loading="userStore.isOnRequest"
							:disabled="userStore.isOnRequest"
							@click="handleForm && addTask()"
						>
							Criar tarefa
						</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-modal
			v-model:show="deleteCurrentTask"
			type="error"
			title="Deseja realmente remover?"
			content="Caso você opte por excluir não será possivel recuperar esses dados. Tem certeza de que deseja excluir?"
			preset="confirm"
			positive-text="Excluir"
			negative-text="Cancelar"
			:positive-button-props="{ round: true }"
			:negative-button-props="{ round: true }"
			@positive-click="deleteTask(taskState.current._id)"
			@negative-click="deleteCurrentTask = false"
			@after-leave="deleteCurrentTask = false"
		/>
	</div>
</template>

<style scoped lang="scss">
.new-card {
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	flex-direction: row;

	.new-card-content {
		color: rgb(163, 163, 163);
		font-weight: 500;
		text-align: center;
	}
}
</style>
