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
const title = ref('')
const description = ref('')

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
	axios.post('/tasks', {
		name: title.value,
		description: description.value,
		startDate: new Date()
	})
}

const deleteTask = taskId => {
	axios.delete(`/tasks/${taskId}`)
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
					<n-card class="card" :title="task.name" @click="showModalViewTask(task)">
						<template #header-extra>
							<div class="card-header-title">
								{{ formatDate(task.startDate) }}
								<!-- <n-time :value="task.startDate" type="datetime" format="hh:mm" /> -->
							</div>
						</template>
						<div class="card-content-text">{{ task.description }}</div>
					</n-card>
				</n-timeline-item>
			</n-timeline>
			<Loading v-else :show="true" componentClass="minimal-loading" />
		</n-space>

		<n-modal v-model:show="showModal.newTask" preset="card" style="margin: 0 10px" title="Criar nova tarefa">
			<n-input placeholder="Titulo" class="mb-4" v-model:value="title" />
			<n-input
				v-model:value="description"
				placeholder="Descrição"
				type="textarea"
				:autosize="{
					minRows: 3,
					maxRows: 5
				}"
			/>
			<template #footer>
				<div class="d-flex jc-end">
					<n-button type="info" round @click="addTask"> Criar tarefa </n-button>
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
					<n-button type="error" round class="mr-10" @click="deleteTask(currentTask._id)"> Excluir </n-button>
					<n-button type="info" round @click=""> Iniciar </n-button>
				</div>
			</template>
		</n-modal>
	</div>
</template>

<style scoped lang="scss">
.card {
	min-width: 50vw;
	width: 100%;
	height: 100%;
	border-radius: 20px;
	background-color: #e7e9fa;
}

:deep(.n-card-header__main) {
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
