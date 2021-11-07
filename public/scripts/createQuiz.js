// * Loading from localstorage

let savedProgress = localStorage.savedProgress ? JSON.parse(localStorage.savedProgress) : {}

// * Variables Setup

let isPublic = false
let questions = []
let quizImageEncoded = null
let currentQuestionIndex = null

const paths = {
    button: '/components/button.html',
    trueFalse: '/components/true-false/true-false.html',
    trueFalseDesign: '/components/true-false/true-false-design.html'
}

// eslint-disable-next-line no-undef
if (editMode) 
    preloadDataFromServer()
else
    preloadDataFromLocalStorage()

// * Event listeners

/* eslint-disable no-undef */
for (let option of questionTypeSelect.children) option.addEventListener('click', changeQuestionType) // For simulating with js
questionTypeSelect.addEventListener('change', changeQuestionType) // For simulating with real click

newQuestionBtn.addEventListener('mouseup', () => createQuestion())
deleteQuestionBtn.addEventListener('mouseup', deleteQuestion)

questionTitleInp.addEventListener('input', function () { questions[currentQuestionIndex].title = this.value })

visibilityToggle.addEventListener('mouseup', toggleVisibility)

saveBtn.addEventListener('mouseup', saveQuiz)

moreBtn.addEventListener('mouseup', toggleMoreSection)
closeBtn.addEventListener('mouseup', toggleMoreSection)
moreContainer.addEventListener('click', e => e.target.id === 'moreContainer' ? toggleMoreSection() : null)

imageInp.addEventListener('change', displayQuizImage)
removeImgBtn.addEventListener('mouseup', () => imageInp.dispatchEvent(new Event('change')))

autoSaveDataToLocalStorage()
/* eslint-disable no-undef */

// * Functions

async function preloadDataFromServer() {
    // Things to load from pre saved quiz : title, description, keywords, imageEncoded, visibility(isPublic) and questions

    // * For title and description inputs
    const mainInputs = [titleInp, descriptionInp, keywordsInp]

    mainInputs.forEach(input => {
        const presavedInput = preSavedQuiz[input.getAttribute('data-storage-name')]
        if (presavedInput) input.value = presavedInput
    })

    // * For keywords input
    keywordsInp.value = preSavedQuiz.keywords.join(' ')

    // * For imageEncoded
    if (preSavedQuiz.imageEncoded) {
        quizImageEncoded = preSavedQuiz.imageEncoded

        const image = new Image()
        image.src = quizImageEncoded
        image.onload = () => displayImageInput(image)
    }

    // * For visibility
    if (preSavedQuiz.isPublic != undefined) {
        isPublic = preSavedQuiz.isPublic
        if (isPublic === true) toggleVisibility()
    }

    // * Questions
    if (preSavedQuiz.questions) {
        for (let question of preSavedQuiz.questions) {
            createQuestion(question.type, question.title, question.answer)
        }

    }
}  

async function preloadDataFromLocalStorage() {
    // Things to load from localStorage : title, description, keywords, imageEncoded, visibility(isPublic) and questions

    // * For title and description inputs
    const mainInputs = [titleInp, descriptionInp]

    mainInputs.forEach(input => {
        const presavedInput = savedProgress[input.getAttribute('data-storage-name')]
        if (presavedInput) input.value = presavedInput
    })

    // * For keywords input
    if (savedProgress.keywords) {   
        keywordsInp.value = savedProgress.keywords
    }

    // * For imageEncoded
    if (savedProgress.quizImageEncoded) {
        quizImageEncoded = savedProgress.quizImageEncoded

        const image = new Image()
        image.src = quizImageEncoded
        image.onload = () => displayImageInput(image)
    }

    // * For visibility
    if (savedProgress.isPublic != undefined) {
        isPublic = savedProgress.isPublic
        if (isPublic === true) toggleVisibility()
    }

    // * Questions
    if (savedProgress.questions) {
        for (let question of savedProgress.questions) {
            createQuestion(question.type, question.title, question.answer)
        }

    }
}   

