const express = require('express')
const router = new express.Router()


const quizController = require('../controllers/quizController')
const { authenticate } = require('../controllers/middlewears')


router.use(authenticate)

router.get('/create', quizController.createQuiz_get)
router.post('/create', quizController.createQuiz_post)

router.get('/:id/edit', quizController.editQuiz_get)
router.post('/:id/edit', quizController.editQuiz_post)

router.get('/:id/play', quizController.playQuiz_get)

router.delete('/:id', quizController.deleteQuiz_delete)

module.exports = router