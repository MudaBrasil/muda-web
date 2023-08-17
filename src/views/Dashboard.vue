<script setup>
import imgTreeBackground from '@/assets/tree_background.png'
import { UserStore } from '@/stores/user'
import { useRouter, RouterLink } from 'vue-router'
import { NAvatar } from 'naive-ui'

const userStore = UserStore()
const router = useRouter()
const signOut = async () => {
  await userStore.logOut()
  router.push('/login')
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
        <n-avatar round :size="100" :src="userStore.user.photoURL"></n-avatar>
        <br />
        <br />
        <div>
          UID: <strong>{{ userStore.user.uid }}</strong>
        </div>
        <div>
          isLogged: <strong>{{ userStore.user.isLogged }}</strong>
        </div>
        <div>
          displayName: <strong>{{ userStore.user.displayName }}</strong>
        </div>
        <div>
          email: <strong>{{ userStore.user.email }}</strong>
        </div>
        <br />

        <br />
        <br />
        <div>
          <div class="" v-if="userStore.user.isLogged">
            <div class="card-header">Welcome, {{ userStore.user.displayName }}</div>

            <br />

            <div class="card-header">
              <router-link to="/">Ir para home</router-link>
            </div>

            <br />

            <div class="d-flex jc-center">
              <button @click.prevent="signOut" class="btn btn-primary">Log Out</button>
            </div>
          </div>

          <div v-else class="alert alert-danger" role="alert">
            You are not logged in!
            <router-link to="/login">Go to login</router-link>
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
