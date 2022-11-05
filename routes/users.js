const userController = require('../controller/user')
const express = require('express')
const passport = require('passport')

const router = express.Router()


// get  route
router.get('/:id/articles', userController.getArticles)




module.exports = router