const supertest = require('supertest')
const mongoose = require("mongoose")
const Article = require('../../model/article')
const { User } = require('../../model/user')

let server
describe('/ articles', () => { 

  beforeEach(() => {
    server = require('../../index')
  })


  afterEach(async() => {
    await Article.deleteMany()
    await User.deleteMany()
    await server.close()
  })

  let url = '/articles'

  describe('/ GET', () => { 

    let articles
    let user

      beforeEach(async () => {
        user = new User({
          firstName: 'john',
          lastName: "godwin",
          email: "godwin@gmail.com",
          password: '1234'
        })
        await user.save()
      })

    it('should get all articles', async () => {


      articles = [ 
        {
         
          title: "javascript the best lang",
          
          description: "Javascript basic",
  
          author: user,
  
          tags: ["react", "js"],
  
          body: " The next step is the most complex. It’s where we take the text and then calculate how many words it contains. There’s actually 3 separate steps all chained together. First, we call the"
  
        },

        {
          title: "early dev of c#",
          
          description: "Breakfast c#",
  
          author: user,
  
          tags: ["game", "c#"],
          state : "published",
  
          body: " The next step is the most complex."
        },

      ]

      await Article.insertMany(articles)
      const res = await supertest(server).get(url)

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(1)
      expect(res.body).not.toBeNull()
      
    })

  })
  

  describe('/GET /:ID', () => { 

    let article
    let user

      beforeEach(async () => {
        user = new User({
          firstName: 'john',
          lastName: "godwin",
          email: "godwin@gmail.com",
          password: '1234'
        })
        await user.save()

        article = new Article(
          {
            title: "early dev of c#",          
            description: "Breakfast c#",
            author: user,   
            tags: ["game", "c#"],
            state : "published",   
            body: " The next step is the most complex."
          },
        )

        await article.save()
      })
    
   
     
      afterEach(() => {
        url = '/articles'
      })
    
    
    it("should return 404 if article id is not found", async () => {
      url = url + '/' + mongoose.Types.ObjectId()
      const errorMsg = {msg : "article not found"}
      const res = await supertest(server).get(url)
      expect(res.status).toBe(404)
      expect(res.text).toBe(JSON.stringify(errorMsg))
    })


    
    it("should increment the article read count any time endpoint is called", async () => {
      url = url + '/' + article._id
      const res = await supertest(server).get(url)
      expect(res.status).toBe(200)
      expect(res.body.readCount).toBe(1)
    })



    it("should save and return the article", async () => {

      url = url + '/' + article._id
      const res = await supertest(server).get(url)
      expect(res.status).toBe(200)
      expect(res.body).toBeDefined()
    })
    
  })



  describe('/ POST', () => { 
    let article
    let user
    let token
    let userId


    beforeEach(async () => {

      user = new User({
        firstName: 'john',
        lastName: "godwin",
        email: "godwin@gmail.com",
        password: '1234'
      })
      await user.save()

      userId = user._id
      token = await user.generateJwtToken({ _id: user._id, email: user.email })
      
      article = {
        title: "early dev of c#",          
        description: "Breakfast c#",
        authorId: userId,   
        tags: ["game", "c#"],
        state : "published",   
        body: " The next step is the most complex."
      }
    })

    it("should 401 if user is not logged in", async () => {

      const res =  await supertest(server)
        .post(url)
        .send(article)

      expect(res.status).toBe(401)
      
    })

    it("should 404 if user with the given id is not found", async () => {

      const res = await supertest(server)
        .post(url)
        .set("Authorization", `bearer ${token}`)
        .send({ ...article, authorId: mongoose.Types.ObjectId() })

      expect(res.status).toBe(400)
      
    })


    it("should return a value > 0 in the readingTime property", async () => {

      const res = await supertest(server)
        .post(url)
        .set("Authorization", `bearer ${token}`)
        .send(article)

      expect(res.status).toBe(200)
      expect(res.body.readingTime).toBeGreaterThan(0)
      
    })


    it("should return 200 and save the article if user authenticated and id is valid", async () => {

      const res = await supertest(server)
        .post(url)
        .set("Authorization", `bearer ${token}`)
        .send(article)

      expect(res.status).toBe(200)
      expect(res.body).toBeDefined()
      expect(res.body.title).toEqual(article.title)
      
    })

  })
  


  describe('/ PUT', () => { 
    let article
    let updatedArticle
    let user
    let token
    let userId


    beforeEach(async () => {

      user = new User({
        firstName: 'john',
        lastName: "godwin",
        email: "godwin@gmail.com",
        password: '1234'
      })
      await user.save()

      userId = user._id
      token = await user.generateJwtToken({ _id: user._id, email: user.email })

      article = new Article(
        {
          title: "early dev of c#",          
          description: "Breakfast c#",
          author: user,   
          tags: ["game", "c#"],
          state : "published",   
          body: " The next step is the most complex."
        }
      )


      await article.save()
      
      updatedArticle = {
        title: "js every day anywhere",          
        description: "js one love",
        author: user,   
        tags: ["js", "node"],
        state : "published",   
        body: " The next step is the most complex."
      }
    })

    it("should 401 if user is not logged in", async () => {
      const res =  await supertest(server)
        .put(`${url}/${article._id}`)
        .send(updatedArticle)

      expect(res.status).toBe(401)
      
    })

    it("should return 404 if article with the given id is not found", async () => {
      let articleId = mongoose.Types.ObjectId()

      const res = await supertest(server)
        .put(`${url}/${articleId}`)
        .set("Authorization", `bearer ${token}`)
        .send({ ...updatedArticle })

      expect(res.status).toBe(404)
      
    })




    it("should return 404 if article those not belongs to the user. ", async () => {

      userId = mongoose.Types.ObjectId()
      token = new User().generateJwtToken({_id: userId})
      const res = await supertest(server)
        .put(`${url}/${article._id}`)
        .set("Authorization", `bearer ${token}`)
        .send(updatedArticle)
      expect(res.status).toBe(404)
      expect(res.body).not.toContain(updatedArticle)
      
    })


    it("should return save and return the article.", async () => {

      const res = await supertest(server)
        .put(`${url}/${article._id}`)
        .set("Authorization", `bearer ${token}`)
        .send(updatedArticle)
      expect(res.status).toBe(200)
      expect(res.body.title).toBe(updatedArticle.title)
      
    })

   })

  describe('/ DELETE', () => { 

    let token
    let articleId
    let user
    let article

    beforeEach(async () => {


      user = new User({
        firstName: 'john',
        lastName: "godwin",
        email: "godwin@gmail.com",
        password: '1234'
      })
      await user.save()

      userId = user._id
      token = await user.generateJwtToken({ _id: user._id, email: user.email })

      article = new Article(
        {
          title: "early dev of c#",          
          description: "Breakfast c#",
          author: user,   
          tags: ["game", "c#"],
          state : "published",   
          body: " The next step is the most complex."
        }
      )


      await article.save()

      articleId = article._id

      
    })


    it("should 401 if user is not logged in", async () => {
      const res =  await supertest(server)
        .delete(`${url}/${articleId}`)

      expect(res.status).toBe(401)
      
    })

    it("should return 404 if article with the given id is not found", async () => {
      let articleId = mongoose.Types.ObjectId()

      const res = await supertest(server)
        .delete(`${url}/${articleId}`)
        .set("Authorization", `bearer ${token}`)

      expect(res.status).toBe(404)
      
    })




    it("should return 404 if article those not belongs to the user. ", async () => {

      userId = mongoose.Types.ObjectId()
      token = new User().generateJwtToken({ _id: userId })
      
      const res = await supertest(server)
        .delete(`${url}/${articleId}`)
        .set("Authorization", `bearer ${token}`)
      
      expect(res.status).toBe(404)
      
    })


    it("should return 200 if article is deleted. ", async () => {
      
      const res = await supertest(server)
        .delete(`${url}/${articleId}`)
        .set("Authorization", `bearer ${token}`)
      
      expect(res.status).toBe(200)
      
    })




   })

 })

