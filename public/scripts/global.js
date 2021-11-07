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
    const supportedErrorCodes = new Set([400, 500])

    if (!supportedErrorCodes.has(code)) {
        code = 'error'
    }

    const res = await fetch(`/${code}`, { method: 'GET' })
    const text = await res.text()
    document.documentElement.innerHTML = text
    return
}