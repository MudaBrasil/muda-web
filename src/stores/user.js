import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'

export const UserStore = defineStore('user', () => {
  const uid = ref("")
  const email = ref("")
  const isLogged = ref(false)
  const displayName = ref("")
  // const firstName = ref("")
  // const middleName = ref("")
  // const lastName = ref("")
  // const fullName = computed(() => `${firstName.value} ${middleName.value} ${lastName.value}`)
  const data = ref({})

  auth && auth.onAuthStateChanged(fetch)

  function resetState() {
    isLogged.value = false
    uid.value = ""
    email.value = ""
    displayName.value = ""
    data.value = {}
  }

  function fetch(user) {
    if (user) {
      isLogged.value = true
      uid.value = user.uid
      email.value = user.email
      displayName.value = user.displayName
      data.value = user
    } else {
      resetState()
    }
  }

  async function register(user) {
    const response = await createUserWithEmailAndPassword(auth, user.email, user.password)

    if (response) {
      await updateProfile(response.user, { displayName: user.name })

      fetch(response.user)
    } else {
      resetState()
      console.log("ERROR: User not registered")
      throw new Error('Unable to register user')
    }
  }

  async function logIn(user) {
    const response = await signInWithEmailAndPassword(auth, user.email, user.password)

    if (response) {
      isLogged.value = true
      data.value = response.user
      uid.value = response.user.uid
      email.value = response.user.email
      displayName.value = response.user.displayName
      console.log("User logged: ", response.user)
    } else {
      console.log("ERROR: User not logged")
      resetState()
      throw new Error('Unable to log in')
    }
  }

  async function logOut() {
    await signOut(auth)
    resetState()
  }

  return {
    uid,
    data,
    email,
    isLogged,
    displayName,
    register,
    logIn,
    logOut,
    fetch
  }
})
