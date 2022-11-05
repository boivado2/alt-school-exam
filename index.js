const express = require('express')
require('dotenv').config()


const app = express()


require("./startup/db")()
require('./middleware/auth')
require('./startup/routes')(app)



app.get('/', (req, res) => {
  res.send("Hello World")
})


const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`server running on ${PORT}`))


module.exports = server