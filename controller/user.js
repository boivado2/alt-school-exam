const { User } = require('../model/user')
const Article = require('../model/article')

module.exports = {
  getArticles: async (req, res) => {


    try {     
    
      const pageNumber = req.query.page || 1
      const pageSize = 4
    
      const article = await Article.find({ "author._id": req.user._id })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({state : 1})
      if(!article) return res.status(404).json({msg : "invalid user."})
      
      res.status(200).json(article)
    } catch (error) {
      console.log(error)
      
    }

  }
}