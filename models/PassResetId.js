const mongoose = require('mongoose')

const PassResetIdSchema = new mongoose.Schema({
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

const PassResetId = mongoose.model('password reset id', PassResetIdSchema)

module.exports = PassResetId
