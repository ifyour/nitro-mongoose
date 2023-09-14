import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  srcDir: 'src',
  noPublicDir: true,
  errorHandler: '~/errorHandler',

  routeRules: {
    '/api/**': { cors: true },
  },

  imports: {
    dirs: ['./src/composables/**', './src/models/**'],
    presets: [{ from: 'zod', imports: ['z'] }],
  },

  plugins: ['~/plugins/mongoose.ts'],

  runtimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI,
    session: {
      name: 'nitro-session',
      // Session expires in 7 days
      maxAge: 604800,
      password: process.env.SESSION_PASSWORD,
    },
  },
})
