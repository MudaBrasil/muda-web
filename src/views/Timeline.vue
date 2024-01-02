<script setup lang="ts">
import { axiosInject } from '@/services/axios';
import { NSpace, NTimeline, NTimelineItem, NCard, NButton, NIcon } from 'naive-ui';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { AddSharp } from '@vicons/ionicons5';

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

onMounted(async () => {
    tasks.value = await getTasks()
    console.log(tasks.value);
})

</script>

<template>
    <n-space justify="end">
        <n-button type="info" round class="m-20" @click="addTask">
            <template #icon>
                <n-icon><AddSharp /></n-icon> 
            </template>
            Criar Task
        </n-button>
    </n-space>
    <n-space class="m-10" justify="center">
        <n-timeline>
            <n-timeline-item v-for="task in tasks" type="success" :key="task._id">
                <n-card class="card" :title="task.name">
                    <template #header-extra>
                        <div class="card-header-title">{{ (new Date(task.startDate)).toLocaleTimeString([], {
                            hour:
                                '2-digit', minute: '2-digit', hourCycle: 'h24'
                        }) }} hs</div>
                    </template>
                    <div class="card-content-text">{{ task.description }}</div>
                </n-card>
            </n-timeline-item>
        </n-timeline>
    </n-space>
</template>

<style scoped lang="scss">
.card {
    min-width: 50vw;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background-color: #e7e9fa;
}

.card-header-title {
    margin-left: 10px;
    font-weight: 500;
    color: #000;
}</style>
