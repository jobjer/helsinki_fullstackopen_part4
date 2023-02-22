const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const { title, author, url, likes } = request.body
  const blog = new Blog({
    title, author, url, 
    likes: likes ? likes : 0
  })

  blog.user = user._id

  const createdBlog = await blog.save()

  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()

  response.status(201).json(createdBlog)
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const { user, title, url, author, likes } = request.body
  
  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,  { user, title, url, author, likes }, { new: true })

  response.json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const user = request.user

  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString() )

  await user.save()
  await blog.remove()
  
  response.status(204).end()
})

module.exports = blogsRouter