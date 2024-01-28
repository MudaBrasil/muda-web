<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { axiosInject } from '@/services/axios'
import {
	NTimeline,
	NTimelineItem,
	NCard,
	NButton,
	NInput,
	NTime,
	NForm,
	NFormItem,
	NDatePicker,
	NDrawer,
	// NScrollbar,
	NDrawerContent,
	NPerformantEllipsis,
	FormInst,
	FormRules,
	useLoadingBar
} from 'naive-ui'
import { useRoute } from 'vue-router'
import { NotificationStore } from '@/stores/notification'
import { UserStore } from '@/stores/user'

const formRef = ref<FormInst | null>(null)
const route = useRoute()
const axios = axiosInject()
const loadingBar = useLoadingBar()
const notification = NotificationStore()
const userStore = UserStore()
const hasSpaceList = ref(false)
const hasTasksSplitted = ref(false)
const requestEndpoint = ref('/me/tasks')
const tasksSplitted = ref([])
const daySelected = ref('')
const daysToSplit = ref([
	'2024-01-26',
	'2024-01-27',
	'2024-01-28',
	'2024-01-29',
	'2024-01-30',
	'2024-01-31',
	'2024-02-01',
	'2024-02-02',
	'2024-02-03'
])

const showModal = ref({
	newTask: false,
	viewTask: false
})
const loading = ref({
	newTask: false,
	deleteTask: false
})

const validationTaskRules: FormRules = {
	name: {
		required: true,
		message: 'Atenção: Informe o titulo da tarefa.',
		trigger: 'blur',
		pattern: /[\S]/
	},
	description: {
		required: true,
		message: 'Atenção: Informe a descrição da tarefa.',
		trigger: 'blur',
		pattern: /[\S]/
	},
	startDate: {
		required: true,
		message: 'Atenção: Informe a data de inicio da tarefa.',
		trigger: 'blur',
		type: 'date'
	}
}

const dateToString = (date: Date = new Date()) => date.toISOString().substring(0, 10)
const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const getShortWeekDay = (date: Date = new Date()) => weekDays[date.getDay()].substring(0, 3)

const newTaskInitial = () => ({
	name: '',
	description: '',
	startDate: new Date().getTime()
})
const newTask = ref(newTaskInitial())

const currentTask = ref({
	_id: '',
	name: '',
	description: '',
	startDate: new Date()
})

onMounted(async () => {
	if (route.name === 'timelineTasks') requestEndpoint.value = '/me/tasks'

	if (route.name === 'timelineSpaceList') {
		const { spaceId, listId }: any = route.params
		hasSpaceList.value = spaceId && listId
		hasSpaceList.value && (requestEndpoint.value = `/me/spaces/${spaceId}/lists/${listId}/tasks`)
	}

	if (route.name === 'timeline') {
		const queryParam = new URLSearchParams()
		queryParam.append('daysToSplit', daysToSplit.value.toLocaleString())
		const todayDateString = dateToString()
		daySelected.value = daysToSplit.value.includes(todayDateString) ? todayDateString : daysToSplit.value[0]

		hasTasksSplitted.value = true
		requestEndpoint.value = '/me/timelines' + (queryParam ? '?' + queryParam.toString() : '')
	}

	getTasks()
})

const getTasks = () => {
	loadingBar.start()
	// TODO: usar o skeleton loading
	// TODO: Verificar se ao logar em outro usuario esta cacheando as tarefas do usuario antigo
	// TODO: Criar verificador de ultima vez que fez o get/tasks para nao fazer toda vez que entrar na pagina

	return axios
		.get(requestEndpoint.value)
		.then(response => {
			loadingBar.finish()

			if (hasTasksSplitted.value) return (tasksSplitted.value = response.data)

			return (userStore.tasks = response.data)
		})
		.catch(({ title, description }) => {
			notification.error({ title, description })
			loadingBar.error()
		})
}

const addTask = () => {
	loading.value.newTask = true

	const { name, description, startDate } = newTask.value

	axios
		.post(requestEndpoint.value, { name, description, startDate: new Date(startDate) })
		.then(async () => {
			getTasks()
			showModal.value.newTask = false
			loading.value.newTask = false
			newTask.value = newTaskInitial()
		})
		.catch(error => {
			loading.value.newTask = false

			if (error?.title && error?.description) {
				notification.error({ title: error.title, description: error.description })
			}

			notification.error({
				title: 'Erro ao adicionar tarefa',
				description:
					'Aconteceu um erro inesperado ao adicionar esta tarefa. Tente novamente e caso o problema persista entre em contato conosco para dar mais detalhes sobre o que aconteceu.'
			})
		})
}

const deleteTask = taskId => {
	loading.value.deleteTask = true

	axios
		.delete(`${requestEndpoint.value}/${taskId}`)
		.then(() => {
			// userStore.tasks = userStore.tasks.filter(task => task._id !== taskId)

			getTasks()
			showModal.value.viewTask = false
			loading.value.deleteTask = false
		})
		.catch(error => {
			loading.value.deleteTask = false

			if (error?.title && error?.description) {
				notification.error({ title: error.title, description: error.description })
			}

			notification.error({
				title: 'Erro ao adicionar tarefa',
				description:
					'Aconteceu um erro inesperado ao adicionar esta tarefa. Tente novamente e caso o problema persista entre em contato conosco para dar mais detalhes sobre seus últimos passos.'
			})
		})
}

const showModalViewTask = task => {
	currentTask.value = task
	currentTask.value.startDate = new Date(task.startDate)
	showModal.value.viewTask = true
}
const handleAddTask = (e: MouseEvent) => {
	e.preventDefault()

	formRef.value?.validate(errors => {
		if (!errors) {
			addTask()
		}
	})
}
</script>

