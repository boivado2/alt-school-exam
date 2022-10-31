const authController = require('../controller/auth')
const express = require('express')
const passport = require('passport')

const router = express.Router()


router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  authController.register
)

router.post('/login', authController.login)


module.exports = router