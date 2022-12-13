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

const tmp = `/tmp/.einbaum/${projectKey}`
if (!fs.existsSync(tmp)) {
  fs.mkdirSync(tmp, {recursive: true})
}

if (!fs.existsSync(path.resolve(tmp, 'commands'))) {
    fs.symlinkSync(path.resolve(projectRoot, 'commands'), path.resolve(tmp, 'commands'))
}

const customConfigFile = path.resolve(projectRoot, 'einbaum.config.js')
if (fs.existsSync(customConfigFile)) {
  config.configFile = customConfigFile
}

cypress(config)