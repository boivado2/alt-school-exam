const supertest = require('supertest')
const mongoose = require("mongoose")
const { User } = require('../../model/user')

let server
describe('/ auth', () => {

  beforeEach(() => {
    server = require('../../index')
  })


  afterEach(async () => {
    await User.deleteMany()
    await server.close()
  })

  let url = '/auth'

  describe('/ POST /register', () => { 

    let user
    let newUser

    beforeEach(async () => {
     user =  new User({
        email: 'name@gmail.com',
        firstName: "name",
        lastName: "great",
        password: "1234"
     })
      
      await user.save()


      

      
    })


    it("should return 401 if user already exist.", async () => {
      newUser = {
        email: 'name@gmail.com',
        firstName: "name",
        lastName: "great",
        password: "1234"
        }
      const res = await supertest(server).post(`${url}/register`).send(newUser)
      expect(res.status).toBe(401)
    })

    it("should save and return the user", async () => {
      newUser = {
        email: 'name@gmail1.com',
        firstName: "name",
        lastName: "great",
        password: "1234"
        }
      const res = await supertest(server).post(`${url}/register`).send(newUser)
      console.log(res.body)
      expect(res.status).toBe(200)
      expect(res.body.user.firstName).toBe(newUser.firstName)
      expect(res.body.user).not.toHaveProperty('password')
    })

  })
  


  describe('/ POST /login', () => { 

    let user
    let authDetails

    beforeEach(async () => {

     user =  new User({
        email: 'name@gmail.com',
        firstName: "name",
        lastName: "great",
        password: "1234"
     })
      
      user.password = await user.hashPassword(user.password)
      
      await user.save()


      authDetails = {
        email: 'name@gmail.com',
        password: "1234"
      }

    })


    it("should return 400 if email or password is not valid.", async () => {
      authDetails.email = "na@gmail.com"
      const res = await supertest(server).post(`${url}/login`).send(authDetails)
      expect(res.status).toBe(400)
    })

    it("should  generate jwt token", async () => {
      const res = await supertest(server).post(`${url}/login`).send(authDetails)

      expect(res.status).toBe(200)
      expect(res.headers).toHaveProperty("authorization")
    })

    it("should  authenticate and return the user", async () => {
      const res = await supertest(server).post(`${url}/login`).send(authDetails)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("user")
      expect(res.body.info).toHaveProperty("message")
    })
   })


})