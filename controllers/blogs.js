const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '') 
    }  
    return null
}

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) { 
        return response.status(401).json({ error: 'token invalid' })  
    }  
    const user = await User.findById(decodedToken.id)
    blog.user = user.id
    const result = await blog.save()
    user.blogs = user.blogs.concat(result.id)
    await User.findByIdAndUpdate(user.id, user, { new: true })
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }

})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
        if (!updatedBlog) {
            response.status(400)
        }
        response.json(updatedBlog)
    } catch (exception) {
        next(exception)
    }
})
module.exports = blogsRouter