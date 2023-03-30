const itemCategories = [
    'Weapon',
    'Key',
    'Case',
    'Sticker Capsule',
    'Sticker',
    'Graffiti',
    'Music Kit',
    'Patch Pack',
    'Patch',
    'Pin',
    'Name Tag',
    'Storage Unit',
    'Swap Tool',
    'Viewer Pass'
]

function floatToAbbreviation(float) {
    if (float <= .07) {
        return 'FN'
    } else if (float <= .15) {
        return 'MW'
    } else if (float <= .38) {
        return 'FT'
    } else if (float <= .45) {
        return 'WW'
    } else if (float <= 1) {
        return 'BS'
    }
}

function abbreviationToFloat(float) {
    if (float == 'FN') {
        return .07
    } else if (float == 'MW') {
        return .15
    } else if (float == 'FT') {
        return .38
    } else if (float == 'WW') {
        return .45
    } else if (float == 'BS') {
        return 1
    }
}

function createCard(itemInfo) {
    $.get('../html/item-card.html', function(itemCardData) {
        if (itemInfo.category == 'Weapon') {
            itemCard = $(itemCardData)
            itemCard.find('.item-card-price').text('$'+itemInfo.price.toFixed(2))
            itemCard.find('.item-card-deal').text(Math.floor(((itemInfo.buffPrice/itemInfo.price)-1)*100)+'%')
            itemCard.find('.item-card-image').attr('src', itemInfo.image)
            if (typeof(itemInfo.float) == 'string') {
                itemCard.find('.item-card-float-abbreviation').text(itemInfo.float)
                itemCard.find('.item-card-float').text('???')
                itemCard.find('.item-card-float-bar-cover').css('width', 'calc(100% - '+abbreviationToFloat(itemInfo.float)*100+'%)')
            } else {
                itemCard.find('.item-card-float-abbreviation').text(floatToAbbreviation(itemInfo.float))
                itemCard.find('.item-card-float').text(itemInfo.float.toFixed(7))
                itemCard.find('.item-card-float-bar-cover').css('width', 'calc(100% - '+itemInfo.float*100+'%)')
            } 
            itemCard.find('.item-card-name').text(itemInfo.name)
            itemCard.find('.item-card-type').text(itemInfo.itemType)
            itemCard.find('.item-card-copy-name-to-clipboard').click(function() {
                navigator.clipboard.writeText(itemInfo.hashName)
            })  
            itemCard.find('.item-card-buff-link').attr('href', itemInfo.buffLink)
            itemCard.find('.item-card-buff-price').text('$'+itemInfo.buffPrice)
            itemCard.find('.item-card-steam-link').attr('href', itemInfo.steamLink)
            itemCard.find('.item-card-steam-price').text('$'+itemInfo.steamPrice)
            itemCard.find('.item-card-price-empire-link').attr('href', itemInfo.priceEmpireLink)
            itemCard.find('.item-card-price-empire-price').text('$'+itemInfo.priceEmpirePrice)
            $('#item-container').append(itemCard)
        }
    })
}

$(document).ready(async function() {
    const cache = await $.ajax({
        type: 'GET',
        url: 'api/item-cache?market=waxpeer'
    })
    console.log(cache)
    for (let i = 0; i < 30; i++) {
        const itemCache = cache[i]
        createCard({
            ...itemCache,
            ...{
                buffPrice: 70,
                steamPrice: 120,
                priceEmpirePrice: 105,
                buffLink: 'a',
                steamLink: 'b',
                priceEmpireLink: 'c',
                image: 'https://steamcommunity-a.akamaihd.net/economy/image/class/730/1309991239/200fx125f',
            }
        })
    }
})
