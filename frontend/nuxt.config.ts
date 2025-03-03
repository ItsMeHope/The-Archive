// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001'
    }
  },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/global.css'],
})
