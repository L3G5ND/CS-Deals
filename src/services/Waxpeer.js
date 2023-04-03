import { Waxpeer, TradeWebsocket, WebsiteWebsocket } from "waxpeer"

import settings from "../settings.js"
import Item from "./modules/Item.js"
import ItemNameParser from "./modules/ItemNameParser.js"

const WP = new Waxpeer(settings.secret.waxpeerAPIKey)
const WS = new WebsiteWebsocket(settings.secret.waxpeerAPIKey, ['add_item', 'remove', 'update_item'])

async function onItemAdded(item) {
    if (item.game != 'csgo') {
        return
    }
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
        link: 'https://waxpeer.com/'+ItemNameParser.getLinkName(item.name)+'/item/'+item.item_id,
    })
}

WS.on('add_item', onItemAdded)
WS.on('update_item', onItemAdded)
