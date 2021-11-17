import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const locales = process.env.LOCALES.split(',').map(locale => locale.trim())

const i18n = createI18n({
  locale: locales[0],
  fallbackLocale: 'en',
  messages
})
const t = i18n.global.t

export default boot(({ app }) => {
  // Set instance on app
  app.use(i18n)
})

export { i18n, t, locales }
