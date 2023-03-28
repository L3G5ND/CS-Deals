import axios from "axios"

import conversionRateModel from "../../models/ConversionRate.js"
import settings from "../../settings.js"

const APIUrl = "https://api.currencyapi.com/"

async function fetchData() {
    const url = APIUrl + "v3/latest?apikey=" + settings.secret.CurrencyAPIKey
    const result = await axios({
        method: 'get',
        url: url
    })
    const data = result.data.data
    for (const currency in data) {
        data[currency] = data[currency].value
    }
    return data
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
    return conversionRates.rates
}

export default {

    async getRateList() {
        const data = await getData()
        return data
    },

    async getRate(currency) {
        const data = await getData()
        return data[currency]
    }

}