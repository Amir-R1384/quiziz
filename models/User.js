const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    email: {
        type: String,
        required: [true, 'The Email is required'],
        unique: [false, 'The Email has already been registered'],
        lowercase: true,
        validate: [isEmail, 'The Email is not a valid Email.']
    },
    password: {
        type: String,
        required: [true, 'The password is required'],
        minlength: [6, 'The password is too short']
    }
})

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 1)
    next()
})

const User = mongoose.model('user', userSchema)

module.exports = User