const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const glob = require('glob')

const { PROJECT_ROOT } = process.env

const generateSupportFilename = (dir = '/tmp/.einbaum') => {
  const hash = crypto.createHash('md5').update(PROJECT_ROOT).digest('hex')
  return path.resolve(dir, `support.${hash}.js`)
}

const subpaths = (root) => {
  const paths = []
  while (root.length > 0) {
    paths.push(root)
    root = root.split('/').slice(0,-1).join('/')
  }
  return paths
}

const addModulePaths = (paths) => {
  paths = paths.filter(path => !module.paths.includes(path))
  module.paths.push(...paths)
}

const resolvePluginPath = (plugin) => {
  return path.dirname(require.resolve(plugin))
}

const resolvePluginModulePaths = (plugin, type) => {
  return glob.sync(`${resolvePluginPath(plugin)}/**/${type}/**/*.js`)
}

const resolveProjectPaths = (projectRoot, pluginType) => {
  return glob.sync(`${projectRoot}/${pluginType}/**/*.js`)  
}

const resolveAllPaths = (plugins, type) => {
  const localPaths = resolveProjectPaths(PROJECT_ROOT)
  return plugins
  .map(plugin => resolvePluginModulePaths(plugin, type))
  .reduce((paths, pluginPaths) => [...paths, ...pluginPaths], localPaths)
}

const writeSupportFile = (filename, plugins) => {
  let content = ""

  addModulePaths(subpaths(PROJECT_ROOT).map(path => `${path}/node_modules`))
  const pluginTypes = {commands: 'registerCommands', hooks: 'registerHooks', selectors: 'registerSelectors', workflows: 'registerWorkflows'}
  content += `const { ${Object.values(pluginTypes).map(registerFn => registerFn).join(', ')} } = require('${__filename}')\n`

  Object.entries(pluginTypes).forEach(([type, registerFn]) => {
    const paths = resolveAllPaths(plugins, type)
    content += `${registerFn}({
      ${paths.map(path => `...require('${path}')`).join(",\n\t")}
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

const registerHooks = (allHooks) => {
  [before, after, beforeEach, afterEach].forEach(hookType => {
    const hooks = Object.values(allHooks).filter(hook => hook.type === hookType.name)
    if (hooks) {
      hookType(() => {
        hooks.forEach(hook => hook.fn())
      })
    }
  })
}

const registerSelectors = (selectors) => {
  Cypress.Commands.addQuery('getBySelector', (selector) => {
    if (!selector.match(/^[a-zA-Z-_]+(\:([0-9a-zA-Z-_])+)+$/)) {
      throw new Error("Malformed selector")
    }

    const base = selector.substring(0, selector.lastIndexOf(':'))
    const name = selector.substring(selector.lastIndexOf(':') + 1)
    if (!selectors.hasOwnProperty(base)) {
      throw new Error("Unrecognized selector")
    }

    const getFn = cy.now('get', selectors[base](name))
    return (selector) => {
      return getFn(selector)
    }
  })
}

const registerWorkflows = (workflows) => {
  function Workflows() {
    this.workflows = {}
  }
  
  Workflows.prototype.add = function (id, workflowFn) {
    this.workflows[id] = workflowFn
  }
  
  Workflows.prototype.run = function (id, context) {
    return this.workflows[id](context)
  }
  
  Cypress.$Cypress.prototype.Workflows = new Workflows()
  Object.entries(workflows).forEach(([id, workflowFn]) => Cypress.Workflows.add(id, workflowFn))
}

module.exports = {
  registerCommands,
  registerHooks,
  registerSelectors,
  registerWorkflows,
  writeSupportFile,
  generateSupportFilename,
}