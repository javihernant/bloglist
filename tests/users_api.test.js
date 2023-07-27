const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const initialUsers = [
    {
        username: 'javi',
        name: 'Javier',
        password: 'olaadios' 
    },
    {
        username: 'ppgrillo',
        name: 'Pepe',
        password: 'saltasalta' 
    },
    {
        username: 'joe',
        name: 'Joe Vandicamp',
        password: 'ilikepies' 
    },

]

describe('create new user (db contains 3 users)', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const salt = 10
        for (const user of initialUsers) {
            const newUser = User(user)
            newUser.password = await bcrypt.hash(user.password, salt)
            await newUser.save()
        }
    })

    test('a valid user', async () => {
        
        const newUser = {
            username: 'chris',
            name: 'Christina',
            password: 'wafflesaremypassion'
        }
        
        const resp = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
    })

    test('invalid user (password length < 3)', async () => {
        
        const newUser = {
            username: 'chris',
            name: 'Christina',
            password: 'wa'
        }
        
        const resp = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(resp.body.error).toContain('password not valid')
        
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})