const defaultConfig = require('./einbaum.config.default')
const merge = require('lodash.merge')
const snakeCase = require('lodash.snakecase')

const defineConfig = (config) => {
  config = merge(defaultConfig, config)
  Object.keys(config).forEach(key => {
    const snakeKey = snakeCase(key).toUpperCase()
    if (process.env[snakeKey]) {
      config[key] = process.env[snakeKey]
    }
  })
  return config
}

module.exports = {
  defineConfig,
}