import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuFlexStore = defineStore('menuFlex', () => {
  const active = ref(false)

  return { active }
})
