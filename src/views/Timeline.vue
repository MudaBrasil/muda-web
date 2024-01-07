<script setup lang="ts">
import { axiosInject } from '@/services/axios'
import { NSpace, NTimeline, NTimelineItem, NCard, NButton, NIcon, NModal, NInput, NTime } from 'naive-ui'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { AddSharp } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import Loading from '@/components/Loading.vue'

const router = useRouter()
const axios = axiosInject()

const tasks = ref([])
const showModal = ref({
	newTask: false,
	viewTask: false
})
const loading = ref({
	newTask: false,
	deleteTask: false
})

const newTaskInitial = () => ({
	name: '',
	description: '',
	startDate: new Date()
})
const newTask = ref(newTaskInitial())

const currentTask = ref({
	_id: '',
	name: '',
	description: '',
	startDate: new Date()
})

onMounted(async () => {
	tasks.value = await getTasks()
})

const addTask = () => {
	loading.value.newTask = true

	try {
		axios
			.post('/tasks', {
				name: newTask.value.name,
				description: newTask.value.description,
				startDate: new Date()
			})
			.finally(async () => {
				tasks.value = await getTasks()
				showModal.value.newTask = false
				loading.value.newTask = false
				newTask.value = newTaskInitial()
			})
	} catch (error) {
		loading.value.newTask = false
		console.log(error) // TODO: Emitir notificação caso de erro
	}
}

const deleteTask = taskId => {
	loading.value.deleteTask = true

	try {
		axios.delete(`/tasks/${taskId}`).finally(() => {
			showModal.value.viewTask = false
			tasks.value = tasks.value.filter(task => task._id !== taskId)
			loading.value.deleteTask = false
		})
	} catch (error) {
		loading.value.deleteTask = false
		console.log(error) // TODO: Emitir notificação caso de erro
	}
}

const getTasks = async () => {
	try {
		const response = await axios.get('/tasks')
		return response.data
	} catch (error) {
		console.log(error)
	}
}

const formatDate = date => {
	return new Date(date).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	})
}

const showModalViewTask = task => {
	currentTask.value = task
	currentTask.value.startDate = new Date(task.startDate)
	showModal.value.viewTask = true
}
const goBack = () => (window.history.length > 1 ? router.go(-1) : router.push('/'))
// dialog.warning()
</script>

<template>
	<div>
		<n-space class="timeline-header" justify="space-between">
			<n-button round class="m-20" @click="goBack()">Voltar</n-button>
			<n-button type="info" round class="m-20" @click="showModal.newTask = true">
				<template #icon>
					<n-icon><AddSharp /></n-icon>
				</template>
				Tarefa
			</n-button>
		</n-space>
		<div class="pt-50"></div>

		<n-space class="p-30 mb-100" justify="center">
			<n-timeline v-if="tasks.length">
				<n-timeline-item v-for="task in tasks" type="success" :key="task._id">
					<n-card hoverable embedded class="custom-card" :title="task.name" @click="showModalViewTask(task)">
						<template #header-extra>
							<div class="card-header-title">
								{{ formatDate(task.startDate) }} |
								<n-time :time="new Date(task.startDate)" time-zone="America/Sao_Paulo" format="HH:mm" />
							</div>
						</template>
						<div class="card-content-text">{{ task.description }}</div>
					</n-card>
				</n-timeline-item>
			</n-timeline>
			<Loading v-else :show="true" componentClass="minimal-loading" />
		</n-space>

		<n-modal
			v-model:show="showModal.newTask"
			preset="card"
			style="margin: 0px auto; max-width: 600px"
			title="Criar nova tarefa"
		>
			<n-input placeholder="Titulo" class="mb-4" v-model:value="newTask.name" />
			<n-input
				v-model:value="newTask.description"
				placeholder="Descrição"
				type="textarea"
				:autosize="{
					minRows: 3,
					maxRows: 5
				}"
			/>
			<template #footer>
				<div class="d-flex jc-end">
					<n-button type="info" round @click="addTask" :loading="loading.newTask"> Criar tarefa </n-button>
				</div>
			</template>
		</n-modal>

		<n-modal v-model:show="showModal.viewTask" preset="card" style="margin: 0 10px" :title="currentTask.name">
			<small>Descrição</small>
			<div>{{ currentTask.description }}</div>
			<br />
			<small>Tempo de execução</small>
			<!-- <n-statistic :value="currentTask.startDate" :precision="0" /> -->
			<div>
				<n-time v-model:value="currentTask.startDate" type="datetime" format="hh:mm" />
			</div>

			<template #footer>
				<div class="d-flex jc-end">
					<n-button type="error" round class="mr-10" :loading="loading.deleteTask" @click="deleteTask(currentTask._id)">
						Excluir
					</n-button>
					<n-button type="info" round @click=""> Iniciar </n-button>
				</div>
			</template>
		</n-modal>
	</div>
</template>

<style scoped lang="scss">
.custom-card {
	min-width: 50vw;
	width: 100%;
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

.n-button .n-button :deep(.n-card-header__main) {
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
