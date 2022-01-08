const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')
const appData = require('../appData')
const { validateBase64, validateForBadWords } = require('../controllers/functions')

async function validateUserId(id) {
    return await User.exists(id)
}

function validateQuestionType(type) {
    const validQuestionTypes = new Set(appData.questionTypes)
    return validQuestionTypes.has(type)
}

function validateRating(rating) {
    return [0, 1, 2, 3, 4, 5].indexOf(rating) !== -1
}

function validateRatingNum(ratingNum) {
    return ratingNum.isInteger
}

const quizSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title, is required'],
        validate: [validateForBadWords, 'title, contains bad words'],
        maxlength: [100, 'title, is too long.']
    },
    description: {
        type: String,
        required: [true, 'description, is required'],
        validate: [validateForBadWords, 'description, contains bad words'],
        maxlength: [200, 'description, is too long.']
    },
    imageEncoded: {
        type: String,
        validate: [validateBase64, 'image, is not a valid type']
    },
    keywords: [
        {
            type: String,
            required: [true, 'keywords, are required'],
            validate: [validateForBadWords, 'keyword, contains bad words'],
            maxlength: [20, 'keyword, is too long.']
        }
    ],
    isPublic: {
        type: Boolean,
        required: [true, 'visibility, is required']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'userId, is required'],
        validate: [validateUserId, 'userId, invalid']
    },
    rating: {
        type: Number,
        default: 0,
        validate: [validateRating, 'rating, is invalid']
    },
    ratingNum: {
        type: Number,
        default: 0,
        validate: [validateRatingNum, 'number of rates, is not valid']
    },
    questions: [
        {
            type: {
                type: String,
                required: [true, 'question type, is required'],
                validate: [validateQuestionType, 'question type, is invalid']
            },
            title: {
                type: String,
                required: [true, 'question title, is required'],
                validate: [validateForBadWords, 'question title, contains bad words'],
                maxlength: [150, 'title, is too long.']
            },
            answer: {
                type: Schema.Types.Mixed,
                required: [true, 'question answer, is required'],
                validate: [validateForBadWords, 'question answer, contains bad words']
            },
            choices: [
                {
                    type: String,
                    required: false,
                    validate: [validateForBadWords, 'choices, contain bad words.']
                }
            ]
        }
    ]
})

quizSchema.pre('validate', function (next) {
    if (!this.questions.length) throw { customError: { questions: 'are not enough' } }
    next()
})

const Quiz = mongoose.model('quiz', quizSchema)

module.exports = Quiz
