const path = require('path')
const fs = require('fs')
const glob = require('glob')

const { defineConfig: defineCypressConfig } = require('cypress')
const { defineConfig: defineEinbaumConfig } = require('./')
const { writeSupportFile, generateSupportFilename } = require('./support')

const { PROJECT_ROOT } = process.env

let einbaumConfig = defineEinbaumConfig({})
const projectConfigPath = path.resolve(PROJECT_ROOT, 'einbaum.config.js')
if (fs.existsSync(projectConfigPath)) {
  einbaumConfig = defineEinbaumConfig(require(projectConfigPath))
}

const supportFilename = generateSupportFilename()
const pluginIds = Object.keys(einbaumConfig.plugins)
writeSupportFile(supportFilename, pluginIds)

const loadPreprocessors = (plugins) => {
  const requirePath = (path) => require(path)
  const localPPs = glob.sync(`${PROJECT_ROOT}/preprocessors/**/*.js`).map(requirePath)
  const pluginPPs = (plugins.length > 0
    ? glob.sync(`${PROJECT_ROOT}/node_modules/${plugins.length > 1 ? `{${plugins.join(',')}}` : plugins[0]}/lib/preprocessors/**/*.js`)
    : []).map(requirePath)
  
  return [...localPPs, ...pluginPPs]
    .reduce((pps, pp) => ({...pps, ...pp}), {})
}

const registerPreprocessors = (preprocessors, options = {}) => {
  options = {
    outputRoot: '/tmp/.einbaum',
    ...options,
  }

  return (file) => {
    let { filePath, shouldWatch, outputPath } = file
    let spec = fs.readFileSync(outputPath, 'utf8')
    Object.values(preprocessors).forEach(pp => {
      if (pp.applies(outputPath)) {
        spec = pp.transform(spec)
        outputPath = `${options.tmpRoot}/${path.basename(outputPath, path.extname(outputPath))}${pp.extname}`
      }
    })

    if (filePath != outputPath) {
      fs.writeFileSync(outputPath, spec)
      if (shouldWatch) {
        fs.watch(filePath, () => {
          file.emit('rerun')
        })
      }  
    }

    return file.outputPath
  }
}

module.exports = defineCypressConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      const preprocessors = loadPreprocessors(pluginIds)
      if (Object.values(preprocessors).length > 0) {
        on('file:preprocessor', registerPreprocessors(preprocessors))
      }
      return config
    },
    baseUrl: einbaumConfig.baseUrl,
    fixturesFolder: path.resolve(__dirname, './fixtures'),
    specPattern: path.resolve(PROJECT_ROOT, 'e2e/**/*.cy.js'),
    supportFile: supportFilename,
  }
})