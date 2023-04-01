import ItemCache from "./ItemCache.js"
import ItemNameParser from "./util/ItemNameParser.js"
import ItemWebsocket from "./websocket/ItemWebsocket.js"
import Prices from "./Prices.js"

const priceEmpireQualities = {
    'Factory New': 'factory-new',
    'Minimal Wear': 'minimal-wear',
    'Field-Tested': 'field-tested',
    'Well-Worn': 'well-worn',
    'Battle-Scarred': 'battle-scarred',
}

function qualityToPriceEmpireQuality(quality) {
    for (const key in priceEmpireQualities) {
        if (key == quality) {
            return priceEmpireQualities[key]
        }
    }
}

const priceEmpirePaths = {
    'Case': 'container',
    'Weapon': 'skin',
    'Gloves': 'gloves',
    'Key': 'key',
    'Sticker Capsule': 'sticker-capsule',
    'Sticker': 'sticker',
    'Graffiti': 'graffiti',
    'Graffiti Box': 'graffiti-capsule',
    'Music Kit': 'music-kit',
    'Patch Pack': 'skin',
    'Patch': 'skin',
    'Pin': 'skin',
    'Name Tag': 'skin',
    'Storage Unit': 'skin',
    'Swap Tool': 'skin',
    'Souvenir Package': 'skin',
    'Viewer Pass': 'skin',
    'Character': 'agent'
}

function getPriceEmpireLink(info) {
    const category = info.category
    const name = info.name.replaceAll(' | ', ' ').replaceAll(',', '').replaceAll(' (', ' ').replaceAll(')', '').replaceAll('\'', '')
    let path = ''
    let dir = ''

    for (const key in priceEmpirePaths) {
        if (category == key) {
            dir = priceEmpirePaths[key]
        }
    }

    if (info.tag == 'StatTrak™') {
        path += 'stattrak-'
    } else if (info.tag == 'Souvenir') {
        path += 'souvenir-'
    }
    
    if (category == 'Weapon' || category == 'Gloves') {
        path += info.itemType + '-'
        path += name + '-'
        let quality
        if (typeof(info.float) == 'number') {
            quality = ItemNameParser.floatToQuality(info.float)
        } else if (typeof(info.float) == 'string') {
            quality = ItemNameParser.abbreviationToQuality(info.float)
        }
        path += qualityToPriceEmpireQuality(quality)
    } else if (category == 'Sticker') {
        path += info.itemType + '-'
        path += name
        if (info.stickerType != 'Normal') {
            path += '-' + info.stickerType
        }
        if (info.event) {
            path += '-' + info.event
        }
    } else if (category == 'Graffiti') {
        path += 'sealed-graffiti-'
        path += name
    } else if (category == 'Music Kit') {
        path += info.itemType + '-'
        path += name
    } else if (category == 'Character') {
        path += name
    } else {
        path += name
    }

    path = path.replaceAll('.', '').replaceAll(' ', '-').toLowerCase()
    return 'https://pricempire.com/item/csgo/'+dir+'/'+path
}

async function addExtraInfo(info) {
    const itemPrices = await Prices.getPrices(info.hashName)
    info.buffInfo = {
        buy: 0, 
        sell: 0, 
    }
    const buffPrices = itemPrices.buff163
    if (buffPrices) {
        if (buffPrices.starting_at || buffPrices.highest_order) {
            const buffBuy = buffPrices.starting_at.price
            const buffSell = buffPrices.highest_order.price
            info.buffInfo = {
                buy: buffBuy ? buffBuy : 0, 
                sell: buffSell ? buffSell : 0, 
            }
        }
    }

    info.steamValue = itemPrices.steam.last_7d ? itemPrices.steam.last_7d : 0
    info.steamLink = 'https://steamcommunity.com/market/listings/730/'+info.hashName

    info.priceEmpireLink = getPriceEmpireLink(info)
}

export default {
    createItem: async function(data) {
        const hashName = data.name

        let info = {
            category: ItemNameParser.getItemCategory(hashName),
            name: ItemNameParser.getItemName(hashName),
            tag: ItemNameParser.getItemTag(hashName),
            itemType: ItemNameParser.getItemType(hashName),
            stickerType: ItemNameParser.getStickerType(hashName),
            event: ItemNameParser.getEvent(hashName),
            image: ItemNameParser.getImage(hashName),
            hashName: hashName,
            price: data.price,
            float: data.float,
            phase: data.phase,
            itemLink: data.link,
            buffInfo: null,
            steamValue: null,
            steamLink: null,
            priceEmpireLink: null,
        }

        if (info.category == 'Weapon' || info.category == 'Gloves') {
            if (!info.float) {
                info.float = ItemNameParser.getWeaponQuality(hashName)
            }
        }

        ItemCache.addCache({
            market: data.market,
            info: info
        })

        await addExtraInfo(info)

        let dealPercentage = 0
        let itemDealPercentage
        if (info.buffInfo.buy > info.price) {
            itemDealPercentage = ((info.buffInfo.buy/info.price)-1)*100
        } else {
            itemDealPercentage = -((info.price/info.buffInfo.buy)-1)*100
        }
        if (itemDealPercentage >= dealPercentage) {
            ItemWebsocket.addDeal(info)
        }

        ItemWebsocket.addItem(info)

        return info
    },

    getItems: async function(market) {
        const cache = await ItemCache.getCache(market)
        for (let i = 0; i < Object.keys(cache).length; i++) {
            await addExtraInfo(cache[i])
        }
        return cache
    }
}