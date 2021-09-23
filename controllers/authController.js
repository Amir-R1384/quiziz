const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.signup_get = (req, res) => {
    res.render('signup', {layout: 'layouts/blankLayout'})
}
module.exports.login_get = (req, res) => {
    res.render('login', {layout: 'layouts/blankLayout'})
}

module.exports.signup_post = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const user = await User.create({ name, email, password })

        const jwt = createJwt({id: user._id})

        sendJwt(jwt, res)

        res.status(200).end()
    }
    catch(err) {
        handleDatabaseErrors(err, res)
    }
}


module.exports.login_post = async (req, res) => {
    const { email, password } = req.body

    if (/^\s*$/.test(email)) return res.status(400).json({errors: {email: 'The Email is required'}})

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({errors: {email: 'This Email does not exist'}})

    const savedPassword = user.password
    const match = await bcrypt.compare(password, savedPassword)

    if (match) {
        const jwt = createJwt({id: user._id})
        sendJwt(jwt, res)

        res.status(200)

        const refererRoute = req.headers?.referer?.match(/(?<=\?route=)[^&]+/)

        if (refererRoute?.length) {
            res.json({route : refererRoute[0]})
        } else {
            res.json({route: '/'})
        }

    } else {
        res.status(400).json({errors: {password: 'The password is incorrect'}})
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }).redirect('/')
}

function handleDatabaseErrors(err, res) {
    const errors = {}
    
    // Unique email check
    if (err.code === 11000) {
        errors.email = 'The email has already been regiestered'
        return res.status(400).json({ errors })
    }

    for (let field in err.errors) {
        errors[field] = err.errors[field].properties.message
    }
    res.status(400).json({ errors })
}

function createJwt (payload) {
    const secretKey = process.env.SECRET_KEY
    return jwt.sign(payload, secretKey)
}

function sendJwt (jwt, res) {
    res.cookie('jwt', jwt, {
        httpOnly: true,
        secure: process.env.IS_COOKIE_SECURE === 'true'
    })
}