function autoSaveDataToLocalStorage() {
    // Things to save to localStorage: title, description, keywords, imageEncoded, visibility(isPublic) and questions

    // * For title, description and keywords inputs
    const mainInputs = [titleInp, descriptionInp, keywordsInp]

    mainInputs.forEach(input => input.addEventListener('input', () => {
        savedProgress[input.getAttribute('data-storage-name')] = input.value
        save()
    }))

    // * For the imageEncoded input, it's done in the 'displayQuizImage' function
    // * For visibility, it's done in the 'toggleVisibility' function

    // * For questions
    const events = [
        [newQuestionBtn, 'mouseup'],
        [deleteQuestionBtn, 'mouseup'],
        [questionTitleInp, 'input'],
        [leftPanel, 'mouseup'],
    ]

    createEventListeners(events, () => {
        savedProgress.questions = questions
        save()
    })
}

function save() {
    localStorage.setItem('savedProgress', JSON.stringify(savedProgress))
}

function createEventListeners(events, func) {
    events.forEach(([element, type]) => {
        element.addEventListener(type, func)
    })
}

function toggleMoreSection() {
    moreContainer.classList.toggle('hidden')
}

function toggleVisibility() {
    visibilityToggle.classList.toggle('active')
    isPublic = visibilityToggle.classList.contains('active')
    
    savedProgress.isPublic = isPublic
    save()
}

function changeQuestionType() {
    questions[currentQuestionIndex].type = this.value
    displayQuestion(this.value)
}

function displayQuestion(questionType) {
    // Deleting any old content
    questionSetting.innerHTML = ''
    questionBoard.innerHTML = ''

    switch(questionType) {

    case 'true/false': 
        fetchComponent(paths.trueFalse)
            .then(components => {

                for (let child of components[1].children) {
                    child.addEventListener('mouseup', () => {
                        // Removing the selected class and adding it to the selected value
                        for (let child of document.querySelectorAll('.true-false')) child.classList.remove('selected')
                        child.classList.add('selected')
                        // Changing the answer in the question array
                        questions[currentQuestionIndex].answer = child.getAttribute('data-value') === 'true'
                    })
                }

                // Selecting on of the options if there is an answer
                if (questions[currentQuestionIndex].answer !== null) components[1].querySelector(`[data-value='${questions[currentQuestionIndex].answer}']`).classList.add('selected')
                
                while(components.length !== 0) {
                    questionSetting.appendChild(components[0]) // When appending from an HTML collection, it removes the element so we use a while loop
                }

                fetchComponent(paths.trueFalseDesign)
                    .then(component => questionBoard.appendChild(component))
            })
        break
    }
}

async function createQuestion(type = null, title = '', answer = null) {
    try {
        // Creating and appending the button
        const button = await fetchComponent(paths.button)

        button.innerText = questions.length + 1
        button.setAttribute('data-index', questions.length)
        button.addEventListener('mouseup', () => loadQuestion(button.getAttribute('data-index')))

        questionsList.appendChild(button)

        // Template for each question in the questions array
        questions.push({
            type,
            title,
            answer
        })

        // Making disabled components interactive
        questionTitleInp.removeAttribute('disabled')
        questionTypeSelect.removeAttribute('disabled')

        // Autoloading if it's the first question
        if (questions.length === 1) loadQuestion(0)
         
        savedProgress.questions = questions
        save()

    } catch (err) {
        console.error(err)
        displayErrorPage()
    }
}

