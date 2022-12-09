const { defineConfig: defineCypressConfig } = require('cypress')
const merge = require('lodash.merge')

const defaultConfig = require('./einbaum.config.default')
module.exports = {
  defineEinbaumConfig: (config) => defineCypressConfig(merge(defaultConfig, config)),
}