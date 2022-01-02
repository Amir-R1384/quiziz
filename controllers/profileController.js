const mongoose = require('mongoose')
const { errorOptions } = require('../appData')
const Quiz = require('../models/Quiz')
const User = require('../models/User')
const { verifyToken } = require('./middlewears')
const { getUserId } = require('./functions')

module.exports.profile_get = async (req, res) => {
    try {
        // Setting the correct layout based on whether the user is logged in or not
        let layout = undefined
        verifyToken(req.cookies.jwt).then(() => (layout = 'layouts/dashboardLayout.ejs'))

        const { id: profileId } = req.params
        if (!mongoose.Types.ObjectId.isValid(profileId)) {
            return res.status(404).render('error', errorOptions[404])
        }

        let quizzes = []
        const profileInfo = await User.findById(profileId)

        if (layout) {
            // If logged in

            const userId = getUserId(req.cookies.jwt)
            const { sharedQuizzes } = await User.findById(userId)

            quizzes = await Quiz.find({
                userId: profileId,
                $or: [
                    // If the quiz is public or is shared with the user
                    { _id: { $in: sharedQuizzes } },
                    { isPublic: true }
                ]
            })
        } else {
            quizzes = await Quiz.find({
                userId: profileId,
                isPublic: true
            })
        }

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
