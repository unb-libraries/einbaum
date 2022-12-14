const fs = require('fs')
const path = require('path')

const defaultConfig = require('./einbaum.config.default')
const merge = require('lodash.merge')

const PLUGIN_TYPES = [
  'commands',
  'preprocessors',
  'selectors',
  'workflows',
]

const resolvePluginPath = (plugin) => {
  const { PROJECT_ROOT } = process.env
  const projectNodeModulesPath = `${PROJECT_ROOT}/node_modules`
  if (!module.paths.includes(projectNodeModulesPath)) {
    module.paths.push(projectNodeModulesPath)
  }
  return require.resolve(plugin)
}

const symlinkPluginFiles = (plugins, targetRoot) => {
  const symlinks = {}
  plugins.forEach(plugin => {
    const pluginRoot = path.dirname(resolvePluginPath(plugin))
    PLUGIN_TYPES.forEach(type => {
      symlinks[type] = []
      const pluginTypeRoot = path.resolve(pluginRoot, type)
      if (fs.existsSync(pluginTypeRoot)) {
        const targetTypeRoot = path.resolve(targetRoot, type)
        if (!fs.existsSync(targetTypeRoot)) {
          fs.mkdirSync(targetTypeRoot)
        }
        fs.readdirSync(pluginTypeRoot).forEach(filename => {
          const targetPath = path.resolve(targetTypeRoot, filename)
          const pluginPath = path.resolve(pluginTypeRoot, filename)
          symlinks[type].push(targetPath)
          if (!fs.existsSync(targetPath)) {
            fs.symlinkSync(pluginPath, targetPath)
          }
        })
      }
    })
  })
  return symlinks
}

module.exports = {
  defineConfig: (config) => merge(defaultConfig, config),
  symlinkPluginFiles,
}