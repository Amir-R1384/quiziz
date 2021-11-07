module.exports.error_get = (req, res) => {
    res.render('error', {layout: 'layouts/blankLayout', title: 'Error', errorMessage: 'UNCAUGHT ERROR'})
}

module.exports.error_500_get = (req, res) => {
    res.render('error', {layout: 'layouts/blankLayout', title: '500 Error', errorMessage: '500 INTERNAL SERVER ERROR'})
}

module.exports.error_400_get = (req, res) => {
    res.render('error', {layout: 'layouts/blankLayout', title: '400 Error', errorMessage: '400 BAD REQUEST'})
}

module.exports.error_404_get = (req, res) => {
    res.render('error', {layout: 'layouts/blankLayout', title: 'Page not found', errorMessage: '404 PAGE NOT FOUND'})
}