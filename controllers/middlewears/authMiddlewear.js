const jwt = require("jsonwebtoken")

module.exports.authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt
        
        jwt.verify(token, process.env.SECRET_KEY)
        next()
    }
    catch(err) {
        res.redirect(`/login?route=${req.url}`)
    }
}