import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/firebaseConfig'
import { saveUser } from '../services/firestore/users'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import firebaseErrors from '@/assets/errors/firebase-error-messages.json'

export const UserStore = defineStore(
  'user',
  () => {
    auth?.onAuthStateChanged(fetch)

    const userModel = () => ({
      uid: '',
      email: '',
      isLogged: false,
      displayName: '',
      phoneNumber: '',
      photoURL: '',
      createdAt: '',
      lastLogin: ''
    })
    const user = ref(userModel())
    const reset = () => (user.value = userModel())

    // TODO: Fazer internacionalização dos textos testando o i18n ou do jeito que eu fiz antes
    // TODO: Talvez criar um store para os erros

    function getError(error) {
      const code = error.code || firebaseErrors[0].code
      const message = error.message || firebaseErrors[0].message

      return firebaseErrors.find((e) => e.code === code) || { id: 0, code, message }
    }

    function fetch(newUser) {
      if (newUser) {
        user.value = {
          uid: newUser.uid,
          email: newUser.email,
          isLogged: true,
          displayName: newUser.displayName,
          phoneNumber: newUser.phoneNumber,
          photoURL: newUser.photoURL,
          createdAt: new Date(parseInt(newUser.metadata.createdAt)),
          lastLogin: new Date(parseInt(newUser.metadata.lastLoginAt))
        }
        saveUser({ ...user.value, createdAt: Timestamp.fromMillis(user.value.createdAt) })
      } else {
        reset()
      }
    }

    function logIn(user) {
      return signInWithEmailAndPassword(auth, user.email, user.password).catch((error) => {
        reset()
        throw new Error(getError(error).message)
      })
    }

    function logOut() {
      reset()
      return signOut(auth)
    }

    function register(newUser) {
      return createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
        .then(() => {
          updateProfile(auth.currentUser, { displayName: newUser.name }).then(() => {
            fetch(auth.currentUser)
          })
        })
        .catch((error) => {
          reset()
          throw new Error(getError(error).message)
        })
    }

    function resetPassword(email) {
      return sendPasswordResetEmail(auth, email).catch((error) => {
        throw new Error(getError(error).message)
      })
    }

    function googleLogin() {
      const provider = new GoogleAuthProvider()
      return signInWithPopup(auth, provider)
        .then((response) => {
          fetch(response.user)
        })
        .catch((error) => {
          reset()
          throw new Error(getError(error).message)
        })
    }

    return {
      user,
      fetch,
      logIn,
      logOut,
      register,
      resetPassword,
      googleLogin
    }
  },
  { persist: true }
)
