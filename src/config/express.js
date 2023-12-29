const express = require('express')
const app = express()

app.use(express.json())

const routes = require('../routes/route.js')

app.use('/', routes)

module.exports = app