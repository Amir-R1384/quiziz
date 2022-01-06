const express = require('express')
const router = new express.Router()
const { isUserBanned } = require('../controllers/middlewears')
const profileController = require('../controllers/profileController')

router.use(isUserBanned)

router.get('/:id', profileController.profile_get)

module.exports = router
