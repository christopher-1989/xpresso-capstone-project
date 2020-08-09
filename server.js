const express = require('express')
const apiRouter = require('./api/api')

const app = express()

const PORT = process.env.PORT || 4000
app.use(morgan('dev'))

app.use('/api', apiRouter)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports = app