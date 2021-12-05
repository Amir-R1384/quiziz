const User = require('../models/User')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const getMailOptions = require('../nodemailerOptions')
const { comparePasswords } = require('./functions')

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
    const salt = user.salt
    const match = comparePasswords(password, savedPassword, salt)

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

module.exports.forgotPassword_get = (req, res) => {
    res.render('forgotPassword', {
        layout: 'layouts/blankLayout'
    })
}

module.exports.forgotPassword_post = async (req, res) => {
    try {
    
        const { email } = req.body

        if (!await User.exists({ email })) {
            return res.status(400).json({
                inputs: {
                    email: 'There is not user with this email.'
                }
            })
        }

        await sendEmail(email)

        res.status(200).end()

    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.changePassword_get = (req, res) => {
    res.render('changePassword', {
        title: 'Reset password',
        layout: 'layouts/blankLayout'
    })
}

module.exports.changePassword_post = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!await User.exists({ email })) {
            return res.status(400).end()
        }
    
        const user = await User.findOne({ email })
        user.password = password
        await user.save()
    
        res.status(200).end()
        
    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
   
}

async function sendEmail(reciever) {

    const mailOptions = getMailOptions(reciever)
    const { transport, emailOptions } = mailOptions

    const transporter = nodemailer.createTransport(transport)
    await transporter.sendMail(emailOptions)
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