const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports.dashboard_get = async (req, res) => {
    try {
        const token = req.cookies.jwt
        const { id } = jwt.verify(token, process.env.SECRET_KEY)

        const { name } = await User.findById(id)

        res.render('dashboard', {layout: false, profileName: name, title: `Dashboard (${name})`})
    }

    catch(err) {
        console.error(err)
        res.status(500).end()
    }
}