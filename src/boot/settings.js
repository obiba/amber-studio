const settings = JSON.parse(process.env.SETTINGS) || {}
settings.version = process.env.VERSION
settings.register_enabled = process.env.REGISTER_ENABLED

export { settings }
