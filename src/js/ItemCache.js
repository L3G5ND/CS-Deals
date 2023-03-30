import ItemCache from "../models/ItemCache.js"
import settings from '../config/settings.js'

async function addCache(data) {
    const cacheModel = ItemCache[Object.keys(ItemCache).find((key) => key.toLowerCase() === data.market.toLowerCase())]
    if (!cacheModel) {
        return false
    }

    const sortedCache = await cacheModel.find({}).sort({createdAt: 'descending'})
    const deletedIds = []
    if (sortedCache.length >= settings.maxCache) {
        for (let i = settings.maxCache-1; i < sortedCache.length; i++) {
            deletedIds.push(sortedCache[i].id)
        }
    }
    if (sortedCache[0]) {
        await cacheModel.deleteMany({_id: {$in: deletedIds}})
    }

    const cacheDocument = new cacheModel({ info: data.info })
    await cacheDocument.save()

    return true
}

async function getCache(market) {
    const cacheModel = ItemCache[Object.keys(ItemCache).find((key) => key.toLowerCase() === market.toLowerCase())]
    if (!cacheModel) {
        return false
    }

    const sortedCache = await cacheModel.find({}).sort({createdAt: 'descending'})
    const itemCache = {}

    for (let i = 0; i < sortedCache.length; i++) {
        itemCache[i] = sortedCache[i].info
    }

    return itemCache
}

export default {
    addCache: async function(data) {
        const res = await addCache(data)
        await addCache({ market: 'all', info: data.info })
        return res
    },
    getCache: async function(market) {
        return await getCache(market)
    },
}