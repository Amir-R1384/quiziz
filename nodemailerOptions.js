const ejs = require('ejs')
const fs = require('fs')

module.exports = (receiverEmail, passResetId) => {
    const template = fs.readFileSync('./views/changePassword.email.ejs').toString()
    const mailContent = ejs.render(template, { passResetId })

    return {
        transport: {
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        },

        emailOptions: {
            from: process.env.MAIL_USER,
            to: receiverEmail,
            subject: 'Password Reset Instructions',
            html: mailContent
        }
    }
}
