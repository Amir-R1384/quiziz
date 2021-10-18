const mongoose = require('mongoose')
const Quiz = require('../models/Quiz')
const jwt = require('jsonwebtoken')
const { handleDatabaseErrors } = require('./functions')

const testQuiz = { 
    userId: new mongoose.Types.ObjectId('61452a75b94a70533b06c218'),
    title: 'test quiz2',
    isPublic: true,
    questions: [{
        type: 'true/no',
        title: 'What is 1+1 ?',
        answer: 1
    }],
    description: 'bla bla bla',
    keywords: ['hi', 'test']
}

module.exports.createQuiz_get = async (req, res) => {
    res.render('new', { title: 'New Quiz', layout: false })
}

module.exports.createQuiz_post = async (req, res) => {
    try {
        const data = req.body

        const { id } = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY)
        data.userId = new mongoose.Types.ObjectId(id)

        await Quiz.create(data)

        res.status(200).end()
    }
    catch(err) {
        handleDatabaseErrors(err, res)
    }
}

module.exports.editQuiz_get = async (req, res) => {

}

module.exports.editQuiz_post = async (req, res) => {

}

module.exports.playQuiz_get = async (req, res) => {

}

module.exports.deleteQuiz_delete = async (req, res) => {

}