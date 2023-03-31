import { Waxpeer, TradeWebsocket, WebsiteWebsocket } from "waxpeer"

import settings from "../config/settings.js"
import TaskScheduler from "./util/TaskScheduler.js"
import Item from "./Item.js"

const WP = new Waxpeer(settings.secret.WaxpeerAPIKey)
const WS = new WebsiteWebsocket(settings.secret.WaxpeerAPIKey, ['add_item', 'remove', 'update_item'])

const waxpeerTaskSceduler = new TaskScheduler({ maxTasks: 2, taskDelay: 1})

async function onItemAdded(item) {
    const itemList = await WP.getItemsList(0, item.name)
    let extraInfo
    for (let i = 0; i < itemList.items.length; i++) {
        if (itemList.items[i].item_id == item.item_id) {
            extraInfo = itemList.items[i]
        }
    }
    if (!extraInfo) {
        return
    }
    Item.createItem({
        market: 'waxpeer',
        name: item.name,
        price: item.price/1000,
        float: extraInfo.float,
        phase: extraInfo.phase,
        image: item.image,
        link: 'https://waxpeer.com/market/item/'+item.item_id,
    })
}

WS.on('add_item', async (item) => {
    if (item.game != 'csgo') {
        return
    }
    waxpeerTaskSceduler.addTask(onItemAdded, item)
})