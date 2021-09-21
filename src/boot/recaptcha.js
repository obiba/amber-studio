import { boot } from 'quasar/wrappers'
import { VueReCaptcha } from 'vue-recaptcha-v3'

export default boot(({ app, router }) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY;
  app.use(VueReCaptcha, { 
    siteKey: siteKey,
    loaderOptions: {
      useRecaptchaNet: true,
      autoHideBadge: true
    }
  });
})
