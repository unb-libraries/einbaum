const { includes } = Cypress.config()
module.exports = includes.commands.map(path => {
  const relativePath = path.substr('/tmp/.einbaum/'.length)
  const { name, fn } = require(`/tmp/.einbaum/${relativePath}`)
  Cypress.Commands.add(name, fn)
})