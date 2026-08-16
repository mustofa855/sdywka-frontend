// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // Modul yang digunakan
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Mencegah SEO / Indexing pada seluruh halaman admin (Server Level via HTTP Header)
  routeRules: {
    '/admin/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow' }
    }
  },

  // Konfigurasi Runtime Variable (Membaca dari .env)
  runtimeConfig: {
    // Key privat (hanya bisa diakses di sisi Server Nuxt)
    apiSecret: process.env.NUXT_API_SECRET || '',

    // Key publik (bisa diakses di Server maupun Client/Browser)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE 
    }
  },

  // Pengaturan Head & SEO Utama
  app: {
    head: {
      title: 'SD YWKA REL HOMY SCHOOL',
      titleTemplate: '%s | SD YWKA REL HOMY SCHOOL',
      htmlAttrs: {
        lang: 'id'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Website Resmi SD YWKA REL HOMY SCHOOL - Sekolah Ramah Anak & Berkarakter.' },
        { name: 'format-detection', content: 'telephone=no' },
        
        // Open Graph / Social Media Meta Tags
        { property: 'og:site_name', content: 'SD YWKA REL HOMY SCHOOL' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'SD YWKA REL HOMY SCHOOL' },
        { property: 'og:description', content: 'Website Resmi SD YWKA REL HOMY SCHOOL' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})