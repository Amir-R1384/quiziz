const quizMenuBtns = document.querySelectorAll('.quizMenuBtn')
const editBtns = document.querySelectorAll('.editBtn')
const deleteBtns = document.querySelectorAll('.deleteBtn')

quizMenuBtns.forEach(btn => {
    btn.addEventListener('mouseup', () => {
        const quizMenu = btn.querySelector('.quiz-menu') 

        if (quizMenu.classList.contains('hidden')) {

            quizMenu.classList.remove('hidden')
            quizMenu.classList.add('flex')

        } else {

            quizMenu.classList.remove('flex')
            quizMenu.classList.add('hidden')

        }
    })
})

editBtns.forEach(btn => {
    btn.addEventListener('mouseup', function() {

        const quizId = getQuizId(this)

        location.assign(`/quiz/edit/${quizId}`)
    })
})

deleteBtns.forEach(btn => {
    btn.addEventListener('mouseup', async function() {

        const wantsToDelete = confirm('Are you sure you want to delete this quiz?')
        if (!wantsToDelete) return

        const quizId = getQuizId(this)

        const response = await fetch(`/quiz/${quizId}`, {
            method: 'DELETE'
        })

        if (response.ok) {

            location.assign('/')

        } else {

            if (response.status === 400) return location.assign('/400')
            if (response.status === 500) return location.assign('/500')
            location.assign('/error')
            
        }
        
    })
})

const quizzes = document.querySelectorAll('.quiz')
const searchData = createSearchData()

/* eslint-disable no-undef */
searchInp.addEventListener('keydown', e => e.key === 'Enter' ? searchQuiz() : null)
searchBtn.addEventListener('mouseup', searchQuiz)
/* eslint-disable no-undef */

function searchQuiz() {
    const query = searchInp.value.toLowerCase()

    if (/^\s*$/.test(query)) return quizzes.forEach(quiz => quiz.classList.remove('hidden'))

    quizzes.forEach((quiz, i) => {

        if (searchData[i].includes(query)) 
            quiz.classList.remove('hidden')
        else
            quiz.classList.add('hidden')

    })
}

function createSearchData() {
    const data = []

    quizzes.forEach(quiz => {
        let dataStr = ''

        const quizTitle = quiz.querySelector('.quiz-title').textContent.toLowerCase()
        const quizDescription = quiz.querySelector('.quiz-description').textContent.toLowerCase()
        const keywords = quiz.getAttribute('data-keywords')

        dataStr += quizTitle
        dataStr += ` ${quizDescription}`
        dataStr += ` ${keywords}`

        data.push(dataStr)
    })

    return data
}

function getQuizId(son) {
    const quizDiv = getParent(son, 5)
    const quizId = quizDiv.getAttribute('data-id')
    return quizId
}

// For traversing the node tree upwards with certain amout of time
function getParent(son, generation) {
    if (generation === 0) return son
    son = son.parentNode
    generation--
    return getParent(son, generation)
}