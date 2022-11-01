const passport = require('passport')
const {User} = require('../model/user')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt




passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRETE,
  },
  async (token, done) => {
  try {
    return done(null, token);
  } catch (error) {
    done(error);
  }
  
}))


passport.use('register', new LocalStrategy({

  usernameField: "email",
  passwordField: "password",
  passReqToCallback : true

}, async (req, email, password, done) => {
  const {firstName, lastName} = req.body
  try {
    let user = await User.findOne({ email })
    if (user) return done(null, false, { message: 'email already exist!' })

    
    user = new User({ email, password, firstName, lastName})

    user.password = await user.hashPassword(user.password)

    await user.save()

    return done(null, user)
  } catch (error) {
    return done(error)
  }
}))



passport.use('login', new LocalStrategy({

  usernameField: "email",
  passwordField: "password",

}, async (email, password, done) => {

  try {
    // user email exit
    //validate if user password match the one in the db
    const user = await User.findOne({ email })
    if (!user) return done(null, false, { message: 'email or password is incorrect.' })
    
    const isValid = await user.isValidPassword(password)
    if(!isValid) return done(null, false, {message: "email or password is incorrect."})
    
    return done(null, user, { message: "successfully logged in."})
  } catch (error) {
    return done(error)
  }
}))