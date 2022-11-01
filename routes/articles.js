const articleController = require('../controller/article')
const express = require('express')
const passport = require('passport')

const router = express.Router()

// post route
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  articleController.addArticle
)

// get  route
router.get('/', articleController.getArticles)

//get/:id route
router.get('/:id', articleController.getArticle)

// put route
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  articleController.updateArticle
)

// delete route
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  articleController.deleteArticle
)




module.exports = router