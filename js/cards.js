const cards = document.getElementsByClassName('card-body')

const CardState = {
    ready: 'ready',
    turning: 'turning',
    turned: 'turned'
}

Array.prototype.forEach.call(cards, (card) => {
    card.addEventListener("click", async () => {
        const attr = card.getAttribute('data-state')

        switch (attr) {
            case 'ready':
                card.setAttribute('data-state', 'turning')
                await new Promise(res => setTimeout(res, 2000))
                card.setAttribute('data-state', 'turned')
                break;

            default:
                break;
        }
    })
})