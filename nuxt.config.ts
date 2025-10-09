import pkg from './package.json';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  fonts: {
    families: [
      {
        name: 'Inter',
        weights: [800],
        styles: ['normal', 'italic']
      },
      {
        name: 'Work Sans',
        weights: [700],
        styles: ['normal']
      },
      {
        name: 'Montserrat',
        weights: [700],
        styles: ['normal']
      },
      {
        name: 'Kaisei Decol',
        weights: [700],
        styles: ['normal']
      }
    ],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja', prefix: 'og: https://ogp.me/ns#'
      },
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'GooglingGo! Japan' },
        { property: 'og:title', content: '検索を開始。' },
        { property: 'og:image', content: '/ogp.png' },
      ]
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
      type: 'module',
    },
    manifest: {
      name: 'GooglingGo! Japan',
      short_name: 'G! Japan',
      description: '次世代検索ツール「GooglingGo! Japan」を使って、より効率的に情報を検索しましょう。',
      lang: 'ja',
      theme_color: '#FFFFFF',
      display: 'standalone',
      "icons": [
        {
          "src": "pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ]
    },
  },
  runtimeConfig: {
    public: {
      appVersion: pkg.version
    }
  },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css']
})
