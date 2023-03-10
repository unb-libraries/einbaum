#!/usr/bin/env node

const headless = process.argv.includes('--headless')

const { open, run } = require("cypress")
const path = require('path')

let projectRoot = process.argv.find(arg => arg.startsWith('--project-root'))?.split('=')[1]
if (!projectRoot) {
  projectRoot = process.cwd()
}

if (!path.isAbsolute(projectRoot)) {
  projectRoot = path.resolve(process.cwd(), projectRoot)
}

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
