const { defineConfig } = require('cypress')
const path = require('path')
const fs = require('fs')

const { PROJECT_ROOT, PROJECT_KEY } = process.env
module.exports = {
  e2e: {
    setupNodeEvents: (on, config) => {
      config.projectKey = PROJECT_KEY
      config.includes = {
        commands: fs.readdirSync(path.resolve(PROJECT_ROOT, 'commands'))
      }
      return config
    },
    baseUrl: "http://localhost:8080",
    fixturesFolder: path.resolve(__dirname, './fixtures'),
    specPattern: path.resolve(PROJECT_ROOT, 'e2e/**/*.cy.js'),
    supportFile: path.resolve(__dirname, './support/index.js'),
  }
}