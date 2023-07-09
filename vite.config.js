import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';

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
        theme_color: "#417505",
        background_color: "#b8e986",
        display: "standalone",
        scope: "/",
        start_url: "/",
        name: "Muda",
        short_name: "Muda",
        description: "Muda is your best growth app",
        icons: [
            {
                src: "/logo-192x192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/logo-256x256.png",
                sizes: "256x256",
                type: "image/png"
            },
            {
                src: "/logo-384x384.png",
                sizes: "384x384",
                type: "image/png"
            },
            {
                src: "/logo.png",
                sizes: "512x512",
                type: "image/png"
            }
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
