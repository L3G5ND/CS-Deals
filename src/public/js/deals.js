const socket = io('http://127.0.0.1:3000', {
    path: '/item-socket'
})

socket.on('connection')

$(document).ready(async function() {
    socket.on('deal-added', (item) => {
        itemContainer.createCard(item)
    })

    const urlParams = new URLSearchParams(window.location.search)
    let market = urlParams.get('market')
    if (!market) {
        market = 'all'
    }
    const cache = await $.ajax({
        type: 'GET',
        url: 'api/deals-cache?market='+market
    })
    console.log(cache)
    for (let i = 0; i < Object.keys(cache).length; i++) {
        const itemCache = cache[i]
        itemContainer.createCard(itemCache)
    }
})