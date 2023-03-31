const itemTags = {
    '★': '#ff3e3e', 
    'StatTrak™': '#dbbc16',
    'Souvenir': '#881acd'
}

function getTagColor(tag) {
    for (const key in itemTags) {
        if (key == tag) {
            return itemTags[key]
        }
    }
}

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
        itemCard = $(itemCardData)
        itemCard.find('.item-card-price').text('$'+itemInfo.price.toFixed(2))
        itemCard.find('.item-card-deal').text(Math.floor(((itemInfo.buffInfo.buy/itemInfo.price)-1)*100)+'%')
        itemCard.find('.item-card-image').attr('src', itemInfo.image)
        if (itemInfo.stickerType) {
            itemCard.find('.item-card-type').text('(' + itemInfo.stickerType + ') ' + itemInfo.itemType)
        } else if (itemInfo.tag) {
            itemCard.find('.item-card-type').css('color', getTagColor(itemInfo.tag))
            itemCard.find('.item-card-type').text(itemInfo.tag + itemInfo.itemType)
        } else {
            itemCard.find('.item-card-type').text(itemInfo.itemType)
        }
        itemCard.find('.item-card-float-bar-cover').css('width', 'calc(100%)')
        itemCard.find('.item-card-copy-name-to-clipboard').click(function() {
            navigator.clipboard.writeText(itemInfo.hashName)
        })
        if (itemInfo.buffInfo.buy >= 100000) {
            itemCard.find('.item-card-buff-price').text('$'+itemInfo.buffInfo.buy)
        } else {
            itemCard.find('.item-card-buff-price').text('$'+itemInfo.buffInfo.buy.toFixed(2))
        }
        itemCard.find('.item-card-steam-link').attr('href', itemInfo.steamLink)
        if (itemInfo.steamValue >= 100000) {
            itemCard.find('.item-card-steam-price').text('$'+itemInfo.steamValue)
        } else {
            itemCard.find('.item-card-steam-price').text('$'+itemInfo.steamValue.toFixed(2))
        }
        itemCard.find('.item-card-price-empire-link').attr('href', itemInfo.priceEmpireLink)   

        if (itemInfo.category == 'Weapon' || itemInfo.category == 'Gloves') {
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
        } else if (itemInfo.category == 'Sticker' || itemInfo.category == 'Graffiti' || itemInfo.category == 'Patch') {
            if (itemInfo.stickerType) {
                itemCard.find('.item-card-float-abbreviation').text(itemInfo.stickerType)
            }
            if (itemInfo.event) {
                itemCard.find('.item-card-name').text(itemInfo.name + ' | ' + itemInfo.event)
            } else {
                itemCard.find('.item-card-name').text(itemInfo.name)
            }
        } else {
            itemCard.find('.item-card-name').text(itemInfo.name)
        }
        
        $('#item-container').append(itemCard)
    })
}

$(document).ready(async function() {
    const cache = await $.ajax({
        type: 'GET',
        url: 'api/item-cache?market=waxpeer'
    })
    console.log(cache)
    for (let i = 0; i < Object.keys(cache).length; i++) {
        const itemCache = cache[i]
        createCard({
            ...{
                steamLink: 'https://steamcommunity.com/market/',
                priceEmpireLink: 'https://pricempire.com/',
                image: '',
            },
            ...itemCache
        })
    }
})
