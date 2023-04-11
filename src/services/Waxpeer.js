import { Waxpeer, TradeWebsocket, WebsiteWebsocket } from "waxpeer"

import settings from "../settings.js"
import Item from "./modules/Item.js"
import ItemNameParser from "./modules/ItemNameParser.js"

const WS = new WebsiteWebsocket(settings.secret.waxpeerAPIKey, ['add_item', 'remove', 'update_item'])

async function onItemAdded(item) {
    if (item.game != 'csgo') {
        return
    }
    Item.createItem({
        market: 'waxpeer',
        name: item.name,
        price: item.price/1000,
        float: null,
        link: 'https://waxpeer.com/'+ItemNameParser.getLinkName(item.name)+'/item/'+item.item_id,
    })
}

WS.on('add_item', onItemAdded)
WS.on('update_item', onItemAdded)
