const User = require('../models/User')
const Quiz = require('../models/Quiz')
const jwt = require('jsonwebtoken')
const { errorOptions } = require('../appData')

module.exports.dashboard_get = async (req, res) => {
    try {
        const token = req.cookies.jwt
        const { id: userId } = jwt.verify(token, process.env.SECRET_KEY)

        const profileInfo = await User.findById(userId)

        const quizzes = await Quiz.find({ userId })

        const friends = []
        for (let friendId of profileInfo.friends) {
            const { name } = await User.findById(friendId)

            friends.push({
                id: friendId,
                name
            })
        }

        res.render('dashboard', {
            layout: 'layouts/dashboardLayout',
            title: `Dashboard (${profileInfo.name})`,
            quizzes,
            profileInfo,
            friends
        })
    } catch (err) {
        console.error(err)
        res.status(500).render('error', errorOptions[500])
    }
}
