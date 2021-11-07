const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')
const Filter = require('bad-words')
const appData = require('../appData.json')
const { validateBase64 } = require('../controllers/functions')

const filter = new Filter()

async function validateUserId(id) {
    return await User.exists(id)
}

function validateQuestionType(type) {
    const validQuestionTypes = new Set(appData.questionTypes)
    return validQuestionTypes.has(type)
}

function validateForBadWords(type) {
    return !filter.isProfane(type)
}

const quizSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title, is required'],
        validate: [validateForBadWords, 'title, contains bad words']
    },
    description: {
        type: String,
        required: [true, 'description, is required'],
        validate: [validateForBadWords, 'description, contains bad words']
    },
    imageEncoded: {
        type: String,
        validate: [validateBase64, 'image, is not a valid type']
    },
    keywords: [{
        type: String,
        required: [true, 'keywords, are required'],
        validate: [validateForBadWords, 'keyword, contains bad words']
    }],
    isPublic: {
        type: Boolean,
        required: [true, 'visibility, is required']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'userId, is required'],
        validate: [validateUserId, 'userId, invalid']
    },
    questions : [{
        type: {
            type: String,
            required: [true, 'question type, is required'],
            validate: [validateQuestionType, 'question type, is invalid']
        },
        title: {
            type: String,
            required: [true, 'question title, is required'],
            validate: [validateForBadWords, 'question title, contains bad words']
        },
        answer: {
            type: Schema.Types.Mixed,
            required: [true, 'question answer, is required'],
            validate: [validateForBadWords, 'question answer, contains bad words']
        }
    }]
})

quizSchema.pre('validate', function (next) {
    if (!this.questions.length) throw ({customError: {questions: 'are not enough'}})
    next()
})

const Quiz = mongoose.model('quiz', quizSchema)

module.exports = Quiz