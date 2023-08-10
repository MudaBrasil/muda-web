<script setup>
import { ref } from 'vue'
import { UserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'

const userStore = UserStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref(null)

const Login = () => {
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
</script>

<template>
  <div class="container d-flex ai-center hv-100 px-50">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Login</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <br />
            <form action="#" @submit.prevent="Login">
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
                  <button type="submit" class="btn btn-primary">Login</button>
                </div>
              </div>
              <br />
              <br />
              <br />
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
