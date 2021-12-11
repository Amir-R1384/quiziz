const mongoose = require('mongoose')
const { errorOptions } = require('../appData')
const Quiz = require('../models/Quiz')
const User = require('../models/User')
const { verifyToken } = require('./middlewears')

module.exports.profile_get = async (req, res) => {
    try {
        // Setting the correct layout based on whether the user is logged in or not
        let layout = undefined
        verifyToken(req.cookies.jwt)
            .then(() => layout = 'layouts/dashboardLayout.ejs')

        const { id:userId } = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).render('error', errorOptions[404])
        }

        const profileInfo = await User.findById(userId)
        const quizzes = await Quiz.find({ userId })

        res.render('profile', {
            profileInfo,
            quizzes,
            layout
        })
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}