<script setup>
import { ref } from 'vue'
import { UserStore } from '@/stores/user'
// import { useRouter, useRoute } from 'vue-router'

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
</script>

<template>
  <div class="container d-flex ai-center hv-100 px-50">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Recuperação de senha</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <br />
            <form action="#" @submit.prevent="ResetPassword">
              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>
                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="email"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Enviar email</button>
                </div>
              </div>
              <br />
              <br />
              <br />
              <div class="card-header">
                Ja possui uma conta?
                <router-link to="/login">Entrar</router-link>
              </div>

              <div class="card-header">
                Novo por aqui?
                <router-link to="/register">Registre-se</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.alert-danger {
  color: #721c24;
}
</style>
