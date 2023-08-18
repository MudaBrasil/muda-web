/*|__________________________________________________________________________________________________________________________________________
| |   __    __   __    __   ______       ____         ______   ______     __    __    ______     ____    ________   __    _____    __   __   |
| |  |  \  /  | |  |  |  | |   _  \     /    \       |   ___| |   _  \   |  |  |  |  /  __  |   /    \  |__    __| |  |  /  _  \  |  \ |  |  |
| |  |   \/   | |  |  |  | |  | \  \   /  /\  \      |  |___  |  | \  \  |  |  |  | /  /  \_|  /  /\  \    |  |    |  | /  / \  \ |   \|  |  |
| |  |        | |  |  |  | |  |  |  | |  |__|  |     |   ___| |  |  |  | |  |  |  | | |    _  |  |__|  |   |  |    |  | |  | |  | |       |  |
| |  |  |\/|  | |  |__|  | |  |_/  /  |   __   |  _  |  |___  |  |_/  /  |  |__|  | \  \__/ | |   __   |   |  |    |  | \  \_/  / |  |\   |  |
| |  |__|  |__| |________| |______/   |__|  |__| |_| |______| |______/   |________|  \______| |__|  |__|   |__|    |__|  \_____/  |__| \__|  |
| |__________________________________________________________________________________________________________________________________________|
| |
| |
| |
| /
*/

import './assets/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'vfonts/Inter.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)

app.mount('#app')
