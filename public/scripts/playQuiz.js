// * Important variables

let questionIndex = null
let answers = []

// * Event listeners

/* eslint-disable no-undef */
window.addEventListener('beforeunload', cancelQuiz)
skipQuestionBtn.addEventListener('mouseup', () => answerQuestion(null))
cancelBtn.addEventListener('mouseup', cancelQuiz)
returnHomeBtn.addEventListener('mouseup', () => location.assign('/'))
document
    .querySelectorAll('.rating-star')
    .forEach(star => star.addEventListener('mouseup', rateQuiz))
/* eslint-disable no-undef */

// * Setup

startQuiz()

// * Functions

function startQuiz() {
    questionIndex = 0
    nextQuestion()
    numerateRatingStars()
}

function numerateRatingStars() {
    document
        .querySelectorAll('.rating-star')
        .forEach((star, i) => star.setAttribute('data-index', i))
}

async function nextQuestion() {
    // Hover effect on the buttons
    document
        .querySelectorAll('.question-button')
        .forEach(button => button.classList.remove('selected'))
    const currentQuestionButton = document.querySelector(
        `.question-button[data-index='${questionIndex}']`
    )
    currentQuestionButton.classList.add('selected')

    // The question title and board
    const { type, title } = questions[questionIndex] // questions is gotten from the ejs file

    questionTitle.innerText = title
    questionBoard.innerHTML = ''

    switch (type) {
        case 'true/false': {
            const designElement = await fetchComponent(
                '/components/true-false/true-false-design.html'
            )

            for (let i = 0; i < 2; i++) {
                const button = designElement.children[i]

                // Styling
                button.style.cursor = 'pointer'
                button.addEventListener('mouseover', () => (button.style.opacity = 0.9))
                button.addEventListener('mouseout', () => (button.style.opacity = 1))
                button.style.transition = 'opacity 0.2s'

                // The event listener for answering the question
                button.addEventListener('mouseup', () => {
                    const valueString = button.getAttribute('data-value')
                    const valueBoolean = valueString === 'true'
                    answerQuestion(valueBoolean)
                })
            }

            questionBoard.appendChild(designElement)
            break
        }

        case 'multiple-choice': {
            const designElement = await fetchComponent(
                '/components/multiple-choice/multiple-choice-design.html'
            )

            for (let i = 0; i < 4; i++) {
                const button = designElement.children[i]

                // Styling
                button.style.cursor = 'pointer'
                button.addEventListener('mouseover', () => (button.style.opacity = 0.9))
                button.addEventListener('mouseout', () => (button.style.opacity = 1))
                button.style.transition = 'opacity 0.2s'
                button.innerText = questions[questionIndex].choices[i]

                // The event listener for answering the question
                button.addEventListener('mouseup', () => {
                    const value = button.getAttribute('data-index')
                    answerQuestion(value)
                })
            }

            questionBoard.appendChild(designElement)
            break
        }
        default:
            throw new Error('Invalid question type')
    }
}

function answerQuestion(answer) {
    answers.push(answer)

    if (answers.length === questions.length) {
        submitQuiz()
    } else {
        questionIndex++
        nextQuestion(questionIndex)
    }
}

async function submitQuiz() {
    const res = await fetch(`/quiz/submit/${quizId}`, {
        // quizId is gotten from the ejs file
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
    })

    if (res.ok) {
        const { score } = await res.json()
        showScorePage(score)
    } else {
        displayErrorPage(res.status)
    }
}

function showScorePage(score) {
    scoreWrapper.classList.remove('hidden')

    scoreNumDiv.innerText = score + '%'

    // For the ring
    const ringRadius = 65
    const scoreInRadian = ((((100 - score) * 360) / 100) * Math.PI) / 180
    setTimeout(() => (progressRing.style.strokeDashoffset = ringRadius * scoreInRadian), 100)
}

function cancelQuiz() {
    if (!answers.length) return location.assign('/')

    const wantsToQuit = confirm('Are you sure you want to quit? All your progress will be lost.')
    if (wantsToQuit) {
        location.assign('/')
    }
}

async function rateQuiz() {
    // The UI
    const currentIndex = this.getAttribute('data-index')
    const stars = document.querySelectorAll('.rating-star')
    const selectedStarsNum = document.querySelectorAll('.rating-star.selected').length
    let rating

    if (currentIndex == selectedStarsNum - 1) {
        stars.forEach(star => star.classList.remove('selected'))
        rating = 0
    } else {
        stars.forEach((star, i) => {
            if (i <= currentIndex) {
                star.classList.add('selected')
            } else {
                star.classList.remove('selected')
            }
        })
        rating = parseInt(currentIndex) + 1
    }

    // The logic
    const res = await fetch(`/quiz/rate/${quizId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating })
    })

    if (!res.ok) {
        displayErrorPage(res.status)
    }
}
