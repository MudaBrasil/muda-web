// Create a Vue component for the 404 page not found
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult, NButton, NSpace } from 'naive-ui'

const router = useRouter()
</script>

<template>
	<n-space justify="center" align="center" class="h-100vh" vertical>
		<n-result status="404" title="Em construção"
			description="Estamos finalizando o currículo online do Rennan!" class="h-100">
			<template #footer>
				<div>
					<a href="/cv-rennan.pdf" download>Baixar currículo em PDF </a>
				</div>
				<br />
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
