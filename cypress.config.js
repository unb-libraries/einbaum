const path = require('path')
const fs = require('fs')

const { defineConfig: defineCypressConfig } = require('cypress')
const { defineConfig: defineEinbaumConfig } = require('./')
const { writeSupportFile, generateSupportFilename } = require('./support')

const { PROJECT_ROOT } = process.env

const projectConfigPath = path.resolve(PROJECT_ROOT, 'einbaum.config.js')
const einbaumConfig = defineEinbaumConfig(
  fs.existsSync(projectConfigPath) ? require(projectConfigPath) : {}
);

const supportFilename = generateSupportFilename()
const pluginIds = Object.keys(einbaumConfig.plugins)
writeSupportFile(supportFilename, pluginIds)

const { cypress: cypressConfig } = einbaumConfig
cypressConfig.e2e.supportFile = supportFilename

module.exports = defineCypressConfig(cypressConfig)
