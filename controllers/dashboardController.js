const User = require('../models/User')
const Quiz = require('../models/Quiz')
const jwt = require('jsonwebtoken')

module.exports.dashboard_get = async (req, res) => {
    try {
        const token = req.cookies.jwt
        const { id: userId } = jwt.verify(token, process.env.SECRET_KEY)

        const { name, quizzesAttended, quizzesMade, overallScore } = await User.findById(userId)

        const quizzes = await Quiz.find({ userId })

        res.render('dashboard', {
            layout: false, 
            profileName: name, 
            title: `Dashboard (${name})`, 
            quizzes,
            quizzesAttended,
            quizzesMade,
            overallScore 
        })
    }

    catch(err) {
        console.error(err)
        res.status(500).redirect('/500')
    }
}