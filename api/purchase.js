const app = require('../server')
const route = require('../routes/purchase')

app.use("/api/", route)

module.exports = app