const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
    username: {    
        type: String,
        required: true,
        unique: true,
        minLength: 3
    }, 
    name: String,
    password: {
        type:String,
        required:true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)