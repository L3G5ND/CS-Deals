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

let itemCardCount = 0
let itemCardHTML

function createCard(itemInfo) {
    itemCardCount += 1
    const index = itemCardCount
    
    if (!itemCardHTML) {
        $.ajax({
            async: false,
            type: 'GET',
            url: '../html/item-card.html',
            success: function(itemCardData) {
                itemCardHTML = itemCardData
            }
        })
    }

    itemCard = $(itemCardHTML)
    itemCard.css('order', -index)

    itemCard.find('.item-card-price').text('$'+itemInfo.price.toFixed(2))

    const dealLerpNum = (((itemInfo.buffInfo.buy/itemInfo.price)-1)*100 + 100) / 2
    const dealR = (255 * (100 - dealLerpNum)) / 100
    const dealG = (255 * dealLerpNum) / 100
    const dealB = 0
    let dealPercentage
    if (itemInfo.buffInfo.buy > itemInfo.price) {
        dealPercentage = ((itemInfo.buffInfo.buy/itemInfo.price)-1)*100
    } else {
        dealPercentage = -((itemInfo.price/itemInfo.buffInfo.buy)-1)*100
    }
    itemCard.find('.item-card-deal').text(Math.floor(dealPercentage)+'%')
    itemCard.find('.item-card-deal').css('color', 'rgb('+dealR+', '+dealG+', '+dealB+')')

    itemCard.find('.item-card-image').attr('src', itemInfo.image)

    if (itemInfo.stickerType) {
        itemCard.find('.item-card-type').text('(' + itemInfo.stickerType + ') ' + itemInfo.itemType)
    } else if (itemInfo.tag) {
        itemCard.find('.item-card-type').css('color', getTagColor(itemInfo.tag))
        itemCard.find('.item-card-type').text(itemInfo.tag + ' ' + itemInfo.itemType)
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
    itemCard.find('.item-card-buy-page-button').attr('href', itemInfo.itemLink)

    itemCard.find('.item-card-buy-button').click(function() {
        window.open(itemInfo.itemLink, '_blank')
    })

    if (itemInfo.category == 'Weapon' || itemInfo.category == 'Gloves') {
        if (typeof(itemInfo.float) == 'string') {
            itemCard.find('.item-card-float-abbreviation').text(itemInfo.float)
            itemCard.find('.item-card-float').text('???')
            itemCard.find('.item-card-float-bar-cover').css('width', 'calc(100% - '+abbreviationToFloat(itemInfo.float)*100+'%)')
        } else if (typeof(itemInfo.float) == 'number') {
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
}

const itemContainer = {

    createCard: function(item) {
        createCard({
            ...{
                steamLink: 'https://steamcommunity.com/market/',
                priceEmpireLink: 'https://pricempire.com/',
                itemLink: '',
                image: '',
            },
            ...item
        })
    },

    clearContainer: function() {

    }

}
