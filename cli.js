#!/usr/bin/env node
const { open: cypress } = require("cypress")
const path = require('path')

const projectRoot = process.cwd()
process.env.PROJECT_ROOT = projectRoot

const projectKey = projectRoot.replace(/[^a-zA-z0-9-_]/g, "")
process.env.PROJECT_KEY = projectKey

cypress({
  configFile: path.resolve(__dirname, './cypress.config.js')
})