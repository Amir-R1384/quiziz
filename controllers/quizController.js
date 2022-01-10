const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Quiz = require('../models/Quiz')
const User = require('../models/User')
const { handleDatabaseErrors, getUserId, sendEmail } = require('./functions')
const { errorOptions, infos } = require('../appData')

module.exports.attendQuiz_get = async (req, res) => {
    const userId = getUserId(req.cookies.jwt)

    const { loc, rating, search, loading, sharedWithMe } = req.query

    const loadedIdsStringified = req.cookies.loadedIds
    const loadedIds =
        loadedIdsStringified && loading === 'true' ? JSON.parse(loadedIdsStringified) : []

    try {
        // * Making the query object
        const query = {
            isPublic: true,
            _id: {
                $nin: loadedIds
            }
        }
        if (rating !== 'default' && rating != undefined) {
            query.rating = rating
        }
        if (sharedWithMe == 'true') {
            const { sharedQuizzes } = await User.findById(userId)
            query._id['$in'] = sharedQuizzes
            delete query.isPublic
        }
        if (search) {
            const searchRegex = new RegExp(search, 'i')

            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { keywords: searchRegex }
            ]

            if (mongoose.Types.ObjectId.isValid(search)) {
                query.$or.push({
                    _id: search
                })
            }
        }

        const quizzes = await Quiz.find(query, null, { limit: 20 })

        // * Keeping track of the loaded documents
        quizzes.forEach(quiz => {
            loadedIds.push(quiz._id)
        })
        res.cookie('loadedIds', JSON.stringify(loadedIds), {
            secure: process.env.IS_COOKIE_SECURE === 'true'
        })

        if (loc === 'js') {
            return res.json(quizzes)
        }

        res.render('attend', {
            title: "Let's play a quiz",
            layout: 'layouts/dashboardLayout',
            quizzes
        })
    } catch (err) {
        console.error(err)
        if (loc === 'js') {
            return res.sttaus(500).end()
        }
        res.status(500).render('error', errorOptions[500])
    }
}

module.exports.createQuiz_get = async (req, res) => {
    res.render('new', { title: 'New Quiz', layout: false })
}

module.exports.createQuiz_post = async (req, res) => {
    try {
        const data = req.body
        const userId = getUserId(req.cookies.jwt)

        data.userId = new mongoose.Types.ObjectId(userId)
        await Quiz.create(data)

        const { quizzesMade } = await User.findById(userId)
        await User.findByIdAndUpdate(userId, { quizzesMade: quizzesMade + 1 })

        res.status(200).end()
    } catch (err) {
        handleDatabaseErrors(err, res)
    }
}

module.exports.editQuiz_get = async (req, res) => {
    const quizId = req.params.id
    const quiz = await Quiz.findById(quizId)

    res.render('new', {
        layout: false,
        title: 'Edit Quiz',
        editMode: true,
        quiz
    })
}

module.exports.editQuiz_post = async (req, res) => {
    try {
        const quizId = req.params.id

        const data = req.body

        const { id: userId } = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY)
        data.userId = new mongoose.Types.ObjectId(userId)

        await Quiz.findByIdAndUpdate(quizId, { ...data })

        res.status(200).end()
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.playQuiz_get = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)
        const { id: quizId } = req.params

        const ObjectId = mongoose.Types.ObjectId

        if (!ObjectId.isValid(quizId) || !(await Quiz.exists({ _id: quizId }))) {
            return res.status(400).render('error', errorOptions[400])
        }

        const quiz = await Quiz.findById(quizId)

        if (quiz.isPublic === false && quiz.userId.toString() !== userId) {
            const { sharedQuizzes } = await User.findById(userId)

            if (sharedQuizzes.indexOf(quizId) === -1) {
                return res.status(400).render('error', errorOptions[403])
            }
        }

        const { name: creatorName } = await User.findById(quiz.userId)

        res.render('play', {
            layout: false,
            title: 'Play Quiz',
            quiz,
            creatorName
        })
    } catch (err) {
        console.error(err)
        res.status(500).render('error', errorOptions[500])
    }
}

module.exports.submitQuiz_post = async (req, res) => {
    try {
        const answers = req.body
        const { id: quizId } = req.params

        const { questions } = await Quiz.findById(quizId)

        const questionsNum = questions.length
        let mistakes = 0

        questions.forEach((question, i) => {
            const answer = answers[i]

            if (answer === null || question.answer !== answer) {
                mistakes++
            }
        })

        const scorePercentage = Math.round(((questionsNum - mistakes) * 100) / questionsNum)

        const userId = getUserId(req.cookies.jwt)
        const user = await User.findById(userId)

        let { quizzesAttended, overallScore } = user

        if (overallScore === 'N/A') overallScore = 0
        quizzesAttended++

        overallScore = Math.round(
            (overallScore * (quizzesAttended - 1) + scorePercentage) / quizzesAttended
        )

        await User.findByIdAndUpdate(
            userId,
            { quizzesAttended, overallScore },
            { runValidators: true }
        )

        res.status(200).json({ score: scorePercentage })
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
        await User.findByIdAndUpdate(id, { quizzesMade: quizzesMade - 1 })

        res.status(200).end()
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.reportQuiz_get = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)
        const { id: quizId } = req.params

        const user = await User.findById(userId)
        const quiz = await Quiz.findById(quizId)

        const receiver = process.env.ADMIN_MAIL

        await sendEmail(receiver, 'report', { user, quiz })

        res.render('info', { message: infos.reportSuccess, layout: 'layouts/blankLayout.ejs' })
    } catch (err) {
        console.error(err)
        res.status(500).render('error', errorOptions[500])
    }
}

module.exports.rate_post = async (req, res) => {
    try {
        const quizId = req.params.id
        if (!quizId) return res.status(400).end()

        const { rating: newRating } = req.body

        const quiz = await Quiz.findById(quizId)
        let { rating: oldRating, ratingNum } = quiz

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

module.exports.shareQuiz_post = async (req, res) => {
    try {
        const { quizId, receiverIds } = req.body
        const userId = getUserId(req.cookies.jwt)

        for (let receiverId of receiverIds) {
            // Checking if they're friend
            const { friends: receiverFriends, sharedQuizzes } = await User.findById(receiverId)
            if (receiverFriends.indexOf(userId) === -1) continue

            // Adding to sharedQuizzes if doesn't already exists
            if (sharedQuizzes.indexOf(quizId) === -1) {
                sharedQuizzes.push(quizId)
            }

            await User.findByIdAndUpdate(receiverId, { sharedQuizzes })
        }

        res.status(200).end()
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.removeSharedQuiz_delete = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)
        const { quizId } = req.body

        const { sharedQuizzes } = await User.findById(userId)
        sharedQuizzes.splice(quizId, 1)
        await User.findByIdAndUpdate(userId, { sharedQuizzes })

        res.status(200).end()
    } catch (err) {
        console.error(err)
        res.sttaus(500).end()
    }
}
