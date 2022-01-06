const express = require('express')
const router = new express.Router()

const friendsController = require('../controllers/friendsController')
const { authenticate, isUserConfirmed, isUserBanned } = require('../controllers/middlewears')

router.use(authenticate, isUserConfirmed, isUserBanned)

router.get('/', friendsController.friends_get)
router.delete('/', friendsController.friends_delete)

router.post('/request/send', friendsController.sendRequest_post)
router.post('/request/accept', friendsController.acceptRequest_post)
router.post('/request/reject', friendsController.rejectRequest_post)

module.exports = router
