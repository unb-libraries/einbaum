const path = require('path')
const fs = require('fs')
const glob = require('glob')

const loadPreprocessors = (plugins, options = {}) => {
  const { projectRoot } = {
    projectRoot: process.cwd(),
    ...options,
  }

  const requirePath = (path) => require(path)
  const localPPs = glob.sync(`${projectRoot}/preprocessors/**/*.js`).map(requirePath)
  const pluginPPs = (plugins.length > 0
    ? glob.sync(`${projectRoot}/node_modules/${plugins.length > 1 ? `{${plugins.join(',')}}` : plugins[0]}/lib/preprocessors/**/*.js`)
    : []).map(requirePath)
  
  return [...localPPs, ...pluginPPs]
    .reduce((pps, pp) => ({...pps, ...pp}), {})
}

const registerPreprocessors = (preprocessors, options = {}) => {
  const { outputRoot } = {
    outputRoot: '/tmp/.einbaum',
    ...options,
  }

  return (file) => {
    let { filePath, shouldWatch, outputPath } = file
    let spec = fs.readFileSync(outputPath, 'utf8')
    Object.values(preprocessors).forEach(pp => {
      if (pp.applies(outputPath)) {
        spec = pp.transform(spec)
        outputPath = `${outputRoot}/${path.basename(outputPath, path.extname(outputPath))}${pp.extname}`
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

module.exports = {
  loadPreprocessors,
  registerPreprocessors,
}