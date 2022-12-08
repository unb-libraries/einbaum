const defaultConfig = require('./einbaum.config.default')
module.exports = {
  defineEinbaumConfig: (config) => ({
  ...defaultConfig,
  ...config,
  }),
}