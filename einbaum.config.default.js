const { loadPreprocessors, registerPreprocessors } = require('./preprocessor')

const { PROJECT_ROOT } = process.env
module.exports = {
  cypress: {
    e2e: {
      setupNodeEvents: (on, config) => {
        // const preprocessors = loadPreprocessors(pluginIds, {projectRoot: PROJECT_ROOT})
        // if (Object.values(preprocessors).length > 0) {
        //   on('file:preprocessor', registerPreprocessors(preprocessors))
        // }
        return config
      },
      baseUrl: "http://localhost:8080",
      specPattern: `${PROJECT_ROOT}/e2e/**/*.cy.js`,
      fixturesFolder: `${PROJECT_ROOT}/fixtures`,
      supportFile: "",
    },
  },
  plugins: {},
}
