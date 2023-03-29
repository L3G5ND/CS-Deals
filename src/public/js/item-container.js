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

function createCard(itemInfo) {
    $.get('../html/item-card.html', function(itemCardData) {
        itemCard = $(itemCardData)
        itemCard.find('.item-card-price').text('$'+itemInfo.price.toFixed(2))
        itemCard.find('.item-card-deal').text(Math.floor(((itemInfo.buffPrice/itemInfo.price)-1)*100)+'%')
        itemCard.find('.item-card-image').attr('src', itemInfo.image)
        itemCard.find('.item-card-float-abbreviation').text(floatToAbbreviation(itemInfo.float))
        itemCard.find('.item-card-float').text(itemInfo.float.toFixed(7))
        itemCard.find('.item-card-float-bar-cover').css('width', 'calc(100% - '+itemInfo.float*100+'%)')
        itemCard.find('.item-card-name').text(itemInfo.name)
        itemCard.find('.item-card-type').text(itemInfo.itemType)
        itemCard.find('.item-card-copy-name-to-clipboard').click(function() {
            navigator.clipboard.writeText(itemInfo.hashName)
        })  
        itemCard.find('.item-card-buff-link').attr('href', 'buff')
        itemCard.find('.item-card-buff-price').text('$'+itemInfo.buffPrice)
        itemCard.find('.item-card-steam-link').attr('href', 'steam')
        itemCard.find('.item-card-steam-price').text('$'+itemInfo.steamPrice)
        itemCard.find('.item-card-price-empire-link').attr('href', 'price empire')
        itemCard.find('.item-card-price-empire-price').text('$'+itemInfo.priceEmpirePrice)
        $('#item-container').append(itemCard)
    })
}

$(document).ready(function() {
    for (let i = 0; i < 30; i++) {
        createCard({
            price: 50,
            buffPrice: 70,
            steamPrice: 120,
            priceEmpirePrice: 105,
            float: .1823423,
            hashName: 'helloo',
            name: 'Case Hardened',
            itemType: 'StatTrak Bayonet',
            image: 'https://steamcommunity-a.akamaihd.net/economy/image/class/730/1309991239/200fx125f',
        })
    }
})
