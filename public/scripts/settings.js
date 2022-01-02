selectCorrectTabButton()

// * Event listeners

document.querySelectorAll('form button').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault()
        document.querySelectorAll('.error-div').forEach(el => (el.innerText = ''))
    })
})
document.getElementById('closeUpdateMessageBtn').addEventListener('click', closeUpdateMessage)

// * Functions

// eslint-disable-next-line no-unused-vars
function showUpdateMessage() {
    // eslint-disable-next-line no-undef
    updateMessage.classList.remove('hidden')
    window.scrollTo(0, 0)
}

function closeUpdateMessage() {
    // eslint-disable-next-line no-undef
    updateMessage.classList.add('hidden')
}

function selectCorrectTabButton() {
    // eslint-disable-next-line no-undef
    const selectedBtn = document.getElementById(selectedBtnId)
    selectedBtn.classList.add('selected')
}
