<script setup>
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useMenuFlexStore } from '@/stores/menuFlex'
import MenuBar from '@/components/MenuBar.vue'

const menuFlexStore = useMenuFlexStore()

// TODO: Criar mecanismo para validar toda vez que acessar a pagina o usuário esta logado

watch(
	() => menuFlexStore.active,
	(menuFlexEnabled) => {
		document.querySelector('body').style.overflowY = menuFlexEnabled ? 'hidden' : 'auto'
	}
)
</script>

<template>
	<div>
		<!-- TODO: Componente MENU BAR -->
		<MenuBar />

		<RouterView v-slot="{ Component }">
			<Transition name="slide-fade">
				<component :is="Component" />
			</Transition>
		</RouterView>
	</div>
</template>
