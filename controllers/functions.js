const isBase64 = require('is-base64')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports.handleDatabaseErrors = (err, res) => {
    try {
        const finalErrors = {}

        if (err.code != undefined) {

            const property = Object.keys(err.keyValue)[0]
            
            switch(err.code) {

            case 11000: {
                finalErrors[property] = 'not unique'
                break
            }
            }

            return res.status(400).json(finalErrors)
        }

        if (err.customError) { 
            const property = Object.keys(err.customError)[0]
            const value = err.customError[property]
            finalErrors[property] = value
        }

        for (let key in err.errors) {
            const error = err.errors[key]

            const property = error.properties.message.match(/[^,]+(?=,)/)?.reduce((a, b) => b, null) // Matches the property in the database that isn't correct
            const reason = error.properties.message.match(/(?<=,\s).+/)?.reduce((a, b) => b, null) // Matches the reason the database property isn't correct

            if (!property || !reason) 
                throw new Error('Error while finding the property or the cause of database error when creating a new quiz')

            finalErrors[property] = reason       
        }

        res.status(400).json(finalErrors)

    } catch(err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.validateBase64 = string => {
    // The /assets... string comes from the path to the deault profile picture in the images folder
    if (string == null || string === '/assets/images/defaultProfileImage.jpg') return true
    return isBase64(string, { mimeRequired: true, allowEmpty: false })
}

module.exports.getUserId = token => {
    return jwt.verify(token, process.env.SECRET_KEY).id
}

module.exports.hash = async (data) => {
    return await bcrypt.hash(data, 1)
}