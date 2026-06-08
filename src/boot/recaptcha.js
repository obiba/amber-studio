import { boot } from 'quasar/wrappers'
import { VueReCaptcha } from 'vue-recaptcha-v3'

export default boot(({ app, router }) => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || import.meta.env.RECAPTCHA_SITE_KEY
  app.use(VueReCaptcha, {
    siteKey: siteKey,
    loaderOptions: {
      useRecaptchaNet: true,
      autoHideBadge: true
    }
  })
})
