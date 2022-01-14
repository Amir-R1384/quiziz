const { errorOptions } = require('../appData')
const User = require('../models/User')
const Quiz = require('../models/Quiz')
const { getUserId, comparePasswords } = require('./functions')

module.exports.settings_get = async (req, res) => {
    try {
        const path = req.path.replace('/', '')

        const userId = getUserId(req.cookies.jwt)
        const userInfo = await User.findById(userId)

        res.render('settings', {
            layout: 'layouts/dashboardLayout',
            title: `Settings | ${path}`,
            path,
            userInfo
        })
    } catch (err) {
        console.error(err)
        res.status(500).render('error', errorOptions[500])
    }
}

module.exports.profile_post = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)

        // Data validation
        const validInputs = new Set(['name', 'email', 'profileImageEncoded'])

        for (let input in req.body) {
            if (validInputs.has(input)) {
                validInputs.delete(input)
            } else {
                console.error('Invalid input paramter')
                return res.status(400).end()
            }
        }

        await User.findByIdAndUpdate(userId, req.body, { runValidators: true })

        res.status(200).end()
    } catch (err) {
        // If from mongoose
        if (err._message.toLowerCase().includes('validation failed')) {
            const errorObj = {
                inputs: {}
            }

            for (let key in err.errors) {
                const error = err.errors[key]
                errorObj.inputs[error.path] = error.message
            }

            return res.status(400).json(errorObj)
        }

        console.error(err)
        res.status(500).end()
    }
}

module.exports.account_post = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)

        // * For password changing
        const { oldPassword, newPassword, confirmPassword } = req.body

        if (oldPassword && newPassword && confirmPassword) {
            const { password: currentPassword, salt } = await User.findById(userId)
            const isSamePassword = comparePasswords(oldPassword, currentPassword, salt)

            if (!isSamePassword) {
                return res.status(401).json({ inputs: { oldPassword: 'Incorrect password' } })
            }
            if (newPassword !== confirmPassword) {
                return res
                    .status(401)
                    .json({ inputs: { confirmPassword: 'Does not match the new password' } })
            }

            // We use document.save() to run the pre('save') middlewear
            const user = await User.findById(userId)
            user.password = newPassword
            await user.save()
        }

        // * For stats
        const { showStats, showQuizzes } = req.body

        if (showStats === true || showStats === false) {
            // We don't check for showQuizzes because they get sent together

            await User.findByIdAndUpdate(userId, { showStats, showQuizzes })
        }

        res.status(200).end()
    } catch (err) {
        // If from mongoose
        if (err._message.includes('validation failed')) {
            const errorObj = {
                inputs: {}
            }

            for (let key in err.errors) {
                const error = err.errors[key]
                errorObj.inputs[error.path] = error.message
            }

            return res.status(400).json(errorObj)
        }

        console.error(err)
        res.status(500).end()
    }
}

module.exports.data_post = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)

        // * For reseting data
        const { resetData } = req.body
        if (resetData === true) {
            await deleteUserData(userId)
        }

        // * For deleting account
        const { deleteAccount } = req.body
        if (deleteAccount) {
            await deleteUserData(userId)
            await User.findByIdAndDelete(userId)

            // Removing user from the user's friends
            const friends = await User.find({
                friends: {
                    $all: [userId]
                }
            })
            for (let friend of friends) {
                const friends_of_friend = friend.friends
                friends_of_friend.splice(friends_of_friend.indexOf(userId), 1)

                await User.findByIdAndUpdate(friend._id, {
                    friends: friends_of_friend
                })
            }

            res.cookie('jwt', '', { maxAge: 1 }) // Logging out the user
        }

        res.status(200).end()
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}

async function deleteUserData(userId) {
    await User.findByIdAndUpdate(userId, {
        quizzesAttended: 0,
        quizzesMade: 0,
        overallScore: 'N/A'
    })

    await Quiz.deleteMany({ userId })
}
