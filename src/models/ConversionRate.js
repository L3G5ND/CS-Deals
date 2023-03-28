import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ConversionRateSchema = new Schema({ 
    rates: {
        type: Object,
        required: true
    } 
}, { timestamps: true })

const ConversionRates = mongoose.model('ConversionRates', ConversionRateSchema)

export default ConversionRates