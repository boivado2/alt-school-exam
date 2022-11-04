const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const articleRoute = require('./routes/articles')
const userRoutes = require('./routes/users')
const passport = require('passport')
 

require('./middleware/auth')


mongoose.connect(process.env.MONGO_URI).then(() => console.log(`db connected successfully ${process.env.MONGO_URI}`)).catch((err) => console.log('db not connected', err))




const app = express()
app.use(express.json())


app.use('/auth', authRoute)
app.use('/articles', articleRoute)
app.use('/users', passport.authenticate('jwt', {session : false}), userRoutes )

app.get('/', (req, res) => {
  res.send("Hello World")
})


const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`server running on ${PORT}`))


module.exports = server