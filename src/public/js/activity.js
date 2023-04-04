const socket = io('http://127.0.0.1:3000', {
    path: '/item-socket'
})

socket.on('connection')

$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search)
    let market = urlParams.get('market')
    if (!market) {
        market = 'all'
    }
    
    const cache = await $.ajax({
        type: 'GET',
        url: 'api/item-cache?market='+market
    })

    for (let i = 0; i < Object.keys(cache).length; i++) {
        const itemCache = cache[i]
        itemContainer.createCard(itemCache)
    }

    socket.on('item-added', (item) => {
        itemContainer.createCard(item)
    })
})