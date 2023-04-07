import Item from '../services/modules/Item.js'
import settings from '../settings.js'

function filterItems(items, filterOptions) {
    const filteredItems = {}
    for (let i = 0; i < Object.keys(items).length; i++) {
        const item = items[i]
        const itemDealPercentage = Item.getItemDeal(item)
        if (itemDealPercentage <= filterOptions.maxDeals) {
            filteredItems[Object.keys(filteredItems).length] = item
        }
    }
    return filteredItems
}

export default {

    async itemCache(req, res) {
        const tierInfo = req.TierInfo
        if (!req.query.market) {
            req.query.market = 'all'
        }

        const itemCache = await Item.getItems(req.query.market)
        const filteredItems = filterItems(itemCache, {
            maxDeals: tierInfo.maxDeals,
        })
        res.json(filteredItems)
    },

    async dealCache(req, res) {
        const tierInfo = req.TierInfo
        if (!req.query.market) {
            req.query.market = 'all'
        }

        const itemCache = await Item.getDeals(req.query.market)
        const filteredItems = filterItems(itemCache, {
            maxDeals: tierInfo.maxDeals
        })
        res.json(filteredItems)
    }

}
