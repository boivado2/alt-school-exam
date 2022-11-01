const mongoose = require('mongoose')
const {userSchema} = require('./user')

const articleSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true },
  description: {type: String, required: true},
  author: {
    type: new mongoose.Schema({
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },    
    }),
    required: true
  },
  state: { type: String, enum: ['draft', 'published'], required: true, default: 'draft'},
  readCount: {type: Number, default: 0},
  readingTime: {type: Number},
  tags: [{type: String, required: true}],
  body: { type: String, required: true },

}, { timestamps: true })


const Article = mongoose.model('articles', articleSchema)



module.exports = Article
