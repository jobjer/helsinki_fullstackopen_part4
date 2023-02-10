const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const userExtractor = middleware.userExtractor
const tokenExtractor = middleware.tokenExtractor


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

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response, next) => {
  try {
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

    const user = await User.findById(request.user)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if ( blog.user.toString() === request.user.toString() ){
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'user invalid' })
    }

  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)  

  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter