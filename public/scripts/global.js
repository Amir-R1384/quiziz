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