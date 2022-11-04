const Article = require('../model/article')
const { User } = require('../model/user')
const calculateReadingTime = require('../util/calculateReadingTime')

module.exports = {
  // get all articles
  // access by everyone /GET
  getArticles: async (req, res) => { 
    const { author, title, tag } = req.query
    
    const queryOptions = {
      state : 'published'
    }

    if (author) queryOptions['author.firstName'] = new RegExp(`.*${author}.*`,"i")
    if (title) queryOptions.title = new RegExp(`.*${title}.*`,"i")
    if(tag) queryOptions.tags = {"$in" : tag}

    const pageSize = 20
    const pageNumber = req.query.pageNumber || 1
    const articles = await Article.find(queryOptions)
      .skip((pageNumber -1) * pageSize)
      .limit(pageSize)
      .sort({readCount : -1, readingTime: -1, createdAt : -1})
    res.send(articles)
  },
  // get a single article /GET/:ID
  // access by everyone
  getArticle: async (req, res) => { 
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ msg: "article not found" })

    await article.readCount++
    await article.save()  
    res.status(200).json(article)
  },

  // post a single article /POST
  // access by login users
  addArticle: async (req, res) => {

    try {

      const user = await User.findById(req.body.authorId)
      if (!user) return res.status(400).json({ msg: "User not found." })
      
      const article = new Article({
        title: req.body.title,
        description: req.body.description,
        author: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        state: req.body.state,
        tags: req.body.tags,
        body: req.body.body,
        // readingTime : req.body.readingTime
      })


      article.readingTime = calculateReadingTime(article.body)
  
      await article.save()
      res.json(article)
      
    } catch (error) {
      console.log(error)
      
    }
   
  },

  // update a single article /PUT
  // access by login users
  updateArticle: async (req, res) => {


    try {

      let article;

      article = await Article.findById(req.params.id)
      if (!article) return res.status(404).json({ msg: "article not found." })
      
      article = await Article.findOneAndUpdate({ "author._id": req.user._id }, {
        $set: {
  
          title: req.body.title,
          description: req.body.description,
          author: article.author,
          state: req.body.state,
          tags: req.body.tags,
          body: req.body.body,
          readingTime : req.body.readingTime
        }
      }, {new : true})
      if (!article) return res.status(404).json({ msg: "invalid user." })
      
      await article.save()
  
      res.status(200).json(article)
      
    } catch (error) {
      console.log(error)
      
    }

    
  },


  // delete a single article /DELETE
  // access by login users 
  deleteArticle: async (req, res) => {
    try {     

      let article;

      article = await Article.findById(req.params.id)
      if(!article) return res.status(404).json({msg: "article not found."})


     article = await Article.findOneAndDelete({ "author._id": req.user._id })
     if(!article) return res.status(404).json({msg: "invalid user."})

     res.status(200).json({msg: "article successfully deleted."})

   } catch (error) {
    console.log(error)
   }
    
  },

}