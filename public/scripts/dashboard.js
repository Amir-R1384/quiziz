const quizMenuBtns = document.querySelectorAll('.quizMenuBtn')
const editBtns = document.querySelectorAll('.editBtn')
const deleteBtns = document.querySelectorAll('.deleteBtn')
const quizzes = document.querySelectorAll('.quiz')
const shareBtns = document.querySelectorAll('.shareBtn')
const friendOptions = document.querySelectorAll('.friendOption')

// emailNotice comes from ejs
if (emailNotice == 'true') {
    window.onload = () => {
        alert(
            `In order to access the full features of quiziz, you have to confirm your email address.
If your email provider is not yahoo, you may not receive any email.`
        )
    }
}

const searchData = createSearchData()

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
    btn.addEventListener('mouseup', function () {
        const quizId = getQuizId(this)

        location.assign(`/quiz/edit/${quizId}`)
    })
})

deleteBtns.forEach(btn => {
    btn.addEventListener('mouseup', async function () {
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

shareContainer.addEventListener('click', e => {
    if (e.target === e.currentTarget) toggleShareDiv()
})
shareBtns.forEach(btn =>
    btn.addEventListener('mouseup', () => {
        toggleShareDiv(btn.getAttribute('data-quiz-id'))
    })
)
friendSearchInp.addEventListener('input', () => searchFriends(friendSearchInp.value))
shareBtn.addEventListener('mouseup', shareQuiz)
searchInp.addEventListener('keydown', e => (e.key === 'Enter' ? searchQuiz() : null))
searchBtn.addEventListener('mouseup', searchQuiz)
closeConfirmEmailBtn.addEventListener('mouseup', closeConfirmEmailMessage)
resendEmailConfirmBtn.addEventListener('mouseup', resendEmailConfirm)

function searchQuiz() {
    const query = searchInp.value.toLowerCase()

    if (/^\s*$/.test(query)) return quizzes.forEach(quiz => quiz.classList.remove('hidden'))

    quizzes.forEach((quiz, i) => {
        if (searchData[i].includes(query)) quiz.classList.remove('hidden')
        else quiz.classList.add('hidden')
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

function toggleShareDiv(quizId) {
    shareContainer.classList.toggle('hidden')

    if (!shareContainer.classList.contains('hidden')) {
        shareDiv.setAttribute('data-shared-quiz-id', quizId)
    }
}

function searchFriends(query) {
    if (/^\s*$/.test(query)) {
        return friendOptions.forEach(el => el.classList.remove('hidden'))
    }

    friendOptions.forEach(el => {
        if (el.querySelector('label').innerText.toLowerCase().includes(query)) {
            el.classList.remove('hidden')
        } else {
            el.classList.add('hidden')
        }
    })
}

async function shareQuiz() {
    const toBeShared = Array.from(document.querySelectorAll('input.friendOptionInput:checked'))
    const receiverIds = toBeShared.map(el => el.id)
    const quizId = shareDiv.getAttribute('data-shared-quiz-id')

    const res = await fetch('/quiz/share', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quizId, receiverIds })
    })

    if (res.ok) {
        document.querySelectorAll('input.friendOptionInput').forEach(input => {
            input.checked = false
        })
        shareContainer.classList.add('hidden')
    } else {
        displayErrorPage(res.status)
    }
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

function closeConfirmEmailMessage() {
    // eslint-disable-next-line no-undef
    confirmEmailMessage.classList.add('hidden')
}

async function resendEmailConfirm() {
    const res = await fetch('/resendEmailConfirm')

    if (!res.ok) return displayErrorPage(res.status)

    // The text div itself
    confirmEmail_self.innerText = 'A new email has been sent. Check your inbox.'
}
