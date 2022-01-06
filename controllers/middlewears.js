const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { getUserId } = require('./functions')
const { infos } = require('../appData')

module.exports.authenticate = async (req, res, next) => {
    verifyToken(req.cookies.jwt)
        .then(() => next())
        .catch(() => res.redirect(`/login?route=${req.originalUrl}`))
}

module.exports.checkUser = (req, res, next) => {
    verifyToken(req.cookies.jwt)
        .then(() => res.redirect('/dashboard'))
        .catch(() => next())
}

module.exports.isUserConfirmed = async (req, res, next) => {
    const userId = getUserId(req.cookies.jwt)

    const { isEmailConfirmed } = await User.findById(userId)

    if (isEmailConfirmed) {
        next()
    } else {
        res.redirect('/dashboard?emailNotice=true')
    }
}

module.exports.isUserBanned = async (req, res, next) => {
    const userId = getUserId(req.cookies.jwt)
    const { isBanned } = await User.findById(userId)

    if (isBanned) {
        res.status(403).render('info', { message: infos.banned, layout: 'layouts/blankLayout.ejs' })
    } else {
        next()
    }
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.SECRET_KEY)
            resolve()
        } catch (err) {
            reject('Invalid token')
        }
    })
}
module.exports.verifyToken = verifyToken
