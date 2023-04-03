import axios from "axios"

import conversionRate from "../modules/ConversionRates.js"

const APIUrl = "https://buff.163.com/api/market/goods"

export default {

    async getItemIdFromName(name) {
        const url = APIUrl

        const result = await axios({
            method: "get",
            url: url,
            params: {
                game: "csgo",
                page_num: 1,
                search: name,
                use_suggestion: 0,
            },
            headers: {
                Cookie: "session=1-Cpd9QZkxBF0r8tGeGBetfj6QQzG2B5xIJo2TwW1yIN_X2033610679;"
            }
        })
        if (result.status != 200) {
            return false
        }
        
        const data = result.data.data.items
        for (let i = 0; i < data.length; i++) {
            let item = data[i]
            if (item.market_hash_name == name) {
                return item.id
            }
        }
    },


    async getBuyOrders(data) {
        const url = APIUrl + "/buy_order"

        const result = await axios({
            method: "get",
            url: url,
            params: {
                game: "csgo",
                goods_id: data.itemId,
                page_num: data.pageNum || 1,
                sort_by: data.sortBy || "default",
                mode: null,
                allow_tradable_cooldown: data.allowTradeCooldown || 1,
            }
        })
        if (result.status != 200) {
            return false
        }

        const cRate = await conversionRate.getRate('CNY')
        const items = result.data.data.items
        for (const key in items) {
            items[key].price = items[key].price / cRate
        }

        return items
    },

    async getBuyPrice(data) {
        if (typeof(data) == 'number') {
            data = {
                itemId: data
            }
        }

        const buyOrders = await this.getBuyOrders(data)
        if (buyOrders.length <= 0) {
            return
        }

        return buyOrders[1].price
    },


    async getSellOrders(data) {
        const url = APIUrl + "/sell_order"

        const result = await axios({
            method: "get",
            url: url,
            params: {
                game: "csgo",
                goods_id: data.itemId,
                page_num: data.pageNum || 1,
                sort_by: data.sortBy || "default",
                mode: null,
                allow_tradable_cooldown: data.allowTradeCooldown || 1,
            }
        })
        if (result.status != 200) {
            return false
        }

        const cRate = await conversionRate.getRate('CNY')
        const items = result.data.data.items
        for (const key in items) {
            items[key].price = items[key].price / cRate
        }

        return items
    },

    async getSellPrice(data) {
        if (typeof(data) == 'number') {
            data = {
                itemId: data
            }
        } else if (typeof(data) != 'object') {
            data = {}
        }

        const sellOrders = await this.getSellOrders(data)
        if (sellOrders.length <= 0) {
            return
        }

        return sellOrders[1].price
    }

}