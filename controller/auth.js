const passport = require("passport")
const jwt = require('jsonwebtoken')

module.exports = {
  register: (req, res) => {
    console.log('controller : ',req.user)
  },
  
  login: async (req, res, next) => {
    passport.authenticate('login', async (error, user, info) => {
        
      if (error) return next(err)
        
      if (!user) {
        const error = new Error("Username and Password not valid.")
        return next(error)
      }

        try {
          req.login(user, { session: false }, async error => {
            if (error) return next(error)
            console.log(user)
            const payload = { _id: user._id, email: user.email }
            const token = await user.generateJwtToken(payload)
            res.setHeader('Authorization', token).json(info)
          })
        } catch (error) {
          return next(error)
        }
      })(req, res, next)
  }
}