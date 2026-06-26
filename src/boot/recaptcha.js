import { boot } from 'quasar/wrappers'
import { VueReCaptcha } from 'vue-recaptcha-v3'

const appEnv = window.env

export default boot(({ app, router }) => {
  const siteKey = appEnv.RECAPTCHA_SITE_KEY
  app.use(VueReCaptcha, {
    siteKey: siteKey,
    loaderOptions: {
      useRecaptchaNet: true,
      autoHideBadge: true
    }
  })
})
