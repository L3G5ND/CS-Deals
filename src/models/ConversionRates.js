import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ConversionRatesSchema = new Schema({ 
    rates: {
        type: Object,
        required: true
    } 
}, { timestamps: true })

const ConversionsRates = mongoose.model('ConversionRates', ConversionRatesSchema)

export default ConversionsRates