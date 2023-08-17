import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/firebaseConfig'
import { saveUser } from '../firestore/users'
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

export const UserStore = defineStore(
  'user',
  () => {
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

    function reset() {
      user.value = userModel()
    }

    auth?.onAuthStateChanged(fetch)

    // TODO: Fazer internacionalização dos textos testando o i18n ou do jeito que eu fiz antes
    // TODO: Talvez criar um store para os erros

    const errors = ref([
      { id: 0, code: 'unknown', message: 'Erro desconhecido' },
      { id: 1, code: 'auth/wrong-password', message: 'Usuário ou senha inválidos' },
      { id: 2, code: 'auth/invalid-email', message: 'Usuário ou senha inválidos' },
      { id: 3, code: 'auth/user-not-found', message: 'Usuário ou senha inválidos' },
      { id: 4, code: 'auth/email-already-in-use', message: 'Email de usuário já cadastrado' },
      { id: 5, code: 'auth/weak-password', message: 'A combinação da senha pode estar frágil' },
      { id: 6, code: 'auth/operation-not-allowed', message: 'Operação não permitida' },
      {
        id: 7,
        code: 'auth/account-exists-with-different-credential',
        message: 'Conta já existe com credenciais diferentes'
      },
      { id: 8, code: 'auth/invalid-credential', message: 'Credenciais inválidas' },
      { id: 9, code: 'auth/invalid-user-token', message: 'Token de usuário inválido' },
      { id: 10, code: 'auth/invalid-argument', message: 'Argumento inválido' },
      { id: 11, code: 'auth/popup-closed-by-user', message: 'Popup fechada pelo usuário' },
      { id: 12, code: 'auth/unauthorized-domain', message: 'Domínio não autorizado' },
      {
        id: 13,
        code: 'auth/operation-not-supported-in-this-environment',
        message: 'Operação não suportada neste ambiente'
      },
      { id: 14, code: 'auth/popup-blocked', message: 'Popup bloqueada' },
      { id: 15, code: 'auth/timeout', message: 'Tempo limite excedido' },
      { id: 16, code: 'auth/user-disabled', message: 'Usuário desabilitado' },
      { id: 17, code: 'auth/user-token-expired', message: 'Token de usuário expirado' },
      { id: 18, code: 'auth/web-storage-unsupported', message: 'Armazenamento web não suportado' },
      { id: 19, code: 'auth/invalid-verification-code', message: 'Código de verificação inválido' },
      { id: 20, code: 'auth/invalid-verification-id', message: 'ID de verificação inválido' },
      { id: 21, code: 'auth/captcha-check-failed', message: 'Falha na verificação do captcha' },
      { id: 22, code: 'auth/invalid-phone-number', message: 'Número de telefone inválido' },
      { id: 23, code: 'auth/missing-phone-number', message: 'Número de telefone ausente' },
      { id: 24, code: 'auth/quota-exceeded', message: 'Cota excedida' },
      { id: 25, code: 'auth/cancelled-popup-request', message: 'Solicitação de popup cancelada' },
      { id: 26, code: 'auth/missing-or-invalid-nonce', message: 'Nonce ausente ou inválido' },
      { id: 27, code: 'auth/time-limit-exceeded', message: 'Limite de tempo excedido' },
      { id: 28, code: 'auth/credential-already-in-use', message: 'Credencial já em uso' },
      { id: 29, code: 'auth/user-mismatch', message: 'Usuário incompatível' },
      { id: 30, code: 'auth/requires-recent-login', message: 'Requer login recente' },
      { id: 31, code: 'auth/invalid-oauth-provider', message: 'Provedor OAuth inválido' },
      { id: 32, code: 'auth/network-request-failed', message: 'Falha na solicitação de rede' },
      { id: 33, code: 'auth/provider-already-linked', message: 'Provedor já vinculado' },
      { id: 34, code: 'auth/no-such-provider', message: 'Nenhum provedor' }
    ])

    function getError(error) {
      const code = error.code || errors.value[0].code
      const message = error.message || errors.value[0].message

      return errors.value.find((e) => e.code === code) || { id: 0, code, message }
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
