<script setup lang="ts">
import { NIcon, NInput, NSelect, NTag, NSpace } from 'naive-ui'
import { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { PencilSharp } from '@vicons/ionicons5'
import { PropType } from 'vue'

type InputOptions = 'text' | 'textarea' | 'password'
type AutosizeOptions = boolean | { minRows?: number; maxRows?: number } // Updated type

defineProps({
	type: {
		type: String,
		default: 'input'
	},
	rows: {
		type: Number,
		default: 1
	},
	autosize: {
		type: null as PropType<AutosizeOptions>,
		default: false as AutosizeOptions
	},
	inputType: {
		type: String as PropType<InputOptions>,
		default: 'text'
	},
	originalValues: {
		type: Array<string>,
		default: () => []
	},
	selectOptions: {
		type: Array as PropType<SelectMixedOption[]>,
		default: () => []
	},
	title: String,
	placeholder: String,
	originalValue: String
})

const editingValues = defineModel('editingValues', { type: Array<string> })
const editingValue = defineModel('editingValue', { type: String })
const isEditing = defineModel('isEditing', { type: Boolean })
</script>

<template>
	<div class="d-flex jc-between mb-10">
		<div class="w-100 mr-20">
			<small>{{ title }}</small>
			<div v-if="type === 'input'">
				<n-input
					v-if="isEditing"
					v-model:value="editingValue"
					:type="inputType"
					:autosize="autosize"
					:placeholder="placeholder"
				/>

				<div v-else :class="['ml-10 pl-2', { empty: !originalValue }]">
					{{ originalValue || placeholder }}
				</div>
			</div>
			<n-space vertical v-else-if="type === 'select'">
				<n-select
					v-if="isEditing"
					v-model:value="editingValues"
					:options="selectOptions"
					tag
					multiple
					filterable
					:show-arrow="false"
					placeholder="Adicione tags para relacionar a outras tarefas"
				/>

				<div v-else>
					<n-tag v-for="(tag, index) in originalValues" :key="index" style="margin-right: 8px">{{ tag }}</n-tag>
				</div>
			</n-space>
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
