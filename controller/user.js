const { User } = require('../model/user')
const Article = require('../model/article')

module.exports = {
  getArticles: async (req, res, next) => {
    try {     


      const user = await User.findById(req.params.id)
      if(!user)  return res.status(404).json({msg : "user not found"})
      const { state } = req.query
    
      const pageNumber = req.query.page || 1
      const pageSize = 4
    
      const articles = await Article.find({ "author._id": user._id})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ state: state === 'draft' ? 1 : -1 })
            
      res.status(200).json(articles)
    } catch (error) {
      next(error)
      
    }

  }
}