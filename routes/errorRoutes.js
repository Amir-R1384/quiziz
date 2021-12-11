// It's only for fetching purposes from javascript and not from the browser

const express = require('express')
const router = new express.Router()

const errorController = require('../controllers/errorController')

router.get('/400', errorController.error_400)
router.get('/500', errorController.error_500)
router.get('/404', errorController.error_404)
router.get('/error', errorController.error_default)

module.exports = router