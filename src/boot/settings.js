const settings = JSON.parse(process.env.SETTINGS) || {}
settings.version = process.env.VERSION

export { settings }
