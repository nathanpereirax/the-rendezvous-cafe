const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('../../the-rendezvous-cafe'))
app.listen(3000)