const mongoose = require('mongoose')
const { isEmail } = require('validator')
const {
    validateBase64,
    hash,
    validateForBadWords,
    generateSalt
} = require('../controllers/functions')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
        validate: [validateForBadWords, 'The name contains bad words'],
        maxlength: [20, 'The maximum length of characters is 20.']
    },
    email: {
        type: String,
        required: [true, 'The Email is required'],
        unique: [true, 'The Email has already been registered'],
        lowercase: true,
        validate: [isEmail, 'The Email is not a valid Email.']
    },
    password: {
        type: String,
        required: [true, 'The password is required'],
        minlength: [6, 'The password is too short'],
        maxlength: [50, 'The maximum length of characters is 50.']
    },
    salt: String,
    isEmailConfirmed: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    profileImageEncoded: {
        type: String,
        default: '/assets/images/defaultProfileImage.jpg',
        validate: [validateBase64, 'The profile image is not valid']
    },
    showStats: Boolean,
    showQuizzes: Boolean,
    quizzesAttended: {
        type: Number,
        default: 0,
        min: 0
    },
    quizzesMade: {
        type: Number,
        default: 0,
        min: 0
    },
    overallScore: {
        type: String,
        default: 'N/A'
    },
    friends: [],
    friendRequests: [],
    sharedQuizzes: []
})

userSchema.pre('save', async function (next) {
    this.salt = generateSalt()
    this.password = hash(this.password, this.salt)
    next()
})

const User = mongoose.model('user', userSchema)

module.exports = User
