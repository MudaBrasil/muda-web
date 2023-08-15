<script setup>
import { ref, watch } from 'vue'
import { UserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NInput, NCard, NSpace, NIcon, NTag } from 'naive-ui'

const userStore = UserStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref(null)

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

const LogIn = () => {
  error.value = null

  userStore
    .logIn({
      email: email.value,
      password: password.value
    })
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
    <n-card title="Acessar o Muda">
      <n-tag v-if="error" closable class="mb-10" type="error" @close="error = null">
        {{ error }}
      </n-tag>
      <n-space vertical>
        <n-input
          id="email"
          type="text"
          class="form-control"
          name="email"
          placeholder="E-mail"
          required
          autofocus
          v-model="email"
        />

        <n-input
          id="password"
          type="password"
          class="form-control"
          name="password"
          placeholder="Senha"
          required
          v-model="password"
        />
      </n-space>
      <template #footer>
        <div>
          Novo por aqui?
          <router-link to="/register">Registre-se</router-link>
        </div>

        <div>
          Esqueceu a senha?
          <router-link to="/reset-password">Recuperar</router-link>
        </div>
      </template>
      <template #action>
        <n-space>
          <n-button type="primary" @click="LogIn">Entrar</n-button>
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
  <!--  <div class="container d-flex ai-center hv-100 px-50">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Acessar o Muda</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <br />
            <form action="#" @submit.prevent="LogIn">
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

              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

                <div class="col-md-6">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="password"
                  />
                </div>
              </div>
              <br />
              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Entrar</button>
                </div>
              </div>
            </form>
            <div>
              <div class="col-md-8 offset-md-4">
                <button @click="GoogleLogin">Entrar com Google</button>
              </div>
            </div>
            <br />
            <br />
            <br />
            <div class="card-header">
              Novo por aqui?
              <router-link to="/register">Registre-se</router-link>
            </div>

            <div class="card-header">
              Esqueceu a senha?
              <router-link to="/reset-password">Recuperar</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<style scoped lang="scss">
.alert-danger {
  color: #721c24;
}
</style>
