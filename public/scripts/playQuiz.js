// * Important variables

let questionIndex = null
let answers = []

// * Event listeners

/* eslint-disable no-undef */
window.addEventListener('beforeunload', cancelQuiz)
skipQuestionBtn.addEventListener('mouseup', () => answerQuestion(null))
cancelBtn.addEventListener('mouseup', cancelQuiz)
/* eslint-disable no-undef */

// * Setup

startQuiz()

// * Functions

function startQuiz() {
    questionIndex = 0
    nextQuestion()
}

async function nextQuestion() {

    // Hover effect on the buttons
    document.querySelectorAll('.question-button').forEach(button => button.classList.remove('selected'))
    const currentQuestionButton = document.querySelector(`.question-button[data-index='${questionIndex}']`)
    currentQuestionButton.classList.add('selected')

    // The question title and board
    const { type, title } = questions[questionIndex] // questions is gotten from the ejs file

    questionTitle.innerText = title
    questionBoard.innerHTML = ''

    switch (type) {    
    case 'true/false': {

        const designElement = await fetchComponent('/components/true-false/true-false-design.html')

        for (let i=0; i<2; i++) {
            const button = designElement.children[i]

            // Styling
            button.style.cursor = 'pointer'
            button.addEventListener('mouseover', () => button.style.opacity = 0.9)
            button.addEventListener('mouseout', () => button.style.opacity = 1)
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

    const res = await fetch(`/quiz/submit/${quizId}`, { // quizId is gotten from the ejs file
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
    })
    
    if (res.ok) {
        location.assign('/')
    } else {
        displayErrorPage(res.status)
    }
}

function cancelQuiz() {
    if (!answers.length) return location.assign('/')
    
    const wantsToQuit = confirm('Are you sure you want to quit? All your progress will be lost.')
    if (wantsToQuit) {
        location.assign('/')
    } 
}