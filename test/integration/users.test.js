const supertest = require('supertest')
const mongoose = require("mongoose")
const { User } = require('../../model/user')
const Article = require('../../model/article')

let server

describe('/ user', () => {

  beforeEach(() => {
    server = require('../../index')
  })


  afterEach(async () => {
    await User.deleteMany()
    await Article.deleteMany()
    await server.close()
  })

  let url

  describe('/GET :ID/articles', () => { 


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
    })

    it("should return 401 if user is not login.",async () => {

      url = `/users/${userId}/articles`
      token = ""
      const res = await supertest(server).get(url).set("authorization", `bearer ${token}`)

      console.log(res.body)
      expect(res.status).toBe(401)
    })

    it("should return 404 if user with the given id not found.",async () => {

      userId = mongoose.Types.ObjectId()
      url = `/users/${userId}/articles`
      const res = await supertest(server).get(url).set("authorization", `bearer ${token}`)
      expect(res.status).toBe(404)
    })


    it("should return status of 200 and articles if user have any",async () => {

      url = `/users/${userId}/articles`
      const res = await supertest(server).get(url).set("authorization", `bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body).not.toBeNull()
    })

   })

})