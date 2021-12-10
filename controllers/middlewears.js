const jwt = require('jsonwebtoken')

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

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.SECRET_KEY)
            resolve()
        }
        catch(err) {
            reject('Invalid token')
        }
    })
}
module.exports.verifyToken = verifyToken