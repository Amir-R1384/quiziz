const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true
    },
    // There is a TTL index on 'createdAt' that expires the document after a certain amount of time
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Token = mongoose.model('token', TokenSchema)

module.exports = Token
