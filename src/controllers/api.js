import Item from '../services/modules/Item.js'

function filterItems(items, filterOptions) {
    const filteredItems = {}
    for (let i = 0; i < Object.keys(items).length; i++) {
        const item = items[i]
        const itemDealPercentage = Item.getItemDeal(item)
        if (itemDealPercentage <= filterOptions.maxDeals) {
            if(itemDealPercentage >= filterOptions.minDeals) {
                filteredItems[Object.keys(filteredItems).length] = item
            }
        }
    }
    return filteredItems
}

export default {

    async itemCache(req, res) {
        const tierInfo = req.TierInfo
        const params = req.query
        params.market = params.market || 'all'
        params.minDeal = params.minDeal != 'null' ? params.minDeal : 0
        params.maxDeal = params.maxDeal != 'null' ? params.maxDeal : tierInfo.maxDeals

        const itemCache = await Item.getItems(params.market)
        const filteredItems = filterItems(itemCache, {
            maxDeals: Math.min(params.maxDeal, tierInfo.maxDeals),
            minDeals: params.minDeal,
        })
        res.json(filteredItems)
    },

    async dealCache(req, res) {
        const tierInfo = req.TierInfo
        const params = req.query
        params.market = params.market || 'all'
        params.minDeal = params.minDeal != 'null' ? params.minDeal : 0
        params.maxDeal = params.maxDeal != 'null' ? params.maxDeal : tierInfo.maxDeals

        const itemCache = await Item.getDeals(params.market)
        const filteredItems = filterItems(itemCache, {
            maxDeals: Math.min(params.maxDeal, tierInfo.maxDeals),
            minDeals: params.minDeal,
        })
        res.json(filteredItems)
    }

}
