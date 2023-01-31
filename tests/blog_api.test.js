const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('six blogs are returned in json format', async () => {
  const response = await api.get('/api/blogs')
    .expect('Content-Type', /json/)
  expect(response.body).toHaveLength(6)
  
}, 100000)



afterAll(async () => {
  await mongoose.connection.close()
})