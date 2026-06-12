const appEnv = window.env;
const settings = JSON.parse(process.env.SETTINGS) || {}
settings.version = process.env.VERSION
settings.register_enabled = appEnv.RECAPTCHA_SITE_KEY !== undefined

export { settings }
