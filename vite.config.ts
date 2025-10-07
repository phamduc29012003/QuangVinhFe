import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'My PWA React App',
        short_name: 'ReactPWA',
        description: 'My awesome React + TypeScript + Vite + PWA app',
        theme_color: '#ffffff',
        display: 'standalone',
        background_color: '#ffffff',
        start_url: '/',
        // icons: [
        //   {
        //     src: '/pwa-192x192.png',
        //     sizes: '192x192',
        //     type: 'image/png',
        //   },
        //   {
        //     src: '/pwa-512x512.png',
        //     sizes: '512x512',
        //     type: 'image/png',
        //   },
        //   {
        //     src: '/pwa-512x512.png',
        //     sizes: '512x512',
        //     type: 'image/png',
        //     purpose: 'any maskable',
        //   },
        // ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
