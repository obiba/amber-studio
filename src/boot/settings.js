const appEnv = window.env
const settings = {}

const response = await fetch(`${appEnv.PATH_PREFIX}settings.json`)
if (response.ok) {
  Object.assign(settings, await response.json())
}

settings.version = process.env.VERSION
settings.register_enabled = appEnv.RECAPTCHA_SITE_KEY !== undefined

export { settings }