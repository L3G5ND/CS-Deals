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

async function addExtraInfo(item) {
    const itemPrices = await Prices.getPrices(item.hashName)
    item.buffInfo = {
        buy: 0, 
        sell: 0, 
    }
    const buffPrices = itemPrices.buff163
    if (buffPrices) {
        if (buffPrices.starting_at || buffPrices.highest_order) {
            const buffBuy = buffPrices.starting_at.price
            const buffSell = buffPrices.highest_order.price
            item.buffInfo = {
                buy: buffBuy ? buffBuy : 0, 
                sell: buffSell ? buffSell : 0, 
            }
        }
    }

    item.steamValue = itemPrices.steam.last_7d ? itemPrices.steam.last_7d : 0
    item.steamLink = 'https://steamcommunity.com/market/listings/730/'+item.hashName

    if (item.buffInfo.buy > item.steamValue) {
        item.estimatedValue = item.steamValue
    } else {
        item.estimatedValue = item.buffInfo.buy
    }
    if (item.steamValue <= 0) {
        item.estimatedValue = item.buffInfo.buy
    }

    let path = ''
    for (const key in priceEmpirePaths) {
        if (item.category == key) {
            path = priceEmpirePaths[key]
        }
    }
    item.priceEmpireLink = 'https://pricempire.com/item/csgo/'+path+'/'+ItemNameParser.getLinkName(item.hashName)
}

export default {

    createItem: async function(data) {
        const hashName = data.name

        let item = {
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
            estimatedValue: 0,
            buffInfo: null,
            steamValue: null,
            steamLink: null,
            priceEmpireLink: null,
        }

        if (item.category == 'Weapon' || item.category == 'Gloves') {
            if (!item.float) {
                item.float = ItemNameParser.getWeaponQuality(hashName)
            }
        }

        ItemCache.addCache({
            market: data.market,
            item: item
        })
         
        await addExtraInfo(item)

        if (this.getItemDeal(item) >= 0) {
            ItemCache.addDealCache({
                market: data.market,
                item: item
            })
            ItemWebsocket.addDeal(item)
        }

        ItemWebsocket.addItem(item)

        return item
    },

    getItems: async function(market) {
        const cache = await ItemCache.getCache(market)
        for (let i = 0; i < Object.keys(cache).length; i++) {
            await addExtraInfo(cache[i])
        }
        return cache
    },

    getDeals: async function(market) {
        const cache = await ItemCache.getDealCache(market)
        for (let i = 0; i < Object.keys(cache).length; i++) {
            await addExtraInfo(cache[i])
        }
        return cache
    },

    getItemDeal(item) {
        let itemDealPercentage
        if (item.estimatedValue.buy > item.price) {
            itemDealPercentage = ((item.estimatedValue/item.price)-1)*100
        } else {
            itemDealPercentage = -((item.price/item.estimatedValue)-1)*100
        }
        return itemDealPercentage
    }

}