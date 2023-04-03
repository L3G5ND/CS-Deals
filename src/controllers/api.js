import item from '../services/modules/Item.js'

export default {

    async itemCache(req, res) {
        if (!req.query.market) {
            req.query.market = 'all'
        }
        res.json(await item.getItems(req.query.market))
    },

    async dealCache(req, res) {
        if (!req.query.market) {
            req.query.market = 'all'
        }
        let dealPercentage = 0
        const itemCache = await item.getItems(req.query.market)
        const dealCache = {}
        for (let i = 0; i < Object.keys(itemCache).length; i++) {
            const item = itemCache[i]
            let itemDealPercentage
            if (item.buffInfo.buy > item.price) {
                itemDealPercentage = ((item.buffInfo.buy/item.price)-1)*100
            } else {
                itemDealPercentage = -((item.price/item.buffInfo.buy)-1)*100
            }
            if (itemDealPercentage >= dealPercentage) {
                dealCache[Object.keys(dealCache).length] = item
            }
        }
        res.json(dealCache)
    }

}
