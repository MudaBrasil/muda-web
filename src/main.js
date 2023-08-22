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
import * as Sentry from '@sentry/vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'vfonts/Inter.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
Sentry.init({
  app,
  dsn: 'https://e56e2192fb1ed5c1156526bf674cc6f4@o4505745942708224.ingest.sentry.io/4505745945460736',
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', 'https://muda.education/'],
      routingInstrumentation: Sentry.vueRouterInstrumentation(router)
    }),
    new Sentry.Replay()
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})
app.mount('#app')
