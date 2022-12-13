const { PROJECT_ROOT } = process.env
module.exports = {
  baseUrl: "http://localhost:8080",
  plugins: {
    [PROJECT_ROOT]: {},
  },
}