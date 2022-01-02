const copyUserIdBtn = document.getElementById('copyUserIdBtn')
const addFriendBtn = document.getElementById('addFriendBtn')
const addFriendContainer = document.getElementById('addFriendContainer')
const sendFriendRequestBtn = document.getElementById('sendFriendRequestBtn')

copyUserIdBtn.addEventListener('mouseup', copyUserId)
addFriendBtn.addEventListener('mouseup', toggleAddFriendDiv)
addFriendContainer.addEventListener('mouseup', e => {
    if (e.target === e.currentTarget) toggleAddFriendDiv()
})
sendFriendRequestBtn.addEventListener('mouseup', sendFriendRequest)

function copyUserId() {
    const copyDiv = document.createElement('input')
    copyDiv.value = userId // userId is from the ejs file

    copyDiv.select()
    copyDiv.setSelectionRange(0, 100)

    navigator.clipboard.writeText(copyDiv.value)
}

function toggleAddFriendDiv() {
    addFriendContainer.classList.toggle('hidden')
}

async function sendFriendRequest() {
    const errorDiv = document.getElementById('errorDiv')
    errorDiv.innerText = ''

    const id = document.getElementById('sendFriendRequestInp').value

    const res = await fetch(`/friends/request/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })

    if (res.ok) {
        toggleAddFriendDiv()
    } else {
        const error = await res.json()

        errorDiv.innerText = error.input
    }
}

async function acceptFriendRequest(id) {
    const res = await fetch('/friends/request/accept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })

    if (res.ok) {
        location.reload()
    } else {
        displayErrorPage(res.status)
    }
}

async function rejectFriendRequest(id) {
    const res = await fetch('/friends/request/reject', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })

    if (res.ok) {
        location.reload()
    } else {
        displayErrorPage(res.status)
    }
}

async function removeFriend(id) {
    const res = await fetch('/friends', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })

    if (res.ok) {
        location.reload()
    } else {
        displayErrorPage(res.status)
    }
}
