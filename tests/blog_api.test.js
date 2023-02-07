const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

const resetToInitialBlogs = async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}

test('get all returns six blogs in json format', async () => {
  await resetToInitialBlogs()
  const response = await api.get('/api/blogs')
    .expect('Content-Type', /json/)
  expect(response.body).toHaveLength(6)
  
}, 100000)

test('id is not undefined in any of the blogs', async () => {
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


test('if the likes prop is missing in add request, then it is added and set to 0', async () => {
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

describe('if a request is missing mandatory fields, then bad request is returned', () => {
  test('if a request is missing title, then bad request is returned', async () => {
    const blogMissingTitle = {
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2011/01/19/individuals-and-interactions.html'
    }  

    await api
      .post('/api/blogs')
      .send(blogMissingTitle)
      .expect(400)

  }, 100000)

  test('if a request is missing url, then bad request is returned', async () => {

    const blogMissingUrl = {
      title: 'Bringing Balance to the Force',
      author: 'Robert C. Martin'
    }

    await api
      .post('/api/blogs')
      .send(blogMissingUrl)
      .expect(400)

  }, 100000)
})

test('a deletion of a blog returns 204 and does no longer exist', async () => {
  await resetToInitialBlogs()
  const blogToDelete = helper.initialBlogs[0]
  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .expect(204)

  const blogs = await Blog.find({})

  expect(blogs).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const blogsAfterDeletion = blogs.map(blog => blog.toJSON())

  const titles = blogsAfterDeletion.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
}, 100000)

test('a blog can be updated', async () => {
  const blogToUpdate = helper.initialBlogs[1]
  blogToUpdate.likes = 50

  await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send(blogToUpdate)
    .expect(200)

  const blog = await Blog.findById(blogToUpdate._id)
  expect(blog.likes).toStrictEqual(50)
  
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})