<template>
	<div>
		<!-- <n-button type="info" round class="m-20" @click="showModal.newTask = true">
				<template #icon>
					<n-icon><AddSharp /></n-icon>
				</template>
				Tarefa
			</n-button> -->

		<div class="w-100">
			<!-- </n-scrollbar> trigger="hover" class="m-10"> -->
			<div class="m-10 pb-6 pt-3" style="white-space: nowrap; overflow-y: auto">
				<n-button
					v-for="(day, index) in daysToSplit"
					:key="index"
					:type="daySelected == day ? 'primary' : 'default'"
					@click.prevent="daySelected = day"
					secondary
					style="height: 42px; width: 50px"
					class="mh-3"
				>
					<div class="">
						<div style="font-weight: bold">{{ day.substring(8, 10) }}</div>
						<div style="font-size: 10px">{{ getShortWeekDay(new Date(day)) }}</div>
					</div>
				</n-button>
			</div>
		</div>
		<div class="pt-10 mb-100 mh-30">
			<n-timeline v-if="!hasTasksSplitted && userStore.tasks?.length">
				<n-timeline-item v-for="task in userStore.tasks" type="success" :key="task._id">
					<n-card hoverable embedded class="custom-card" :title="task.name" @click="showModalViewTask(task)">
						<template #header-extra>
							<div class="card-header-title">
								<n-time v-if="task?.startDate" :time="new Date(task?.startDate)" format="HH:mm" />
							</div>
						</template>
						<div class="card-content-text">
							<n-performant-ellipsis :line-clamp="2" :tooltip="{ disabled: true }">
								{{ task.description }}
							</n-performant-ellipsis>
						</div>
					</n-card>
				</n-timeline-item>
			</n-timeline>
			<div v-else>
				<div>
					<n-timeline>
						<!-- v-for="(dayTasks, index) in tasksSplitted" :key="index"> -->
						<n-timeline-item v-for="task in tasksSplitted[daySelected]" type="success" :key="task._id">
							<n-card hoverable embedded class="custom-card" :title="task.name" @click="showModalViewTask(task)">
								<template #header-extra>
									<div class="card-header-title">
										<n-time v-if="task?.startDate" :time="new Date(task?.startDate)" format="HH:mm" />
									</div>
								</template>
								<div class="card-content-text">
									<n-performant-ellipsis :line-clamp="2" :tooltip="{ disabled: true }">
										{{ task.description }}
									</n-performant-ellipsis>
								</div>
							</n-card>
						</n-timeline-item>
					</n-timeline>
				</div>
			</div>
		</div>

		<n-drawer
			v-model:show="showModal.newTask"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<!-- // TODO: Calcular o tamanho da tela e setar o max-height -->
			<n-drawer-content title="Criar nova tarefa" closable>
				<n-form ref="formRef" :model="newTask" :rules="validationTaskRules">
					<n-form-item label="Titulo" path="name">
						<n-input v-model:value="newTask.name" placeholder="Informe o titulo da tarefa" />
					</n-form-item>
					<n-form-item label="Descrição" path="description">
						<n-input
							v-model:value="newTask.description"
							placeholder="Informe a descrição da tarefa"
							type="textarea"
							:autosize="{ minRows: 4 }"
						/>
					</n-form-item>
					<n-form-item label="Data de inicio" path="startDate">
						<n-date-picker
							v-model:value="newTask.startDate"
							type="datetime"
							style="width: 100%"
							format="dd/MM/yyyy HH:mm:ss"
							clearable
						/>
					</n-form-item>
				</n-form>
				<template #footer>
					<div class="d-flex jc-end">
						<n-button type="info" round @click="handleAddTask" :loading="loading.newTask"> Criar tarefa </n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>

		<n-drawer
			v-model:show="showModal.viewTask"
			class="drawer-task"
			placement="bottom"
			default-height="500"
			:max-height="700"
			:min-height="300"
			resizable
		>
			<n-drawer-content :title="currentTask.name" closable>
				<small>Descrição</small>
				<div style="white-space: pre-wrap">{{ currentTask.description }}</div>
				<br />
				<small>Data de inicio</small>
				<div>
					<n-time :time="new Date(currentTask.startDate)" type="datetime" format="dd/MM/yyyy HH:mm" />
				</div>

				<template #footer>
					<div class="d-flex jc-end">
						<n-button
							@click="deleteTask(currentTask._id)"
							:loading="loading.deleteTask"
							type="error"
							class="mr-10"
							round
						>
							Excluir
						</n-button>
						<n-button type="info" round @click="">Iniciar</n-button>
					</div>
				</template>
			</n-drawer-content>
		</n-drawer>
	</div>
</template>

<style scoped lang="scss">
.custom-card {
	min-width: 50vw;
	height: 100%;
	border-radius: 20px;
	cursor: pointer;

	&:not(.n-button--disabled):active {
		background-color: var(--n-color-pressed);
		color: var(--n-text-color-pressed);
	}

	&:not(.n-button--disabled):hover {
		background-color: var(--n-color-hover);
		color: var(--n-text-color-hover);
	}
}

:deep(.drawer-task) {
	margin: auto;

	@media (min-width: 1000px) {
		width: 60vw;
	}
}

.n-button :deep(.n-card-header__main) {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding-right: 3px;
	font-size: 16px;
}

:deep(.n-card-header) {
	padding-bottom: 4px;
}

.card-header-title {
	font-weight: 500;
	color: #000;
}

.timeline-header {
	position: fixed;
	z-index: 2;
	background: white;
	width: 100%;
}
</style>
