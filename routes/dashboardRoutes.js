const express = require("express")
const router = new express.Router()

const dashboardController = require("../controllers/dashboardController")
const { authenticate } = require("../controllers/middlewears")

router.use(authenticate)

router.get("/", dashboardController.dashboard_get)

module.exports = router