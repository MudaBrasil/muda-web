<script setup lang="ts">
import { NIcon, NInput } from 'naive-ui'
import { PencilSharp } from '@vicons/ionicons5'

defineProps({
	title: String,
	placeholder: String,
	originalValue: String
})

const editingValue = defineModel('editingValue', { type: String })
const isEditing = defineModel('isEditing', { type: Boolean })
</script>

<template>
	<div class="d-flex jc-between mb-10">
		<div>
			<small>{{ title }}</small>
			<n-input v-if="isEditing" v-model:value="editingValue" type="text" :placeholder="placeholder" />
			<div v-else :class="['ml-10 pl-2', { empty: !originalValue }]">
				{{ originalValue || placeholder }}
			</div>
		</div>
		<n-icon
			class="mt-10 pt-4"
			size="20"
			@click="isEditing = !isEditing"
			:color="isEditing ? '#1a9561' : '#555'"
			style="cursor: pointer"
		>
			<PencilSharp />
		</n-icon>
	</div>
</template>

<style scoped>
.empty {
	color: #bbb;
}
</style>
