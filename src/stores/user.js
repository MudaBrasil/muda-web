import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

export const UserStore = defineStore('user', () => {
  const isLogged = ref(false)
  const id = ref("")
  const email = ref("")
  const displayName = ref("")
  const firstName = ref("")
  const middleName = ref("")
  const lastName = ref("")
  const fullName = computed(() => `${firstName.value} ${middleName.value} ${lastName.value}`)
  const data = ref({})

  function resetState() {
    isLogged.value = false
    id.value = ""
    email.value = ""
    displayName.value = ""
    firstName.value = ""
    middleName.value = ""
    lastName.value = ""
    data.value = {}
  }

  async function register(user) {
    const response = await createUserWithEmailAndPassword(this.auth, user.email, user.password)

    if (response) {
      email.value = user.email
      data.value = response.user
      response.user.updateProfile({ displayName: user.name })
      console.log("User Registered: ", response.user)
    } else {
      console.log("ERROR: User not registered")
      throw new Error('Unable to register user')
    }
  }

  async function logIn(user) {
    const response = await signInWithEmailAndPassword(this.auth, user.email, user.password)

    if (response) {
      email.value = user.email
      data.value = response.user
      console.log("User logged: ", response.user)
    } else {
      console.log("ERROR: User not logged")
      throw new Error('Unable to log in')
    }
  }

  async function logOut() {
    await signOut(this.auth)
    console.log("User logout")
  }

  async function fetch(user) {
    // context.commit("SET_LOGGED_IN", user !== null);
    isLogged.value = true

    if (user) {
      email.value = user.email
      firstName.value = user.displayName
      displayName.value = user.displayName
      data.value = user
    } else {
      resetState()
    }
  }

  return { isLogged, firstName, middleName, lastName, fullName, register, logIn, logOut, fetch }
})