function deleteQuestion() {
    if (currentQuestionIndex == null) return

    const index = currentQuestionIndex
    const toBeRemoved = document.querySelector(`.question-button[data-index='${index}']`)
    const questionsParent = toBeRemoved.parentElement

    // Removing from the questions array and the UI
    questions.splice(index, 1)
    questionsParent.removeChild(toBeRemoved)

    // Recalculating the questions' number
    const questionElements = document.querySelectorAll('.question-button')

    for (let i=index; i<questions.length; i++) {
        questionElements[i].setAttribute('data-index', i)
        questionElements[i].innerText = i + 1
    }


    if (index >= questions.length) {
        if (questions.length) {

            currentQuestionIndex = questions.length-1
            loadQuestion(currentQuestionIndex)

        } else {

            currentQuestionIndex = null
            deselectQuestions()

        }
    } else
        loadQuestion(currentQuestionIndex)

    savedProgress.questions = questions
    save()
}

function loadQuestion(index) {
    // Removing the selected class from previously selected question button
    document.querySelector(`.question-button[data-index='${currentQuestionIndex}']`)?.classList.remove('selected')

    currentQuestionIndex = parseInt(index)
    
    // Selecting the new question button   
    document.querySelector(`.question-button[data-index='${currentQuestionIndex}']`).classList.add('selected')

    const question = questions[currentQuestionIndex]

    // Changing the type of the question in the dropdown
    questionTypeSelect.value = question.type || 'default'

    // Filling the questionTitle div
    questionTitleInp.value = question.title

    // Displaying the answers
    displayQuestion(question.type)
}

async function fetchComponent(path) {
    try {
        const raw = await fetch(path)
        const componentHtml = await raw.text()

        const parent = document.createElement('div')

        parent.innerHTML = componentHtml

        const componentOrComponents = parent.children.length === 1 ? parent.children[0] : parent.children

        return componentOrComponents
    } catch (err) {
        console.error(err)
        displayErrorPage()
    }
}

function displayQuizImage(event) {

    if (!this.files.length || !event.isTrusted) {
        quizImageEncoded = null

        imageInpLabel.classList.remove('hidden')
        removeImgBtn.classList.add('hidden')
        imgContainer.querySelectorAll('img').forEach(img => imgContainer.removeChild(img))

        savedProgress.quizImageEncoded = null
        save()
        return
    }

    const imageFile = this.files[0]
    
    const fileReader = new FileReader()
    fileReader.readAsDataURL(imageFile)

    fileReader.onload = () => {

        const img = new Image()
        img.src = fileReader.result
        
        img.onload = () => {

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.height = img.height
            canvas.width = img.width

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            const dataURL = canvas.toDataURL('image/jpeg', 0.2)

            img.src = dataURL
            quizImageEncoded = dataURL

            savedProgress.quizImageEncoded = quizImageEncoded
            save()

            img.onload = () => displayImageInput(img)
        }
    }

    // TODO Redirecting to the erorr page in the future
}

async function displayImageInput(img) {
    imageInpLabel.classList.add('hidden')
    removeImgBtn.classList.remove('hidden')
    imgInpContainer.querySelectorAll('img').forEach(img => img.remove())
    imgContainer.appendChild(img)
}

function deselectQuestions() {
    currentQuestionIndex = null
    questionTitleInp.disabled = true
    questionTypeSelect.disabled = true
    questionSetting.innerHTML = ''
    questionBoard.innerHTML = ''
    questionTypeSelect.value = 'default'
}

async function saveQuiz() {
    const data = {
        title: titleInp.value,
        isPublic,
        questions,
        description: descriptionInp.value,
        keywords: keywordsInp.value.split(/\s+/),
        imageEncoded: quizImageEncoded 
    }

    const url = editMode ? `/quiz/edit/${preSavedQuiz._id}` : '/quiz/create'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {

        savedProgress = {}
        save()
        location.assign('/')

    } else {

        if (response.status === 500) return location.assign('/500')

        try {
            const errors = await response.json()

            let errorMessage = ''

            for (let errorProperty in errors) {
                const errorReason = errors[errorProperty]
                errorMessage += `\n The ${errorProperty} ${errorReason}.`
            }

            alert(errorMessage)
        }
        catch(err) {
            console.error(err)
            displayErrorPage()
        }
    }
}