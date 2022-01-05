// It's only for fetching purposes from javascript and not from the browser

const { errorOptions } = require('../appData')

module.exports.error_400 = (req, res) => {
    res.render('error', errorOptions[400])
}

module.exports.error_500 = (req, res) => {
    res.render('error', errorOptions[500])
}

module.exports.error_404 = (req, res) => {
    res.render('error', errorOptions[404])
}

module.exports.error_403 = (req, res) => {
    res.render('error', errorOptions[403])
}

module.exports.error_401 = (req, res) => {
    res.render('error', errorOptions[401])
}

module.exports.error_default = (req, res) => {
    res.render('error', errorOptions.default)
}
