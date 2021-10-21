
// eslint-disable-next-line no-unused-vars
function makeTransitionBetweenInputs(inputsOrder) {

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keydown', e => {
            if (e.code !== 'Enter') return
            
            const index = inputsOrder.indexOf(input.id)
            
            if (index < 0 || index >= inputsOrder.length || (!index && index !== 0)) return

            if (index === inputsOrder.length -1) {
                const submitBtn = document.getElementById('submitBtn')

                return submitBtn.click()
            } else {
                document.querySelector(`input[id=${inputsOrder[index+1]}]`).focus()
            }
        })
    })

}

window.onload = () => {
    setTimeout(() => document.querySelector('input').focus(), 100)
}