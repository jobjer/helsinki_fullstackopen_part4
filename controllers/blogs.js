const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user')
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }    
  } catch (error) {
    response.status(400).send({error: 'malformatted id'})
  }  
})

blogsRouter.post('/', async (request, response) => {
  if(!request.body.title){
    return response.status(400).send({error: 'title is missing in request' })
  }

  if(!request.body.url){
    return response.status(400).send({error: 'url is missing in request' })
  }
  
  if(!request.body.likes ){
    request.body.likes = 0
  }

  const body = request.body

  const users = await User.find({})

  const user = users[0]

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedblog => {
      response.json(updatedblog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter