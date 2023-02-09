const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const resetToInitialBlogs = async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}

const setInitialUsers = async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
}

describe('when there is initially some blogs saved', () => {
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
})

describe('viewing a specific blog', () => {

  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.title).toEqual(blogToView.title)
  }, 100000)

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  }, 100000)

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '63e38805e465d0a7208514f'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  }, 100000)
})


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
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
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
  await resetToInitialBlogs()
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  blogToUpdate.likes = 50

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)

  const blog = await Blog.findById(blogToUpdate.id)
  expect(blog.likes).toStrictEqual(50)
  
}, 100000)

test('a blog can be added', async () => {
  await resetToInitialBlogs()
  await setInitialUsers()
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

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map(r => r.title)
  expect(title).toContain('FP vs. OO')
  
}, 100000)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  }, 100000)
  
  test('get users returns one user in json format', async () => {
    const users = await helper.usersInDb()
    
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body).toHaveLength(1)  
    expect(response.body).toStrictEqual(users)
  
  }, 100000)

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  }, 100000)

})

describe('the following add requests should fail with proper statuscode and message', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  }, 100000)

  afterEach(async () => {
    const usersAtStart = await helper.usersInDb()
    expect(usersAtStart).toHaveLength(1)

  }, 100000)

  test('if username already taken', async () => {

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

  }, 100000)

  test('if username is missing or is less than 3 characters', async () => {

    const newUser = {
      name: 'Donald Duck',
      password: 'Dolly'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username is mandatory and must be at least 3 characters long')

    const newUser2 = {
      username: 'DD',
      name: 'Donald Duck',
      password: 'Dolly'
    }

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('username is mandatory and must be at least 3 characters long')

  }, 100000)

  test('if password is missing or is less than 3 characters', async () => {

    const newUser = {
      username: 'donald',
      name: 'Donald Duck',
      password: 'Do'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is mandatory and must be at least 3 characters long')

    const newUser2 = {
      username: 'donald',
      name: 'Donald Duck'
    }

    const result2 = await api
      .post('/api/users')
      .send(newUser2)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('password is mandatory and must be at least 3 characters long')

  }, 100000)
})


afterAll(async () => {
  await setInitialUsers()
  await mongoose.connection.close()
})