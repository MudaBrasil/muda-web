// Create a Vue component for the 404 page not found
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult, NButton, NSpace } from 'naive-ui'
const router = useRouter()
</script>

<template>
	<n-space justify="center" align="center" class="h-100vh" vertical>
		<n-result status="404" title="Página não encontrada"
			description="Algo deu errado, não sabemos onde esta essa página." class="h-100">
			<template #footer>
				<n-button @click="router.push('/')">Voltar para o inicio</n-button>
			</template>
		</n-result>
	</n-space>
</template>

<style lang="scss">
#app,
body,
html {
	min-height: 100%;
	height: 100%;
}
</style>
