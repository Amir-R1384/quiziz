const layout = 'layouts/blankLayout'

module.exports = {
    questionTypes: ['true/false'],

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
    }
}
