import { Waxpeer, TradeWebsocket, WebsiteWebsocket } from "waxpeer"

import secret from "../config/secret.js"
import Item from "./Item.js"

const WP = new Waxpeer(secret.WaxpeerAPIKey)
const WS = new WebsiteWebsocket(secret.WaxpeerAPIKey, ['add_item', 'remove', 'update_item'])

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
    onItemAdded(item)
})

console.log('[INFO] - Waxpeer.js ran successfully')