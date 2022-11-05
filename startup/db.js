const mongoose  = require('mongoose')

module.exports = function () {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`db connected successfully ${process.env.MONGO_URI}`))
    .catch((err) => console.log('db not connected', err))
}