const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../models/blog')
const mongoose = require('mongoose')

const initialBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    const promises = initialBlogs.map(b => Blog(b).save())
    await Promise.all(promises)
})

test('get list of all the blogs', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('to be id the unique identifier', async () => {
    const response = await api
        .get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
})

test('add (POST) a new blog', async () => {
    const newBlog = {
        title: 'Star Wars Fan Blog',
        author: 'Lucasart',
        url: 'http://starwars.com',
        likes: 142,
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogs = await api.get('/api/blogs')
    const titles = blogs.body.map((blog) => blog.title)
    expect(blogs.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain('Star Wars Fan Blog')
})

test('if no likes property, default to 0', async () => {
    const newBlog = {
        title: 'Star Wars Fan Blog',
        author: 'Lucasart',
        url: 'http://starwars.com',
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toBe(0)
})

test('if no url or title, send 400', async () => {
    const newBlog = {
        author: 'Lucasart',
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('delete a blog post', async () => {
    const response = await api.get('/api/blogs')
    await api
        .delete(`/api/blogs/${response.body[0].id}`)
    const newResponse = await api.get('/api/blogs')

    expect(newResponse.body).toHaveLength(initialBlogs.length - 1)
})

test('update blogpost', async () => {
    const response = await api.get('/api/blogs')
    const updatedBlog = response.body[0]
    updatedBlog.likes = 99
    const updateResponse = await api
        .put(`/api/blogs/${response.body[0].id}`)
        .send(updatedBlog)

    expect(updateResponse.body.likes).toBe(99)
})

test('update a nonexistant blogpost', async () => {
    const dummyBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
    }
    const response = await api.post('/api/blogs').send(dummyBlog)
    const badId = response.body.id
    await api.delete(`/api/blogs/${badId}`)
    const updateResponse = await api
        .put(`/api/blogs/${badId}`)
        .send(dummyBlog)
        .expect(400)
})


afterAll(async () => {
    await mongoose.connection.close()
})