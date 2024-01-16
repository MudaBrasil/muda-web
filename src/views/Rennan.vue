<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult, NButton, NFlex } from 'naive-ui'

const router = useRouter()
</script>

<template>
	<n-flex justify="center" align="center" class="h-100">
		<n-result status="404" title="Em construção" description="Estamos finalizando o currículo online do Rennan!">
			<template #footer>
				<div>
					<a href="/cv-rennan.pdf" download>Baixar currículo em PDF </a>
				</div>
				<br />
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
