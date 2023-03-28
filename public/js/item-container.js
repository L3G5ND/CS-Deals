function createCard() {
    $.get('../html/item-cards.html', function(data) {
        $('#item-container').append(data)
    })
}

$(document).ready(function() {
    createCard()
    window.addEventListener('click', (event) => {
        createCard()
    })
})
