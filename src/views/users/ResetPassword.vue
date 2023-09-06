<script setup>
import { ref, watch } from 'vue'
import { UserStore } from '@/stores/user'
import { NButton, NInput, NCard, NSpace, NTag } from 'naive-ui'

const email = ref('')
const error = ref(null)

const userStore = UserStore()
// const router = useRouter()
// const route = useRoute()

const ResetPassword = () => {
  error.value = null
  userStore
    .resetPassword(email.value)
    .then(() => {
      // TODO: Criar redirect automático la no router
      // router.push(route.query.redirect || '/dashboard')
      alert('Solicitação de recuperação de senha enviada com sucesso')
    })
    .catch((err) => {
      error.value = err.message
    })
}
watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      error.value = null
    }, 5000)
  }
})
</script>

<template>
  <n-space
    justify="center"
    align="center"
    class="h-100vh"
    vertical
    style="background-color: #114c7c"
  >
    <img src="@/assets/logo.png" alt="Logo do Muda" height="150" />
    <n-space justify="center" align="center">
      <n-card title="Recuperação de senha" style="width: 300px">
        <n-tag v-if="error" closable class="mb-10" type="error" @close="error = null">
          {{ error }}
        </n-tag>
        <n-space>
          <div>Informe o email de cadastro</div>
          <n-input
            id="email"
            type="text"
            class="form-control"
            name="email"
            placeholder="E-mail"
            required
            autofocus
            v-model:value="email"
          />
        </n-space>
        <br />
        <template #footer>
          <div>
            Ja possui uma conta?
            <router-link to="/login">Entrar</router-link>
          </div>
          <div>
            Novo por aqui?
            <router-link to="/register">Registre-se</router-link>
          </div>
        </template>

        <template #action>
          <n-space>
            <n-button type="primary" @click="ResetPassword">Enviar</n-button>
          </n-space>
        </template>
      </n-card>
    </n-space>
  </n-space>
</template>

<style scoped lang="scss">
.alert-danger {
  color: #721c24;
}
</style>
