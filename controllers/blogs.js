const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const decryptedToken = request.user
    if (!decryptedToken || !decryptedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    blog.user = decryptedToken.id
    const result = await blog.save()
    const user = await User.findById(decryptedToken.id)
    user.blogs = user.blogs.concat(result.id)
    await User.findByIdAndUpdate(user.id, user, { new: true })
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    console.log(blog)
    console.log(blog.user.toString())
    if (!request.user || !request.user.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    if (request.user.id !== blog.user.toString()) {
        return response.status(401).json({ error: 'user not allowed to delete that blog post' })
    }
    await Blog.findByIdAndDelete(blog.id)
    response.status(204).end()
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