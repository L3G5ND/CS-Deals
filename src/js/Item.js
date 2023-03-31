import ItemCache from "./ItemCache.js"
import ItemNameParser from "./util/ItemNameParser.js"
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

async function addExtraInfo(info) {
    const itemPrices = await Prices.getPrices(info.hashName)
    info.buffInfo = {
        buy: itemPrices.buff163.starting_at.price, 
        sell: itemPrices.buff163.highest_order.price
    }

    info.steamValue = itemPrices.steam.last_7d
    info.steamLink = 'https://steamcommunity.com/market/listings/730/'+info.hashName

    let priceEmpireName = ''
    if (info.tag == 'StatTrak™') {
        priceEmpireName += 'stattrak-'
    } else if (info.tag == 'Souvenir') {
        priceEmpireName += 'souvenir-'
    }
    priceEmpireName += info.itemType + '-'
    priceEmpireName += info.name + '-'
    if (info.category == 'Weapon' || info.category == 'Gloves') {
        let quality
        if (typeof(info.float) == 'number') {
            quality = ItemNameParser.floatToQuality(info.float)
        } else if (typeof(info.float) == 'string') {
            quality = ItemNameParser.abbreviationToQuality(info.float)
        }
        priceEmpireName += qualityToPriceEmpireQuality(quality)
    }
    priceEmpireName = priceEmpireName.replace(' ', '-')
    priceEmpireName = priceEmpireName.toLowerCase()
    info.priceEmpireLink = 'https://pricempire.com/item/csgo/skin/'+priceEmpireName
}

export default {
    createItem: async function(data) {
        const hashName = data.name

        const info = {
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
            id: data.id,
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

        return await addExtraInfo(info)
    },

    getItems: async function(market) {
        const cache = await ItemCache.getCache(market)
        for (let i = 0; i < Object.keys(cache).length; i++) {
            await addExtraInfo(cache[i])
        }
        return cache
    }
}