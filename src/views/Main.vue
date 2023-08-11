<script setup>
import { RouterView } from 'vue-router'
import MenuBar from '@/components/MenuBar.vue'

// TODO: Criar mecanismo para validar toda vez que acessar a pagina o usuário esta logado
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
