import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

// https://vitejs.dev/config/
export default ({ mode }) => {
  // eslint-disable-next-line no-undef
  const p = { env: { ...process.env, ...loadEnv(mode, process.cwd()) } }

  return defineConfig({
    plugins: [
      vue(),
      VitePWA({
        workbox: {
          cleanupOutdatedCaches: false
        },
        injectRegister: 'auto',
        devOptions: {
          enabled: true
        },
        manifest: {
          theme_color: '#114c7c',
          background_color: '#114c7c', //  114C7C 1B5477
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone'],
          scope: '/',
          lang: 'pt',
          id: '/',
          launch_handler: {
            client_mode: 'auto'
          },
          start_url: '/',
          name: 'Muda',
          short_name: 'Muda',
          orientation: 'portrait-primary',
          description: 'Seu melhor jeito para aprender feliz!',
          shortcuts: [
            {
              name: 'Login',
              url: '/login'
            },
            {
              name: 'Home',
              url: '/'
            }
          ],
          icons: [
            {
              src: '/logo-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/logo-256x256.png',
              sizes: '256x256',
              type: 'image/png'
            },
            {
              src: '/logo-384x384.png',
              sizes: '384x384',
              type: 'image/png'
            },
            {
              src: '/logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/logo-bg.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          dir: 'auto',
          categories: [
            'education',
            'fitness',
            'food',
            'games',
            'health',
            'music',
            'productivity',
            'social',
            'utilities'
          ],
          screenshots: [
            {
              src: '/screen-1.png',
              sizes: '485x711',
              type: 'image/png',
              platform: 'wide'
            },

            {
              src: '/screen-2.png',
              sizes: '476x678',
              type: 'image/png',
              platform: 'wide'
            },
            {
              src: '/screen-3.png',
              sizes: '468x703',
              type: 'image/png',
              platform: 'wide'
            }
          ],
          related_applications: [
            {
              platform: 'play',
              url: 'https://play.google.com/store/apps/details?id=com.duolingo&hl=pt_BR&gl=US',
              id: 'com.duolingo'
            }
          ]
        }
      }),
      sentryVitePlugin({
        org: p.env.VITE_SENTRY_ORG,
        project: p.env.VITE_SENTRY_PROJECT,
        authToken: p.env.VITE_SENTRY_AUTH_TOKEN
      }),
      chunkSplitPlugin()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true,
      port: 8080
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    }
  })
}
