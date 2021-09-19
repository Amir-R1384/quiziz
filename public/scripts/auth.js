
function makeTransitionBetweenInputs(inputsOrder) {

    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("keydown", e => {
            if (e.code !== "Enter") return
            
            const index = inputsOrder.indexOf(input.id)
            
            if (index < 0 || index >= inputsOrder.length || (!index && index !== 0)) return

            if (index === inputsOrder.length -1) {
                return submitBtn.click()
            } else {
                document.querySelector(`input[id=${inputsOrder[index+1]}]`).focus()
            }
        })
    })

}