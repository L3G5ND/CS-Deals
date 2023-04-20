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

function getDeal(item) {
    let itemDealPercentage
    if (item.estimatedValue > item.price) {
        itemDealPercentage = ((item.estimatedValue/item.price)-1)*100
    } else {
        itemDealPercentage = -((item.price/item.estimatedValue)-1)*100
    }
    return itemDealPercentage
}

const marketToImage = {
    waxpeer: '../images/marketIcons/waxpeer.png',
    skinport: '../images/marketIcons/skinport.png',
}

function getMarketImage(market) {
    for (const key in marketToImage) {
        if (market.toLowerCase() == key.toLowerCase()) {
            return marketToImage[key]
        }
    }
}

let itemCardCount = 0
let itemCardHTML

function createCard(item) {
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

    itemCard.find('.item-card-price').text('$'+item.price.toFixed(2))

    const dealLerpNum = (((item.estimatedValue/item.price)-1)*100 + 100) / 2
    const dealR = (255 * (100 - dealLerpNum)) / 100
    const dealG = (255 * dealLerpNum) / 100
    const dealB = 0
    itemCard.find('.item-card-deal').text(Math.floor(getDeal(item))+'%')
    itemCard.find('.item-card-deal').css('color', 'rgb('+dealR+', '+dealG+', '+dealB+')')

    if (item.market) {
        itemCard.find('.item-card-market-image').attr('src', getMarketImage(item.market))
    }

    itemCard.find('.item-card-image').attr('src', item.image)

    if (item.stickerType) {
        itemCard.find('.item-card-type').text('(' + item.stickerType + ') ' + item.itemType)
    } else if (item.tag) {
        itemCard.find('.item-card-type').css('color', getTagColor(item.tag))
        itemCard.find('.item-card-type').text(item.tag + ' ' + item.itemType)
    } else {
        itemCard.find('.item-card-type').text(item.itemType)
    }

    itemCard.find('.item-card-float-bar-cover').css('width', 'calc(100%)')

    itemCard.find('.item-card-copy-name-to-clipboard').click(function() {
        navigator.clipboard.writeText(item.hashName)
    })

    if (item.buffInfo.buy >= 100000) {
        itemCard.find('.item-card-buff-price').text('$'+item.buffInfo.buy)
    } else {
        itemCard.find('.item-card-buff-price').text('$'+item.buffInfo.buy.toFixed(2))
    }

    itemCard.find('.item-card-steam-link').attr('href', item.steamLink)
    if (item.steamValue >= 100000) {
        itemCard.find('.item-card-steam-price').text('$'+item.steamValue)
    } else {
        itemCard.find('.item-card-steam-price').text('$'+item.steamValue.toFixed(2))
    }

    itemCard.find('.item-card-price-empire-link').attr('href', item.priceEmpireLink)
    itemCard.find('.item-card-buy-page-button').attr('href', item.itemLink)

    itemCard.find('.item-card-buy-button').click(function() {
        window.open(item.itemLink, '_blank')
    })

    if (item.category == 'Weapon' || item.category == 'Gloves') {
        if (typeof(item.float) == 'string') {
            itemCard.find('.item-card-float-abbreviation').text(item.float)
            itemCard.find('.item-card-float').text('???')
            itemCard.find('.item-card-float-bar-cover').css('width', 'calc(100% - '+abbreviationToFloat(item.float)*100+'%)')
        } else if (typeof(item.float) == 'number') {
            itemCard.find('.item-card-float-abbreviation').text(floatToAbbreviation(item.float))
            itemCard.find('.item-card-float').text(item.float.toFixed(7))
            itemCard.find('.item-card-float-bar-cover').css('width', 'calc(100% - '+item.float*100+'%)')
        }
        itemCard.find('.item-card-name').text(item.name)
    } else if (item.category == 'Sticker' || item.category == 'Graffiti' || item.category == 'Patch') {
        if (item.stickerType) {
            itemCard.find('.item-card-float-abbreviation').text(item.stickerType)
        }
        if (item.event) {
            itemCard.find('.item-card-name').text(item.name + ' | ' + item.event)
        } else {
            itemCard.find('.item-card-name').text(item.name)
        }
    } else {
        itemCard.find('.item-card-name').text(item.name)
    }
    
    $('#item-grid').append(itemCard)
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
