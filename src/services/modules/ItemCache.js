import ItemCache from "../../models/ItemCache.js"
import settings from '../../settings.js'
import TaskScheduler from "./TaskScheduler.js"

const ItemCacheTaskScheduler = new TaskScheduler({maxTasks: 10})

async function addCache(data) {
    const itemCacheModels = ItemCache[data.type]
    const cacheModel = itemCacheModels[Object.keys(itemCacheModels).find((key) => key.toLowerCase() === data.market.toLowerCase())]
    if (!cacheModel) {
        return false
    }

    const sortedCache = await cacheModel.find({}).sort({createdAt: 'descending'})
    const deletedIds = []
    const cacheLength = Object.keys(sortedCache).length
    if (cacheLength >= settings.database.maxItemCache) {
        for (let i = settings.database.maxItemCache-1; i < cacheLength; i++) {
            deletedIds.push(sortedCache[i].id)
        }
    }
    if (sortedCache[0]) {
        await cacheModel.deleteMany({_id: {$in: deletedIds}})
    }

    const cacheDocument = new cacheModel({ item: data.item })
    await cacheDocument.save()

    return true
}

async function getCache(data) {
    const itemCacheModels = ItemCache[data.type]
    const cacheModel = itemCacheModels[Object.keys(itemCacheModels).find((key) => key.toLowerCase() === data.market.toLowerCase())]
    if (!cacheModel) {
        return false
    }

    const sortedCache = await cacheModel.find({})
    
    const itemCache = {}
    for (let i = 0; i < sortedCache.length; i++) {
        itemCache[i] = sortedCache[i].item
    }

    return itemCache
}

async function _addCache(data) {
    await addCache(data)
    if (data.market != 'all') {
        await addCache({
            type: data.type,
            market: 'all',
            item: data.item
        })
    }
}

export default {

    addCache: async function(data) {
        data.type = 'normal'
        ItemCacheTaskScheduler.addTask(_addCache, data)
    },

    getCache: async function(market) {
        return await getCache({
            type: 'normal',
            market: market
        })
    },

    addDealCache: async function(data) {
        data.type = 'deal'
        ItemCacheTaskScheduler.addTask(_addCache, data)
    },

    getDealCache: async function(market) {
        return await getCache({
            type: 'deal',
            market: market
        })
    }
    
}