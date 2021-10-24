const express = require('express')
const router = new express.Router()
const errorController = require('../controllers/errorController')

router.get('/error', errorController.error_get)
router.get('/500', errorController.error_500_get)
router.get('/400', errorController.error_400_get)
router.use(errorController.error_404_get)

module.exports = router