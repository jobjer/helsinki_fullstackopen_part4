const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')


test('six blogs are returned in json format', async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  const response = await api.get('/api/blogs')
    .expect('Content-Type', /json/)
  expect(response.body).toHaveLength(6)
  
}, 100000)

test('id is not undefined', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
}, 100000)


test('a blog can be added', async () => {
  const blogsBeforeAdding = await api.get('/api/blogs')
  const blogCountBeforeAdding = blogsBeforeAdding.body.length

  const newBlog = {
    title: 'FP vs. OO',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
    likes: 0
  }  

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const title = response.body.map(r => r.title)

  expect(response.body).toHaveLength(blogCountBeforeAdding + 1)
  expect(title).toContain('FP vs. OO')
}, 100000)


test('an add request gets likes added if missing and set to 0', async () => {
  const titleOfNewBlog = 'What Software Craftsmanship is about'

  const newBlog = {
    title: titleOfNewBlog,
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2011/01/17/software-craftsmanship-is-about.html'
  }  

  const postResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(postResponse.body.likes).toStrictEqual(0)

}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})