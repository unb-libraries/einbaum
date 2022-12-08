const { defineConfig } = require('cypress')
const path = require('path')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents: (on, config) => {

    },
    fixturesFolder: path.resolve(__dirname, './fixtures'),
    supportFile: path.resolve(__dirname, './support/index.js'),
  }
})