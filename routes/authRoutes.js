const express = require("express")
const router = new express.Router()
const authController = require("../controllers/authControllers")

router.get("/signup", authController.signup_get)
router.post("/signup", authController.signup_post)
router.get("/login", authController.login_get)
router.post("/login", authController.login_post)

module.exports = router