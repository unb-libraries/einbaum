#!/usr/bin/env node
const { open: cypress } = require("cypress")
const path = require('path')
const fs = require('fs')

const projectRoot = process.cwd()
process.env.PROJECT_ROOT = projectRoot

const projectKey = projectRoot.replace(/[^a-zA-z0-9-_]/g, "")
process.env.PROJECT_KEY = projectKey

const config = {
  configFile: path.resolve(__dirname, './einbaum.config.default.js')
}

const tmpProjectRoot = `/tmp/.einbaum/${projectKey}`
if (!fs.existsSync(tmpProjectRoot)) {
  fs.mkdirSync(tmpProjectRoot, {recursive: true})
}

['commands', 'preprocessors', 'selectors', 'workflows'].forEach(plugin => {
  const pluginPath = path.resolve(projectRoot, plugin)
  const tmpPluginPath = path.resolve(tmpProjectRoot, plugin)
  if (fs.existsSync(pluginPath) && !fs.existsSync(tmpPluginPath)) {
    fs.symlinkSync(pluginPath, tmpPluginPath)
  }
})

const customConfigFile = path.resolve(projectRoot, 'einbaum.config.js')
if (fs.existsSync(customConfigFile)) {
  config.configFile = customConfigFile
}

cypress(config)