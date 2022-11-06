const passport = require("passport")
const jwt = require('jsonwebtoken')
const pick = require("lodash/pick")
module.exports = {
  register: (req, res) => {
      res.status(200).json({msg : "Register Successfully", user : pick(req.user, ['email', 'firstName', "lastName"])})
  },
  
  login: async (req, res, next) => {
    passport.authenticate('login', async (error, user, info) => {
        
      if (error) return next(err)
        
      if (!user) return res.status(400).json({msg : "Username and Password not valid."})

        try {
          req.login(user, { session: false }, async error => {
            if (error) return next(error)
            const payload = { _id: user._id, email: user.email }
            const token = await user.generateJwtToken(payload)
           user =  pick(user, ['email', 'firstName', "lastName"])
            res.setHeader('Authorization', token).json({ user, info})
          })
        } catch (error) {
          return next(error)
        }
      })(req, res, next)
  }
}