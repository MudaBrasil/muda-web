<script setup>
import imgTreeBackground from '@/assets/tree_background.png'
import { UserStore } from '@/stores/user'
import { auth } from '@/firebaseConfig'
import { useRouter, RouterLink } from 'vue-router'

const userStore = UserStore()
const router = useRouter()

auth.onAuthStateChanged((user) => {
  userStore.fetch(user)
})

const signOut = async () => {
  await userStore.logOut()
  router.push('/')
}
</script>

<template>
  <main>
    <div class="bg-image" :style="{ backgroundImage: `url(${imgTreeBackground})` }"></div>

    <div class="context">
      <div class="context-field">
        <h1 style="font-size: 40px">MUDA</h1>
        <a href="">Continue a nadar(mudar)!</a>
        <br />
        <img src="@/assets/logo.png" alt="Logo do Muda" />
        <br />
        <br />
        <h3>
          ID: <strong>{{ userStore.id }}</strong>
        </h3>
        <h3>
          isLogged: <strong>{{ userStore.isLogged }}</strong>
        </h3>
        <h3>
          firstName: <strong>{{ userStore.firstName }}</strong>
        </h3>
        <h3>
          middleName: <strong>{{ userStore.middleName }}</strong>
        </h3>
        <h3>
          lastName: <strong>{{ userStore.lastName }}</strong>
        </h3>
        <h3>
          fullName: <strong>{{ userStore.fullName }}</strong>
        </h3>
      </div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div v-if="userStore.loggedIn">
              <div class="card-header">Welcome, {{ userStore.data.displayName }}</div>
              <div class="card-body">
                <div class="alert alert-success" role="alert">
                  You are logged in!
                  <div class="my-4">
                    <button @click.prevent="signOut" class="btn btn-primary">Log Out</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-danger" role="alert">
              You are not logged in!
              <router-link to="/login">Go to login</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.context {
  padding-bottom: 140px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(0deg, rgba(241, 246, 247, 1) 77%, rgba(144, 182, 47, 1) 100%);

  .context-field {
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
      max-width: 100px;
    }
  }
}

.bg-image {
  width: 100%;
  min-height: 234px;
}

h3 {
  color: brown;
}
</style>
