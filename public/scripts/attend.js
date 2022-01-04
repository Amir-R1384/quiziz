const selects = document.querySelectorAll('select')

let sharedWithMe = false

/* eslint-disable no-undef */
selects.forEach(select => select.addEventListener('change', () => search(false)))
searchBtn.addEventListener('mouseup', () => search(false))
searchInp.addEventListener('keydown', e => (e.key === 'Enter' ? search(false) : null))
loadMoreBtn.addEventListener('mouseup', () => search(true))
sharedWithMeToggle.addEventListener('mouseup', toggleSharedWithMeAndSearch)
/* eslint-disable no-undef */

function toggleSharedWithMeAndSearch() {
    sharedWithMeToggle.classList.toggle('active')
    search(false)
}

async function search(loading = false) {
    const rating = ratingSelect.value
    const search = searchInp.value
    sharedWithMe = sharedWithMeToggle.classList.contains('active')

    const res = await fetch(
        `?loc=js&rating=${rating}&sharedWithMe=${sharedWithMe}&search=${search}&loading=${loading}`,
        {
            method: 'GET'
        }
    )

    if (!res.ok) return displayErrorPage(res.status)

    const quizzes = await res.json()

    if (!loading) quizWrapper.innerHTML = ''

    quizzes.forEach(quiz => {
        if (sharedWithMe) {
            quizWrapper.innerHTML += `<div data-id ="${
                quiz._id
            }" data-keywords="${quiz.keywords.join(
                ' '
            )}" class="flex flex-col h-64 bg-white shadow-lg quiz rounded-2xl">
                <div class="bg-center bg-no-repeat bg-cover h-2/5" style="border-top-left-radius: 16px; border-top-right-radius: 16px; background-image: url('${
                    quiz.imageEncoded
                }');"></div>
                    <div class="flex flex-col justify-between flex-1 p-3 pt-2">
                        <div class="text-xl font-semibold text-gray-700 quiz-title">${shortenText(
                            quiz.title,
                            45
                        )}</div>
                        <div class="text-xs font-medium text-gray-500 break-words quiz-description">${shortenText(
                            quiz.description,
                            60
                        )}</div>
                        <div class="flex justify-between w-full gap-x-2">
                        <a href="/quiz/play/${
                            quiz._id
                        }" class="flex-1 py-0.5 button-filled bg-primary">Play</a>
                        <button class="relative quizMenuBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600 rounded-lg cursor-pointer transition-colors hover:bg-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                            <div class="absolute flex-col hidden mr-1 overflow-hidden text-white bg-gray-600 border-2 border-gray-700 rounded-lg quiz-menu bottom-full -mb-7 right-full " style="box-shadow: 0 0 10px 1px rgba(0,0,0,0.5);">
                                <div data-quiz-id ="${
                                    quiz._id
                                }" class="px-3 py-1 text-sm font-medium text-left text-white bg-red-500 removeSharedQuizBtn transition-colors hover:bg-red-600">Remove</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>`
        } else {
            quizWrapper.innerHTML += `<div data-id ="${
                quiz._id
            }" data-keywords="${quiz.keywords.join(
                ' '
            )}" class="flex flex-col h-64 bg-white shadow-lg quiz rounded-2xl">
                <div class="bg-center bg-no-repeat bg-cover h-2/5" style="border-top-left-radius: 16px; border-top-right-radius: 16px; background-image: url('${
                    quiz.imageEncoded
                }');"></div>
                    <div class="flex flex-col justify-between flex-1 p-3 pt-2">
                        <div class="text-xl font-semibold text-gray-700 quiz-title">${shortenText(
                            quiz.title,
                            45
                        )}</div>
                        <div class="text-xs font-medium text-gray-500 break-words quiz-description">${shortenText(
                            quiz.description,
                            60
                        )}</div>
                        <div class="w-full">
                        <a href="/quiz/play/${
                            quiz._id
                        }" class="flex-1 block w-full text-lg font-semibold text-center text-white rounded-lg bg-primary transition-opacity hover:opacity-90">Play</a>
                    </div>
                </div>
            </div>`
        }
    })

    if (sharedWithMe) {
        const quizMenuBtns = document.querySelectorAll('.quizMenuBtn')
        const removeSharedQuizBtns = document.querySelectorAll('.removeSharedQuizBtn')

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

        removeSharedQuizBtns.forEach(btn => {
            btn.addEventListener('mouseup', () => {
                const quizId = btn.getAttribute('data-quiz-id')

                removeSharedQuiz(quizId)
            })
        })
    }

    if (quizzes.length) {
        endMessage.classList.add('hidden')
        loadMore.classList.remove('hidden')
    } else {
        endMessage.classList.remove('hidden')
        loadMore.classList.add('hidden')
    }
}

async function removeSharedQuiz(quizId) {
    const res = await fetch('/quiz/attend/sharedQuiz', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quizId })
    })

    if (!res.ok) return displayErrorPage(res.status)

    const removedQuiz = document.querySelector(`.quiz[data-id="${quizId}"]`)
    quizWrapper.removeChild(removedQuiz)
}
