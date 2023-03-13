#!/usr/bin/env node

const snakeCase = require('lodash.snakecase')

const headless = process.argv.includes('--headless')
process.argv
  .filter(arg => arg.startsWith('--set-'))
  .map(arg => arg.substring(6))
  .forEach(arg => {
    const [name, value] = arg.split('=')
    const envVarName = snakeCase(name).toUpperCase()
    if (!process.env[envVarName]) {
      process.env[envVarName] = value
    }
  })

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

const exec = headless ? run : open
exec(config)
  .then(({ totalFailed}) => {
    process.exit(totalFailed > 0 ? 1 : 0)
  })
  .catch((e) => {
    process.exit(e.code || 1)
  })
