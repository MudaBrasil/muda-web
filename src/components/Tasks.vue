<script setup lang="ts">
import { axiosInject } from '@/services/axios'
import { UserStore, TaskModel } from '@/stores/user'
import { NotificationStore } from '@/stores/notification'
import {
	NCard,
	NPerformantEllipsis,
	NInput,
	NDynamicTags,
	NTag,
	NButton,
	NDrawerContent,
	NDrawer,
	NForm,
	NFormItem,
	NModal,
	NIcon,
	FormRules,
	FormInst
} from 'naive-ui'
import { ref, watch } from 'vue'
import { AddCircleOutline } from '@vicons/ionicons5'

const formRef = ref<FormInst | null>(null)
const axios = axiosInject()
const userStore = UserStore()
const notification = NotificationStore()
const isEditing = ref(false)
const isDeleting = ref(false)

const { tasks, spaceId, listId } = defineProps(['tasks', 'spaceId', 'listId'])
const emit = defineEmits(['update'])

const initialState = () => ({
	current: {} as TaskModel,
	loading: {
		new: false,
		update: false,
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

watch(
	() => userStore.isOnRequest,
	(newValue, oldValue) => !newValue && oldValue && cleanFields(),
	{ immediate: true }
)

const taskState = ref(initialState())

const handleForm = (e: MouseEvent) => {
	e.preventDefault()

	return formRef.value?.validate(errors => !errors)
}

const resolveCatch = ({ title, description }) => {
	notification.error({ title, description })
}

const openView = task => {
	taskState.value.current = Object.assign({}, task)
	taskState.value.show.view = true
}

const cleanFields = () => {
	isEditing.value = false
	taskState.value.current = {} as TaskModel
	taskState.value.show.new = false
	taskState.value.show.view = false
	taskState.value.loading.new = false
}

//#region Task Functions

const addTask = (task = taskState.value.current) => {
	taskState.value.loading.new = true

	return axios
		.post(`/me/spaces/${spaceId}/lists/${listId}/tasks`, task)
		.then(() => emit('update'))
		.catch(resolveCatch)
}

const updateTask = (task = taskState.value.current) => {
	taskState.value.loading.update = true

	return axios
		.put(`/me/spaces/${spaceId}/lists/${listId}/tasks/${task._id}`, task)
		.then(() => emit('update'))
		.catch(resolveCatch)
}

const deleteTask = (task = taskState.value.current) => {
	taskState.value.loading.delete = true

	axios
		.delete(`/me/spaces/${spaceId}/lists/${listId}/tasks/${task._id}`)
		.then(() => emit('update'))
		.catch(resolveCatch)
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
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
			@after-leave="cleanFields()"
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
					<n-dynamic-tags v-if="isEditing" v-model:value="taskState.current.tags" />
					<n-tag v-else v-for="(tag, index) in taskState.current.tags" :key="index" style="margin-right: 8px">{{
						tag
					}}</n-tag>
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							@click="taskState.loading.delete = isDeleting = true"
							:loading="taskState.loading.delete"
							type="error"
							class="mr-10"
							round
						>
							Excluir
						</n-button>
						<n-button v-if="isEditing" type="success" round @click="updateTask()">Salvar</n-button>
						<n-button v-else type="warning" round @click="isEditing = true">Editar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="taskState.show.new"
			class="drawer-task"
			placement="bottom"
			default-height="500"
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
						<n-dynamic-tags v-model:value="taskState.current.tags" />
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button type="info" round @click="handleForm && addTask()" :loading="taskState.loading.new">
							Criar tarefa
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
			@positive-click="deleteTask()"
			@negative-click="taskState.loading.delete = isDeleting = false"
			@after-leave="taskState.loading.delete = isDeleting = false"
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
