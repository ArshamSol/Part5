const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs= await Blog
    .find({}).populate('user')
    
    response.json(blogs)
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  
  if (authorization && authorization.startsWith('bearer ')) {
    return authorization.replace('bearer ', '')
  }
  return null
}

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  //console.log(request.body.userId)
  try {
    const token = getTokenFrom(request)
    //console.log(token)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    //const user = await User.findById(request.body.userId)
    //console.log(user)
    blog.user = user.id
    
    const savedBLog = await blog.save()
    
    user.blogs = user.blogs.concat(savedBLog._id)
    await user.save()
    //savedBLog = await Blog.findById(blog.id).populate('user')
    console.log(savedBLog.user)
    response.status(201).json(savedBLog)
  } catch (error) {
    if (error.name ===  'JsonWebTokenError') {
      return response.status(401).json({ error: error.message })
    }
  }
 
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  //console.log(body.user)

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user.id
  }

  try {
    updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user')
    response.json(updatedNote)
    //console.log(updatedNote)
  } catch (error) {
    next(error)
  }
})


module.exports = blogsRouter