const mongoose = require('mongoose')
const {userSchema} = require('./user')

const articleSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  description: {type: String, required: true},
  author: {type: userSchema,  required: true},
  state: { type: String, enum: ['draft', 'published'], required: true},
  readCount: {type: Number, required: true},
  readingTime: {type: Number, required: true},
  tags: {type: String, required: true},
  body: { type: String, required: true },

}, { timestamps: true })


const Article = mongoose.model('blog', articleSchema)



module.exports = Article
