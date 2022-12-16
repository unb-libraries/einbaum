const path = require('path')
const fs = require('fs')

const { defineConfig: defineCypressConfig } = require('cypress')
const { defineConfig: defineEinbaumConfig } = require('./')
const { writeSupportFile, generateSupportFilename } = require('./support')
const { loadPreprocessors, registerPreprocessors } = require('./preprocessor')

const { PROJECT_ROOT } = process.env

let einbaumConfig = defineEinbaumConfig({})
const projectConfigPath = path.resolve(PROJECT_ROOT, 'einbaum.config.js')
if (fs.existsSync(projectConfigPath)) {
  einbaumConfig = defineEinbaumConfig(require(projectConfigPath))
}

const supportFilename = generateSupportFilename()
const pluginIds = Object.keys(einbaumConfig.plugins)
writeSupportFile(supportFilename, pluginIds)

module.exports = defineCypressConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      const preprocessors = loadPreprocessors(pluginIds, {projectRoot: PROJECT_ROOT})
      if (Object.values(preprocessors).length > 0) {
        on('file:preprocessor', registerPreprocessors(preprocessors))
      }
      return config
    },
    baseUrl: einbaumConfig.baseUrl,
    fixturesFolder: einbaumConfig.fixturesFolder || path.resolve(__dirname, './fixtures'),
    specPattern: path.resolve(PROJECT_ROOT, 'e2e/**/*.cy.js'),
    supportFile: supportFilename,
  }
})