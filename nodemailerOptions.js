const ejs = require('ejs')
const fs = require('fs')
const appData = require('./appData')

module.exports = (receiver, token, emailType) => {
    const { templatePath, subject } = appData.emailTypes[emailType]

    const template = fs.readFileSync(`./views/emails/${templatePath}`).toString()
    const mailContent = ejs.render(template, { token })

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
            to: receiver,
            subject: subject,
            html: mailContent
        }
    }
}
