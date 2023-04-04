import Item from '../services/modules/Item.js'

export default {

    async itemCache(req, res) {
        if (!req.query.market) {
            req.query.market = 'all'
        }
        res.json(await Item.getItems(req.query.market))
    },

    async dealCache(req, res) {
        if (!req.query.market) {
            req.query.market = 'all'
        }
        const itemCache = await Item.getDeals(req.query.market)
        const dealCache = {}
        for (let i = 0; i < Object.keys(itemCache).length; i++) {
            const item = itemCache[i]
            const itemDealPercentage = Item.getItemDeal(item)
            if (itemDealPercentage >= 0) {
                dealCache[Object.keys(dealCache).length] = item
            }
        }
        res.json(dealCache)
    }

}
