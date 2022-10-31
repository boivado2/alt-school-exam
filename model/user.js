const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  password: { type: String, required: true},


})

userSchema.methods.hashPassword =  async function (data) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(data, salt)
}


userSchema.methods.isValidPassword = async function (password) {
  const user = this
  return await bcrypt.compare(password, user.password)
}

const User = mongoose.model('Users', userSchema)


module.exports.User = User
module.exports.userSchema = userSchema
