import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
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
        scope: '/',
        lang: 'pt',
        start_url: '/',
        name: 'Muda',
        short_name: 'Muda',
        description: 'Seu melhor jeito para aprender feliz!',
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
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 8080
  }
})
