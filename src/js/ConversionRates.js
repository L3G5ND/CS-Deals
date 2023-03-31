import axios from "axios"

import conversionRateModel from "../models/ConversionRates.js"

const url = "https://prices.csgotrader.app/latest/exchange_rates.json"

async function fetchData() {
    const result = await axios({
        method: 'get',
        url: url
    })
    return result.data
}

async function getData() {
    let conversionRates = await conversionRateModel.findOne()
    if (!conversionRates) {
        let data = await fetchData()
        conversionRates = new conversionRateModel({ rates: data })
        await conversionRates.save()
    } else {
        const hourDifference = ((new Date).getTime() - conversionRates.updatedAt.getTime()) / 1000 / 60 / 60
        if (hourDifference >= 6) {
            let data = await fetchData()
            conversionRates.rates = data
            conversionRates.updatedAt = new Date
            await conversionRates.save({ timestamps: false })
        }
    }
    return conversionRates.toObject().rates
}

export default {

    async getRateList() {
        return await getData()
    },

    async getRate(currency) {
        return (await getData())[currency]
    }

}