const passport = require('passport')
const authRoute = require("../routes/auth")
const articleRoute = require('../routes/articles')
const userRoute = require('../routes/users')

module.exports = function (app) {

  app.use(express.json())
  app.use('/auth', authRoute)
  app.use('/articles', articleRoute)  
  app.use('/users', passport.authenticate('jwt', { session: false }), userRoute)
  

}