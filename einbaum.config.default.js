const { PROJECT_ROOT } = process.env
module.exports = {
  baseUrl: process.env.BASE_URL || "http://localhost:8080",
  fixturesFolder: `${PROJECT_ROOT}/fixtures`,
  plugins: {},
}