const layout = 'layouts/blankLayout'

module.exports = {
    questionTypes: ['true/false', 'multiple-choice'],

    errorOptions: {
        default: {
            layout,
            title: 'Error',
            errorMessage: 'UNCAUGHT ERROR'
        },
        400: {
            layout,
            title: '400 Error',
            errorMessage: '400 BAD REQUEST'
        },
        500: {
            layout,
            title: '500 Error',
            errorMessage: '500 INTERNAL SERVER ERROR'
        },
        404: {
            layout,
            title: 'Page not found',
            errorMessage: '404 PAGE NOT FOUND'
        },
        403: {
            layout,
            title: 'Forbidden',
            errorMessage: '403 FORBIDDEN'
        },
        401: {
            layout,
            title: 'Unauthorized',
            errorMessage: '401 UNAUTHORIZED'
        }
    },

    emailTypes: {
        changePassword: {
            templatePath: 'changePassword.email.ejs',
            subject: 'Password Reset Instructions'
        },

        confirmEmail: {
            templatePath: 'confirmEmail.email.ejs',
            subject: 'Confirm Your Email'
        },

        report: {
            templatePath: 'report.email.ejs',
            subject: 'New report'
        }
    },

    infos: {
        emailConfirm: 'Your email has been confirmed :)',
        reportSuccess: "Your report has been sent. We'll take care of it soon.",
        banned: 'You are banned from Quiziz.'
    }
}
