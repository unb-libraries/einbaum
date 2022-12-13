const defaultConfig = require('./einbaum.config.default')
const merge = require('lodash.merge')

module.exports = {
  defineConfig: (config) => merge(defaultConfig, config),
}