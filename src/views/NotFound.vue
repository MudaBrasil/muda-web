<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult, NButton, NFlex } from 'naive-ui'
const router = useRouter()
</script>

<template>
	<n-flex justify="center" align="center" class="h-100">
		<n-result
			status="404"
			title="Página não encontrada"
			description="Algo deu errado, não sabemos onde esta essa página."
		>
			<template #footer>
				<n-button @click="router.push('/')">Voltar para o inicio</n-button>
			</template>
		</n-result>
	</n-flex>
</template>

<style lang="scss">
#app,
body,
html {
	min-height: 100%;
	height: 100%;
}
</style>
