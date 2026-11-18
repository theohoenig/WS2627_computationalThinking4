import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  // The frontend talks to the backend via /api, so the backend address lives only here.
  routeRules: {
    '/api/**': { proxy: 'http://localhost:3001/**' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
})
