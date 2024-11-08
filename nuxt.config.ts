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
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
    ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
  },
   colorMode: {
    preference: 'light', 
    fallback: 'light', 
    classSuffix: ''
  },
  app:{
    pageTransition: {name:'page', mode: 'out-in'},
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/', '/listOfCats','/login'],
      cookieRedirect: false,
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: true,
      // httpOnly: true
    },
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PRIVATE_SUPABASE_KEY
  }
})