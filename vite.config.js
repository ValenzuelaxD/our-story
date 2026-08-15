import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 82 },
      jpeg: { quality: 82 },
      png: { quality: 85, compressionLevel: 8 },
      webp: { lossless: false, quality: 82 },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'imgs/og-share.jpg',
      ],
      manifest: {
        name: 'Davi & Maysa - Nuestra Historia',
        short_name: 'Nuestra Historia',
        description:
          'Nuestra historia: momentos, promesas, versículo y todo lo que construye nuestro amor.',
        theme_color: '#5c2d42',
        background_color: '#5c2d42',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'es',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MB (el valor por defecto es 2 MB)
        runtimeCaching: [
          {
            // CacheFirst: las fotos rara vez cambian → se sirven desde la caché sin consultar la red
            urlPattern: ({ url }) => url.pathname.startsWith('/imgs/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'our-story-media',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
        },
      },
    },
  },
})
