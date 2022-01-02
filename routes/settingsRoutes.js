const express = require('express')
const router = new express.Router()

const settingsController = require('../controllers/settingsController')
const { authenticate } = require('../controllers/middlewears')

router.use(authenticate)

const settingsPaths = ['/profile', '/account', '/data']
router.get('/', (req, res) => res.redirect(`/settings${settingsPaths[0]}`))
router.get(settingsPaths, settingsController.settings_get)

router.post('/profile', settingsController.profile_post)
router.post('/account', settingsController.account_post)
router.post('/data', settingsController.data_post)

module.exports = router
