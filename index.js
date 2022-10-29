const express = require('express')
require('dotenv').config()


const app = express()

app.get('/', (req, res) => {
  res.send("Hello World")
})


const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`server running on ${PORT}`))