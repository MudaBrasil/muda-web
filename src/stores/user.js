import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'

export const UserStore = defineStore('user', () => {
  const uid = ref("")
  const data = ref({})
  const email = ref("")
  const isLogged = ref(false)
  const displayName = ref("")

  // TODO: Fazer internacionalização dos textos testando o i18n ou do jeito que eu fiz antes
  // TODO: Talvez criar um store para os erros

  const errors = ref([
    { id: 0, code: 'unknown', message: "Erro desconhecido" },
    { id: 1, code: 'auth/wrong-password', message: "Usuário ou senha inválidos" },
    { id: 2, code: 'auth/invalid-email', message: "Usuário ou senha inválidos" },
    { id: 3, code: 'auth/user-not-found', message: "Usuário ou senha inválidos" },
    { id: 4, code: 'auth/email-already-in-use', message: "Email de usuário já cadastrado" },
    { id: 5, code: 'auth/weak-password', message: "A combinação da senha pode estar frágil" },
    { id: 6, code: 'auth/operation-not-allowed', message: "Operação não permitida" },
    { id: 7, code: 'auth/account-exists-with-different-credential', message: "Conta já existe com credenciais diferentes" },
    { id: 8, code: 'auth/invalid-credential', message: "Credenciais inválidas" },
    { id: 9, code: 'auth/operation-not-allowed', message: "Operação não permitida" },
    { id: 10, code: 'auth/invalid-argument', message: "Argumento inválido" }
  ])

  auth && auth.onAuthStateChanged(fetch)

  function reset() {
    uid.value = ""
    data.value = {}
    email.value = ""
    isLogged.value = false
    displayName.value = ""
  }

  function fetch(user) {
    if (user) {
      uid.value = user.uid
      data.value = user
      email.value = user.email
      isLogged.value = true
      displayName.value = user.displayName
    } else {
      reset()
    }
  }

  function getError(error) {
    const code = error.code || errors.value[0].code
    const message = error.message || errors.value[0].message

    return errors.value.find(e => e.code === code) || { id: 0, code, message }
  }

  function register(user) {
    return createUserWithEmailAndPassword(auth, user.email, user.password).then(() => {
      updateProfile(auth.currentUser, { displayName: user.name }).then(() => {
        fetch(auth.currentUser)
      })
    }).catch(error => {
      reset()
      throw new Error(getError(error).message)
    })
  }

  function logIn(user) {
    return signInWithEmailAndPassword(auth, user.email, user.password).catch(error => {
      reset()
      throw new Error(getError(error).message)
    })
  }

  function logOut() {
    return signOut(auth).finally(() => {
      reset()
    })
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
}, { persist: true })
