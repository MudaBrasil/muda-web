<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { axiosInject } from '@/services/axios'
import {
	NTimeline,
	NTimelineItem,
	NCard,
	NButton,
	NInput,
	NIcon,
	NTime,
	NForm,
	NFormItem,
	NEmpty,
	NDatePicker,
	NDrawer,
	NScrollbar,
	NDrawerContent,
	NPerformantEllipsis,
	FormInst,
	FormRules,
	useLoadingBar
} from 'naive-ui'
import { useRoute } from 'vue-router'
import { NotificationStore } from '@/stores/notification'
import { UserStore } from '@/stores/user'
import { AddSharp, PlayCircleOutline } from '@vicons/ionicons5'

const formRef = ref<FormInst | null>(null)
const route = useRoute()
const axios = axiosInject()
const loadingBar = useLoadingBar()
const notification = NotificationStore()
const userStore = UserStore()
const hasSpaceList = ref(false)
const hasTasksSplitted = ref(false)
const requestEndpoint = ref('/me/tasks')
const daySelected = ref<number | null>(null)
const days = ref([])

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
		const weekDaysNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
		const monthsNames = [
			'Janeiro',
			'Fevereiro',
			'Março',
			'Abril',
			'Maio',
			'Junho',
			'Julho',
			'Agosto',
			'Setembro',
			'Outubro',
			'Novembro',
			'Dezembro'
		]
		const dateToString = (date: Date = new Date()) => date.toLocaleString('sv').substring(0, 10)
		const getWeekDay = (date: Date) => weekDaysNames[date.getDay()]
		const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6

		const today = new Date()
		const yesterday = new Date(today.getTime() - 86400000)
		const before2days = new Date(yesterday.getTime() - 86400000)
		const tomorrow = new Date(today.getTime() + 86400000)
		const after2days = new Date(tomorrow.getTime() + 86400000)
		const after3days = new Date(after2days.getTime() + 86400000)
		const after4days = new Date(after3days.getTime() + 86400000)
		const after5days = new Date(after4days.getTime() + 86400000)

		days.value = [
			{ fullDate: before2days, shortDate: dateToString(before2days), weekDay: getWeekDay(before2days) },
			{ fullDate: yesterday, shortDate: dateToString(yesterday), weekDay: getWeekDay(yesterday) },
			{ fullDate: today, shortDate: dateToString(today), weekDay: getWeekDay(today) },
			{ fullDate: tomorrow, shortDate: dateToString(tomorrow), weekDay: getWeekDay(tomorrow) },
			{ fullDate: after2days, shortDate: dateToString(after2days), weekDay: getWeekDay(after2days) },
			{ fullDate: after3days, shortDate: dateToString(after3days), weekDay: getWeekDay(after3days) },
			{ fullDate: after4days, shortDate: dateToString(after4days), weekDay: getWeekDay(after4days) },
			{ fullDate: after5days, shortDate: dateToString(after5days), weekDay: getWeekDay(after5days) }
		]

		days.value.map(day => {
			day.description = `${day.weekDay}, ${day.fullDate.getDate()} de ${monthsNames[day.fullDate.getMonth()]}`
			day.isWeekend = isWeekend(day.fullDate)
			return day
		})

		const queryParam = new URLSearchParams()
		const daysToSplit = days.value.map(day => day.shortDate)
		const todayShortString = daysToSplit[2]

		queryParam.append('daysToSplit', daysToSplit.join(','))
		requestEndpoint.value = `/me/timelines?${queryParam.toString()}`
		hasTasksSplitted.value = true
		daySelected.value = days.value.findIndex(day => day.shortDate === todayShortString)
	}

	getTasks()
})

const currentTasks = computed(() => {
	if (hasTasksSplitted.value) {
		if (hasTasksSplitted.value && daySelected.value !== null) {
			const selectedShortString = days.value[daySelected.value].shortDate
			return userStore.tasksSplitted[selectedShortString]
		}
		return []
	}

	return userStore.tasks
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

			if (hasTasksSplitted.value) return (userStore.tasksSplitted = response.data)

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
		<div class="cards-scrollbar ph-20">
			<n-scrollbar x-scrollable trigger="hover" class="pb-14 pt-3">
				<div class="d-flex" style="white-space: nowrap; overflow-y: auto; gap: 10px">
					<n-button
						v-for="(day, index) in days"
						:key="index"
						:type="daySelected == index ? 'primary' : 'default'"
						@click.prevent="daySelected = index"
						secondary
						style="height: 50px; width: 56px"
						class="mh-0"
					>
						<div :class="['btn-day', { active: daySelected == index }]">
							<div class="day-number">{{ day.shortDate.substring(8, 10) }}</div>
							<div :class="{ weekend: day.isWeekend }">{{ day.weekDay.substring(0, 3) }}</div>
						</div>
					</n-button>
				</div>
			</n-scrollbar>
		</div>

		<div class="d-flex jc-between ai-center">
			<h3 class="ml-20" style="color: #444">{{ days[daySelected]?.description }}</h3>
			<n-button type="info" round class="m-20" @click="showModal.newTask = true">
				<template #icon>
					<n-icon><AddSharp /></n-icon>
				</template>
				Tarefa
			</n-button>
		</div>
		<div class="pt-10 mb-100 mh-30">
			<n-timeline>
				<n-timeline-item v-for="task in currentTasks" type="success" :key="task._id">
					<n-card hoverable embedded class="custom-card" :title="task.name" @click="showModalViewTask(task)">
						<template #header-extra>
							<div class="card-header-date">
								<n-time v-if="task?.startDate" :time="new Date(task?.startDate)" format="HH:mm" />
							</div>
						</template>
						<div class="d-flex jc-between">
							<div class="card-content-text">
								<n-performant-ellipsis :line-clamp="1" :tooltip="{ disabled: true }">
									{{ task.description }}
								</n-performant-ellipsis>
							</div>
							<div class="d-flex ai-center mh-4">
								<n-icon size="30" color="#555"><PlayCircleOutline /></n-icon>
							</div>
						</div>
					</n-card>
				</n-timeline-item>
			</n-timeline>
			<n-empty class="mt-40" description="Não foi encontrado nenhuma tarefa" v-if="!currentTasks?.length" />
		</div>

		<n-drawer
			v-model:show="showModal.newTask"
			class="drawer-task"
			placement="bottom"
			default-height="84%"
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
			default-height="84%"
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
	box-shadow:
		0 1px 2px -2px rgba(0, 0, 0, 0.08),
		0 3px 6px 0 rgba(0, 0, 0, 0.06);

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

.btn-day {
	font-size: 11px;
	.day-number {
		font-size: 16px;
		font-weight: bold;
	}

	&:not(.active) {
		.weekend {
			color: #813131;
		}
	}
}

:deep(.n-card-header) {
	padding-bottom: 4px;
	// padding-top: 4px;
}
.card-header-date {
	font-weight: 500;
	// font-size: 11px;
	color: #000;
}

.card-content-text {
	margin-top: 4px;
}

.timeline-header {
	position: fixed;
	z-index: 2;
	background: white;
	width: 100%;
}
</style>
