const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app