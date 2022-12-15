const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const glob = require('glob')

const { PROJECT_ROOT } = process.env

const generateSupportFilename = (dir = '/tmp/.einbaum') => {
  const hash = crypto.createHash('md5').update(PROJECT_ROOT).digest('hex')
  return path.resolve(dir, `support.${hash}.js`)
}

const writeSupportFile = (filename, plugins) => {
  let content = ""

  const pluginTypes = {commands: 'registerCommands', selectors: 'registerSelectors'}
  content += `const { ${Object.values(pluginTypes).map(registerFn => registerFn).join(', ')} } = require('${__filename}')\n`

  Object.entries(pluginTypes).forEach(([type, registerFn]) => {
    const localPaths = glob.sync(`${PROJECT_ROOT}/${type}/**/*.js`)
    const pluginPaths = plugins.length > 0
      ? glob.sync(`${PROJECT_ROOT}/node_modules/${plugins.length > 1 ? `{${plugins.join(',')}}` : plugins[0]}/lib/${type}/**/*.js`)
      : []

    content += `${registerFn}({
      ${[...localPaths, ...pluginPaths].map(path => `...require('${path}')`).join(",\n\t")}
    })\n\n`
  })

  const supportDir = path.dirname(filename)
  if (!fs.existsSync(supportDir)) {
    fs.mkdirSync(supportDir, {recursive: true})
  }
  fs.writeFileSync(filename, content)
}

const registerCommands = (commands) => {
  Object.entries(commands)
  .forEach(([name, { fn, method = 'add', type = 'parent', subject = false }]) => {
    if (method === 'add') {
      Cypress.Commands.add(name, {
        prevSubject: type === 'parent'
          ? false
          : subject,
      }, fn)
    }
    else {
      Cypress.Commands.overwrite(name, fn)
    }
  })
}

const registerSelectors = (modules) => {
}

module.exports = {
  registerCommands,
  registerSelectors,
  writeSupportFile,
  generateSupportFilename,
}