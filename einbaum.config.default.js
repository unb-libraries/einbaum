const { defineConfig } = require('cypress')
const path = require('path')

const { PROJECT_ROOT } = process.env
module.exports = {
  e2e: {
    setupNodeEvents: (on, config) => {

    },
    fixturesFolder: path.resolve(__dirname, './fixtures'),
    specPattern: path.resolve(PROJECT_ROOT, 'e2e/**/*.cy.js'),
    supportFile: path.resolve(__dirname, './support/index.js'),
  }
}