// eslint-disable-next-line no-unused-vars
function boldOut(el) {
    const originalFontWeight = window.getComputedStyle(el).getPropertyValue('font-weight')
    el.style.fontWeight = Number(originalFontWeight) + 200 
}

// eslint-disable-next-line no-unused-vars
function stretchToBrowserHeight(el) {
    const {top} = el.getBoundingClientRect()
    el.style.height = `${window.innerHeight - top}px`
}

// eslint-disable-next-line no-unused-vars
async function displayErrorPage(code) {
    const supportedErrorCodes = new Set([400, 500, 404, 403])

    if (!supportedErrorCodes.has(code)) {
        code = 'error'
    }

    const res = await fetch(`/${code}`, { method: 'GET' })
    const text = await res.text()
    document.documentElement.innerHTML = text
    return
}

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
function shortenText(text, length) {
    if (text.length > length) {
        return text.slice(0,length).split(' ').slice(0,-1).join(' ') + '...'
    }
    return text
}