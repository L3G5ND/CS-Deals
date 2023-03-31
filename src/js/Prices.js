import axios from "axios"

import pricesModel from '../models/Prices.js'

const url = 'https://prices.csgotrader.app/latest/prices_v6.json'

let cachedPrices
let lastUpdated
const updateInterval = 12

async function fetchData() {
    const result = await axios({
        method: 'get',
        url: url
    })
    return result.data
}

async function getData() {
    if (cachedPrices) {
        const hourDifference = ((new Date).getTime() - lastUpdated.getTime()) / 1000 / 60 / 60
        if (hourDifference >= updateInterval) {
            let prices = await pricesModel.findOne()
            let data = await fetchData()
            prices.prices = data
            prices.updatedAt = new Date
            await prices.save({ timestamps: false })
            cachedPrices = prices.toObject().prices
            lastUpdated = prices.updatedAt
        }
        return cachedPrices
    } else {
        let prices = await pricesModel.findOne()
        if (!prices) {
            let data = await fetchData()
            prices = new pricesModel({ prices: data })
            await prices.save()
        } else {
            const hourDifference = ((new Date).getTime() - prices.updatedAt.getTime()) / 1000 / 60 / 60
            if (hourDifference >= updateInterval) {
                let data = await fetchData()
                prices.prices = data
                prices.updatedAt = new Date
                await prices.save({ timestamps: false })
            }
        }
        cachedPrices = prices.toObject().prices
        lastUpdated = prices.updatedAt
        return cachedPrices
    }
}

getData()

export default {

    async getPriceList() {
        return await getData()
    },

    async getPrices(hashName) {
        return (await getData())[hashName]
    }

}