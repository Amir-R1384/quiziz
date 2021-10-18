const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')
const Filter = require('bad-words')
const isBase64 = require('is-base64')
const appData = require('../appData.json')

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

function validateBase64(string) {
    return isBase64(string, { mimeRequired: true, allowEmpty: false })
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
        validate: [validateBase64, 'image, not base64']
    },
    keywords: [{
        type: String,
        required: [true, 'keyword, is required'],
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
            validate: [validateQuestionType, 'question type, invalid']
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
    if (!this.questions.length) throw new mongoose.Error('questions, not enough')
    next()
})

const Quiz = mongoose.model('quiz', quizSchema)

module.exports = Quiz