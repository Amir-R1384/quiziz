const selects = document.querySelectorAll('select')
const quizMenuBtns = document.querySelectorAll('.quizMenuBtn')

let sharedWithMe = false

/* eslint-disable no-undef */
selects.forEach(select => select.addEventListener('change', () => search(false)))
searchBtn.addEventListener('mouseup', () => search(false))
searchInp.addEventListener('keydown', e => e.key === 'Enter' ? search(false) : null)
loadMoreBtn.addEventListener('mouseup', () => search(true))
sharedWithMeToggle.addEventListener('mouseup', toggleSharedWithMeAndSearch)
/* eslint-disable no-undef */

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

function toggleSharedWithMeAndSearch() {
    sharedWithMeToggle.classList.toggle('active')
    search(false)
}

async function search(loading=false) {
    const rating = ratingSelect.value
    const search = searchInp.value
    sharedWithMe = sharedWithMeToggle.classList.contains('active')
    
    const res = await fetch(`?loc=js&rating=${rating}&sharedWithMe=${sharedWithMe}&search=${search}&loading=${loading}`, {
        method: 'GET'
    })

    if (!res.ok)
        return displayErrorPage(res.status)

    const quizzes = await res.json()
    
    if (!loading) quizWrapper.innerHTML = ''

    quizzes.forEach(quiz => {
        quizWrapper.innerHTML += 
        `<div data-id ="${quiz._id}" data-keywords="${quiz.keywords.join(' ')}" class="quiz rounded-2xl h-64 bg-white flex flex-col shadow-lg">
            <div class="bg-center bg-no-repeat bg-cover h-2/5" style="border-top-left-radius: 16px; border-top-right-radius: 16px; background-image: url('${quiz.imageEncoded}');"></div>
                <div class="p-3 pt-2 flex flex-col justify-between flex-1">
                    <div class="quiz-title text-xl font-semibold text-gray-700">${shortenText(quiz.title, 45)}</div>
                    <div class="quiz-description text-xs font-medium text-gray-500 break-words">${shortenText(quiz.description, 60)}</div>
                    <div class="flex w-full justify-between gap-x-2">
                    <a href="/quiz/play/${quiz._id}" class="bg-primary text-center text-white font-semibold text-lg flex-1 rounded-lg transition-opacity hover:opacity-90">Play</a>
                    <button class="quizMenuBtn relative">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 transition-colors hover:bg-gray-300 rounded-lg cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        <div class="quiz-menu absolute w-28 bottom-full -mb-7 mr-1 right-full bg-gray-600 text-white rounded-lg hidden flex-col border-2 border-gray-700" style="box-shadow: 0 0 10px 1px rgba(0,0,0,0.5);">
                            <div class="learnMorebtn text-sm font-medium text-white text-left p-3 transition-colors hover:bg-gray-700 py-1">Learn more</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>`
    })

    if (quizzes.length) {
        endMessage.classList.add('hidden')
        loadMore.classList.remove('hidden')

    } else {
        endMessage.classList.remove('hidden')
        loadMore.classList.add('hidden')
    }
}