import axios from "axios"

const url = "https://prices.csgotrader.app/latest/exchange_rates.json"

let cache
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
    const now = (new Date).getTime()
    if (cache) {
        const hourDifference = (now - lastUpdated) / 1000 / 60 / 60
        if (hourDifference >= updateInterval) {
            cache = await fetchData()
            lastUpdated = now
        }
    } else {
        cache = await fetchData()
        lastUpdated = now
    }
    return cache
}

export default {

    async getRateList() {
        return await getData()
    },

    async getRate(currency) {
        return (await getData())[currency]
    }

}