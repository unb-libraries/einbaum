#!/usr/bin/env node
const { open: cypress } = require("cypress")
const path = require('path')

const projectRoot = process.cwd()
process.env.PROJECT_ROOT = projectRoot

cypress({
  configFile: path.resolve(__dirname, './cypress.config.js')
})