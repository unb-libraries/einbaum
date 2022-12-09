module.exports = Cypress.config().includes.commands.map(path => {
  const { name, fn } = require(`/tmp/.einbaum/commands/${path}`)
  Cypress.Commands.add(name, fn)
})