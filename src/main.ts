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
// import { passiveSupport } from 'passive-events-support/src/utils'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { PiniaSharedState } from 'pinia-shared-state'
// import * as Sentry from '@sentry/vue' TODO: Enable Sentry (actually has a console error)
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'vfonts/Inter.css'
import { emitter } from './emitter'
import axios from './services/axios'
import VueRewards from 'vue-rewards'

declare module '@vue/runtime-core' {
	export interface ComponentCustomProperties {
		emitter: typeof emitter
	}
}

// TODO: This is only to disable warning(added non-passive event listener to a scroll-blocking). Remove when Naive-UI fixes n-tabs event wheel
// passiveSupport({ events: ['wheel'] })

const app = createApp(App)
const pinia = createPinia()

pinia.use(PiniaSharedState({ enable: false, initialize: false }))
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
app.use(axios)
app.use(VueRewards)

app.config.globalProperties.emitter = emitter
app.mount('#app')
