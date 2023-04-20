const socket = io('http://127.0.0.1:3000', {
    path: '/item-socket'
})

socket.on('connection')

$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search)
    let market = urlParams.get('market') || 'all'
    let minDeal = urlParams.get('minDeal')
    let maxDeal = urlParams.get('maxDeal')
    
    const cache = await $.ajax({
        type: 'GET',
        url: 'api/deal-cache?market='+market+'&minDeal='+minDeal+'&maxDeal='+maxDeal
    })

    for (let i = 0; i < Object.keys(cache).length; i++) {
        const itemCache = cache[i]
        itemContainer.createCard(itemCache)
    }

    function validateItem(item) {
        const itemDealPercentage = getDeal(item)
        if (itemDealPercentage <= maxDeal) {
            if(itemDealPercentage >= minDeal) {
                return true
            }
        }
        return false
    }

    socket.on('deal-added', (item) => {
        if (validateItem(item)) {
            itemContainer.createCard(item)
        }
    })
})