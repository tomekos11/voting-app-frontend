// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  imports: {
    dirs: ['composables/**']
  },
  
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/icon', 'nuxt-security', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  eslint: {
    // checker: true,
  },

  security: {
    // rateLimiter: false,
    nonce: true,
    headers: {
      contentSecurityPolicy: {
        'default-src': ['\'self\''],
        'connect-src': ['\'self\'', import.meta.env.NUXT_PUBLIC_API_URL, import.meta.env.NUXT_PUBLIC_API_URL_HTTPS],
        'script-src': ['\'self\'', '\'nonce-{{nonce}}\'', '\'strict-dynamic\''],
        'style-src': ['\'self\'', '\'nonce-{{nonce}}\''],
        'img-src': ['\'self\'', 'data:', 'blob:', import.meta.env.NUXT_PUBLIC_API_URL, import.meta.env.NUXT_PUBLIC_API_URL_HTTPS],
        'font-src': ['\'self\''],
        'object-src': ['\'none\''],
        'frame-ancestors' : ['\'none\''],
        'upgrade-insecure-requests': true,
      },
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      },
    }
  },

  runtimeConfig: {
    public: {
      API_URL: import.meta.env.NUXT_PUBLIC_API_URL,
      API_URL_HTTPS: import.meta.env.NUXT_PUBLIC_API_URL_HTTPS,
    }
  }
});
