const path = require('path')
const fs = require('fs')

const { defineConfig: defineCypressConfig } = require('cypress')
const { defineConfig: defineEinbaumConfig } = require('./')

const { PROJECT_ROOT, PROJECT_KEY } = process.env

let einbaumConfig = defineEinbaumConfig({})
const projectConfigPath = path.resolve(PROJECT_ROOT, 'einbaum.config.js')
if (fs.existsSync(projectConfigPath)) {
  einbaumConfig = defineEinbaumConfig(require(projectConfigPath))
}

module.exports = defineCypressConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      config.projectKey = PROJECT_KEY
      config.includes = {
        commands: fs.readdirSync(path.resolve(PROJECT_ROOT, 'commands'))
      }
      return config
    },
    baseUrl: einbaumConfig.baseUrl,
    fixturesFolder: path.resolve(__dirname, './fixtures'),
    specPattern: path.resolve(PROJECT_ROOT, 'e2e/**/*.cy.js'),
    supportFile: path.resolve(__dirname, './support/index.js'),
  }
})