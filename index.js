const express = require('express')
require('dotenv').config()
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')

const app = express()


require("./startup/db")()
require('./middleware/auth')
require('./startup/routes')(app)


app.use(cors())
app.use(helmet())
app.use(compression())




app.get('/', (req, res) => {
  res.send("Hello World")
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).jso({msg : "internal error"})
})


const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`server running on ${PORT}`))


module.exports = server