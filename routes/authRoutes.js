const express = require('express')
const router = new express.Router()
const authController = require('../controllers/authController')

router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)
router.get('/forgotPassword', authController.forgotPassword_get)
router.post('/forgotPassword', authController.forgotPassword_post)
router.get('/changePassword/:token', authController.changePassword_get)
router.post('/changePassword', authController.changePassword_post)
router.get('/confirmEmail/:token', authController.confirmEmail_get)
router.get('/resendEmailConfirm', authController.resendEmailConfirm_get)

module.exports = router
