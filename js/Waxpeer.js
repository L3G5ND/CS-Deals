import { Waxpeer, TradeWebsocket, WebsiteWebsocket } from "waxpeer"

import settings from "../settings.js"
import buff from "./api/Buff.js"
import TaskScheduler from "./util/TaskScheduler.js"
import { Waxpeer as WaxpeerDealsCache } from "../models/DealsCache.js"

const WS = new WebsiteWebsocket(settings.secret.WaxpeerAPIKey, ['add_item', 'remove', 'update_item'])

const cacheTaskScheduler = new TaskScheduler()
const waxpeerTaskSceduler = new TaskScheduler({ maxTasks: 2, taskDelay: 1})

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

async function onItemAdded(item) {
    item.price = item.price/1000
    console.log(item)

    let buffItemId = await buff.getItemIdFromName(item.name)
    let sellPrice = await buff.getSellPrice(buffItemId)
    let buyPrice = await buff.getBuyPrice(buffItemId)

    console.log("\n"+item.name+"\nBuff Buy Price: "+buyPrice+"\nBuff Sell Price: "+sellPrice+"\nWaxpeer Sell Price: "+item.price+"\n"+item.price/buyPrice+"% Buff Price\n")

    cacheTaskScheduler.addTask(addToCache, {
        name: item.name,
        price: item.price
    })
}

WS.on('add_item', async (item) => {
    if (item.game != 'csgo') {
        return
    }
    console.log(item.name)
    waxpeerTaskSceduler.addTask(onItemAdded, item)
})
WS.on('remove', (message) => {
    
})
WS.on('update_item', (message) => {
    
})