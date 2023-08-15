<script setup>
import { ref, watch } from 'vue'
import { UserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NInput, NCard, NSpace, NIcon } from 'naive-ui'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)

const userStore = UserStore()
const router = useRouter()
const route = useRoute()

const Register = () => {
  error.value = null

  userStore
    .register({
      email: email.value,
      password: password.value,
      name: name.value
    })
    .then(() => {
      // TODO: Criar redirect automático la no router
      router.push(route.query.redirect || '/dashboard')
    })
    .catch((err) => {
      error.value = err.message
    })
}

const GoogleLogin = () => {
  error.value = null

  userStore
    .googleLogin()
    .then(() => {
      router.push(route.query.redirect || '/dashboard')
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
    class="hv-100"
    style="background-color: rgb(233, 241, 233)"
  >
    <n-card title="Cadastro" hoverable>
      <n-tag v-if="error" closable class="mb-10" type="error" @close="error = null">
        {{ error }}
      </n-tag>
      <n-input
        id="name"
        type="text"
        class="form-control"
        placeholder="Nome"
        name="name"
        required
        autofocus
        v-model="name"
      />
      <n-input
        id="email"
        type="text"
        class="form-control"
        placeholder="E-mail"
        name="email"
        value
        required
        autofocus
        v-model="email"
      />
      <n-input
        id="password"
        type="password"
        placeholder="Senha"
        class="form-control"
        name="password"
        required
        v-model="password"
      />
      <template #footer>
        <n-space class="ml-5">
          <div>
            Ja possui uma conta?
            <router-link to="/login">Entrar</router-link>
          </div>
          <div>
            Esqueceu a senha?
            <router-link to="/reset-password">Recuperar</router-link>
          </div>
        </n-space>
      </template>
      <template #action>
        <n-space>
          <n-button type="primary" @click="Register"> Cadastrar </n-button>
          <n-button type="info" @click="GoogleLogin">
            <template #icon>
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 488 512"
                >
                  <path
                    d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    fill="currentColor"
                  ></path>
                </svg>
              </n-icon>
            </template>
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-space>
  <!--   <div class="container d-flex jc-center ai-center hv-100">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Cadastro</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <br />
            <form action="#" @submit.prevent="">
              <div class="form-group row">
                <div class="col-md-6 mb-10">
                  <n-input
                    id="name"
                    type="text"
                    class="form-control"
                    placeholder="Nome"
                    name="name"
                    value
                    required
                    autofocus
                    v-model="name"
                  />
                </div>
              </div>

              <div class="form-group row">
                <div class="col-md-6 mb-10">
                  <n-input
                    id="email"
                    type="text"
                    class="form-control"
                    placeholder="E-mail"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="email"
                  />
                </div>
              </div>
              <div class="form-group row">
                <div class="col-md-6 mb-10">
                  <n-input
                    id="password"
                    type="password"
                    placeholder="Senha"
                    class="form-control"
                    name="password"
                    required
                    v-model="password"
                  />
                </div>
              </div>
              <br />

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4 mb-10">
                  <n-button type="primary" class="btn btn-primary" @click="Register"
                    >Cadastrar</n-button
                  >
                </div>
                <div class="col-md-8 offset-md-4">
                  <n-button type="primary" class="btn btn-primary" @click="GoogleLogin">
                    Cadastrar com Google
                  </n-button>
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
                Esqueceu a senha?
                <router-link to="/reset-password">Recuperar</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<style scoped lang="scss">
.n-card {
  max-width: 300px;
}
.alert-danger {
  color: #721c24;
}
</style>
