const express = require('express')
const router = new express.Router()
const profileController = require('../controllers/profileController')

router.get('/:id', profileController.profile_get)

module.exports = router
