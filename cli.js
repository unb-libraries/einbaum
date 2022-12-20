#!/usr/bin/env node

const headless = process.argv.includes('--headless')

const { open, run } = require("cypress")
const path = require('path')

const projectRoot = process.cwd()
process.env.PROJECT_ROOT = projectRoot

config = {
  configFile: path.resolve(__dirname, './cypress.config.js'),
}

if (!headless) {
  open(config)
}
else {
  run(config)
}