// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@prisma/nuxt',
    '@pinia/nuxt'
  ],
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  },
   colorMode: {
    preference: 'light', 
    fallback: 'light', 
    classSuffix: ''
  },
  app:{
    pageTransition: {name:'page', mode: 'out-in'},
    layoutTransition: { name: 'layout', mode: 'out-in' }
  }
})