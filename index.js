const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const articleRoute = require('./routes/articles')
const passport = require('passport')

require('./middleware/auth')

mongoose.connect('mongodb://localhost:27017/blogApp').then(() => console.log("db connected successfully")).catch((err) => console.log('db not connected', err))




const app = express()
app.use(express.json())


app.use('/auth', authRoute)
app.use('/articles', articleRoute)

app.get('/', (req, res) => {
  res.send("Hello World")
})


const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`server running on ${PORT}`))