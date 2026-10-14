import { defineBoot } from '#q-app'
import { VueReCaptcha } from 'vue-recaptcha-v3'

const appEnv = window.env

export default defineBoot(({ app, router }) => {
  const siteKey = appEnv.RECAPTCHA_SITE_KEY
  app.use(VueReCaptcha, {
    siteKey: siteKey,
    loaderOptions: {
      useRecaptchaNet: true,
      autoHideBadge: true
    }
  })
})
