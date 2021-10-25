const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Quiz = require('../models/Quiz')
const User = require('../models/User')
const { handleDatabaseErrors } = require('./functions')

module.exports.createQuiz_get = async (req, res) => {
    res.render('new', { title: 'New Quiz', layout: false })
}

module.exports.createQuiz_post = async (req, res) => {
    try {
        const data = req.body

        const { id } = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY)
        data.userId = new mongoose.Types.ObjectId(id)

        await Quiz.create(data)

        const user = await User.findById(id)
        const quizzesMade = user.quizzesMade
        await User.findByIdAndUpdate(id, { quizzesMade: quizzesMade+1 })

        res.status(200).end()
    }
    catch(err) {
        handleDatabaseErrors(err, res)
    }
}

module.exports.editQuiz_get = async (req, res) => {
    const quizId = req.params.id
    const quiz = await Quiz.findById(quizId)
    
    res.render('new', { layout: false, title: 'Edit Quiz', editMode: true, quiz })
}

module.exports.editQuiz_post = async (req, res) => {
    try {
        const quizId = req.params.id

        const data = req.body

        const { id:userId } = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY)
        data.userId = new mongoose.Types.ObjectId(userId)

        await Quiz.findByIdAndUpdate(quizId, {...data})

        res.status(200).end()
    }
    catch(err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.playQuiz_get = async (req, res) => {

}

module.exports.deleteQuiz_delete = async (req, res) => {
    try {
        const quizId = req.params.id
        if (!quizId) return res.status(400).end()

        await Quiz.findByIdAndDelete(quizId)

        const { id } = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY)
        const user = await User.findById(id)
        const quizzesMade = user.quizzesMade
        await User.findByIdAndUpdate(id, { quizzesMade: quizzesMade-1 })

        res.status(200).end()
        
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}