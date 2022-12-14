const path = require('path')
const fs = require('fs')

const { defineConfig: defineCypressConfig } = require('cypress')
const { defineConfig: defineEinbaumConfig, symlinkPluginFiles } = require('./')

const { PROJECT_ROOT, PROJECT_KEY } = process.env

let einbaumConfig = defineEinbaumConfig({})
const projectConfigPath = path.resolve(PROJECT_ROOT, 'einbaum.config.js')
if (fs.existsSync(projectConfigPath)) {
  einbaumConfig = defineEinbaumConfig(require(projectConfigPath))
}

const tmpRoot = '/tmp/.einbaum/'
const tmpProjectRoot = tmpRoot + PROJECT_KEY
if (!fs.existsSync(tmpProjectRoot)) {
  fs.mkdirSync(tmpProjectRoot, {recursive: true})
}

module.exports = defineCypressConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      config.projectKey = PROJECT_KEY
      config.includes = symlinkPluginFiles(Object.keys(einbaumConfig.plugins), tmpProjectRoot)
      console.log(config.includes)
      return config
    },
    baseUrl: einbaumConfig.baseUrl,
    fixturesFolder: path.resolve(__dirname, './fixtures'),
    specPattern: path.resolve(PROJECT_ROOT, 'e2e/**/*.cy.js'),
    supportFile: path.resolve(__dirname, './support/index.js'),
  }
})