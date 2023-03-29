import TaskScheduler from "./util/TaskScheduler.js"
import { Waxpeer as WaxpeerDealsCache } from "../models/DealsCache.js"

const cacheTaskScheduler = new TaskScheduler()

async function addToCache(data) {
    const sortedCache = await WaxpeerDealsCache.find({}).sort({createdAt: 'descending'})

    if (sortedCache.length >= settings.maxCache) {
        for (let i = settings.maxCache-1; i < sortedCache.length; i++) {
            await WaxpeerDealsCache.findByIdAndDelete(sortedCache[i].id)
        }
    }

    const dealsCache = new WaxpeerDealsCache({
        name: data.name,
        price: data.price
    })
    await dealsCache.save()
}

export default {
    addToDealsCache: function(data) {
        data.cacheType = 'deals'
        cacheTaskScheduler.addTask(addToCache(data))
        
    },
    addToCache: function(data) {
        data.cacheType = 'items'
        cacheTaskScheduler.addTask(addToCache(data))
    }
}