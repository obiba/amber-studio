const settings = JSON.parse(import.meta.env.VITE_SETTINGS || import.meta.env.SETTINGS || '{}')
settings.version = import.meta.env.VITE_VERSION || import.meta.env.VERSION
settings.register_enabled = import.meta.env.VITE_REGISTER_ENABLED || import.meta.env.REGISTER_ENABLED

export { settings }
