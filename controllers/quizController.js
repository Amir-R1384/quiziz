const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Quiz = require('../models/Quiz')
const User = require('../models/User')
const { handleDatabaseErrors, getUserId } = require('./functions')

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
    try {

        const { id:quizId } = req.params

        const ObjectId = mongoose.Types.ObjectId

        if (!ObjectId.isValid(quizId) || !await Quiz.exists({ _id: quizId })) {
            return res.status(400).redirect('/400')
        }

        const quiz = await Quiz.findById(quizId)

        const { name:creatorName } = await User.findById(quiz.userId)
    
        res.render('play', {
            layout: false,
            title: 'Play Quiz',
            quiz,
            creatorName
        })

    } catch (err) {
        console.error(err)
        res.status(500).redirect('/500')
    }
}

module.exports.submitQuiz_post = async (req, res) => {
    try {

        const answers = req.body
        const { id:quizId } = req.params

        const { questions } = await Quiz.findById(quizId)

        const questionsNum = questions.length
        let mistakes = 0
        
        questions.forEach((question, i) => {
            const answer = answers[i]

            if (answer === null || question.answer !== answer) {
                mistakes++
            }
        })

        const scorePercentage = Math.round((questionsNum-mistakes) * 100 / questionsNum)
        

        const userId = getUserId(req.cookies.jwt)
        const user = await User.findById(userId)
        
        let { quizzesAttended, overallScore } = user

        if (overallScore === 'N/A') overallScore = 0
        quizzesAttended++

        overallScore = Math.round((overallScore*(quizzesAttended-1) + scorePercentage) / quizzesAttended)

        // await User.findByIdAndUpdate(userId, { quizzesAttended, overallScore }, { runValidators: true })

        res.status(200).json({score: scorePercentage})

    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
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

module.exports.rate_post = async (req, res) => {
    try {
        const quizId = req.params.id
        if (!quizId) return res.status(400).end()

        const { rating:newRating } = req.body

        const quiz = await Quiz.findById(quizId)
        let { rating:oldRating, ratingNum } = quiz

        ratingNum++
        const finalRating = Math.round((oldRating * (ratingNum - 1) + newRating) / ratingNum)
        
        await Quiz.findByIdAndUpdate(quizId, {
            rating: finalRating,
            ratingNum
        })

        res.status(200).end()
        
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}