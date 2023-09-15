const settings = JSON.parse(process.env.SETTINGS) || {}
settings.version = process.env.VERSION
settings.register_enabled = process.env.REGISTER_ENABLED === 'true' ||
  process.env.REGISTER_ENABLED === '1' ||
  process.env.REGISTER_ENABLED === true ||
  process.env.REGISTER_ENABLED === 1

export { settings }
