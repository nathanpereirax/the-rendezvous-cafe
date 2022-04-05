const app = require('../server')
const route = require('../routes/menu')

app.use("/api/", route)

module.exports = app