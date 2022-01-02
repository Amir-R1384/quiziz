const express = require('express')
const router = new express.Router()


const quizController = require('../controllers/quizController')
const { authenticate } = require('../controllers/middlewears')


router.use(authenticate)

router.get('/attend', quizController.attendQuiz_get) // Where you can find a quiz and play
router.delete('/attend/sharedQuiz', quizController.removeSharedQuiz_delete)

router.get('/create', quizController.createQuiz_get)
router.post('/create', quizController.createQuiz_post)

router.get('/edit/:id', quizController.editQuiz_get)
router.post('/edit/:id', quizController.editQuiz_post)

router.get('/play/:id', quizController.playQuiz_get)
router.post('/submit/:id', quizController.submitQuiz_post)

router.delete('/:id', quizController.deleteQuiz_delete)

router.post('/rate/:id', quizController.rate_post)

router.post('/share', quizController.shareQuiz_post)

module.exports = router