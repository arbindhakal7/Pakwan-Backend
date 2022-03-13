require('dotenv').config();

const request = require('supertest');
const mongoose = require("mongoose");

const User = require('../models/User.js')
const Post = require('../models/Post.js')
const Recipe = require('../models/Recipe.js')

const app = require('../app');
const url = process.env.DB_URI_TESTING;
let __accessToken = ""
let __postId = ""
let __recipeId = ""

beforeAll(async function(){
  await mongoose.connect(url);
});

afterAll(async function() {
  await User.deleteMany({})
  await Post.deleteMany({})
  await Recipe.deleteMany({})
  await mongoose.connection.close();
});

describe('User', function () {
  describe("Register User", function(){
    jest.setTimeout(30000);
    it('should register new user', async function(){
      const response = await request(app)
        .post('/user/register')
        .send({
          fullname: "test user",
          email: "user@test.com",
          password: "123456"
        })
        .set('Accept', 'application/json')
      expect(response.body.success).toBe(true)
    })

    it('should respond failure when registering registered user', async function(){
      const response = await request(app)
        .post('/user/register')
        .send({
          fullname: "test user",
          email: "user@test.com",
          password: "123456"
        })
        .set('Accept', 'application/json')
      expect(response.body.success).toBe(false)
    })
  })

  describe("Login User", function(){
    it('should login valid user', async function(){
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'user@test.com',
          password: '123456'
        })
        .set('Accept', 'application/json')
      __accessToken = response.body.accessToken
      expect(response.body.success).toBe(true)              
    })

    it('should fail with invalid password', async function(){
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'user@test.com',
          password: '123123'
        })
        .set('Accept', 'application/json')
      expect(response.body.success).toBe(false)
    })
  })

  describe("Get User Detail", function(){
    it('should get user detail', async function(){
      const response = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${__accessToken}`)
      expect(response.body.success).toBe(true)
    })
  })

  describe("Update User", function(){
    it('should update user detail', async function(){
      const response = await request(app)
        .patch('/user')
        .send({
          fullname: "test user",
          bio: "i m new",
          website: "Jeep",
          address: "West Laurynfort",
          phone: "1-801-374-1975",
          gender: "male",
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${__accessToken}`)
      expect(response.body.success).toBe(true)
    })
  })
});

describe('Post', function () {
  describe("Add Status", function(){
    it('should add new status', async function(){
      const response = await request(app)
        .post('/post/status')
        .send({
          status: "Hello world"
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${__accessToken}`)
      __postId = response.body.data._id
      expect(response.body.success).toBe(true)
    })
  })

  describe("Get Post", function(){
    it('should get all post', async function(){
      const response = await request(app)
        .get('/post')
        .set('Accept', 'application/json')
      expect(response.body.success).toBe(true)
    })
  })

  describe("Like Post", function(){
    it('should like status', async function(){
      const response = await request(app)
        .patch('/post/like/' + __postId)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${__accessToken}`)
      expect(response.body.message).toBe("Post Liked")
    })
    it('should unlike status', async function(){
      const response = await request(app)
        .patch('/post/like/' + __postId)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${__accessToken}`)
      expect(response.body.message).toBe("Post Unliked")
    })
  })
});

describe('Recipe', function () {
  describe("Insert New Recipe", function(){
    it('should insert new Recipe', async function(){
      const response = await request(app)
        .post('/recipe')
        .send({
          title: "test recipe",
          description: "i m new",
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${__accessToken}`)
      __recipeId = response.body.data._id
      expect(response.body.success).toBe(true)

    })
  })
  describe("GET Recipe by ID", function(){
    it('should give recipe detail', async function(){
      const response = await request(app)
        .get('/recipe/' + __recipeId)
        .set('Accept', 'application/json')
      expect(response.body.success).toBe(true)
    })
  })
});

describe('Review', function () {
  describe("Insert New Review", function(){
    it('should insert new review', async function(){
      const response = await request(app)
        .post('/review/' + __recipeId)
        .send({
          review: "test review",
          rating: 3,
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${__accessToken}`)
      expect(response.body.success).toBe(true)
    })
  })
});