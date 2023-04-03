import ItemCache from "./ItemCache.js"
import ItemNameParser from "./ItemNameParser.js"
import ItemWebsocket from "../ItemWebsocket.js"
import Prices from "./Prices.js"

const priceEmpirePaths = {
    'Case': 'container',
    'Weapon': 'skin',
    'Gloves': 'gloves',
    'Key': 'key',
    'Sticker Capsule': 'sticker-capsule',
    'Sticker': 'sticker',
    'Autograph Capsule': 'sticker-capsule',
    'Graffiti': 'graffiti',
    'Graffiti Box': 'graffiti-capsule',
    'Music Kit': 'music-kit',
    'Patch Pack': 'patch-pack',
    'Patch': 'patch',
    'Pin': 'pin',
    'Name Tag': 'other',
    'Storage Unit': 'other',
    'Swap Tool': 'other',
    'Souvenir Package': 'souvenir-package',
    'Viewer Pass': 'other',
    'Character': 'agent'
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

    let path = ''
    for (const key in priceEmpirePaths) {
        if (info.category == key) {
            path = priceEmpirePaths[key]
        }
    }
    info.priceEmpireLink = 'https://pricempire.com/item/csgo/'+path+'/'+ItemNameParser.getLinkName(info.hashName)
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