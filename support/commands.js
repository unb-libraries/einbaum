const { includes, projectKey } = Cypress.config()
module.exports = includes.commands.map(path => {
  const { name, fn } = require(`/tmp/.einbaum/${projectKey}/commands/${path}`)
  Cypress.Commands.add(name, fn)
})