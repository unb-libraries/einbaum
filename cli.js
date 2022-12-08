#!/usr/bin/env node
const { open: cypress } = require("cypress")
const path = require('path')
const fs = require('fs')

const config = {
  configFile: path.resolve(__dirname, './einbaum.config.default.js')
}

const customConfigFile = path.resolve(process.cwd(), 'einbaum.config.js')
if (fs.existsSync(customConfigFile)) {
  config.configFile = customConfigFile
}

cypress(config)