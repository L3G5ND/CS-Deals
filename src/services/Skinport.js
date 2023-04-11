import { io } from "socket.io-client"
import Item from "./modules/Item.js"

const socket = io('https://skinport.com', {
    transports: ['websocket'],
})

socket.on('saleFeed', (saleFeed) => {
    if (saleFeed.eventType != 'listed') {
        console.log(saleFeed.eventType)
        return
    }
    let items = saleFeed.sales
    for (let i = 0; i < Object.keys(items).length; i++) {
        const item = items[i]
        Item.createItem({
            market: 'skinport',
            name: item.marketHashName,
            price: item.salePrice/100,
            float: item.wear,
            link: 'https://skinport.com/item/'+item.url+'/'+item.saleId,
        })
    }
})

socket.emit('saleFeedJoin', {
    currency: 'USD',
    locale: 'en',
    appid: 730
})