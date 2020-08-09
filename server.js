const express = require('express')
const apiRouter = require('./api/api')
const morgan = require('morgan')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 4000
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/api', apiRouter)
app.use(cors())
app.use(errorHandler())

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports = app