<script setup lang="ts">
import { axiosInject } from '@/services/axios'
import { NSpace, NTimeline, NTimelineItem, NCard, NButton, NIcon } from 'naive-ui'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { AddSharp } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
// import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const router = useRouter()
const axios = axiosInject()

const tasks = ref([])

const addTask = () => {
	axios.post('/tasks', {
		name: 'Teste de nome cumpridoooo',
		description: 'Teste de descrição cumpridoooo',
		startDate: new Date()
	})
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
const goBack = () => (window.history.length > 1 ? router.go(-1) : router.push('/'))

const onSwiper = swiper => {
	console.log(swiper)
}
const onSlideChange = () => {
	console.log('slide change')
}

onMounted(async () => {
	tasks.value = await getTasks()
})
</script>

<template>
	<div>
		<n-space justify="space-between">
			<n-button round class="m-20" @click="goBack()">Voltar</n-button>
			<n-button type="info" round class="m-20" @click="addTask">
				<template #icon>
					<n-icon><AddSharp /></n-icon>
				</template>
				Criar Task
			</n-button>
		</n-space>
		<swiper :slides-per-view="3" :space-between="50" @swiper="onSwiper" @slideChange="onSlideChange">
			<swiper-slide>Slide 1</swiper-slide>
			<swiper-slide>Slide 2</swiper-slide>
			<swiper-slide>Slide 3</swiper-slide>
			...
		</swiper>
		<n-space class="p-30 mb-100" justify="center">
			<n-timeline>
				<n-timeline-item v-for="task in tasks" type="success" :key="task._id">
					<n-card class="card" :title="task.name">
						<template #header-extra>
							<div class="card-header-title">{{ formatDate(task.startDate) }}</div>
						</template>
						<div class="card-content-text">{{ task.description }}</div>
					</n-card>
				</n-timeline-item>
			</n-timeline>
		</n-space>
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
</style>
